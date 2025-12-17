import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';
import {UserService} from "../services/user.service";


export interface yearlyChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  responsive: ApexResponsive;
  labels: string[];
  colors: string[];
}

@Component({
  selector: 'app-yearly-breakup',
  templateUrl: './yearly-breakup.component.html',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, TablerIconsModule],
  encapsulation: ViewEncapsulation.None,
})
export class AppYearlyBreakupComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  public yearlyChart!: Partial<yearlyChart> | any;
  stats: any = {
    total: 0,
    admins: 0,
    teachers: 0,
    students: 0,
    growth: 0
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserStats();
  }

  loadUserStats(): void {
    this.userService.getUserStatistics().subscribe({
      next: (data) => {
        this.stats = data;
        this.updateChart();
      },
      error: (err) => {
        console.error('Error loading user statistics', err);
      }
    });
  }

  updateChart(): void {
    this.yearlyChart = {
      series: [this.stats.admins, this.stats.teachers, this.stats.students],
      labels: ["Administrateurs", "Professeurs", "Étudiants"],
      chart: {
        width: 125,
        type: "donut",
        fontFamily: "inherit",
        foreColor: "#adb0bb",
      },
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          donut: {
            size: "75%",
          },
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      colors: ['#5D87FF', '#49BEFF', '#13DEB9'],
      responsive: [
        {
          breakpoint: 991,
          options: {
            chart: {
              width: 120,
            },
          },
        },
      ],
      tooltip: {
        theme: "dark",
        fillSeriesColor: false,
        y: {
          formatter: (val: number) => `${val} utilisateurs`
        }
      },
    };
  }
}
