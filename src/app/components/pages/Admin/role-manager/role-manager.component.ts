import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IResult } from '../../../../models/result';
import { IRole } from '../../../../models/Role/role';
import { ConfirmDialogService } from '../../../../services/confirmDialog.service';
import { NotificationService } from '../../../../services/notification.service';
import { RoleGuardService } from '../../../../services/roleGuardService';
import { RoleService } from '../services/role.services';

@Component({
  selector: 'vt-role-manager',
  templateUrl: './role-manager.component.html',
  styleUrls: ['./role-manager.component.scss'],
})
export class RoleManagerComponent implements OnInit {
  public roles: IRole[];
  public pageTitle = 'List of Roles';
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns = ['RoleId', 'RoleName', 'CompanyId', 'Created', 'CreatedBy', 'Updated', 'UpdatedBy', 'Actions'];
  dataSource: any;
  public overlay = false;
  selectedRow: IRole = {
    RoleId: 0,
    RoleName: '',
    CompanyId: '',
    Application: 'omniChannel',
    Create: null,
    CreatedBy: '',
    Updated: null,
    UpdatedBy: '',
  };
  isNew = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: RoleService,
    private roleGuard: RoleGuardService,
    private notify: NotificationService,
    private dialogService: ConfirmDialogService
  ) {
    const roleData: IResult<IRole[]> = this.route.snapshot.data['roles'];
    this.roles = [];
    if (roleData.errorMessage !== null && roleData.errorMessage !== undefined && roleData.errorMessage !== '') {
      return;
    }
    for (const item of roleData.Data) {
      this.roles.push(item);
    }
  }

  ngOnInit(): void {
    if (this.roles === null || this.roles.length < 1) {
      this.refresh();
    }
    this.setDataSource();
  }

  refresh() {
    this.dataService.getRoles().subscribe(
      (response: IResult<IRole[]>) => {
        this.roles = response.Data;
        this.setDataSource();
      },
      (err: any) => {
        this.roles = [];
        this.setDataSource();
      }
    );
  }
  private setDataSource() {
    this.dataSource = new MatTableDataSource<IRole>(this.roles);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.paginator.pageSize = 10;
      this.dataSource.paginator.firstPage();
    }
  }

  add() {
    this.isNew = true;
    this.selectedRow = {
      RoleId: 0,
      RoleName: '',
      CompanyId: '',
      Application: 'omniChannel',
      Create: null,
      CreatedBy: '',
      Updated: null,
      UpdatedBy: '',
    };
    this.toggleOverlay();
  }

  edit(item: IRole) {
    this.selectedRow = item;
    this.isNew = false;
    this.toggleOverlay();
  }

  delete(item: IRole) {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'Are you sure to delete the role ' + item.RoleName,
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.dataService.deleteRole(item.RoleId).subscribe((_) => {
          if (_.errorMessage !== undefined && _.errorMessage !== '' && _.errorMessage !== ' ' && _.errorMessage !== null) {
            alert(_.errorMessage);
          } else if (_.Data) {
            this.refresh();
            this.notify.openSnackBar('Role has been deleted !');
          } else {
            this.notify.openSnackBarError(new Error('Item delete failed!'));
          }
        });
      }
    });
  }

  toggleOverlay(): void {
    const overlayContainer = document.querySelector('#roles-overlay');
    const overlayBg = document.querySelector('.dark-overlay');
    const body = document.querySelector('body');
    overlayContainer.classList.toggle('active');
    overlayBg.classList.toggle('active');
    body.classList.toggle('active');
    this.overlay = !this.overlay;
    if (this.overlay) {
      this.onOverlayClicked();
    }
  }
  onOverlayClicked() {
    const overlay = document.querySelector('.dark-overlay') as HTMLElement;
    overlay.addEventListener('click', this.handleDialog);
  }

  hasClaim(claim: string) {
    return this.roleGuard.hasClaim(claim);
  }

  handleDialog() {
    const overlay = document.querySelector('.dark-overlay') as HTMLElement;
    if (overlay === event.target) {
      const closeBtn: HTMLElement = document.getElementsByClassName('sidebar-close')[0] as HTMLElement;
      closeBtn.click();
    }
    if (this.selectedRow === null) {
      document.removeEventListener('click', this.handleDialog);
    }
  }

  onCloseClicked() {
    this.toggleOverlay();
    this.selectedRow = null;
    this.refresh();
  }

  onCloseFromChild(event: any) {
    this.toggleOverlay();
    this.selectedRow = null;
    this.refresh();
  }
}
