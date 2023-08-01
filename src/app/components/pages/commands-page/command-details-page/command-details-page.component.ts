import { Component, Input, AfterContentChecked, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NotificationService } from '@services/notification.service';
import { ConfirmDialogService } from '@services/confirmDialog.service';
import { CommandsService } from '@services/commands.service';
import { MatTableDataSource } from '@angular/material/table';
import { CommandDetails } from '@models/commands';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { SessionStorageService } from '@services/storageSession.service';

@Component({
  selector: 'vt-command-details-page',
  templateUrl: './command-details-page.component.html',
  styleUrls: ['./command-details-page.component.scss'],
})
export class CommandDetailsPageComponent implements AfterContentChecked {
  @Input() commandsListDetails!: CommandDetails[];
  @Input() commandListId;
  commandData = this.commandsListDetails;
  detailColumnsToDisplay: string[];
  dataSource: any;
  public subOverlay = false;
  selectedCommand: any;
  makeCommandformVisible = false;

  constructor(
    private notify: NotificationService,
    private commands: CommandsService,
    private formBuilder: FormBuilder,
    private dialogService: ConfirmDialogService,
    public sessionService: SessionStorageService,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterContentChecked(): void {
    this.detailColumnsToDisplay = ['CommandName', 'ConsumerCommand', 'Actions'];
    this.dataSource = new MatTableDataSource<CommandDetails>(this.commandsListDetails);
  }

  showCommandEdit(command: any | boolean) {
    if (!command) {
      this.sessionService.setVariableToStorage('selectedCommand', null);
      this.toggleOverlay();
    } else {
      const row = command;
      this.sessionService.setVariableToStorage('selectedCommand', row.CommandId);
      this.selectedCommand = row;
      this.toggleOverlay();
    }
  }

  toggleOverlay(): void {
    const parentOverlay = document.querySelector('#commands-overlay');
    const overlayContainer = document.querySelector('#command-overlay');
    const overlayBg = document.querySelector('.secondary-overlay');
    overlayContainer.classList.toggle('active');
    overlayBg.classList.toggle('active');
    parentOverlay.classList.toggle('disabled');
    this.subOverlay = !this.subOverlay;
    this.makeCommandformVisible = true;
    if (this.subOverlay === true) {
      this.onSubOverlayClicked();
    }
  }

  onCloseClicked() {
    const changedVariables: number = +this.sessionService.getVariableFromStorage('commandEditChanges');
    if (changedVariables > 0) {
      this.openConfirmDialog();
    } else {
      this.toggleOverlay();
      this.selectedCommand = '';
      this.sessionService.setVariableToStorage('selectedCommand', null);
      this.sessionService.setVariableToStorage('commandEditChanges', null);
      this.makeCommandformVisible = false;
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
        this.selectedCommand = '';
        this.sessionService.setVariableToStorage('selectedCommand', null);
        this.sessionService.setVariableToStorage('commandEditChanges', null);
        this.makeCommandformVisible = false;
      }
    });
  }

  showDeleteDialog(element) {
    const dialogOptions = {
      title: 'Are You sure?',
      message: 'The selected command will be removed if you choose to proceed.',
      cancelText: 'Cancel',
      confirmText: 'Proceed',
    };
    this.dialogService.open(dialogOptions);
    this.dialogService.confirmed().subscribe((confirmed) => {
      if (confirmed) {
        this.commands.deleteCommandInList(element.CommandId).subscribe(
          (result) => {
            this.notify.openSnackBar('The selected command has been deleted');
            this.refreshCommandList();
          },
          (error) => {
            this.notify.openSnackBar(error.error.title);
          }
        );
      }
    });
  }

  forceRefresh(info: any) {
    this.onCloseClicked();
    setTimeout(() => {
      this.refreshCommandList();
    }, 500);
  }

  refreshCommandList() {
    const selectedCommandsList = +this.sessionService.getVariableFromStorage('selectedCommandsList');
    this.commands.getCommandsInList(selectedCommandsList).subscribe(
      (result) => {
        this.commandsListDetails = result;
        this.dataSource = new MatTableDataSource<CommandDetails>(this.commandsListDetails);
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSubOverlayClicked() {
    const overlay = document.querySelector('.secondary-overlay') as HTMLElement;
    overlay.addEventListener('click', this.handleDialog);
  }

  handleDialog() {
    const overlay = document.querySelector('.secondary-overlay') as HTMLElement;
    if (overlay === event.target) {
      const closeBtn: HTMLElement = document.getElementsByClassName('secondary-sidebar-close')[0] as HTMLElement;
      closeBtn.click();
    }
    if (this.selectedCommand === '') document.removeEventListener('click', this.handleDialog);
  }
}
