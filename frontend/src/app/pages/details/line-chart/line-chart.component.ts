import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import 'chart.js/auto';
// import { IChartData } from '../details.component';
//
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnChanges {
  public chart: any;

  @Input() public data: any;

  createChart() {
    // previnir que o gráfico seja criado duas vezes
    if (this.chart) {
      return;
    }
    this.chart = new Chart('MyChart', {
      type: 'line', //this denotes tha type of chart

      data: {
        labels: this.data.labels,
        datasets: [
          {
            label: 'Download',
            data: this.data.download,
            borderColor: '#009DE0',
            fill: false,

          },
          {
            label: 'Upload',
            data: this.data.upload,
            borderColor: '#BED733',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        aspectRatio: 2.5,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Speed (bytes/s)',
              color: 'white',
            },
            ticks: {
              color: 'white',
            },
          },
          x: {
            ticks: {
              color: 'white',
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',
            },
          },
        },
      },
    });
  }

  updateChart(data: any) {
    if (!this.chart) {
      this.createChart();
    }

    // Atualize os dados do gráfico
    this.chart.data.labels = data.labels;
    this.chart.data.datasets[0].data = data.download;
    this.chart.data.datasets[1].data = data.upload;

    // Atualize o gráfico
    this.chart.update();
  }

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChart(this.data);
    }
  }
}
