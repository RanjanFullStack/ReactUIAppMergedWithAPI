import Highcharts from 'highcharts';

export const CustomHighCharts = {
    getStockedChart,
    getAreaChart,
    getcolumnChart,
    getlineChart

};


function getStockedChart(chartType, title, xAxisData, yAxisData) {
   
    let chartOptions = {
        chart: {
            type: chartType
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: xAxisData,
        },
        yAxis: {
            allowDecimals: false,
    min: 0,
    title: {
        text: ''
    },
    gridLineWidth: 0,
    stackLabels: {
        enabled: false,
        style: {
            fontWeight: 'bold',
           
        }
    }
},
// exporting: {
//     buttons: {
//       contextButton: {
//         menuItems: [ {
//             separator: true
//         }, {
//             textKey: 'downloadPNG',
//             onclick: function () {
//                 this.exportChart();
//             }
//         },{
//             textKey: 'downloadPDF',
//             onclick: function () {
//                 this.exportChart({
//                     type: 'application/pdf'
//                 });
//             }
//         }, ]
//       }
//     }
//   },
legend: {
    align: 'center',
    x: -30,
    verticalAlign: 'center',
    y: -17,
    floating: true,
    border:"0px",
    shadow: false
},
credits: {
    enabled: false
  },
tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
},
plotOptions: {
    column: {
        stacking: 'normal',
        dataLabels: {
            enabled: false,
          
            
        }
       
    }
},
// colors: [
//     '#f77468',
//     '#b5ffed'
    
// ],

        series: yAxisData,
       
       
    }
    return chartOptions;
}



function getAreaChart(chartType, title, xAxisData, yAxisData) {
    let firstDate = xAxisData[0]; 
    let chartOptions =  {chart: {
        type: 'area'
    },
    title: {
        text: ''
    },
    xAxis: {
        startOfWeek: 1,
        title: {
            text: ''
        },
        type: 'datetime',
        labels: {
            formatter: function () {
                return Highcharts.dateFormat('%a %e %b', this.value);
            }
        }
    },

    tooltip: {
        //headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: 'No. of Requests: {point.y}'
    },
    // exporting: {
    //     buttons: {
    //       contextButton: {
    //         menuItems: [ {
    //             separator: true
    //         }, {
    //             textKey: 'downloadPNG',
    //             onclick: function () {
    //                 this.exportChart();
    //             }
    //         },{
    //             textKey: 'downloadPDF',
    //             onclick: function () {
    //                 this.exportChart({
    //                     type: 'application/pdf'
    //                 });
    //             }
    //         }, ]
    //       }
    //     }
    //   },
    yAxis: {
        allowDecimals: false,
        title: {
            text: ''
        },
        gridLineWidth: 0
        
    },
    credits: {
        enabled: false
      },

      plotOptions: {
        area: {
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                    [0, '#b5ffed'],
                    [1, '#a7e5ff']
                ]
            },
            lineWidth: 1,
            marker: {
                enabled: false
            },
            shadow: false,
            states: {
                hover: {
                    lineWidth: 1
                }
            },
            threshold: null
        }
    },
     
       // '#b5ffed'

         //linear-gradient(179.96deg, #b5ffed 0%, #a7e5ff 100%)

    series: [{
        showInLegend: true,
        data: yAxisData,
        pointStart: Date.UTC(xAxisData[0], xAxisData[1], xAxisData[2]),
        pointInterval: 7 * 24 * 3600 * 1000
    }]
};
    return chartOptions;
}



function getcolumnChart(chartType, title, xAxisData, yAxisData) {
    let chartOptions = {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        exporting: {
            buttons: {
              contextButton: {
                menuItems: [ {
                    textKey: 'downloadPNG',
                    onclick: function () {
                        this.exportChart();
                    }
                },{
                    textKey: 'downloadPDF',
                    onclick: function () {
                        this.exportChart({
                            type: 'application/pdf'
                        });
                    }
                }, ]
              }
            }
          },
        xAxis: {
            categories:xAxisData,
            crosshair: true,
            enabled: false,
        },
        yAxis: {
            min: 0,
            allowDecimals: false,
            title: {
                text: title
            }
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}'+title+': {point.y}'
        },
        legend: {
            enabled: false,
        },
        plotOptions: {
            enabled: false,
            column: {
             
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        credits: {
            enabled: false
          },
        series: [{
            name: '',
            data: yAxisData,
            color: {
                linearGradient: {
                  x1: 0,
                  x2: 0,
                  y1: 0,
                  y2: 1
                },
                stops: [
                  [0, '#b5ffed'],
                  [1, '#a7e5ff ']
                ]
              }
    
        },  ]
    }
    return chartOptions;
}




function getlineChart(chartType, title, xAxisData, yAxisData) {
    let chartOptions = {
        chart: {
            type: 'line'
        },
       
    title: {
        text: ''
    },

    subtitle: {
        text: ''
    },
    xAxis: {
        startOfWeek: 1,
        title: {
            text: ''
        },
        type: 'datetime',
        labels: {
           
            formatter: function () {
                return Highcharts.dateFormat('%b \'%y', this.value);
            }
        }
    },

    exporting: {
        buttons: {
          contextButton: {
            menuItems: [ 
                 {
                textKey: 'downloadPNG',
                onclick: function () {
                    this.exportChart();
                }
            },{
                textKey: 'downloadPDF',
                onclick: function () {
                    this.exportChart({
                        type: 'application/pdf'
                    });
                }
            }, ]
          }
        }
      },
    tooltip: {
        headerFormat: '',
        pointFormat: '{series.name}'+title+': {point.y}'
    },

    yAxis: {
        allowDecimals: false,
        title: {
            text: title,
           
        },
     
    },
    legend: {
        enabled: false,
        layout: '',
        align: '',
        verticalAlign: ''
    },

    plotOptions: {
        series: {
            pointStart: Date.UTC(2019, 0, 1),
            pointIntervalUnit: 'month',
            label: {
                connectorAllowed: false
            }
            
        }
    },
    credits: {
        enabled: false
      },
      

    series: [{
        name: '',
        data: yAxisData,
      
        color: {
            linearGradient: {
              x1: 0,
              x2: 0,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, '#5c6bc0'],
              [1, '#5c6bc0']
            ]
          }
       
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                enabled: false,
                legend: {
                    layout: '',
                    align: '',
                    verticalAlign: ''
                }
            }
        }]
    }
    }
    return chartOptions;
}





