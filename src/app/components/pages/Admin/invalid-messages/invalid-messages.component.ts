import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IInvalidMessage } from '../../../../models/invalidMessage';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../services/admin.services';
import { NotificationService } from '../../../../services/notification.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'vt-invalid-messages',
  templateUrl: './invalid-messages.component.html',
  styleUrls: ['./invalid-messages.component.scss'],
})
export class InvalidMessagesComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[];
  dataSource: any;
  data: IInvalidMessage[];
  pageTitle = 'Invalid Messages';
  from: Date = new Date();
  to: Date = new Date();
  loading = false;
  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService, private notify: NotificationService) {
    this.activatedRoute.data.subscribe((data) => {
      this.data = data.imessages;
    });
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

    this.adminService.getInvalidMessages(yyyy + '-' + mm + '-' + dd, yyyy2 + '-' + mm2 + '-' + dd2).subscribe(
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
    this.dataSource = new MatTableDataSource<IInvalidMessage>(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.paginator.pageSize = 10;
      this.dataSource.paginator.firstPage();
    }
  }
}
