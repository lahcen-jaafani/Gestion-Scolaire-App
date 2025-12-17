import { Component, ViewChild, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { MajorService } from 'src/app/components/services/major.service';
import {
  ApexChart, ChartComponent, ApexDataLabels, ApexLegend, ApexStroke,
  ApexTooltip, ApexAxisChartSeries, ApexXAxis, ApexYAxis, ApexGrid,
  ApexPlotOptions, ApexFill, ApexMarkers, NgApexchartsModule
} from 'ng-apexcharts';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from "@angular/forms";

interface Month {
  value: string;
  viewValue: string;
}

export interface salesOverviewChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

@Component({
  selector: 'app-sales-overview',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule, MatButtonModule, FormsModule],
  templateUrl: './sales-overview.component.html',
})
export class AppSalesOverviewComponent implements OnInit {
  academicYears: Month[] = [];
  selectedYear: string='2024-2025';
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  majors: any[] = [];

  generateAcademicYears(): void {
    const currentYear = new Date().getFullYear();
    const yearsToShow = 3; // Nombre d'années académiques à afficher

    this.academicYears = Array.from({ length: yearsToShow }, (_, i) => {
      const startYear = currentYear + i - 2;
      const endYear = startYear + 1;
      const value = `${startYear}-${endYear}`;
      return { value, viewValue: value };
    });

    // Sélectionner la dernière année par défaut
    this.selectedYear = this.academicYears[this.academicYears.length - 1].value;
  }




  public salesOverviewChart: Partial<salesOverviewChart> | any = {
    series: [{
      name: 'Number of Students',
      data: []
    }],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      foreColor: '#adb0bb',
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        horizontal: false,  // Changed to vertical bars
        columnWidth: '35%',
        borderRadius: 4,
      }
    },
    colors: ['#5D87FF', '#49BEFF'], // Multiple colors for potential multiple series
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [],
      title: {
        text: 'Majors'
      },
      labels: {
        style: { cssClass: 'grey--text lighten-2--text fill-color' },
        rotate: -45, // Rotate labels if they're long
      }
    },
    yaxis: {
      title: {
        text: 'Number of Students'
      },
      labels: {
        style: {
          cssClass: 'grey--text lighten-2--text fill-color',
        },
      },
      min: 0,
      tickAmount: 5
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => `${val} students`
      }
    },
    fill: {
      opacity: 1
    }
  };

  constructor(private majorService: MajorService) {}

  ngOnInit(): void {
    this.generateAcademicYears();
    this.loadMajorsWithStudentCount();
    this.updateChartData();

    // Then load real data

  }

  loadMajorsWithStudentCount(): void {
    this.majorService.getMajorsWithStudentCount(this.selectedYear).subscribe({
      next: (data) => {
        this.majors = data;
        this.updateChartData();
      },
      error: (err) => {
        console.error('Error loading majors with student count', err);
      }
    });
  }

  updateChartData(): void {
    const newChartData = {
      ...this.salesOverviewChart,
      series: [{
        name: 'Number of Students',
        data: this.majors.map(major => major.studentCount || 0)
      }],
      xaxis: {
        ...this.salesOverviewChart.xaxis,
        categories: this.majors.map(major => major.majorName || '')
      }
    };

    // Force new object reference
    this.salesOverviewChart = JSON.parse(JSON.stringify(newChartData));

    // Trigger resize after a small delay
    setTimeout(() => {
      if (this.chart) {
        this.chart.updateOptions(newChartData);
        window.dispatchEvent(new Event('resize'));
      }
    }, 100);
  }

  onYearChange(): void {
    this.loadMajorsWithStudentCount();
  }
}
