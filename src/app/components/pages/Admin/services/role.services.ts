import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlerService } from '../../../../services/errorHandling.service';
import { IResult } from '../../../../models/result';
import { IRole } from '../../../../models/Role/role';
import { Constants } from '../../../../constants';
import { IUserAgentId } from '../../../../models/Role/userAgent';
import { IPermission } from '../../../../models/Role/permission';

@Injectable()
export class RoleService {
  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  getRoles(): Observable<IResult<IRole[]>> {
    return this.http.get<IResult<IRole[]>>(`${Constants.apiRoot}Role/GetRoles`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  getRole(roleId: number): Observable<IResult<IRole>> {
    return this.http.get<IResult<IRole>>(`${Constants.apiRoot}Role/GetRole/${roleId}`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  getUsersWithRole(roleId: number): Observable<IResult<IUserAgentId[]>> {
    return this.http.get<IResult<IUserAgentId>>(`${Constants.apiRoot}Role/GetUsersWithRole/${roleId}`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }
  getUsersWithOutRole(roleId: number): Observable<IResult<IUserAgentId[]>> {
    return this.http.get<IResult<IUserAgentId>>(`${Constants.apiRoot}Role/GetUsersWithOutRole/${roleId}`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  getAllAgentIds(): Observable<IResult<string[]>> {
    return this.http.get<IResult<string[]>>(`${Constants.apiRoot}Role/GetAllAgentIds`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  getPermissionsWithRole(roleId: number): Observable<IResult<IPermission[]>> {
    return this.http.get<IResult<IPermission>>(`${Constants.apiRoot}Role/GetPermissionsWithRole/${roleId}`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  getPermissionsWithOutRole(roleId: number): Observable<IResult<IPermission[]>> {
    return this.http.get<IResult<IPermission>>(`${Constants.apiRoot}Role/GetPermissionsWithOutRole/${roleId}`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  getPermission(): Observable<IResult<IPermission[]>> {
    return this.http.get<IResult<IPermission>>(`${Constants.apiRoot}Role/GetPermissions`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  addPermissionToRole(roleId: number, permissionId: number): Observable<IResult<boolean>> {
    return this.http.post(`${Constants.apiRoot}Role/AddPermissionToRole`, { roleId: roleId, permissionId: permissionId }).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  removePermissionFromRole(roleId: number, permissionId: number): Observable<IResult<boolean>> {
    return this.http.delete(`${Constants.apiRoot}Role/RemovePermissionFromRole?roleId=${roleId}&permissionId=${permissionId}`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  addUserToRole(roleId: number, user: string): Observable<IResult<boolean>> {
    return this.http.post(`${Constants.apiRoot}Role/AddUserToRole`, { roleId: roleId, user: user }).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  removeUserFromRole(roleId: number, user: string): Observable<IResult<boolean>> {
    return this.http.delete(`${Constants.apiRoot}Role/RemoveUserFromRole?roleId=${roleId}&user=${user}`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  createRole(role: IRole): Observable<IResult<IRole>> {
    return this.http.post(`${Constants.apiRoot}Role/CreateRole`, role).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }

  updateRole(role: IRole): Observable<IResult<boolean>> {
    return this.http.patch(`${Constants.apiRoot}Role/UpdateRole`, role).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }
  deleteRole(roleId: number): Observable<IResult<boolean>> {
    return this.http.delete(`${Constants.apiRoot}Role/DeleteRole/${roleId}`).pipe(
      map((result: any) => result),
      catchError((error) => {
        this.errorHandler.handleError(error);
        return of({ results: [] });
      })
    );
  }
}
