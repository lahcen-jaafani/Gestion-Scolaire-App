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
    selector: 'app-monthly-earnings',
    imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
    templateUrl: './monthly-earnings.component.html',
})
export class AppMonthlyEarningsComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public chartOptions: any = {
    series: [44, 55], // Valeurs par défaut, seront remplacées par les données réelles
    chart: {
      type: 'donut',
      height: 300,
      animations: {
        enabled: true,
        speed: 800
      }
    },
    labels: ['Départements', 'Filières'],
    colors: ['#3f51b5', '#4caf50'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: (w: any) => {
                return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              }
            }
          }
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} unités`
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
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
