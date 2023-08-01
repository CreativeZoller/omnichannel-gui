import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '../../../../services/notification.service';
import { UserClaim } from '@models/UserClaim';
import { PersistService } from '@services/persist.service';
import { LocalSessionService } from '@services/localSession.service';
import { SessionStorageService } from '@services/storageSession.service';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { ReservedCommandsService } from '@services/reservedCommands.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'vt-reserved-commands',
  templateUrl: './reserved-commands.component.html',
  styleUrls: ['./reserved-commands.component.scss'],
})
export class ReservedCommandsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  navParentClass: boolean;
  displayedColumns: string[];
  dataSource: any;
  resolvedCommands: any[];
  pageTitle = 'Reserved commands with response message';
  overlay = false;
  isNotActive = true;
  isCommandVisible = false;
  noCommands = true;
  selectedCommand: any;
  user: UserClaim;
  cmdData: any;
  makeCommandformVisible = false;
  commandsToUsed = ['STOP', 'OUT', 'CHAT', 'SWITCH'];
  commandsUsed = [];
  usableCommands = [];
  canCreate = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private store: PersistService,
    private localSessionService: LocalSessionService,
    private dialogService: ConfirmDialogService,
    private reservedService: ReservedCommandsService,
    private notify: NotificationService,
    public sessionService: SessionStorageService,
    public changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.user = this.store.get<UserClaim>('user');
    this.activatedRoute.data.subscribe((data) => {
      this.resolvedCommands = data.resolvedCommands;
      if (data.resolvedCommands.length > 0) this.noCommands = false;
    });
    this.user = this.store.get<UserClaim>('user');
    this.localSessionService.setUserFromStore(this.user);
  }

  ngOnInit(): void {
    this.setDataSource();
    this.usableCommands = this.sortOutItems(this.resolvedCommands, this.commandsToUsed);
    this.canCreate = this.updateOptions(this.usableCommands);
  }

  sortOutItems(itemsToCheck, itemsFromCheck) {
    const usedOnes = itemsToCheck;
    const basicOnes = itemsFromCheck;
    usedOnes.forEach((element) => {
      this.commandsUsed.push(element.ConsumerCommand);
    });
    this.usableCommands = basicOnes.filter((value) => !this.commandsUsed.includes(value));
    return this.usableCommands;
  }

  updateOptions(usable) {
    let canDo = true;
    if (usable.length <= 0) canDo = false;
    return canDo;
  }

  setDataSource() {
    this.displayedColumns = ['ReservedCommandName', 'MessageToConsumer', 'Actions'];
    this.dataSource = new MatTableDataSource<any>(this.resolvedCommands);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.paginator.pageSize = 10;
      this.dataSource.paginator.firstPage();
    }
  }

  toggleOverlay(): void {
    this.overlay = !this.overlay;
    this.isCommandVisible = true;
    this.makeCommandformVisible = this.makeCommandformVisible;
  }

  onOverlayClicked() {
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
    overlay.addEventListener('click', this.handleDialog);
  }

  handleDialog() {
    const overlay = document.querySelector('.sidebar-overlay') as HTMLElement;
    if (overlay === event.target) {
      const closeBtn: HTMLElement = document.getElementsByClassName('sidebar-close')[0] as HTMLElement;
      closeBtn.click();
    }
    if (this.selectedCommand === '') document.removeEventListener('click', this.handleDialog);
  }

  modify(message: any | boolean) {
    if (!message) {
      this.sessionService.setVariableToStorage('selectedCommand', null);
      this.toggleOverlay();
    } else {
      const row = message;
      this.sessionService.setVariableToStorage('selectedCommand', row.ReservedCommandName);
      this.selectedCommand = row;
      this.toggleOverlay();
    }
  }

  delete(element) {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'The selected command will be removed if you choose to proceed.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.reservedService.deleteReservedCommand(element.ReservedCommandId).subscribe(
          (result) => {
            this.notify.openSnackBar('The selected command has been deleted');
            setTimeout(() => {
              this.refreshCommands();
            }, 500);
          },
          (error) => {
            this.notify.openSnackBar(error.error.title);
          }
        );
      }
    });
  }

  onCloseClicked() {
    const changedVariables: number = +this.sessionService.getVariableFromStorage('commandEditChanges');
    if (changedVariables > 0) {
      this.openConfirmDialog();
    } else {
      this.toggleOverlay();
      this.selectedCommand = '';
      this.sessionService.setVariableToStorage('selectedCommand', null);
      this.sessionService.setVariableToStorage('commandEditChanges', null);
      this.makeCommandformVisible = false;
    }
  }

  forceRefreshCmd(info: any) {
    this.onCloseClicked();
    setTimeout(() => {
      this.refreshCommands();
    }, 500);
  }

  refreshCommands() {
    this.reservedService.getReservedCommands(this.user.CompanyId).subscribe(
      (result) => {
        this.displayedColumns = ['ReservedCommandName', 'MessageToConsumer', 'Actions'];
        this.dataSource = new MatTableDataSource<any>(result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.changeDetectorRef.detectChanges();
        this.document.location.reload();
      },
      (error) => {
        this.notify.openSnackBar(error.error.title);
      }
    );
  }

  openConfirmDialog() {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'There may be unsaved modifications. If you proceed now, they will be lost. To hold those changes, please save first.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.toggleOverlay();
        this.selectedCommand = '';
        this.sessionService.setVariableToStorage('selectedCommand', null);
        this.sessionService.setVariableToStorage('commandEditChanges', null);
        this.makeCommandformVisible = false;
      }
    });
  }
}
