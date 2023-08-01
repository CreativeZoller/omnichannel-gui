import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '@services/notification.service';
import { CommandsService } from '@services/commands.service';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { CommandList, UpdatingCommandList, CommandDetails } from '@models/commands';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { SessionStorageService } from '@services/storageSession.service';
import { UserClaim } from '../../../models/UserClaim';
import { PersistService } from '../../../services/persist.service';

@Component({
  selector: 'vt-commands-page',
  templateUrl: './commands-page.component.html',
  styleUrls: ['./commands-page.component.scss'],
})
export class CommandsPageComponent implements OnInit {
  public overlay = false;
  public isNotActive = true;
  selectedRow: any;
  pageTitle: any;
  user: UserClaim;
  navParentClass: boolean;
  commandListData: CommandList[];
  commandDetails: CommandDetails[];
  columnsToDisplay: string[];
  dataSource: any;
  allAccounts: any;
  commandListDetailsForm: FormGroup;
  saved = false;
  makeListformVisible = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private activatedroute: ActivatedRoute,
    private notify: NotificationService,
    private commands: CommandsService,
    private formBuilder: FormBuilder,
    private dialogService: ConfirmDialogService,
    private store: PersistService,
    public sessionService: SessionStorageService,
    public changeDetectorRef: ChangeDetectorRef
  ) {
    this.activatedroute.data.subscribe((data) => {
      this.pageTitle = data.pageTitle;
      this.user = this.store.get<UserClaim>('user');
      this.commandListData = data.commandsList;
      this.columnsToDisplay = ['CommandListName', 'CommandListDescription', 'Created', 'Modified', 'Default', 'Actions'];
      this.dataSource = new MatTableDataSource<CommandList>(this.commandListData);
    });
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // main methods
  toggleOverlay(): void {
    const overlayContainer = document.querySelector('#commands-overlay');
    const overlayBg = document.querySelector('.dark-overlay');
    const body = document.querySelector('body');
    overlayContainer.classList.toggle('active');
    overlayBg.classList.toggle('active');
    body.classList.toggle('active');
    this.overlay = !this.overlay;
    this.makeListformVisible = true;
    if (this.overlay === true) {
      this.onOverlayClicked();
    }
  }

  showDetails(row: any | boolean) {
    if (row) {
      this.selectedRow = row;
      this.getCommandListDetails(row.CommandListId);
    } else {
      this.sessionService.setVariableToStorage('selectedCommandsList', null);
      this.selectedRow = null;
      this.toggleOverlay();
    }
  }

  updateCheckChange(values: any) {
    const isActive = document.querySelector('#commandListActive') as HTMLInputElement;
    const isActiveValue: boolean = isActive.checked;
    if (!isActiveValue) {
      this.isNotActive = true;
    } else {
      this.isNotActive = false;
    }
  }

  getCommandListDetails(commandlistId: number) {
    let messageErrors = 0;
    this.commands.getCommandsInList(commandlistId).subscribe(
      (result) => {
        result.forEach((value) => {
          if (value.ErrorMessage !== '' && value.ErrorMessage !== null) messageErrors++;
        });
        if (messageErrors === 0) {
          const commandsData: CommandDetails[] = result;
          this.commandDetails = commandsData;
          this.sessionService.setVariableToStorage('selectedCommandsList', commandlistId);
          this.toggleOverlay();
        }
      },
      (error) => {
        messageErrors++;
        this.notify.openSnackBar(error.error.title);
      }
    );
  }

  openDeleteDialog(element) {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'The selected items will be removed if you choose to proceed.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.commands.deleteCommandsList(element.CommandListId).subscribe(
          (result) => {
            this.notify.openSnackBar('The selected item has been deleted');
            this.refreshCommandsList();
          },
          (error) => {
            this.notify.openSnackBar(error.error.title);
          }
        );
      }
    });
  }

  onCloseClicked() {
    const changedVariables: number = +this.sessionService.getVariableFromStorage('commandsListEditChanges');
    
    if (changedVariables != 0) {
      this.openConfirmDialog();
    } else {
      this.toggleOverlay();
      this.selectedRow = '';
      this.sessionService.setVariableToStorage('selectedCommandsList', null);
      this.sessionService.setVariableToStorage('commandsListEditChanges', null);
      this.makeListformVisible = false;
    }
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
        this.selectedRow = '';
        this.sessionService.setVariableToStorage('selectedCommandsList', null);
        this.sessionService.setVariableToStorage('commandsListEditChanges', null);
        this.makeListformVisible = false;
      }
    });
  }

  forceRefresh(info: any) {
    this.onCloseClicked();
    setTimeout(() => {
      this.refreshCommandsList();
    }, 500);
  }

  refreshCommandsList() {
    this.commands.getCommandListsByCompany(this.user.CompanyId).subscribe(
      (result) => {
        this.commandListData = result;
        this.dataSource = new MatTableDataSource<CommandList>(this.commandListData);
        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  toggleReceive($event) {
    this.navParentClass = $event;
  }

  onOverlayClicked() {
    const overlay = document.querySelector('.dark-overlay') as HTMLElement;
    overlay.addEventListener('click', this.handleDialog);
  }

  handleDialog() {
    const overlay = document.querySelector('.dark-overlay') as HTMLElement;
    if (overlay === event.target) {
      const closeBtn: HTMLElement = document.getElementsByClassName('sidebar-close')[0] as HTMLElement;
      closeBtn.click();
    }
    if (this.selectedRow === '') document.removeEventListener('click', this.handleDialog);
  }
}
