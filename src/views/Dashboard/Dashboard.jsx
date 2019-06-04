import React, { Component } from 'react';
import { Alert, Button, ButtonToolbar, Card } from 'react-bootstrap';
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import AlertBanner from '../../components/AlertBanner/index'
import './Dashboard.css';
import ReactHighcharts from 'react-highcharts'

import Highcharts from 'highcharts';

import HighchartsReact from 'highcharts-react-official';
import inprogressrequests from '../../assets/fonts/inprogress-requests.svg'
import newrequests from '../../assets/fonts/new-requests.svg'
import openrequests from '../../assets/fonts/open-requests.svg'
import overduerequests from '../../assets/fonts/overdue-requests.svg'
import { RequestDataService } from "../../configuration/services/RequestDataService";
import { withGlobalState } from 'react-globally'
import LoadingOverlay from 'react-loading-overlay';

import {CustomHighCharts} from '../Charts/Charts'
import moment from 'moment';


import graphnodata from '../../assets/fonts/graph-no-data.svg';
import emptycontentsmall from '../../assets/fonts/empty-content_small.svg';
var options={};

class Dashboard extends Component {
  state = { showError: true,visible: false,requestList:[], isLatest: false ,allRequests:[],Messages:'', counterResult:[],workFlowWeekly:[],FrequencyWeekly:[]}
  constructor(props) {
    //call the base constructor
    super(props)
    this.chartComponent = React.createRef();
 this.state = { showError: true,visible: false,requestList:[], isLatest: false ,
  allRequests:[],Messages:'', counterResult:[],optionsREQUESTSBYSTATUS:null,
  optionsREQUESTSBYFREQUENCY:null,
  DashboardRequestListByCreatedOn :[],
  DashboardRequestListByDueOn:[],



}

  
  }
  componentDidMount() {
    this. message();
    this.DashboardCardValue();
    this.getRequestList();
 
 
    
    
  }

  toggleError = () => {
    this.setState((prevState, props) => {
      return { showError: !prevState.showError }
    })
  };
  async getRequestList() {

    this.props.setGlobalState({ IsLoadingActive: true });
    const body = JSON.stringify({ "group": "DashboardList"});
    
    const responseJson = await BFLOWDataService.post("Report", body)
    debugger
    if(responseJson["Dashboard Request List By Due On"].Results.length === 0){
      this.props.setGlobalState({ IsLoadingActive: false });
    }
    if(responseJson["Dashboard Request List By Due On"].Results.length === 0){
      this.props.setGlobalState({ IsLoadingActive: false });
    }
    
  if(responseJson["Dashboard Request List By Created On"].Results.length>0)
  { 
    let _DashboardRequestListByCreatedOn =responseJson["Dashboard Request List By Created On"].Results;
    let _DashboardRequestListByDueOn =responseJson["Dashboard Request List By Due On"].Results;
    this.setState({DashboardRequestListByCreatedOn:_DashboardRequestListByCreatedOn,DashboardRequestListByDueOn:_DashboardRequestListByDueOn,requestList:_DashboardRequestListByDueOn})
    this.props.setGlobalState({ IsLoadingActive: false })
 
  }
}

 async DashboardCardValue(){
    const body = JSON.stringify({ "group": "dashboard"});
    
    const message = await BFLOWDataService.post("Report", body)

    this.setState({counterResult:message.Dashboard.Results[0]});
    this.Workflow(message["Request Workflow"].Results);

    this.FREQUENCY(message["Request Frequency"].Results)
  }

  async reportsRequest(){
   
    const body = JSON.stringify({ "group": "DashboardList"});
    
    const message = await BFLOWDataService.post("Report", body)

    let _DashboardRequestListByCreatedOn =message["Dashboard Request List By Created On"].Results;
    let _DashboardRequestListByDueOn =message["Dashboard Request List By Due On"].Results;

    this.setState({DashboardRequestListByCreatedOn:_DashboardRequestListByCreatedOn,DashboardRequestListByDueOn:_DashboardRequestListByDueOn,requestList:_DashboardRequestListByDueOn})
    
  }
  

 Workflow(workFlowData)
 {
 

 let MonthlyworkFlow = workFlowData.filter(x=>  x.frequencyType === "Monthly")
 

let WeeklyworkFlow = workFlowData.filter(x=>  x.frequencyType === "Weekly")
debugger
if(WeeklyworkFlow.length>0){

let AvaialbleWorkFlow = WeeklyworkFlow.map(a => a.workFlowName);
let inTimeCountMonthly = WeeklyworkFlow.map(a => a.requestInTimeCount);
let overDueTimeCountMonthly = WeeklyworkFlow.map(a => a.requestOverDueCount);
let data1 = [{
  name: 'Overdue',
  data: overDueTimeCountMonthly,
  color: {
    linearGradient: {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 1
    },
    stops: [
      [0, '#f77468'],
      [1, '#f77468']
    ]
  }
},
{
  name: 'In-time',
  data: inTimeCountMonthly,
  color: {
    linearGradient: {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 1
    },
    stops: [
      [0, '#b5ffed'],
      [1, '#a7e5ff']
    ]
  }
}];
let data2=AvaialbleWorkFlow;
let item = CustomHighCharts.getStockedChart("column", "", data2, data1);

this.setState({optionsREQUESTSBYSTATUS : item,workFlowWeekly:WeeklyworkFlow});
}else{
  this.setState({workFlowWeekly:WeeklyworkFlow});
}

 }


 FREQUENCY(Frequency){
 

  let MonthlyFrequency = Frequency.filter(x=>  x.frequencyType === "Monthly")
  

 let WeeklyFrequency = Frequency.filter(x=>  x.frequencyType === "Weekly")
 if(WeeklyFrequency.length>0){
  debugger
  let requestCount = WeeklyFrequency.map(a => a.requestCount);
  let date = WeeklyFrequency.map(a => a.date); //moment(a.date).format("dd mmm")
  let data1 =  requestCount;
 
 let firstdate =[];
 let d = moment(date[0]);
 firstdate = firstdate.concat(d.year());
 firstdate =  firstdate.concat(d.month());
 firstdate =  firstdate.concat(d.date());
 
  let data2=date;
  let item = CustomHighCharts.getAreaChart("area", "",  firstdate,data1);
 
  console.log(item);
  this.setState({optionsREQUESTSBYFREQUENCY : item,FrequencyWeekly:WeeklyFrequency});
 }
 else{
  this.setState({FrequencyWeekly:WeeklyFrequency});
 }

 }

  message(){
    var myDate = new Date();
    var hrs = myDate.getHours();
    if (hrs < 12)
    this.setState({Messages:'Good Morning'})
       
    else if (hrs >= 12 && hrs <= 16)
    this.setState({Messages:'Good Afternoon'})
  
    else if (hrs >= 17 && hrs <= 22)
    this.setState({Messages:'Good Evening'})

    else if (hrs >= 22 && hrs <= 24)
    this.setState({Messages:'Good Night'})
   
  }

  REQUESTSBYSTATUS()
    {

    
     
      if(this.state.optionsREQUESTSBYSTATUS !== null )
      {
        return (

          <HighchartsReact highcharts={Highcharts} options={this.state.optionsREQUESTSBYSTATUS}     containerProps={{ style: { height: "200px", "margin-top": "0px" , "margin-left": "0px" } }} />
        )
       
      }
      else{
        return(
          <center><img src={graphnodata} /></center>
        )
      }
    }


    REQUESTSBYFREQUENCY()
    {
    
      
      if(this.state.optionsREQUESTSBYFREQUENCY !== null)
      {
        return (

          <HighchartsReact highcharts={Highcharts} options={this.state.optionsREQUESTSBYFREQUENCY}     containerProps={{ style: { height: "200px", "margin-top": "2px" ,"margin-left": "0px" } }} />
        )
       
      }
      else{
        return(
          <center><img src={graphnodata} /></center>
        )
      }
    }
  
  //sorting by created date start
  handleCheck(event) {
  
    this.setState({ isLatest: !this.state.isLatest });
    if (event.target.checked === true) {

      this.setState({requestList:this.state.DashboardRequestListByCreatedOn})
    }else{
      this.setState({requestList:this.state.DashboardRequestListByDueOn})
    }
  }

  handleClose() {
    this.setState({ visible: false });
  }
  handleOpen() {
    this.setState({ visible: true });
  }


  requestList(){
    if(this.state.requestList.length>0){

   
    return(
      <table class="table w-95 ml-3 mr-3" style={{ borderbottom: "1px solid #dee2e6" }}>
      <thead>
         <tr>
            <th scope="col" className=""> ID </th>
            <th scope="col" className="">Created by</th>
            <th scope="col" className="">Created on</th>
            <th scope="col" className="">Due on</th>
            <th scope="col" className="">Status</th>
         </tr>
      </thead>
      <tbody>
      
         {this.state.requestList.map((data, key) => {
            
            return (
               <tr>
                  <td><lable className="text-truncate">REQ {data.requestId}</lable></td>
                  <td > <lable  className="text-truncate">{data.createdByName}</lable></td>
                  <td> <lable  className="text-truncate">{moment(data.createdOn).format("Do MMM YYYY")}</lable></td>
                  <td ><lable  className="text-truncate"> {data.dueDatetime ===null || data.dueDatetime===undefined?"-":moment(data.dueDateTime).format("Do MMM YYYY")}</lable></td>
                  <td > <lable  className="text-truncate">{data.currentWorkflowState}</lable></td>
               </tr>
            )
         })}

      </tbody>
   </table>
    )
        }
        else{
          return(
            <>
           <table class="table w-95 ml-3 mr-3" style={{ borderbottom: "1px solid #dee2e6" }}>
      <thead>
         <tr>
            <th scope="col" className="border-th"> ID </th>
            <th scope="col" className="">Created by</th>
            <th scope="col" className="">Created on</th>
            <th scope="col" className="">Due on</th>
            <th scope="col" className="">status</th>
         </tr>
      </thead>
   </table>
   
      
   <center><img src={emptycontentsmall} /></center>
            </>
          )
        }
  }
    render() {

     
        return (
        <>
          <div class="container-fluid" style={{backgroundColor:"#FAFAFB"}}>
               <div class="row">
             <div class="col-12">
             <div class="row mt-2 ml-2">
            <h5>{this.state.Messages}, {localStorage.getItem("firstName")}!</h5>
             </div>
         
          <div class="row mt-1">

           
            <div class="col-xl-3 col-md-6 mb-4 pr-2">
              <div class="card border-0 shadow-sm  py-2">
                <div class="card-body p-1">
                  <div class="row no-gutters align-items-center p-0 m-0">
                    <div class="col-12">
                     <div class="row"> 
                    <div class="col-4 mt-0 ">
                        <i><img src={newrequests} style={{width:"75px"}} class="ml-2"></img></i>
                       
                      </div>
                      <div class="col-8">
                      <div class="ml-5 mt-1 mr-5 h3 text-truncate" title={this.state.counterResult.newRequest}>{this.state.counterResult.newRequest}</div>
                      <div class="ml-3 mt-1 mr-3 dasebordbartext text-truncate" title="New Requests" style={{color:"rgb(171, 171, 171)"}}>New Requests</div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4 pr-2">
              <div class="card border-0 shadow-sm   py-2">
                <div class="card-body  p-1">
                  <div class="row no-gutters align-items-center">
                    <div class="col-12">
                      <div class="row"> 
                    <div class="col-4 mt-0">
                        <i><img src={openrequests} style={{width:"75px"}} class="ml-2"></img></i>
                      
                      </div>
                      <div class="col-8">

                      <div class="ml-5 mt-1 mr-5 h3 text-truncate" title={this.state.counterResult.openRequest}>{this.state.counterResult.openRequest}</div>
                      <div class="ml-3 mt-1 mr-3 dasebordbartext text-truncate" title="Open Requests" style={{color:"rgb(171, 171, 171)"}}>Open Requests</div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4 pr-2">
              <div class="card border-0 shadow-sm   py-2">
                <div class="card-body  p-1">
                  <div class="row no-gutters align-items-center">
                    <div class="col-12">
                    <div class="row"> 
                    <div class="col-4 mt-0">
                        <i><img src={inprogressrequests} style={{width:"75px"}} class="ml-2"></img></i>
                      
                      </div>
                      <div class="col-8 ">
                      <div class="ml-5 mt-1 mr-5 h3 text-truncate" title={this.state.counterResult.inProgressRequest}>{this.state.counterResult.inProgressRequest}</div>
                      <div class="ml-0 mt-1 mr-0 dasebordbartext text-truncate" title="In-progress Requests" style={{color:"rgb(171, 171, 171)"}}>In-progress Requests</div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4 pr-3">
              <div class="card border-0 shadow-sm   py-2">
                <div class="card-body  p-1">
                  <div class="row no-gutters align-items-center">
                    <div class="col-12">
                    <div class="row"> 
                    <div class="col-4 mt-0">
                        <i><img src={overduerequests} style={{width:"75px"}} class="ml-2"></img></i>
                       
                      </div>
                      <div class="col-8">
                      <div class="ml-5 mt-1 mr-5 h3 text-truncate" title={this.state.counterResult.overDueRequest}>{this.state.counterResult.overDueRequest}</div>
                      <div class="ml-2 mt-1 mr-2 dasebordbartext text-truncate" style={{color:"rgb(171, 171, 171)"}} title="Overdue Requests">Overdue Requests
                    
                      </div>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          
          </div>
          <div class="row">


<div class="col-xl-6">
  <div class="row">
    <div class="col-xl-12 pr-2">
  <div class="card border-0 shadow-sm mb-4 pr-3">
    <div class="card-body" style={{height:"261px"}}>
    <label class="ml-2 text-truncate " style={{fontWeight:"500", color: "#55565a"}}>Request by Frequency</label>
   
      <div class="chart-area">
      {this.REQUESTSBYFREQUENCY()}
      </div>
    </div>
  </div>
</div>


<div class="col-xl-12 pr-2">
  <div class="card border-0 shadow-sm mb-3 pr-3">
  
    <div class="card-body" style={{height:"261px"}}>
    <label class="ml-2 text-truncate" style={{fontWeight:"500", color: "#55565a"}}>Request by Status</label>

      <div class="chart-area">
      {this.REQUESTSBYSTATUS()}
      </div>
     
    </div>
  </div>
</div>
</div>

</div>
<div class="col-xl-6">
  <div class="row">
  <div class="col-xl-12 mr-0 pl-3">
    
  <LoadingOverlay
  active={this.props.globalState.IsLoadingActive}
  spinner
  text='Loading Requests...'
  styles={{
    overlay: { position: 'absolute',
    height: '100%',
    width: '100%',
    top: '0px',
    left: '0px',
    display: 'flex',
    textAlign: 'center',
    fontSize: '1.2em',
    color: '#FFF',
    background: 'rgba(0, 0, 0, 0.2)',
    zIndex: 800,
},
  
  }}  >
  <div class="card border-0 shadow-sm mb-3  mr-0">
    <div class="row mt-3 ml-5">
 
    <h5 class="mt-2" style={{color:"rgb(171, 171, 171)"}}>Requests</h5>

              <div class="float-right" style={{paddingLeft:"360px", color: "grey",paddingRight:"10px"}}>
                <label className="h6 mt-1" style={{color:"black"}}>Latest</label>
              
              </div>
                <div className="dasebordSwitch" style={{ paddingTop: "5px" }}>
                <label class="switch"  >
                  <input
                    type="checkbox"
                    onChange={this.handleCheck.bind(this)}
                    checked={this.state.isLatest}
                  />
                  <span class="slider round" />
                </label>
             
                </div>
               
           
    </div>
   
    <div class="card-body scrollbar"  style={{height:"490px"}}>
      <div class="chart-area">
     {this.requestList()}


      </div>
    </div>
  </div>
  </LoadingOverlay>
</div>
 </div>
  </div>
</div>
</div>
{/* <div class="col-2">
<div class="row"> 
<div class="col-xl-12 pr-0">
  <div class="card shadow ">
    
    <div class="card-body" style={{height:"930px"}}>
      <div class="chart-area">
    
      </div>
    </div>
  </div>
</div>
</div>
</div> */}
</div>

          </div>
        </>
        );
    }
}
export default withGlobalState(Dashboard)