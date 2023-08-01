import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule, MatSnackBarConfig } from '@angular/material/snack-bar';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NotificationService } from './notification.service';

describe('NotificationService testing:', () => {
  let spectator: SpectatorService<NotificationService>;
  let snackBar: MatSnackBar;
  let snackBarConfig: MatSnackBarConfig;

  const createService = createServiceFactory({
    service: NotificationService,
    imports: [MatSnackBarModule],
    providers: [MatSnackBarModule, Overlay],
    entryComponents: [],
    mocks: [NotificationService],
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    snackBar = TestBed.inject(MatSnackBar);
    spectator = createService();
  });

  it('should service be created', () => {
    const service: NotificationService = TestBed.inject(NotificationService);
    expect(service).toBeTruthy();
  });

  it('should openSnackBar() be known as function', () => {
    expect(typeof spectator.service.openSnackBar).toEqual('function');
  });

  it(`should openSnackBar() call SnackBar's own open()`, () => {
    const service: NotificationService = TestBed.inject(NotificationService);
    snackBarConfig = new MatSnackBarConfig();
    snackBarConfig.duration = parseInt('5000', 0);
    const serviceSpy = spyOn(service, 'openSnackBar').and.callThrough();
    const snackSpy = spyOn(snackBar, 'open');
    expect(serviceSpy).not.toHaveBeenCalled();
    expect(snackSpy).not.toHaveBeenCalled();
    service.openSnackBar('Hello');
    expect(serviceSpy).toHaveBeenCalledWith('Hello');
    expect(snackSpy).toHaveBeenCalledWith('Hello', 'Dismiss', snackBarConfig);
  });
});
