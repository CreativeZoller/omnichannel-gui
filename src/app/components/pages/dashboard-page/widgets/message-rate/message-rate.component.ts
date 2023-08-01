import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { DashboardService } from '../../../../../services/dashboard.service';

@Component({
  selector: 'vt-message-rate',
  templateUrl: './message-rate.component.html',
  styleUrls: ['./message-rate.component.scss'],
})
export class MessageRateComponent implements OnInit {
  @Input() companyId;
  constructor(private dataService: DashboardService) {}
  public pieChartLabels: Label[] = ['Human to Human', 'Human to Machine'];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  visible = false;
  errorMessage = '';

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  ngOnInit(): void {
    this.dataService.getMessageRate(this.companyId).subscribe(
      (result) => {
        this.visible = !result.ErrorMessage;
        if (!result.ErrorMessage) this.pieChartData = [result.H2H, result.H2M];
        else this.errorMessage = 'The data request for widget failed!';
      },
      (error) => {
        this.errorMessage = 'The data request for widget failed!';
      }
    );
  }
}
