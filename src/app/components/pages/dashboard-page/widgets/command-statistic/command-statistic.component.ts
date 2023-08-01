import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';
import { ICommandStatisticResponse } from '../../../../../models/commandStatisticResponse';
import { DashboardService } from '../../../../../services/dashboard.service';

@Component({
  selector: 'vt-command-statistic',
  templateUrl: './command-statistic.component.html',
  styleUrls: ['./command-statistic.component.scss'],
})
export class CommandStatisticComponent implements OnInit {
  @Input() companyId;
  constructor(private dataService: DashboardService) {}
  public pieChartLabels: Label[] = [];
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
    this.dataService.getCommandStatistic(this.companyId).subscribe(
      (result) => {
        this.visible = true;
        const values: number[] = [];

        for (let i = 0; i < result.length; i++) {
          if (result[i].CommandName !== null && result[i].CommandName.length > 1) {
            this.pieChartLabels.push(result[i].CommandName);
            values.push(result[i].Percentage);
            this.visible = !(result[i].ErrorMessage !== '' && result[i].ErrorMessage !== null && result[i].ErrorMessage !== undefined);
            if (i == 0) this.errorMessage = result[i].ErrorMessage;
          }
          if (values.length > 0) this.pieChartData = values;
          else {
            this.pieChartLabels.push('No data');
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
