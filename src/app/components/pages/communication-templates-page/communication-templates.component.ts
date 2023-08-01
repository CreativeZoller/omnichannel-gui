import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { messageTemplate } from '@models/messageTemplate';
import { UserClaim } from '@models/UserClaim';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { MessageTemplateService } from '@services/messageTemplate.service';
import { NotificationService } from '@services/notification.service';
import { PersistService } from '@services/persist.service';
import { SessionStorageService } from '@services/storageSession.service';

@Component({
  selector: 'vt-communication-templates',
  templateUrl: './communication-templates.component.html',
  styleUrls: ['./communication-templates.component.scss']
})
export class CommunicationTemplatesComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public overlay = false;
  public isNotActive = true;
  selectedRow: any;
  pageTitle: any;
  user: UserClaim;
  navParentClass: boolean;
  columnsToDisplay: string[];
  dataSource: any;
  messageTemplatesData: any;
  saved = false;
  makeListformVisible = false;
  templateDetails: messageTemplate[];

  constructor(
    private activatedroute: ActivatedRoute,
    private notify: NotificationService,
    private formBuilder: FormBuilder,
    private dialogService: ConfirmDialogService,
    private store: PersistService,
    public sessionService: SessionStorageService,
    public changeDetectorRef: ChangeDetectorRef,
    private templates: MessageTemplateService,
  ) {
    this.activatedroute.data.subscribe((data) => {
      this.pageTitle = data.pageTitle;
      this.user = this.store.get<UserClaim>('user');
      this.messageTemplatesData = data.templateData;
      this.columnsToDisplay = ['TemplateName', 'TemplateText', 'Actions'];
      this.dataSource = new MatTableDataSource<messageTemplate[]>(this.messageTemplatesData);
    });
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // main methods
  toggleOverlay(): void {
    const overlayContainer = document.querySelector('#communications-overlay');
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
      this.sessionService.setVariableToStorage('selectedMessageTemplate', row.TemplateId);
      this.toggleOverlay();
    } else {
      this.sessionService.setVariableToStorage('selectedMessageTemplate', null);
      this.selectedRow = null;
      this.toggleOverlay();
    }
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
        this.templates.deleteMessageTemplate(element.TemplateId).subscribe(
          (result) => {
            this.notify.openSnackBar('The selected item has been deleted');
            this.refreshTemplateList();
          },
          (error) => {
            this.notify.openSnackBar(error.error.title);
          }
        );
      }
    });
  }

  onCloseClicked() {
    const changedVariables: number = +this.sessionService.getVariableFromStorage('templateMessageChanges');
    
    if (changedVariables != 0) {
      this.openConfirmDialog();
    } else {
      this.toggleOverlay();
      this.selectedRow = '';
      this.sessionService.setVariableToStorage('templateMessageChanges', null);
      this.sessionService.setVariableToStorage('messageTemplateEditChanges', null);
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
        this.sessionService.setVariableToStorage('templateMessageChanges', null);
        this.sessionService.setVariableToStorage('commandsListEditChanges', null);
        this.makeListformVisible = false;
      }
    });
  }

  forceRefresh(info: any) {
    this.onCloseClicked();
    setTimeout(() => {
      this.refreshTemplateList();
    }, 500);
  }

  refreshTemplateList() {
    this.templates.getTemplatesByCompany(this.user.CompanyId).subscribe(
      (result) => {
        this.messageTemplatesData = result;
        this.dataSource = new MatTableDataSource<messageTemplate[]>(this.messageTemplatesData);
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
