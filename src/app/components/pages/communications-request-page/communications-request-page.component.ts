import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '@services/notification.service';
import { SignalRService } from '@services/signalr.service';
import { AccountsService } from '@services/accounts.service';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { H2HAccounts } from '@models/accounts';
import { Messages } from '@models/messages';
import { Subscription } from 'rxjs';
import { Constants } from '../../../constants';

@Component({
  selector: 'vt-communications-request-page',
  templateUrl: './communications-request-page.component.html',
  styleUrls: ['./communications-request-page.component.scss']
})
export class CommunicationsRequestPageComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public overlay = false;
  selectedRow: any;
  pageTitle: any;
  navParentClass: boolean;
  value: any;
  accountsData: H2HAccounts[];
  columnsToDisplay: string[];
  dataSource: any;
  allAccounts: any;
  hasArchive = false;
  accountMessages: Messages[];
  signalDataSubscribe: Subscription;
  selectedAccount: string;
  selAccount: H2HAccounts;

  constructor(
    private activatedroute: ActivatedRoute,
    private notify: NotificationService,
    private accounts: AccountsService,
    private signal: SignalRService,
    private dialogService: ConfirmDialogService,
    private httpClient: HttpClient
  ) {
    this.activatedroute.data.subscribe((data) => {
      this.pageTitle = data.pageTitle;
      this.accountsData = data.debtorList;
      this.columnsToDisplay = ['AccountName', 'DebtorName', 'PhoneNumber'];
      this.dataSource = new MatTableDataSource<H2HAccounts>(this.accountsData);
    });
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.signalDataSubscribe?.unsubscribe();
    this.signalDataSubscribe = null;
  }

  toggleOverlay(): void {
    const overlayContainer = document.querySelector('#communications-overlay');
    const overlayBg = document.querySelector('.dark-overlay');
    const body = document.querySelector('body');
    overlayContainer.classList.toggle('active');
    overlayBg.classList.toggle('active');
    body.classList.toggle('active');
    this.overlay = !this.overlay;
    if (this.overlay === true) {
      this.onOverlayClicked();
    }
  }

  getAccountMessages(account: string) {
    let messageErrors = 0;
    this.accounts.getMessagesByAccount(account).subscribe(
      (result) => {
        result.forEach((value) => {
          if (value.ErrorMessage !== '') messageErrors++;
        });
        if (messageErrors === 0) {
          const accountData: Messages[] = result;
          this.accountMessages = accountData;
          this.selectedAccount = account;
          this.listenForUpdates();
          this.toggleOverlay();
          this.checkScrolling();
        }
      },
      (error) => {
        messageErrors++;
        this.notify.openSnackBar(error);
      }
    );
    this.accounts.hasArchivedMessages(account).subscribe(
      (result) => (this.hasArchive = result),
      (error) => {
        this.notify.openSnackBar(error);
      }
    );
  }

  listenForUpdates() {
    if (this.signalDataSubscribe && !this.signalDataSubscribe.closed) return;
    this.signalDataSubscribe = this.signal.data.subscribe((data: any) => {
      const messageUpdates = this.accountMessages;
      if (data.data.accountId === this.selectedAccount.toLowerCase() && data.data.errorMessage === '') {
        const newMessage = new Messages();
        newMessage.Content = data.data.content;
        newMessage.DateSent = data.data.dateSent;
        newMessage.Direction = data.data.direction;
        newMessage.ErrorMessage = data.data.errorMessage;
        newMessage.From = data.data.from;
        newMessage.MessageId = data.data.messageId;
        newMessage.Status = data.data.status;
        newMessage.To = data.data.to;
        newMessage.Sender = data.data.sender;

        // check if it is just a status update
        const message = this.accountMessages.filter(
          (_) => _.Content === newMessage.Content && _.Status !== 'delivered' && _.Status !== 'sent'
        );
        if (message === null || message === undefined || message.length === 0) messageUpdates.push(newMessage);
        else {
          const index = messageUpdates.indexOf(message[0]);
          if (index !== -1) messageUpdates.splice(index, 1);
          messageUpdates.push(newMessage);
        }
        this.accountMessages = messageUpdates.sort((a, b) => {
           const c =  a.DateCreated.valueOf();
           const d =  b.DateCreated.valueOf();
           return c > d ? -1 : (c < d ? 1 : 0);
        });
        this.accountMessages = messageUpdates;
        this.checkScrolling();
      }
    });
    this.signal.startListening('accountMessages');
  }

  checkScrolling() {
    const messageContainer = document.querySelector('#message-container');
    let parentHeight = 0;
    let itemsHeight = 0;
    setTimeout(() => {
      if (messageContainer) {
        parentHeight = messageContainer.clientHeight;
        itemsHeight = messageContainer.scrollHeight;
        if (itemsHeight >= parentHeight) messageContainer.scrollTop = itemsHeight;
        clearInterval();
      } else {
        this.checkScrolling();
      }
    }, 200);
  }

  onRowClicked(row) {
    const selectedAccount = row;
    const accountId = selectedAccount.AccountId;
    this.selAccount = this.accountsData.find((_) => _.AccountId === selectedAccount.AccountId);
    const phoneNumber = selectedAccount.PhoneNumber;
    this.selectedRow = selectedAccount;
    this.getAccountMessages(accountId);
  }

  openConfirmDialog(element) {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'There are typed texts in the Message field. If you close now, you will loose all unsent messages.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        element.value = '';
        this.toggleOverlay();
        this.selectedRow = '';
      }
    });
  }

  public checkEmptyContent(element) {
    if (element.value !== '') {
      this.openConfirmDialog(element);
    } else {
      this.toggleOverlay();
      this.selectedRow = '';
    }
  }

  public onCloseClicked() {
    this.checkEmptyContent(document.querySelector('#newMessageField') as HTMLInputElement);
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

  toggleReceive($event) {
    this.navParentClass = $event;
  }

}
