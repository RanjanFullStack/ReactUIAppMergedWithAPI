import React, { Component } from 'react';
import { Alert, Button, ButtonToolbar, Card } from 'react-bootstrap';
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import AlertBanner from '../../components/AlertBanner/index'
import './Dashboard.css';
import ReactHighcharts from 'react-highcharts'

class Dashboard extends Component {
  state = { showError: true,visible: false }


  toggleError = () => {
    this.setState((prevState, props) => {
      return { showError: !prevState.showError }
    })
  };

  handleClose() {
    this.setState({ visible: false });
  }
  handleOpen() {
    this.setState({ visible: true });
  }
    render() {

      var data1 = [[1220832000000, 22.56], [1220918400000, 21.67], [1221004800000, 21.66], [1221091200000, 21.81], [1221177600000, 21.28], [1221436800000, 20.05], [1221523200000, 19.98], [1221609600000, 18.26], [1221696000000, 19.16], [1221782400000, 20.13], [1222041600000, 18.72], [1222128000000, 18.12], [1222214400000, 18.39], [1222300800000, 18.85], [1222387200000, 18.32], [1222646400000, 15.04], [1222732800000, 16.24], [1222819200000, 15.59], [1222905600000, 14.3], [1222992000000, 13.87], [1223251200000, 14.02], [1223337600000, 12.74], [1223424000000, 12.83], [1223510400000, 12.68], [1223596800000, 13.8], [1223856000000, 15.75], [1223942400000, 14.87], [1224028800000, 13.99], [1224115200000, 14.56], [1224201600000, 13.91], [1224460800000, 14.06], [1224547200000, 13.07], [1224633600000, 13.84], [1224720000000, 14.03], [1224806400000, 13.77], [1225065600000, 13.16], [1225152000000, 14.27], [1225238400000, 14.94], [1225324800000, 15.86], [1225411200000, 15.37], [1225670400000, 15.28], [1225756800000, 15.86], [1225843200000, 14.76], [1225929600000, 14.16], [1226016000000, 14.03], [1226275200000, 13.7], [1226361600000, 13.54], [1226448000000, 12.87], [1226534400000, 13.78], [1226620800000, 12.89], [1226880000000, 12.59], [1226966400000, 12.84], [1227052800000, 12.33], [1227139200000, 11.5], [1227225600000, 11.8], [1227484800000, 13.28], [1227571200000, 12.97], [1227657600000, 13.57], [1227830400000, 13.24], [1228089600000, 12.7], [1228176000000, 13.21], [1228262400000, 13.7], [1228348800000, 13.06], [1228435200000, 13.43], [1228694400000, 14.25], [1228780800000, 14.29], [1228867200000, 14.03], [1228953600000, 13.57], [1229040000000, 14.04], [1229299200000, 13.54]];
      var datapie =  [{        name: 'Chrome',        y: 61.41,        sliced: true,        selected: true
    }, {
        name: 'Internet Explorer',
        y: 11.84
    }, {
        name: 'Firefox',
        y: 10.85
    }, {
        name: 'Edge',
        y: 4.67
    }, {
        name: 'Safari',
        y: 4.18
    }, {
        name: 'Sogou Explorer',
        y: 1.64
    }, {
        name: 'Opera',
        y: 1.6
    }, {
        name: 'QQ',
        y: 1.2
    }, {
        name: 'Other',
        y: 2.61
    }];
    
    

    let data2=[
      {
          y: 62.74,
          color: "Other",
          drilldown: {
              name: 'Chrome',
              categories: [
                  'Chrome v65.0',
                  'Chrome v64.0',
                  'Chrome v63.0',
                  'Chrome v62.0',
                  'Chrome v61.0',
                  'Chrome v60.0',
                  'Chrome v59.0',
                  'Chrome v58.0',
                  'Chrome v57.0',
                  'Chrome v56.0',
                  'Chrome v55.0',
                  'Chrome v54.0',
                  'Chrome v51.0',
                  'Chrome v49.0',
                  'Chrome v48.0',
                  'Chrome v47.0',
                  'Chrome v43.0',
                  'Chrome v29.0'
              ],
              data: [
                  0.1,
                  1.3,
                  53.02,
                  1.4,
                  0.88,
                  0.56,
                  0.45,
                  0.49,
                  0.32,
                  0.29,
                  0.79,
                  0.18,
                  0.13,
                  2.16,
                  0.13,
                  0.11,
                  0.17,
                  0.26
              ]
          }
      },
      {
          y: 10.57,
          color: "Chrome",
          drilldown: {
              name: 'Firefox',
              categories: [
                  'Firefox v58.0',
                  'Firefox v57.0',
                  'Firefox v56.0',
                  'Firefox v55.0',
                  'Firefox v54.0',
                  'Firefox v52.0',
                  'Firefox v51.0',
                  'Firefox v50.0',
                  'Firefox v48.0',
                  'Firefox v47.0'
              ],
              data: [
                  1.02,
                  7.36,
                  0.35,
                  0.11,
                  0.1,
                  0.95,
                  0.15,
                  0.1,
                  0.31,
                  0.12
              ]
          }
      },
      {
          y: 7.23,
          color: "Firefox",
          drilldown: {
              name: 'Internet Explorer',
              categories: [
                  'Internet Explorer v11.0',
                  'Internet Explorer v10.0',
                  'Internet Explorer v9.0',
                  'Internet Explorer v8.0'
              ],
              data: [
                  6.2,
                  0.29,
                  0.27,
                  0.47
              ]
          }
      },
      {
          y: 5.58,
          color: "Internet Explorer",
          drilldown: {
              name: 'Safari',
              categories: [
                  'Safari v11.0',
                  'Safari v10.1',
                  'Safari v10.0',
                  'Safari v9.1',
                  'Safari v9.0',
                  'Safari v5.1'
              ],
              data: [
                  3.39,
                  0.96,
                  0.36,
                  0.54,
                  0.13,
                  0.2
              ]
          }
      },
      {
          y: 4.02,
          color: "Safari",
          drilldown: {
              name: 'Edge',
              categories: [
                  'Edge v16',
                  'Edge v15',
                  'Edge v14',
                  'Edge v13'
              ],
              data: [
                  2.6,
                  0.92,
                  0.4,
                  0.1
              ]
          }
      },
      {
          y: 1.92,
          color: "Edge",
          drilldown: {
              name: 'Opera',
              categories: [
                  'Opera v50.0',
                  'Opera v49.0',
                  'Opera v12.1'
              ],
              data: [
                  0.96,
                  0.82,
                  0.14
              ]
          }
      },
      {
          y: 7.62,
          color: "Opera",
          drilldown: {
              name: 'Other',
              categories: [
                  'Other'
              ],
              data: [
                  7.62
              ]
          }
      }
  ]

 let series= [{
    name: 'Installation',
    data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
}, {
    name: 'Manufacturing',
    data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
}, {
    name: 'Sales & Distribution',
    data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
}, {
    name: 'Project Development',
    data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
}, {
    name: 'Other',
    data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
}]

var config = {
  rangeSelector: {
    selected: 1
  },
  chart: {
    height: "250px", // 16:9 ratio
},
  title: {
    text: ''
  
  },
  
  series: [{
    name: 'AAPL',
    data: data1,
    tooltip: {
      valueDecimals: 2
    }
  }]
};
var configpie = {
  rangeSelector: {
    selected: 1
  },
  chart: {
    height: "250px",
    type: 'pie' // 16:9 ratio
},
  title: {
    text: ''
  
  },
  
  series: [{
    name: 'AAPL',
    data: datapie,
    tooltip: {
      valueDecimals: 2
    }
  }]
};
var configdonet = {
  rangeSelector: {
    selected: 1
  },
  chart: {
    height: "250px",
    type: 'pie' // 16:9 ratio
},
  title: {
    text: ''
  
  },
  
  series: [{
    name: 'AAPL',
    data: data2,
    tooltip: {
      valueDecimals: 2
    }
  }]
};

var configline = {
  rangeSelector: {
    selected: 1
  },
  chart: {
    height: "250px",
    type: 'line' // 16:9 ratio
},
  title: {
    text: ''
  
  },
  
  series: series
};



      const chart1=(
        <>
        <ReactHighcharts config = {config}></ReactHighcharts>
        </>
      )
      const chart2=(
        <>
        <ReactHighcharts config = {configpie}></ReactHighcharts>
        </>
      )
      const chart3=(
        <>
        <ReactHighcharts config = {configdonet}></ReactHighcharts>
        </>
      )
      const chart4=(
        <>
        <ReactHighcharts config = {configline}></ReactHighcharts>
        </>
      )
        return (
            <>
             <div class="container-fluid  listGroup-scroll" style={{height:"90vh"}}>
          <div class="row mt-3">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-primary shadow bf-h100 py-2">
                <div class="card-body p-1">
                  <div class="row no-gutters align-items-center p-0 m-0">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-primary text-uppercase mb-0 ml-3">126</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 mt-1 ml-1 ml-3">New</div>
                      <div class="h5 mb-0 bf-font-size-15 mt-1 ml-1 border-top-1 ml-3">More Info</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-folder bf-mb-60 fa-2x text-gray-300 mr-3"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-primary shadow bf-h100 py-2">
                <div class="card-body  p-1">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-primary text-uppercase mb-1 ml-3">125</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 mt-1 ml-1 ml-3">Open</div>
                      <div class="h5 mb-0  bf-font-size-15 mt-1 ml-1 border-top-1 ml-3">More Info</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-folder-open bf-mb-60 fa-2x text-gray-300 mr-3"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-primary shadow bf-h100 py-2">
                <div class="card-body  p-1">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-primary text-uppercase mb-1 ml-3">124</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 mt-1 ml-1 ml-3">In progress</div>
                      <div class="h5 mb-0  bf-font-size-15  mt-1 ml-1 border-top-1 ml-3">More Info</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-calendar bf-mb-60 fa-2x text-gray-300 mr-3"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card border-left-primary shadow bf-h100 py-2">
                <div class="card-body  p-1">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-primary text-uppercase mb-1 ml-3">126</div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800 mt-1 ml-1 ml-3">Overdue</div>
                      <div class="h5 mb-0 bf-font-size-15   mt-1 ml-1 border-top-1 ml-3">More Info</div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-calendar fa-2x bf-mb-60 text-gray-300 mr-3"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          
          </div>
          <div class="row">


<div class="col-xl-6">
  <div class="card shadow mb-4">
  
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
      <h6 class="m-0 font-weight-bold text-primary">Request Frequency</h6>
      <div class="dropdown no-arrow">
        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
          <div class="dropdown-header">Dropdown Header:</div>
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </div>
    </div>
    
    <div class="card-body" style={{height:"300px"}}>
      <div class="chart-area">
     {chart1}
      </div>
    </div>
  </div>
</div>


<div class="col-xl-6">
  <div class="card shadow mb-4">
  
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
      <h6 class="m-0 font-weight-bold text-primary">Request by status</h6>
      <div class="dropdown no-arrow">
        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
          <div class="dropdown-header">Dropdown Header:</div>
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </div>
    </div>
   
    <div class="card-body" style={{height:"300px"}}>
      <div class="chart-area h-50">
       {chart2}
      </div>
     
    </div>
  </div>
</div>
</div>
<div class="row">


<div class="col-xl-6">
  <div class="card shadow mb-4">
  
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
      <h6 class="m-0 font-weight-bold text-primary">Request by Priority</h6>
      <div class="dropdown no-arrow">
        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
          <div class="dropdown-header">Dropdown Header:</div>
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </div>
    </div>
    
    <div class="card-body" style={{height:"300px"}}>
      <div class="chart-area">
      {chart3}
      </div>
    </div>
  </div>
</div>


<div class="col-xl-6">
  <div class="card shadow mb-4">
  
    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
      <h6 class="m-0 font-weight-bold text-primary">Request by Master</h6>
      <div class="dropdown no-arrow">
        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
        </a>
        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
          <div class="dropdown-header">Dropdown Header:</div>
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </div>
    </div>
   
    <div class="card-body" style={{height:"300px"}}>
      <div class="chart-area h-50">
      {chart4}
      </div>
     
    </div>
  </div>
</div>
</div>

          </div>
            </>


        );
    }
}

export default Dashboard