import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IUnknownMessage } from '../../../../models/unknownMessage';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../services/admin.services';
import { NotificationService } from '../../../../services/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserClaim } from '@models/UserClaim';
import { LocalSessionService } from '@services/localSession.service';
import { PersistService } from '@services/persist.service';

@Component({
  selector: 'vt-unknown-messages',
  templateUrl: './unknown-messages.component.html',
  styleUrls: ['./unknown-messages.component.scss'],
})
export class UnknownMessagesComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[];
  dataSource: any;
  data: IUnknownMessage[];
  pageTitle = 'Unknown Messages';
  from: Date = new Date();
  to: Date = new Date();
  loading = false;
  user: UserClaim;

  constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private store: PersistService,
    private localSessionService: LocalSessionService,
    private notify: NotificationService
  ) {
    this.activatedRoute.data.subscribe((data) => {
      this.data = data.umessages;
    });
    this.user = this.store.get<UserClaim>('user');
    this.localSessionService.setUserFromStore(this.user);
  }

  ngOnInit(): void {
    this.from.setDate(this.from.getDate() - 1);
    this.setDataSource();
  }

  getData() {
    let messageErrors = 0;
    this.data = [];
    this.setDataSource();
    this.loading = true;
    const dd = String(this.from.getDate()).padStart(2, '0');
    const mm = String(this.from.getMonth() + 1).padStart(2, '0');
    const yyyy = this.from.getFullYear();

    const dd2 = String(this.to.getDate()).padStart(2, '0');
    const mm2 = String(this.to.getMonth() + 1).padStart(2, '0');
    const yyyy2 = this.to.getFullYear();

    this.adminService.getUnknownMessages(this.user.CompanyId, yyyy + '-' + mm + '-' + dd, yyyy2 + '-' + mm2 + '-' + dd2).subscribe(
      (result) => {
        result.forEach((value) => {
          if (value.ErrorMessage !== null && value.ErrorMessage !== undefined && value.ErrorMessage !== '') {
            messageErrors++;
          }
        });
        if (messageErrors === 0) {
          this.data = result;
          this.setDataSource();
          this.loading = false;
        }
      },
      (error) => {
        messageErrors++;
        this.notify.openSnackBar(error);
        this.loading = false;
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.paginator.pageSize = 10;
      this.dataSource.paginator.firstPage();
    }
  }

  private setDataSource() {
    this.displayedColumns = ['Sid', 'From', 'To', 'Content', 'Created'];
    this.dataSource = new MatTableDataSource<IUnknownMessage>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.paginator.pageSize = 10;
      this.dataSource.paginator.firstPage();
    }
  }
}
