import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../../../../services/dashboard.service';
import { ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'vt-account-count-interval',
  templateUrl: './account-count-interval.component.html',
  styleUrls: ['./account-count-interval.component.scss'],
})
export class AccountCountIntervalComponent implements OnInit {
  @Input() companyId;
  constructor(private dataService: DashboardService) {}
  public polarAreaChartLabels: Label[] = ['Last day', 'Last week', 'Last month'];
  public polarAreaLegend = true;
  public polarAreaChartType: ChartType = 'polarArea';
  public polarAreaChartData: SingleDataSet = [0, 0, 0];
  visible = false;
  errorMessage = '';

  ngOnInit(): void {
    this.dataService.getAccountCountForLastInterval(this.companyId).subscribe(
      (result) => {
        this.visible = !result.ErrorMessage;
        if (!result.ErrorMessage) this.polarAreaChartData = [result.LastDay, result.LastWeek, result.LastMonth];
        else this.errorMessage = 'The data request for widget failed!';
      },
      (error) => {
        this.errorMessage = 'The data request for widget failed!';
      }
    );
  }

  // events
  //public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  //  console.log(event, active);
  //}

  //public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  //  console.log(event, active);
  //}
}
