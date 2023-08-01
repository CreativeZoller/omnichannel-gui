import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from '@services/dashboard.service';
import { IFailedMessage } from '../../../../../models/failedMessages';

@Component({
  selector: 'vt-failed-messages',
  templateUrl: './failed-messages.component.html',
  styleUrls: ['./failed-messages.component.scss'],
})
export class FailedMessagesComponent implements OnInit {
  @Input() companyId;
  constructor(private dataService: DashboardService) {}
  visible = false;
  errorMessage = '';
  failedMessages: IFailedMessage[] = [];

  ngOnInit(): void {
    this.dataService.getFailedMessages(this.companyId).subscribe(
      (result) => {
        if (result.length < 1) {
          this.visible = true;
          this.errorMessage = 'There  were no recent failed messages';
        } else {
          this.visible = !result[0].ErrorMessage;
          if (!result[0].ErrorMessage) this.failedMessages = result;
          else this.errorMessage = 'The data request for widget failed!';
        }
      },
      (error) => {
        this.errorMessage = 'The data request for widget failed!';
      }
    );
  }
}
