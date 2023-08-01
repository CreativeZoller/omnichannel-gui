import { TestBed } from '@angular/core/testing';
import { AccountsService } from './accounts.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Accounts } from '../models/accounts';
import { Messages, NewMessage } from '../models/messages';

describe('AccountsService testing:', () => {
  let service: AccountsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [AccountsService],
    });
    service = TestBed.inject(AccountsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('service should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should able to retrieve all companies from the API via getAccountsByCompany()', () => {
    const mockAccounts: Accounts[] = [
      {
        AccountId: '10E1E769-CF98-4B30-8301-AC22F5A2B6B6',
        AccountName: '01010101',
        PhoneNumber: '+15109441689',
        ErrorMessage: null,
      },
      {
        AccountId: 'F7FA7114-943E-11EA-BB37-0242AC130002',
        AccountName: '11111111',
        PhoneNumber: '+36304701622',
        ErrorMessage: null,
      },
      {
        AccountId: '61B9FAAC-943F-11EA-BB37-0242AC130002',
        AccountName: '11001100',
        PhoneNumber: '+36705880057',
        ErrorMessage: null,
      },
      {
        AccountId: '2652CFB6-943F-11EA-BB37-0242AC130002',
        AccountName: '11110000',
        PhoneNumber: '+19732192722',
        ErrorMessage: null,
      },
    ];

    service.getAccountsByCompany(1).subscribe((accounts) => {
      expect(accounts.length).toBe(4);
      expect(accounts).toEqual(mockAccounts);
    });
    const request = httpMock.expectOne(
      'https://omnichannelcommunication-api-development.azurewebsites.net/api/Message/GetAllAccounts?companyId=1'
    );
    expect(request.request.method).toBe('GET');
    request.flush(mockAccounts);
  });

  // TODO: create mockService instead of these, because it will break later :/
  it('should able to retrieve all messages for selected account from the API via getMessagesByAccount()', () => {
    const mockMessages: Messages[] = [
      {
        MessageId: 4,
        Content: 'Integration test asdasdasd asdasdqa',
        DateSent: '2020-04-14T10:48:53Z',
        Direction: 'outbound-api',
        From: '+12058284431',
        Status: 'delivered',
        To: '+15109441689',
        ErrorMessage: '',
      },
      {
        MessageId: 5,
        Content: 'Integration test asdasdasd',
        DateSent: '2020-04-14T10:48:47Z',
        Direction: 'outbound-api',
        From: '+12058284431',
        Status: 'delivered',
        To: '+15109441689',
        ErrorMessage: '',
      },
      {
        MessageId: 6,
        Content: 'daSDASD ASD',
        DateSent: '2020-04-14T11:09:57Z',
        Direction: 'inbound',
        From: '+15109441689',
        Status: 'received',
        To: '+12058284431',
        ErrorMessage: '',
      },
      {
        MessageId: 7,
        Content: 'Second integration test',
        DateSent: '2020-04-14T11:10:54Z',
        Direction: 'inbound',
        From: '+15109441689',
        Status: 'received',
        To: '+12058284431',
        ErrorMessage: '',
      },
      {
        MessageId: 8,
        Content: '01010101',
        DateSent: '2020-04-21T15:46:16Z',
        Direction: 'inbound',
        From: '+15109441689',
        Status: 'received',
        To: '+12058284431',
        ErrorMessage: '',
      },
      {
        MessageId: 9,
        Content: 'Your authentication was successful the following commands are available: ',
        DateSent: '2020-04-21T16:01:11Z',
        Direction: 'outbound-api',
        From: '+12058284431',
        Status: 'delivered',
        To: '+15109441689',
        ErrorMessage: '',
      },
      {
        MessageId: 10,
        Content: '01010101',
        DateSent: '2020-05-05T10:43:50Z',
        Direction: 'inbound',
        From: '+15109441689',
        Status: 'received',
        To: '+12058284431',
        ErrorMessage: '',
      },
      {
        MessageId: 11,
        Content: '01010101',
        DateSent: '2020-05-05T10:46:04Z',
        Direction: 'inbound',
        From: '+15109441689',
        Status: 'received',
        To: '+12058284431',
        ErrorMessage: '',
      },
      {
        MessageId: 12,
        Content: '01010101',
        DateSent: '2020-05-05T10:59:23Z',
        Direction: 'inbound',
        From: '+15109441689',
        Status: 'received',
        To: '+12058284431',
        ErrorMessage: '',
      },
      {
        MessageId: 13,
        Content: 'Your authentication was successful the following commands are available: BAL:Get account command',
        DateSent: '2020-05-05T11:01:43Z',
        Direction: 'outbound-api',
        From: '+12058284431',
        Status: 'delivered',
        To: '+15109441689',
        ErrorMessage: '',
      },
      {
        MessageId: 14,
        Content: 'BAL',
        DateSent: '2020-05-05T11:02:17Z',
        Direction: 'inbound',
        From: '+15109441689',
        Status: 'received',
        To: '+12058284431',
        ErrorMessage: '',
      },
      {
        MessageId: 15,
        Content: 'Your current ballance is : $270.616',
        DateSent: '2020-05-05T11:03:28Z',
        Direction: 'outbound-api',
        From: '+12058284431',
        Status: 'delivered',
        To: '+15109441689',
        ErrorMessage: '',
      },
      {
        MessageId: 16,
        Content: 'hfghfghfgh',
        DateSent: '2020-05-05T11:47:49Z',
        Direction: 'inbound',
        From: '+15109441689',
        Status: 'received',
        To: '+12058284431',
        ErrorMessage: '',
      },
      {
        MessageId: 17,
        Content:
          "The required action is not recognized, please make sure that you entered a valid command or send 'help' for list of available commands.",
        DateSent: '2020-05-07T10:56:02Z',
        Direction: 'outbound-api',
        From: '+12058284431',
        Status: 'delivered',
        To: '+15109441689',
        ErrorMessage: '',
      },
      {
        MessageId: 18,
        Content: 'SignalR test',
        DateSent: '2020-05-05T11:47:49Z',
        Direction: 'inbound',
        From: '+15109441689',
        Status: 'received',
        To: '+12058284431',
        ErrorMessage: '',
      },
      {
        MessageId: 20,
        Content:
          'Please provide the account number of your account. If you have issues please contact our customer service. Have a nice day.',
        DateSent: '2020-05-07T11:01:15Z',
        Direction: 'outbound-api',
        From: '+12058284431',
        Status: 'delivered',
        To: '+15109441689',
        ErrorMessage: '',
      },
    ];

    service.getMessagesByAccount('10e1e769-cf98-4b30-8301-ac22f5a2b6b6').subscribe((messages) => {
      expect(messages.length).toBe(16);
      expect(messages).toEqual(mockMessages);
    });
    const request = httpMock.expectOne(
      'https://omnichannelcommunication-api-development.azurewebsites.net/api/Message/GetMessagesForAccount?accountId=10e1e769-cf98-4b30-8301-ac22f5a2b6b6'
    );
    expect(request.request.method).toBe('GET');
    request.flush(mockMessages);
  });

  it('should able to send a new message to the API via postNewMessage()', () => {
    let loginResponse;
    const testMessage: NewMessage = {
      Message: 'Test message Maj 21',
      ReceiverNumber: '+36304701622',
      SendingNumber: '+12058284431',
      CompanyId: 1,
      AccountId: 'f7fa7114-943e-11ea-bb37-0242ac130002',
    };
    service.postNewMessage(testMessage).subscribe((response) => {
      loginResponse = response;
    });

    const request = httpMock.expectOne({
      url: 'https://omnichannelcommunication-api-development.azurewebsites.net/api/Message/SendSms',
      method: 'POST',
    });
    expect(request.request.method).toBe('POST');
    request.flush(testMessage);
  });
});
