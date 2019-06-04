import React, { Component } from 'react';
import { Alert, Button, ButtonToolbar, Card } from 'react-bootstrap';
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import { MasterBFLOWDataService } from "../../configuration/services/MasterDataService";
import AlertBanner from '../../components/AlertBanner/index'
import './Reports.css';
import { Tab, Tabs } from 'react-bootstrap';

import Highcharts from 'highcharts';

import HighchartsReact from 'highcharts-react-official';
import {CustomHighCharts} from '../Charts/Charts'

let _utlisationReportlist=[];
//require("highcharts/modules/exporting")(Highcharts);
class Reports extends Component {
  constructor(props) {
    //call the base constructor
    super(props)
  this.state = { showError: true,visible: false,utlisationReportSummarychart:null,UtilizationReportchart:[] ,RequestReportSummarychart:null,RequestReportchart:[] ,ResourceReportSummarychart:null,ResourceReportchart:[]}
  }

  componentDidMount() {
    this.utilisationReport();
   
  
  }
  async ResourceReport(){
    const body = JSON.stringify({ "group": "ResourceReport","StartDate":"2019-01-01","EndDate":"2019-12-31"});
    
    const message = await BFLOWDataService.post("Report", body)
    debugger
    let ResourceReportSummary=message["Resource Report Summary"].Results;
    let ResourceReportSummarydate = ResourceReportSummary.map(a => a.date);
    let ResourceReportSummaryuserCount = ResourceReportSummary.map(a => a.userCount);
    let item = CustomHighCharts.getlineChart("column", "Resource", ResourceReportSummarydate, ResourceReportSummaryuserCount);
    this.setState({ResourceReportSummarychart:item})


    let ResourceReport=message["Resource Report"].Results;
    let masterName=ResourceReport.map(a => a.masterName);
    masterName = Array.from(new Set(masterName))
    let ResourceReportlist=[];
     masterName.map(a => {
       let mastername=ResourceReport.filter(x => x.masterName === a);
       ResourceReportlist.push(mastername);
     });
     this.setState({ResourceReportchart:ResourceReportlist})
  }


  async RequestReport(){
    const body = JSON.stringify({ "group": "RequestReport","StartDate":"2019-01-01","EndDate":"2019-12-31"});
    
    const message = await BFLOWDataService.post("Report", body)
     

      let RequestReportSummary=message["Request Report Summary"].Results;
      let RequestReportSummarydate = RequestReportSummary.map(a => a.date);
      let RequestReportSummaryutilisation = RequestReportSummary.map(a => a.requestCount);
      let item = CustomHighCharts.getlineChart("column", "Request", RequestReportSummarydate, RequestReportSummaryutilisation);
      this.setState({RequestReportSummarychart:item})

      let RequestReport=message["Request Report"].Results;
    let masterName=RequestReport.map(a => a.masterName);
    
    masterName = Array.from(new Set(masterName))
    let RequestReportlist=[];
     masterName.map(a => {
       
       let mastername= RequestReport.filter(x => x.masterName === a);
       
       RequestReportlist.push(mastername);
     });

    
     this.setState({RequestReportchart:RequestReportlist})
  }



  async utilisationReport(){
    const body = JSON.stringify({ "group": "UtilisationReport","StartDate":"2019-01-01","EndDate":"2019-12-31"});
    
    const message = await BFLOWDataService.post("Report", body)

    let utlisationReportSummary=message["Utlisation Report Summary"].Results;
    let utlisationReportSummarydate = utlisationReportSummary.map(a => a.date);
    let utlisationReportSummaryutilisation = utlisationReportSummary.map(a => a.utilisation);
    let item = CustomHighCharts.getlineChart("column", "Utilization %", utlisationReportSummarydate, utlisationReportSummaryutilisation);
    this.setState({utlisationReportSummarychart:item})

  
    let utlisationReport=message["Utilization Report"].Results;
    let masterName=utlisationReport.map(a => a.masterName);
    
    masterName = Array.from(new Set(masterName))
    let utlisationReportlist=[];
     masterName.map(a => {
       
       let mastername= utlisationReport.filter(x => x.masterName === a);
       
     utlisationReportlist.push(mastername);
     });

    
     this.setState({UtilizationReportchart:utlisationReportlist})
     this.RequestReport();
     this.ResourceReport();

  }

  
  ResourceReportSummary(){
    if(this.state.ResourceReportSummarychart!==null){
return(
  <>
    <HighchartsReact highcharts={Highcharts} options={this.state.ResourceReportSummarychart}     containerProps={{ style: { height: "150px", "margin-top": "20px" ,"margin-left": "0px" } }} />
  </>
)
    }
  }

  utlisationReportSummary(){
    if(this.state.utlisationReportSummarychart!==null){
return(
  <>
    <HighchartsReact highcharts={Highcharts} options={this.state.utlisationReportSummarychart}     containerProps={{ style: { height: "150px", "margin-top": "20px" ,"margin-left": "0px" } }} />
  </>
)
    }
  }

  RequestReportSummary(){
    if(this.state.RequestReportSummarychart!==null){
return(
  <>
    <HighchartsReact highcharts={Highcharts} options={this.state.RequestReportSummarychart}     containerProps={{ style: { height: "150px", "margin-top": "20px" ,"margin-left": "0px" } }} />
  </>
)
    }
  }



    render() {
    
        return (
        <>
         <div class="container-fluid  Reposts p-0" style={{backgroundColor:"#FAFAFB"}}>

      <Tabs defaultActiveKey="Utilization" id="uncontrolled-tab-example" >
                  <Tab
                     className="tab-content-mapping"
                     eventKey="Utilization"
                     title="Utilization"
                     name="Utilization"
                  >
             <div className="scrollbar" style={{height:"80vh",backgroundColor:"#FAFAFB"}}>      
  <div class="row pl-4 pr-4" >
    <div class="col-xl-12">
  <div class="card border-0 shadow-sm mb-4 mt-4">
 
    
    <div class="card-body" style={{height:"231px"}}>
    <label class="m-0text-truncate" style={{fontWeight:"500", color: "#55565a"}}>Utilization trend</label>
      <div class="chart-area">
    {this.utlisationReportSummary()}
      </div>
    </div>
  </div>
</div>

</div>

<div class="row pl-4 pr-4">
{this.state.UtilizationReportchart.map((data, key) => {
 
  let attributeData = data.map(x=> x.attributeName)
  let utlizationData = data.map(x=> x.utilisation)
  return(
        
   <div class="col-xl-6">
       <div class="card border-0 shadow-sm  mb-4">
         <div class="card-body" style={{height:"380px"}}>
           <label class="m-0 text-truncate" style={{fontWeight:"500", color: "#55565a"}}>{data[0].masterName}</label>
           <div class="chart-area">
           <HighchartsReact highcharts={Highcharts} options={CustomHighCharts.getcolumnChart('','Utilization %',attributeData, utlizationData)}     containerProps={{ style: { height: "300px", "margin-top": "30px" ,"margin-left": "0px" } }} />
           </div>
         </div>
         </div>
       </div>
      )
    })}

</div>
</div> 

           </Tab>
                    <Tab
                     className="tab-content-mapping"
                     eventKey="Request"
                     title="Request"
                     name="Request"
                  >
                     <div className="scrollbar" style={{height:"80vh" ,backgroundColor:"#FAFAFB"}}>  
                     <div class="row">


<div class="col-xl-12">
  <div class="row pl-4 pr-4">
    <div class="col-xl-12">
  <div class="card border-0 shadow-sm mb-4 mt-3">
 
    
    <div class="card-body" style={{height:"231px"}}>
    <label class="m-0 text-truncate" style={{fontWeight:"500", color: "#55565a"}}>Request trend</label>
      <div class="chart-area">
     {this.RequestReportSummary()}
      </div>
    </div>
  </div>
</div>

</div>

<div class="row pl-4 pr-4">
{this.state.RequestReportchart.map((data, key) => {
  let attributeData = data.map(x=> x.attributeName)
  let requestData = data.map(x=> x.requestCount)
 
  return(
        
   <div class="col-xl-6">
       <div class="card border-0 shadow-sm  mb-4">
         <div class="card-body" style={{height:"380px"}}>
         <label class="m-0 text-truncate" style={{fontWeight:"500", color: "#55565a"}}>{data[0].masterName}</label>
           <div class="chart-area">
           <HighchartsReact highcharts={Highcharts} options={CustomHighCharts.getcolumnChart('','Request',attributeData, requestData)}     containerProps={{ style: { height: "300px", "margin-top": "30px" ,"margin-left": "0px" } }} />
           </div>
         </div>
         </div>
       </div>
      )
    })}
</div>

</div>

</div>
</div>
                    </Tab>
                    <Tab
                     className="tab-content-mapping"
                     eventKey="Resource"
                     title="Resource"
                     name="Resource"
                  >
                      <div className="scrollbar" style={{height:"80vh" ,backgroundColor:"#FAFAFB"}}>  
                     <div class="row">


<div class="col-xl-12">
  <div class="row  pl-4 pr-4">
    <div class="col-xl-12">
  <div class="card border-0 shadow-sm mb-4 mt-3">
 
    
    <div class="card-body" style={{height:"231px"}}>
      <div class="chart-area">
  {this.ResourceReportSummary()}
      </div>
    </div>
  </div>
</div>

</div>

<div class="row  pl-4 pr-4">
{this.state.ResourceReportchart.map((data, key) => {
  let attributeData = data.map(x=> x.attributeName)
  let userData = data.map(x=> x.userCount)
 
  return(
        
   <div class="col-xl-6">
       <div class="card border-0 shadow-sm  mb-4">
         <div class="card-body" style={{height:"380px"}}>
         <label class="m-0 text-truncate" style={{fontWeight:"500", color: "#55565a"}}>{data[0].masterName}</label>
           <div class="chart-area">
           <HighchartsReact highcharts={Highcharts} options={CustomHighCharts.getcolumnChart('','Resource',attributeData, userData)}     containerProps={{ style: { height: "300px", "margin-top": "30px" ,"margin-left": "0px" } }} />
           </div>
         </div>
         </div>
       </div>
      )
    })}
</div>

</div>
</div>
</div>
                    </Tab>
                  </Tabs>
      </div>
 
        </>
        );
    }
}

export default Reports