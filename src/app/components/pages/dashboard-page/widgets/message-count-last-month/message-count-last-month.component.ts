import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { DashboardService } from '../../../../../services/dashboard.service';

@Component({
  selector: 'vt-message-count-last-month',
  templateUrl: './message-count-last-month.component.html',
  styleUrls: ['./message-count-last-month.component.scss'],
})
export class MessageCountLastMonthComponent implements OnInit {
  @Input() companyId;
  constructor(private dataService: DashboardService) {}
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  visible = false;
  errorMessage = '';

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
  };

  public barChartData: ChartDataSets[] = [];

  ngOnInit(): void {
    this.dataService.getMessageCountLastMonth(this.companyId).subscribe(
      (result) => {
        this.visible = true;
        const values: number[] = [];

        for (let i = 0; i < result.length; i++) {
          if (result[i].Created !== null && result[i].Created !== undefined) {
            this.barChartLabels.push(result[i].Created.toString());
            values.push(result[i].MessageCount);
            this.visible = !(result[i].ErrorMessage !== '' && result[i].ErrorMessage !== null && result[i].ErrorMessage !== undefined);
            if (i == 0) this.errorMessage = result[i].ErrorMessage;
          }
          if (values.length > 0) this.barChartData = [{ data: values, label: 'Last month message count' }];
          else {
            this.barChartLabels.push('No data');
            values.push(100);
          }
        }
      },
      (error) => {
        this.errorMessage = 'The data request for widget failed!';
      }
    );
  }
}
