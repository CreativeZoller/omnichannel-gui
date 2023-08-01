import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '@services/admin.services';
import { ILog } from '@models/log';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'vt-system-log',
  templateUrl: './system-log.component.html',
  styleUrls: ['./system-log.component.scss']
})
export class SystemLogComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[];
  dataSource: any;
  logs: ILog[];
  pageTitle = 'System logs';
  from: Date = new Date();
  level = 'Info';
  loading = false;
  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService, private notify: NotificationService) {
    this.activatedRoute.data.subscribe((data) => {
      this.logs = data.logs;
    });
  }

  ngOnInit(): void {
    this.setDataSource();
  }

  getLogs() {
    let messageErrors = 0;
    this.logs = [];
    this.setDataSource();
    this.loading = true;
    const dd = String(this.from.getDate()).padStart(2, '0');
    const mm = String(this.from.getMonth() + 1).padStart(2, '0');
    const yyyy = this.from.getFullYear();

    this.adminService.getLogs(this.level, yyyy + '-' + mm + '-' + dd).subscribe(
      (result) => {
        result.forEach((value) => {
          if (value.ErrorMessage !== null && value.ErrorMessage !== undefined && value.ErrorMessage !== '') messageErrors++;
        });
        if (messageErrors === 0) {
          this.logs = result;
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
    this.displayedColumns = ['Logged', 'Level', 'Message', 'Logger'];
    this.dataSource = new MatTableDataSource<ILog>(this.logs);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.paginator.pageSize = 10;
      this.dataSource.paginator.firstPage();
    }
  }
}
