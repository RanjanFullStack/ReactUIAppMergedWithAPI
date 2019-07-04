import React, { Component } from 'react';
import { Alert, Button, ButtonToolbar, Card } from 'react-bootstrap';
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import AlertBanner from '../../components/AlertBanner/index'
import './Dashboard.css';
import ReactHighcharts from 'react-highcharts'

import Highcharts from 'highcharts';

import HighchartsReact from 'highcharts-react-official';
import inprogressrequests from '../../assets/fonts/In-progress.svg'
import newrequests from '../../assets/fonts/New.svg'
import Closedrequests from '../../assets/fonts/Closed.svg'
import Cancelledrequests from '../../assets/fonts/Cancelled.svg'
import overduerequests from '../../assets/fonts/Overdue.svg'
import { RequestDataService } from "../../configuration/services/RequestDataService";
import { withGlobalState } from 'react-globally'
import LoadingOverlay from 'react-loading-overlay';
import ContentLoader from "react-content-loader"

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
  Start:"",
  Cancel:"",
  End:"",
  TotalRequestCount:"",
}

  
  }
  componentDidMount() {
    this.GetEvents();
    this. message();
    this.DashboardCardValue();
    this.getRequestList();
  
  }

  async GetEvents() {
    debugger
    const responseJson = await BFLOWDataService.get("Event");
   var _Start=responseJson.filter(x=>x.isStart===true)[0].name;
   var _Cancel=responseJson.filter(x=>x.isCancel===true)[0].name;
   var _End=responseJson.filter(x=>x.isEnd===true)[0].name;
   this.setState({Start:_Start,Cancel:_Cancel,End:_End})
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
   
   

    var totalrequest=  message.Dashboard.Results[0].newRequest + message.Dashboard.Results[0].inProgressRequest + message.Dashboard.Results[0].overDueRequest + message.Dashboard.Results[0].cancelledRequest + message.Dashboard.Results[0].closedRequest
    this.setState({counterResult:message.Dashboard.Results[0],TotalRequestCount:totalrequest});
    
    //TotalRequestCount
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
                  <td><label  className="text-truncate">REQ {data.requestId}</label ></td>
                  <td > <label   className="text-truncate">{data.createdByName}</label ></td>
                  <td> <label   className="text-truncate">{moment(data.createdOn).format("DD MMM YYYY")}</label ></td>
                  <td ><label   className="text-truncate"> {data.dueDatetime ===null || data.dueDatetime===undefined?"-":moment(data.dueDatetime).format("DD MMM YYYY")}</label ></td>
                  <td > <label   className="text-truncate">{data.currentWorkflowState}</label ></td>
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
      const Loader = () => (
        <ContentLoader 
        height={500}
        width={500}
        speed={1}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
      >
        <rect x="55" y="75" rx="5" ry="5" width="422" height="12" /> 
        <rect x="10" y="75" rx="5" ry="5" width="31" height="12" /> 
        <rect x="55" y="114" rx="5" ry="5" width="422" height="12" /> 
        <rect x="10" y="114" rx="5" ry="5" width="31" height="12" /> 
        <rect x="55" y="156" rx="5" ry="5" width="422" height="12" /> 
        <rect x="10" y="156" rx="5" ry="5" width="31" height="12" /> 
        <rect x="55" y="194" rx="5" ry="5" width="422" height="12" /> 
        <rect x="10" y="194" rx="5" ry="5" width="31" height="12" /> 
        <rect x="55" y="237" rx="5" ry="5" width="422" height="12" /> 
        <rect x="10" y="237" rx="5" ry="5" width="31" height="12" /> 
        <rect x="55" y="276" rx="5" ry="5" width="422" height="12" /> 
        <rect x="10" y="276" rx="5" ry="5" width="31" height="12" /> 
        <rect x="10" y="79" rx="5" ry="5" width="31" height="12" /> 
        <rect x="10" y="37" rx="5" ry="5" width="31" height="12" /> 
        <rect x="55" y="35" rx="5" ry="5" width="422" height="12" /> 
        <rect x="55" y="0" rx="5" ry="5" width="422" height="12" /> 
        <rect x="10" y="1" rx="5" ry="5" width="31" height="12" />
      </ContentLoader>
      );
  
      const RequestListLoader = () => (
        <div class="list-card-Loading">
          <div class="p-2">
            <Loader />
          </div>
          
        </div>
      );
     
        return (
        <>
          <div class="container-fluid" style={{backgroundColor:"#FAFAFB"}}>
               <div class="row">
             <div class="col-12">
             <div class="row mt-2 ml-2">
             <div class="col-7">
            <h5>{this.state.Messages}, {localStorage.getItem("firstName")}!</h5>
            </div>
            <div class="col-5">
            <label class="float-right" >Requests Count: {this.state.TotalRequestCount}</label>
            </div>
             </div>
             <div class="row  mt-1">
             <div class="col-7">
          <div class="row">

           
            <div class="col-xl-4 col-md-6 mb-4 pr-3">
              <div class="card border-0 shadow-sm  py-2">
                <div class="card-body p-1">
                  <div class="row no-gutters align-items-center p-0 m-0">
                    <div class="col-12">
                     <div class="row"> 
                    <div class="col-4 mt-0 ">
                      
                        <i><img src={newrequests} style={{width:"55px"}} class="ml-2 mt-1"></img></i>
                       
                      </div>
                      <div class="col-8">
                      <center class="h3 text-truncate" title={this.state.counterResult.newRequest}>{this.state.counterResult.newRequest}</center>
                      <center class="dasebordbartext text-truncate" title="New Requests" style={{color:"rgb(171, 171, 171)"}}>{this.state.Start}</center>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         
              
            <div class="col-xl-4 col-md-6 mb-4 pr-3">
              <div class="card border-0 shadow-sm   py-2">
                <div class="card-body  p-1">
                  <div class="row no-gutters align-items-center">
                    <div class="col-12">
                    <div class="row"> 
                    <div class="col-4 mt-0">
                        <i><img src={inprogressrequests} style={{width:"55px"}} class="ml-2 mt-1"></img></i>
                      
                      </div>
                      <div class="col-8 ">
                      <center class="h3 text-truncate" title={this.state.counterResult.inProgressRequest}>{this.state.counterResult.inProgressRequest}</center>
                      <center class="dasebordbartext text-truncate" title="In-progress Requests" style={{color:"rgb(171, 171, 171)"}}>In-progress</center>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-xl-4 col-md-6 mb-4 pr-3">
              <div class="card border-0 shadow-sm   py-2">
                <div class="card-body  p-1">
                  <div class="row no-gutters align-items-center">
                    <div class="col-12">
                    <div class="row"> 
                    <div class="col-4 mt-0">
                        <i><img src={overduerequests} style={{width:"55px"}} class="ml-2 mt-1"></img></i>
                       
                      </div>
                      <div class="col-8">
                      <center class="h3 text-truncate" title={this.state.counterResult.overDueRequest}>{this.state.counterResult.overDueRequest}</center>
                      <center class="dasebordbartext text-truncate" style={{color:"rgb(171, 171, 171)"}} title="Overdue Requests">Overdue
                    
                    </center>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </div>
             <div class="col-5">
          <div class="row">

            <div class="col-xl-6 col-md-6 mb-4 pr-3">
              <div class="card border-0 shadow-sm   py-2">
                <div class="card-body  p-1">
                  <div class="row no-gutters align-items-center">
                    <div class="col-12">
                    <div class="row"> 
                    <div class="col-4 mt-0">
                        <i><img src={Cancelledrequests} style={{width:"55px"}} class="ml-2 mt-1"></img></i>
                       
                      </div>
                      <div class="col-8">
                      <center class="h3 text-truncate" title={this.state.counterResult.cancelledRequest}>{this.state.counterResult.cancelledRequest}</center>
                      <center class="dasebordbartext text-truncate" style={{color:"rgb(171, 171, 171)"}} title="Overdue Requests">{this.state.Cancel}
                    </center>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-xl-6 col-md-6 mb-4 pr-3">
              <div class="card border-0 shadow-sm   py-2">
                <div class="card-body  p-1">
                  <div class="row no-gutters align-items-center">
                    <div class="col-12">
                    <div class="row"> 
                    <div class="col-4 mt-0">
                        <i><img src={Closedrequests} style={{width:"55px"}} class="ml-2 mt-1"></img></i>
                       
                      </div>
                      <div class="col-8">
                      <center class="h3 text-truncate" title={this.state.counterResult.closedRequest}>{this.state.counterResult.closedRequest}</center>
                      <center class="dasebordbartext text-truncate" style={{color:"rgb(171, 171, 171)"}} title="Overdue Requests">{this.state.End}                 
                    </center>
                      </div>
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
    {(this.props.globalState.IsLoadingActive)? <Loader /> : <>
      <div class="chart-area">
        
     {this.requestList()}


      </div></>}
    </div>

  </div>
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