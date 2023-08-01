import { Component, Input, OnInit } from '@angular/core';
import { Messages } from '../../../../../models/messages';
import { DashboardService } from '../../../../../services/dashboard.service';

@Component({
  selector: 'vt-h2h-latest',
  templateUrl: './h2h-latest.component.html',
  styleUrls: ['./h2h-latest.component.scss'],
})
export class H2hLatestComponent implements OnInit {
  @Input() companyId;
  constructor(private dataService: DashboardService) {}
  visible = false;
  errorMessage = '';
  messages: Messages[] = [];

  ngOnInit(): void {
    this.dataService.getH2HRequests(this.companyId).subscribe(
      (result) => {
        if (result.length < 1) {
          this.visible = true;
          this.errorMessage = 'There  were no recent messages';
        } else {
          this.visible = !result[0].ErrorMessage;
          if (!result[0].ErrorMessage) this.messages = result;
          else this.errorMessage = 'The data request for widget failed!';
        }
      },
      (error) => {
        this.errorMessage = 'The data request for widget failed!';
      }
    );
  }
}
