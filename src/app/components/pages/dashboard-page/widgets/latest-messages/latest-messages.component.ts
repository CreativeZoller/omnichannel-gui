import { Component, Input, OnInit } from '@angular/core';
import { Messages } from '../../../../../models/messages';
import { DashboardService } from '../../../../../services/dashboard.service';

@Component({
  selector: 'vt-latest-messages',
  templateUrl: './latest-messages.component.html',
  styleUrls: ['./latest-messages.component.scss'],
})
export class LatestMessagesComponent implements OnInit {
  @Input() companyId;
  constructor(private dataService: DashboardService) {}
  visible = false;
  errorMessage = '';
  messages: Messages[] = [];

  ngOnInit(): void {
    this.dataService.getLastMessages(this.companyId).subscribe(
      (result) => {
        if (result === []) {
          this.visible = true;
          this.errorMessage = 'There  were no recent messages';
        }
        if (result.length < 1) {
          this.visible = true;
          return;
        }
        this.visible = !result[0].ErrorMessage;
        if (!result[0]?.ErrorMessage) this.messages = result;
        else this.errorMessage = 'The data request for widget failed!';
      },
      (error) => {
        this.errorMessage = 'The data request for widget failed!';
      }
    );
  }
}
