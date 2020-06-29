import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-covid-graph',
  templateUrl: './covid-graph.component.html',
  styleUrls: ['./covid-graph.component.css']
})
export class CovidGraphComponent implements OnInit {

  confirmed_case: string = '';
  deaths_case: string = '';

  c_case: string = '';
  d_case: string = '';
  m_rate: string = '';

  date_array:string[];
  countries:string[];

  selected_country: string = '';
  selected_date: string = '';
  selectedDate:number = -1;

  isLoading = true;

  constructor(private http: HttpClient) { }

  onCountrySelected(value:string){
    this.isLoading = true;
    this.onstart(value);
  }

  onDateSelected(value:number){
    // this.isLoading = true;
    if(value != -1){
      this.c_case = this.barChartData[1].data[value];
      this.d_case = this.barChartData[0].data[value];
    }else{
      this.c_case = this.barChartData[1].data[0];
      this.d_case = this.barChartData[0].data[0];
    }
    
    console.log(this.c_case);
    let m_r = (Number(this.d_case) * 100) / Number(this.c_case);
    this.m_rate = parseFloat(String(m_r)).toFixed(2) +' %';
  }

  onstart(country: string){
    // this.http.get('http://ec2-15-206-88-236.ap-south-1.compute.amazonaws.com:5000/confirm',
    this.http.get('http://localhost:3000/confirm',

    {
      params: {
        country: country
      },
    }
    ).subscribe((data: any )=> {
      this.date_array = data.date_array.reverse();
      this.barChartLabels = this.date_array;
      this.barChartData[1].data = data.cofirmed_case.reverse();;
      this.barChartData[0].data = data.deaths_case.reverse();;
      this.countries=data.country;
      this.onDateSelected(this.selectedDate);
      this.isLoading = false;
  })}


  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
        yAxes: [{
            id: 'left-y-axis',
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Number of Confirmed Cases'
            },
            ticks: {
              beginAtZero: true,
              autoSkipPadding: 50,
              // stepSize: 50000000,

              // minRotation: 90,
            // autoskip: false,
           },
        }, {
            id: 'right-y-axis',
            type: 'linear',
            position: 'right',
            gridLines: {
                drawOnChartArea: false,
                // tickMarkLength: 5  
            },
            scaleLabel: {
              display: true,
              labelString: 'Number of Deaths',
            },
            ticks: {
              beginAtZero: true,
              autoSkipPadding: 50,
              stepSize: 1000000000,
              display: false
              // min: -10,
              // minRotation: 90,
            // autoskip: false,
           },
          
        }],
        xAxes: [{
          ticks: {
            // minRotation: 90,
            autoSkipPadding: 50,
            // autoskip: false,
          },
          gridLines: {
            drawOnChartArea: false,
            // offsetGridLines: true,
            // drawBorder: true,
            drawTicks: true
        },
        distribution: 'series',
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM D',
          },
        }
        }]
    },
    legend: {
        align: "end",
        labels: {
          usePointStyle: true,
        }
    },
    maintainAspectRatio: false,
    elements: {
      point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 8
      }
    },
    tooltips: {
      intersect: false,
      mode: "index"
    }
  }

  public barChartLabels = [];//this.date_array;
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [{
      label: 'Total Deaths',
      data: this.deaths_case,
      yAxisID: 'right-y-axis',
      backgroundColor: "#A93439",
      pointStyle: 'circle',
      legend: {
        labels: {
          // padding: 50,
          // boxWidth: 80,
        }
      }
    }, {
      label: 'Total Confirmed',
      data: this.confirmed_case,
      type: 'line',
      yAxisID: 'left-y-axis',
      fill: false,
      borderColor: "#EC932F",
      backgroundColor: "#EC932F",
      pointStyle: 'rect',
  }];

  ngOnInit(): void {
    this.onstart(this.selected_country);
    // console.log(startData.c_c);
  }

}
