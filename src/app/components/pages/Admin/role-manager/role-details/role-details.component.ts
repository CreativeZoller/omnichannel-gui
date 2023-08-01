import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDragListItem } from '../../../../../models/Role/dragListItem';
import { IPermission } from '../../../../../models/Role/permission';
import { IRole } from '../../../../../models/Role/role';
import { IUserAgentId } from '../../../../../models/Role/userAgent';
import { UserClaim } from '../../../../../models/UserClaim';
import { LocalSessionService } from '../../../../../services/localSession.service';
import { PersistService } from '../../../../../services/persist.service';
import { RoleGuardService } from '../../../../../services/roleGuardService';
import { RoleService } from '../../services/role.services';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ISelectItem, ISelectItem as ISelectItem1 } from '../../../../../models/selectItem';
import { IResult } from '../../../../../models/result';
import { NotificationService } from '../../../../../services/notification.service';
import { isTemplateExpression } from 'typescript';

@Component({
  selector: 'vt-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss'],
})
export class RoleDetailsComponent implements OnInit {
  @Input() Id: number;
  @Input() Name: string;
  @Input() IsNew: boolean;
  @Output() closeOverlay: EventEmitter<any> = new EventEmitter();

  userWith: IUserAgentId[];
  userWithOut: IUserAgentId[];
  permissionWith: IPermission[];
  permissionWithOut: IPermission[];
  userWithObCtrl = new FormControl();
  userWithOutObCtrl = new FormControl();
  permissionWithObCtrl = new FormControl();
  permissionWithOutObCtrl = new FormControl();
  user: UserClaim;
  roleSaved = true;
  roleForm: FormGroup;
  showSetup = true;
  userAssigned: string[];
  userNotAssigned: string[];
  userAssignedBase: IDragListItem[];
  userNotAssignedBase: IDragListItem[];
  permAssigned: string[];
  permAssignedBase: IDragListItem[];
  permNotAssigned: string[];
  permNotAssignedBase: IDragListItem[];
  dragDisabled = false;
  constructor(
    private formBuilder: FormBuilder,
    private store: PersistService,
    private localSessionService: LocalSessionService,
    private roleGuard: RoleGuardService,
    private notify: NotificationService,
    private dataService: RoleService
  ) {}

  ngOnInit(): void {
    this.roleSaved = this.IsNew;
    this.user = this.store.get<UserClaim>('user');
    this.localSessionService.setUserFromStore(this.user);

    this.roleForm = this.formBuilder.group({
      name: [{ value: this.Name, disabled: false }, Validators.required],
    });

    this.showSetup = false;

    if (!this.IsNew) {
      this.preLoad();
    }
  }

  preLoad() {
    this.dataService.getUsersWithRole(this.Id).subscribe((result) => {
      this.userWithLoad(result);
      this.permissionWithObCtrl.valueChanges.subscribe((item) => {
        this.permAssigned = [];
        this.permAssigned = this._filterPermission(item, this.permissionWith);
      });
    });

    this.dataService.getUsersWithOutRole(this.Id).subscribe((result) => {
      this.userWithOutLoad(result);
      this.permissionWithOutObCtrl.valueChanges.subscribe((item) => {
        this.permNotAssigned = [];
        this.permNotAssigned = this._filterPermission(item, this.permissionWithOut);
      });
    });
    this.dataService.getPermissionsWithRole(this.Id).subscribe((result) => {
      this.permWithLoad(result);
      this.userWithObCtrl.valueChanges.subscribe((item) => {
        this.userAssigned = [];
        this.userAssigned = this._filterUser(item, this.userWith);
      });
    });
    this.dataService.getPermissionsWithOutRole(this.Id).subscribe((result) => {
      this.permWithOutLoad(result);
      this.userWithOutObCtrl.valueChanges.subscribe((item) => {
        this.userNotAssigned = [];
        this.userNotAssigned = this._filterUser(item, this.userWithOut);
      });
    });

    this.roleSaved = true;
    this.showSetup = true;
  }
  private _filter(value: ISelectItem<number>, source: ISelectItem<number>[]): ISelectItem<number>[] {
    return source.filter((_) => _.Name.toLowerCase().indexOf(value.Name.toLowerCase()) === 0);
  }

  private _filterUser(value: string, source: IUserAgentId[]): string[] {
    if (value === undefined || value == null || value === '') {
      return source.slice().map((_) => _.fullname + ' ( ' + _.username + ' -' + _.agent_id + ' )');
    }
    return source
      .filter((_) => _.fullname.toLowerCase().indexOf(value.toLowerCase()) === 0)
      .map((_) => _.fullname + ' ( ' + _.username + ' -' + _.agent_id + ' )');
  }

  private _filterPermission(value: string, source: IPermission[]): string[] {
    if (value === undefined || value == null || value === '') {
      return source.slice().map((_) => _.PermissionName + ' ( ' + _.Description + ' )');
    }
    return source
      .filter((_) => _.PermissionName.toLowerCase().indexOf(value.toLowerCase()) !== -1)
      .map((_) => _.PermissionName + ' ( ' + _.Description + ' )');
  }

  hasClaim(claim: string) {
    return this.roleGuard.hasClaim(claim);
  }

  get f() {
    return this.roleForm.controls;
  }

  canShowError(control: AbstractControl): boolean {
    return (control.dirty || control.touched) && control.invalid;
  }

  dropPerm(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      if (event.container.id === 'permassigned') {
        const id = this.getNotAssignedPermissionId(event.container.data[event.currentIndex]);
        this.dragDisabled = true;
        this.dataService.addPermissionToRole(this.Id, id).subscribe(
          (w) => {
            this.dataService.getPermissionsWithRole(this.Id).subscribe((q) => this.permWithLoad(q));
            this.dataService.getPermissionsWithOutRole(this.Id).subscribe((q) => this.permWithOutLoad(q));
          },
          (t) => {
            this.dataService.getPermissionsWithRole(this.Id).subscribe((q) => this.permWithLoad(q));
            this.dataService.getPermissionsWithOutRole(this.Id).subscribe((q) => this.permWithOutLoad(q));
          }
        );
      } else {
        const id = this.getAssignedPermissionId(event.container.data[event.currentIndex]);
        this.dragDisabled = true;
        this.dataService.removePermissionFromRole(this.Id, id).subscribe(
          (w) => {
            this.dataService.getPermissionsWithRole(this.Id).subscribe((q) => this.permWithLoad(q));
            this.dataService.getPermissionsWithOutRole(this.Id).subscribe((q) => this.permWithOutLoad(q));
          },
          (t) => {
            this.dataService.getPermissionsWithRole(this.Id).subscribe((q) => this.permWithLoad(q));
            this.dataService.getPermissionsWithOutRole(this.Id).subscribe((q) => this.permWithOutLoad(q));
          }
        );
      }
    }
  }

  dropUser(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      if (event.container.id === 'userassigned') {
        const user = this.getNotAssignedUser(event.container.data[event.currentIndex]);
        this.dragDisabled = true;
        this.dataService.addUserToRole(this.Id, user).subscribe(
          (w) => {
            this.dataService.getUsersWithRole(this.Id).subscribe((q) => this.userWithLoad(q));
            this.dataService.getUsersWithOutRole(this.Id).subscribe((q) => this.userWithOutLoad(q));
          },
          (t) => {
            this.dataService.getUsersWithRole(this.Id).subscribe((q) => this.userWithLoad(q));
            this.dataService.getUsersWithOutRole(this.Id).subscribe((q) => this.userWithOutLoad(q));
          }
        );
      } else {
        const user = this.getAssignedUser(event.container.data[event.currentIndex]);
        this.dragDisabled = true;
        this.dataService.removeUserFromRole(this.Id, user).subscribe(
          (w) => {
            this.dataService.getUsersWithRole(this.Id).subscribe((q) => this.userWithLoad(q));
            this.dataService.getUsersWithOutRole(this.Id).subscribe((q) => this.userWithOutLoad(q));
          },
          (t) => {
            this.dataService.getUsersWithRole(this.Id).subscribe((q) => this.userWithLoad(q));
            this.dataService.getUsersWithOutRole(this.Id).subscribe((q) => this.userWithOutLoad(q));
          }
        );
      }
    }
  }

  updateName() {
    if (this.roleSaved) {
      this.onSubmit();
    }
  }

  onSubmit() {
    if (this.roleForm.invalid) {
      return;
    }
    if (this.IsNew) {
      this.dataService
        .createRole({
          RoleId: 0,
          RoleName: this.roleForm.controls['name'].value,
          CompanyId: this.user.CompanyId,
          Application: 'omniChannel',
          Create: null,
          CreatedBy: '',
          Updated: null,
          UpdatedBy: '',
        })
        .subscribe((_) => {
          if (_.errorMessage !== undefined && _.errorMessage !== '' && _.errorMessage !== ' ' && _.errorMessage !== null) {
            this.showSetup = false;
            this.roleSaved = false;
            this.roleForm.controls['name'].setValue('');
            this.notify.openSnackBarError(new Error(_.errorMessage));
          } else {
            this.closeOverlay.emit('Close');
          }
        });
    } else {
      if (this.Name === this.roleForm.controls['name'].value) {
        return;
      }
      this.dataService
        .updateRole({
          RoleId: this.Id,
          RoleName: this.roleForm.controls['name'].value,
          CompanyId: '',
          Application: 'omniChannel',
          Create: null,
          CreatedBy: '',
          Updated: null,
          UpdatedBy: '',
        })
        .subscribe((_) => {
          if (_.errorMessage !== undefined && _.errorMessage !== '' && _.errorMessage !== ' ' && _.errorMessage !== null) {
            this.roleForm.controls['name'].setValue(this.Name);
            this.notify.openSnackBarError(new Error(_.errorMessage));
          } else if (_.Data) {
            this.Name = this.roleForm.controls['name'].value;
            this.notify.openSnackBar('Role has been updated !');
            this.closeOverlay.emit('Close');
          } else {
            this.roleForm.controls['name'].setValue(this.Name);
            this.notify.openSnackBar('Item save failed!');
          }
        });
    }
  }

  private loadData(role: IRole) {
    this.dataService.getUsersWithRole(role.RoleId).subscribe((_) => this.userWithLoad(_));
    this.dataService.getUsersWithOutRole(role.RoleId).subscribe((_) => this.userWithOutLoad(_));
    this.dataService.getPermissionsWithRole(role.RoleId).subscribe((_) => this.permWithLoad(_));
    this.dataService.getPermissionsWithOutRole(role.RoleId).subscribe((_) => this.permWithOutLoad(_));
  }

  private permWithLoad(pwith: IResult<IPermission[]>) {
    this.permissionWith = [];
    this.permAssigned = [];
    this.permAssignedBase = [];
    this.permissionWithObCtrl.setValue('');
    if (pwith.errorMessage !== null && pwith.errorMessage !== undefined && pwith.errorMessage !== '') {
      this.notify.openSnackBarError(new Error(pwith.errorMessage));
    }
    if (pwith !== null && pwith.Data !== null && pwith.Data.length > 0) {
      for (let i = 0; i < pwith.Data.length; i++) {
        this.permissionWith.push(pwith.Data[i]);
        this.permAssigned.push(pwith.Data[i].PermissionName + ' ( ' + pwith.Data[i].Description + ' )');
        this.permAssignedBase.push({ order: i, value: pwith.Data[i].PermissionName });
      }
    }
    if (this.dragDisabled) {
      this.dragDisabled = false;
    }
  }

  private permWithOutLoad(pwithOut: IResult<IPermission[]>) {
    this.permissionWithOut = [];
    this.permNotAssigned = [];
    this.permNotAssignedBase = [];
    this.permissionWithOutObCtrl.setValue('');
    if (pwithOut.errorMessage !== null && pwithOut.errorMessage !== undefined && pwithOut.errorMessage !== '') {
      this.notify.openSnackBarError(new Error(pwithOut.errorMessage));
    }
    if (pwithOut !== null && pwithOut.Data !== null && pwithOut.Data.length > 0) {
      for (let i = 0; i < pwithOut.Data.length; i++) {
        this.permissionWithOut.push(pwithOut.Data[i]);
        this.permNotAssigned.push(pwithOut.Data[i].PermissionName + ' ( ' + pwithOut.Data[i].Description + ' )');
        this.permNotAssignedBase.push({ order: i, value: pwithOut.Data[i].PermissionName });
      }
    }
    if (this.dragDisabled) {
      this.dragDisabled = false;
    }
  }

  private userWithLoad(uwith: IResult<IUserAgentId[]>) {
    this.userWith = [];
    this.userAssigned = [];
    this.userAssignedBase = [];
    this.userWithObCtrl.setValue('');
    if (uwith.errorMessage !== null && uwith.errorMessage !== undefined && uwith.errorMessage !== '') {
      this.notify.openSnackBarError(new Error(uwith.errorMessage));
    }
    if (uwith !== null && uwith.Data !== null && uwith.Data.length > 0) {
      for (const item of uwith.Data) {
        this.userWith.push(item);
        this.userAssigned.push(item.fullname + ' ( ' + item.username + ' -' + item.agent_id + ' )');
        this.userAssignedBase.push({ order: 1, value: item.username });
      }
    }
    if (this.dragDisabled) {
      this.dragDisabled = false;
    }
  }

  private userWithOutLoad(uwithOut: IResult<IUserAgentId[]>) {
    this.userWithOut = [];
    this.userNotAssigned = [];
    this.userNotAssignedBase = [];
    this.userWithOutObCtrl.setValue('');
    if (uwithOut.errorMessage !== null && uwithOut.errorMessage !== undefined && uwithOut.errorMessage !== '') {
      this.notify.openSnackBarError(new Error(uwithOut.errorMessage));
    }
    if (uwithOut !== null && uwithOut.Data !== null && uwithOut.Data.length > 0) {
      for (const item of uwithOut.Data) {
        this.userWithOut.push(item);
        this.userNotAssigned.push(item.fullname + ' ( ' + item.username + ' -' + item.agent_id + ' )');
        this.userNotAssignedBase.push({ order: 1, value: item.username });
      }
    }
    if (this.dragDisabled) {
      this.dragDisabled = false;
    }
  }

  private getNotAssignedPermissionId(name: string): number {
    let pname = name;
    if (name.indexOf('(') > -1) {
      const index = name.indexOf('(') - 1;
      pname = name.substr(0, index);
    }
    const perms = this.permNotAssignedBase.filter((_) => _.value === pname);
    const permissions = this.permissionWithOut.filter((_) => _.PermissionName.toLowerCase().indexOf(perms[0].value.toLowerCase()) === 0);
    return permissions[0].PermissionId;
  }

  private getAssignedPermissionId(name: string): number {
    let pname = name;
    if (name.indexOf('(') > -1) {
      const index = name.indexOf('(') - 1;
      pname = name.substr(0, index);
    }

    const perms = this.permAssignedBase.filter((_) => _.value === pname);
    const permissions = this.permissionWith.filter((_) => _.PermissionName.toLowerCase().indexOf(perms[0].value.toLowerCase()) === 0);
    return permissions[0].PermissionId;
  }

  private getNotAssignedUser(name: string): string {
    const index = name.indexOf('(') + 2;
    const index2 = name.indexOf('-') - 1;
    const pname = name.substr(index, index2 - index);
    const selUsers = this.userNotAssignedBase.filter((_) => _.value === pname);
    const users = this.userWithOut.filter((_) => _.username.toLowerCase().indexOf(selUsers[0].value.toLowerCase()) === 0);
    return users[0].username;
  }

  private getAssignedUser(name: string): string {
    const index = name.indexOf('(') + 2;
    const index2 = name.indexOf('-') - 1;
    const pname = name.substr(index, index2 - index);
    const selUsers = this.userAssignedBase.filter((_) => _.value === pname);
    const users = this.userWith.filter((_) => _.username.toLowerCase().indexOf(selUsers[0].value.toLowerCase()) === 0);
    return users[0].username;
  }
}
