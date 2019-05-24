/**
 * BFLOW: Request UI
 * Components Name: Create Request, Feedback, Alter Banner
 */

/**import start */
import React, { Component } from "react";
import DateTime from 'react-datetime'
import { withGlobalState } from "react-globally";
import moment from 'moment';
import { Tab, Tabs, Modal, Button } from "react-bootstrap";

// Data services start
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import { RequestDataService } from "../../configuration/services/RequestDataService";
import { EventBFLOWDataService } from "../../configuration/services/EventDataService";
import { DocumentService } from "../../configuration/services/DocumentService";

// Data services end

//CSS/Icons
import createlinkedreques from '../../assets/fonts/create-linked-request-white.svg';
import addnew from '../../assets/fonts/add-new.svg';
import '../../assets/css/DateTime.css';
import './Request.css';
import Chips from 'react-chips';
import theme from '../../assets/js/theme.js';
import chipTheme from '../../assets/js/chipTheme.js';
import Recurrence from "./Recurrence";
//used for role method
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";

//Used for TimeTracking 
import TimeTracking from '../TimeTracking/TimeTracking';



//Used Component Imports start
const CreateRequest = React.lazy(() => import('../Request/CreateRequest'))
const AlertBanner = React.lazy(() => import('../../components/AlertBanner/index'))
const Feedback = React.lazy(() => import('./Feedback'))





//Used Component Imports end
/**import end*/

/**global variable start */
let files = [];
let formData = new FormData()
let Documents = [];
let DocComments = [];
let searchText = "";
let allRequests = [];
/**global variable end */

class Request extends Component {
  //call the base constructor
  constructor(...args) {
    super(...args);

    this.state = {

      //common
      currentActiveTab: "editRequestCard", // used for toggling the menu based on linked request selection

      // Request state
      requestList: [],
      editRequestData: [],
      requestId: null,
      Title: "",
      Description: "",
      requestId: "",
      ParentId: 0,
      DueDateTime: null,
      isLatest: false,
      searchInput: "",
      errorTitle:'',
      //Event State
      StatsData: [],
      EventList: [],
      StatusData: [],
      RequestActionClassName: "dropdown-content",
      isWatcher:false,

      //Linked Request
      linkedRequests: [],

      //documents
      editRequestDocumentsData: [],
      uploadedFiles: [],
      validateDocuments: false,

      //key Value list
      keyValueList: [],

      //Master Data
      mastersData: [],


      //Master Mapping
      CurrentSelectedMastersData: [],
      mapRequestWithAttributes: [],

      //feedback
      showFeedBack: "RequestTab",
      Rating: null,
      //showThanks:false,
      FeedBackComments: "",

      //messages
      showErrorMesage: false,
      errorMessage: '',
      errorMessageType: '',


      //popup
      modalShow: false,
      visible: false,
      show: false,


      //Request Watcher
      Watchers: [],
      ChipsItems: [],
      UserList: [],
      Assignee: [],

      //Role based state
      showRequestAddButton:false,
      showRequestEditButton:false,
      showRequestDeleteButton:false,
      showRequestAssignee:false,
      showRequestFeedbackButton:false,
      showLinkRequestTab:false,
      showRecurrenceRequestTab:false,
      showHistoryTab:false,
      showDueDate:false,
      showProductInput:false,

      //Time Tracking 
      showTimeTracking:false,
      hideTimeTracking:false,

      //recurrence
      GetRequestByIdJson: ''

    };
    this.GetEditrequestData = this.GetEditrequestData.bind(this);
    this.handleCloseErrorMessage = this.handleCloseErrorMessage.bind(this)
    this.FeedBackShow = this.FeedBackShow.bind(this);
    this.handleShowDocUpload = this.handleShowDocUpload.bind(this);
    this.handleCloseDocUpload = this.handleCloseDocUpload.bind(this);
    this.handleShowCommentUpload = this.handleShowCommentUpload.bind(this);
    this.handleCloseCommentUpload = this.handleCloseCommentUpload.bind(this);
    this.saveComment = this.saveComment.bind(this);
    this.onDownload = this.onDownload.bind(this);
    this.allDownload = this.allDownload.bind(this);
    this.GetUser = this.GetUser.bind(this);
    this.removeSelectedAttachment = this.removeSelectedAttachment.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.search = this.search.bind(this);

  }

  /** Lifecycle Event start */
  async componentDidMount() {
    this.getComponentData();
   
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.globalState.RequestModalOnHide;
    if (data === true) {
      this.getComponentData();
      this.props.setGlobalState({ RequestModalOnHide: false })
    }
  }

  /** Lifecycle Event end */

  /** Common method start */
  handleCloseErrorMessage() {
    this.setState({ showErrorMesage: false })
  }

  handleClose(show) {

    this.setState({ show: false })
    this.setState({ ParentId: 0 })
  }

  create() {

    this.setState({ show: false })
    this.setState({ ParentId: 0 })
    this.getRequestList("first");
    this.GetMasters();
  }

  showpop() {
    this.setState({ show: true });
  }
  /**Method to hide Alert Message */
  setTimeOutForToasterMessages() {
    setTimeout(
      function () {
        this.setState({ showErrorMesage: false });
      }
        .bind(this),
      150000
    );
  }
  /**Method to get Component data */
  getComponentData(){
    this.GetUser();
    this.getRequestList("first");
    this.GetMasters();
    this.GetKeyValue();
    this.GetStatus();

    const showAddEditButton=  this.getUserAccessibility("Request","Create request");
    const showDeleteButton=  this.getUserAccessibility("Request","Delete request");
    const showAssignee=  this.getUserAccessibility("Request","Assigment");
    const showFeedbackButton=  this.getUserAccessibility("Request","Submit FeedBack");
    const showLinkRequestTab=  this.getUserAccessibility("Request","Create Linked Request");
    const showRecurrenceRequestTab=  this.getUserAccessibility("Request","Set Recurrence");
    const showHistoryTab=  this.getUserAccessibility("Request","View History");
    const showDueDate=  this.getUserAccessibility("Request","Change Due Date");
    const showProductInput=  this.getUserAccessibility("Request","Change Product Input");
debugger;
    this.setState({showRequestAddButton:showAddEditButton,showRequestEditButton:showAddEditButton,
      showRequestDeleteButton:showDeleteButton,showRequestAssignee:showAssignee,
      showRequestFeedbackButton:showFeedbackButton,showLinkRequestTab:showLinkRequestTab,
      showRecurrenceRequestTab:showRecurrenceRequestTab, showHistoryTab:showHistoryTab,
      showDueDate:showDueDate, showProductInput:showProductInput
    })
  }
  /** Common method end */



  /**Request List Start */


  //sorting by created date start
  handleCheck(event) {
    ;
    this.setState({ isLatest: !this.state.isLatest });
    this.RefreshRequestlist(event.target.checked);
  }

  RefreshRequestlist(isChecked) {

    if (isChecked === true) {
      let sortedList = []
        .concat(this.state.requestList)
        .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn)); //.reverse();
      this.setState({ requestList: sortedList });
    }
    else {
      this.setState({ requestList: allRequests });
    }
  }

  //sorting by created date end

  //search start

  search(event) {
    if (event.target.value !== undefined) {
      searchText = event.target.value;
    }
 
  
    var updatedList = this.state.requestList;
    let dueDate = null;
    updatedList = allRequests.filter(function (item) {
      if (
        item.description.toLowerCase().search(searchText.toLowerCase()) !== -1
      ) {
        return (
          item.description.toLowerCase().search(searchText.toLowerCase()) !== -1
        );
      } else if (
        item.title.toLowerCase().search(searchText.toLowerCase()) !== -1
      ) {
        return item.title.toLowerCase().search(searchText.toLowerCase()) !== -1;
      } else if (item.id.toString().search(searchText) !== -1) {
        return item.id.toString().search(searchText) !== -1;
      } else if (searchText.toLowerCase().includes("req")) {
        let id = "req" + item.id.toString();
        return id.search(searchText.toLowerCase()) !== -1;
      } else if (item.dueDateTime !== null) {
        if (item.dueDateTime.toString().search(searchText) !== -1) {
          return item.dueDateTime.toString().search(searchText) !== -1;
        } else {
          var dateFormat = require("dateformat");
          dueDate = dateFormat(
            item.dueDateTime,
            "dddd, mmm d yyyy"
          );
          let str = dueDate.toLowerCase();
          if (str.search(searchText.toLowerCase()) !== -1 === false){
            dueDate = dateFormat(
              item.dueDateTime,
              "dddd, d mmm yyyy"
            );
            let str = dueDate.toLowerCase();
            return str.search(searchText.toLowerCase()) !== -1;
 
          }
          return str.search(searchText.toLowerCase()) !== -1;
        }
      }
    });
    this.setState({ requestList: updatedList });
  }

  //search end




//Time Tracking Hide & Show functions


showTimeTracking()
{

debugger
  if(this.state.showTimeTracking===false)
   {
     var showTimeTracking=true
 
   }

   if(this.state.showTimeTracking===true)
   {
     var showTimeTracking=false
 
   }
   this.setState({showTimeTracking:showTimeTracking})

}

//End Time Tracking Hide & Show functions






  async getRequestList(check) {

    //getRequestList
    const responseJson = await RequestDataService.getRequestList();
    this.setState({ requestList: responseJson });
    allRequests = this.state.requestList;
    this.RefreshRequestlist(this.state.isLatest);
    this.setState({ searchInput: "" });
    if (check === "update") {

      this.GetRequestById(this.state.requestId,this.state.isWatcher);
    }
    if (check === "first") {
      if (this.state.requestList.length > 0) {
        this.GetRequestById(this.state.requestList[0].id,this.state.isWatcher)
      }
      else {
        this.setState({
          editRequestData: null,
          Title: "",
          Title: "",
          requestId: null,
          requestId: "",
          Description: "",
          Workflow: ""

        });
      }
    }




  }

  /**Request List End */
  ResetEditBlockData() {
    const result = this.state.requestList.find(
      x => x.id === this.state.requestId
    );

    setTimeout(
      function () {
        this.setState({ editRequestData: result });
        this.setState({ Title: this.state.editRequestData.title });
      }.bind(this),
      10
    );
  }

  /** Edit Request List Start */
  editRequestTabSection() {
    if (this.state.showFeedBack === "RequestTab") {
      return (


       



        <div class="card rounded-0 border-0 shadow-sm p-1 scrollbar" id="style-4"   >
           {(this.state.showTimeTracking)?
           <div class="m-3">
             <span
             class="card-header border-0"
             style={{
               fontWeight: "600",
               color: "#55565a",
               backgroundColor: "white"
             }}
             onClick={this.showTimeTracking.bind(this)}
           >
             <i class="fas fa-arrow-left mr-3" />
             Time Tracking
           </span>
           <TimeTracking /></div>
           
           :
                     <Tabs activeKey={this.state.currentActiveTab} id="uncontrolled-tab-example"
            onSelect={currentActiveTab => this.setState({ currentActiveTab })}
          >
            <Tab
              className="tab-content-mapping"
              eventKey="editRequestCard"
              title="Request details"
            >
              {this.editRequestCard()}
            </Tab>
            <Tab
              className="tab-content-mapping"
              eventKey="Documents"
              title="Documents"
            >
              {this.UploadRequest()}
            </Tab>
            {this.showLinkRequestTab()}
            
            {this.showRecurrenceRequestTab()}
            {this.showHistoryTab()}
          </Tabs>}
        </div>
      )
    }
    if (this.state.showFeedBack === "FeedBack") {
      return (
        <Feedback RequestId={this.state.requestId} href={this.back.bind(this)} submitFeedBack={this.FeedbackSubmit.bind(this)} Feedbackvalue={this.state.Rating}></Feedback>
      )
    }

    if (this.state.showFeedBack === "FeedBackThanks") {
      return (
        <>

          <div class="card rounded-0 border-0 shadow-sm p-1 bg-white" style={{ height: "70vh" }}>
            <div className="padding123" style={{ height: "12vh" }}>
              <a onClick={this.back.bind(this)} class="fa fa-arrow-left" id="btnSubmitfeedback" style={{ cursor: 'pointer' }} >Submit feedback</a>
            </div>

            <div class="text-center" style={{ height: "15vh" }}>
              <div className="feedback-success">
                <div >
                  <i class="far fa-check-circle" ></i>
                </div>
                <label>
                  Thanks for the Feedback ! <br />
                  Your feedback has been submitted </label>
              </div>
            </div>
          </div>
        </>
      )
    }
  }
 
  editRequestCard() {
    return (
      <>
        <div class="card-header bg-white p-0 border-0" />
        <div
          class="card-body p-0  border-0 pt-2 scrollbar" id="style-4"
          style={{ height: "67.4vh" }}
        >
          <form>
            <div class="card-header m-0 border-0 " style={{ fontWeight: "500" }}>
              Basic Details
          </div>
            <div class="row pl-3 pr-3 pt-2 pb-0">
              <div class="col-sm-12">
                <div class="form-group">
                  <label for="lblTitle" className={this.state.errorTitle ===""?"mandatory":"error-label mandatory"} style={{ color: "#ababab", fontSize: ".80rem" }}  >Request Title</label>
                  <input
                    type="text"
                    value={this.state.Title}
                    onChange={e =>
                      this.setState({ Title: e.target.value })
                    }
                    style={{ color: "#55565a" }}
                   
                    className={this.state.errorTitle ===""?"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0 "}
                    id="txtTitle"
                    placeholder="Title"
                  />
                  <div className="errorMsg">{this.state.errorTitle}</div>
                </div>
              </div>
              <div class="col-sm-12">
                <div class="form-group">
                  <label for="textAreaDescription1" class="m-0" style={{ color: "#ababab", fontSize: ".80rem" }} >Description</label>
                  <textarea
                    style={{ color: "#55565a" }}
                    class="form-control textAreaCustom rounded-0  pl-0 pt-0 mt-0"
                    id="textAreaDescription"
                    rows="2"
                    value={this.state.Description}
                    onChange={e =>
                      this.setState({ Description: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <b class="pl-3 mb-0 mt-1">People</b>
            <div class="pl-3 pr-3"> <hr class="mb-0 mt-1 ml-0 mr-0" /></div>
            <div class="row pl-3 pr-3 pt-0 pb-0 mt-3">

              {this.showRequestAssignee()}

              <div class="col-sm-12">
                <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0 ">
                  <label class="m-0" style={{ color: "#ababab", fontSize: ".80rem" }}> Watchers </label>
                  <Chips
                    onChange={this.handleWatcher.bind(this)}
                    name="Watcher"
                    id="Watcher"
                    className="border-top-0 border-right-0 border-left-0 rounded-0"
                    value={this.state.Watchers}
                    suggestions={this.state.ChipsItems}
                    chipTheme={{ chip: { margin: "3px", padding: 5, background: "#00568F", color: "#ffff", fontSize: "16px", border: "0px" } }}
                    chipTheme={chipTheme}
                    theme={theme}
                    shouldRenderSuggestions={value => value.length >= 1}
                    fetchSuggestionMin={5}
                  />
                </div>
              </div>
            </div>
            <b class="pl-3 mt-1">Request inputs</b>
            <div class="pl-3 pr-3"> <hr class="mb-0 mt-1 ml-0 mr-0" /></div>
            <div class="row pl-3 pr-3 pt-0 pb-0 mt-3">
              {this.state.keyValueList.map((data, key) => {
                if (!data.id !== null)
                  return (
                    <div class="col-sm-6">
                      <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0">
                        <label style={{ color: "#ababab", fontSize: ".80rem" }} className={this.state['err' + data.name] !==undefined && data.isRequired == true   ? 'error-label form-group border-top-0 border-right-0 border-left-0 rounded-0' : 'form-group border-top-0 border-right-0 border-left-0 rounded-0'}>
                            {data.name}
                          </label>
                          <span  className={data.isRequired == true  ? 'mandatory' : ''}></span>
                        <input type="text"
                          style={{ color: "#55565a" }}
                          class=""
                          className={this.state['err' + data.name] !==undefined && data.isRequired == true ?"error-textbox  form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0 "}
                          id={'txt' + data.name.trim()}
                          maxLength="100"
                          placeholder={data.name}
                          name={data.name}
                          value={data.value}
                          onChange={this.updateKeyValue.bind(this)}
                        />
                        <div className="errorMsg">{this.state['err' + data.name]}</div>
                      </div>
                    </div>
                  );
              })}
            </div>

            <b class="pl-3 mt-1">Dates</b>
            <div class="pl-3 pr-3"> <hr class="mb-0 mt-1 ml-0 mr-0" /></div>
            <div class="row pl-3 pr-3 pt-0 pb-0 mt-3">
              <div class="col-sm-6">
                <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0 ">
                  <label class="m-0" style={{ color: "#ababab", fontSize: ".80rem" }}>
                    Due Date
                  </label>
                  <DateTime
                    viewMode='days'

                    timeFormat='HH:mm'
                    viewDate={this.state.DueDateTime === null ? new Date() : this.state.DueDateTime}
                    dateFormat='MMMM DD YYYY'
                    isValidDate={current => current.isAfter(DateTime.moment(new Date()).startOf('day') - 1)}
                    // timeConstraints={hours{min:9, max:15, step:2}
                    onChange={this.handleDate.bind(this)}
                    name="DueDateTime"
                    id="DueDateTime"
                    value={this.state.DueDateTime !== null ? moment(this.state.DueDateTime).format('MMMM DD YYYY HH:mm') : ''}
                    selected={this.state.DueDateTime}
                    timeConstraints={{ hours: { min: this.state.DueDateTime !== null ? new Date(this.state.DueDateTime).getHours() : new Date().getHours(), max: 23, step: 1 }, minutes: { min: this.state.DueDateTime !== null ? new Date(this.state.DueDateTime).getMinutes() : new Date().getMinutes(), max: 59, step: 1 } }}
                    inputProps={{ readOnly: true, disabled:!this.state.showDueDate}}
                  />
                </div>
              </div>
              {this.state.StatusData.map((data, key) => {

                if (data.type == 2)
                  return (
                    <div class="col-sm-6">
                      <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0 ">
                        <label for="exampleFormControlInput1" class="m-0" style={{ color: "#ababab", fontSize: ".80rem" }}>
                          {data.name}
                        </label>
                        <br />

                        <DateTime
                          viewMode='days'

                          timeFormat='HH:mm'
                          dateFormat='MMMM DD YYYY'
                          viewDate={data.value === null ? new Date() : data.value}
                          isValidDate={current => current.isAfter(DateTime.moment(new Date()).startOf('day') - 1)}
                          onChange={this.bindTimeline.bind(this, data.name)}
                          name={data.name}
                          id={'Datetime' + data.name.trim()}
                          value={data.value !== null ? moment(data.value).format('MMMM Do YYYY HH:mm') : ''}
                          selected={data.value}
                          timeConstraints={{ hours: { min: data.value !== null ? new Date(data.value).getHours() : new Date().getHours(), max: 23, step: 1 }, minutes: { min: data.value !== null ? new Date(data.value).getMinutes() : new Date().getMinutes(), max: 59, step: 1 } }}
                          inputProps={{ readOnly: true }}
                        />
                      </div>
                    </div>
                  );
              })}

            </div>
            <b class="pl-3 mt-1">Product inputs</b>
            <div class="pl-3 pr-3"> <hr class="mb-0 mt-1 ml-0 mr-0" /></div>
            <div class="row pl-3 pr-3 pt-0 pb-0 mt-3">
              {this.state.CurrentSelectedMastersData.map((data, key) => {

                if (!data.id !== null)
                  return (
                    <div class="col-sm-6">
                      <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0 ">
                        <label for="exampleFormControlSelect1" class="m-0" style={{ color: "#ababab", fontSize: ".80rem" }}>
                          {data.name}
                        </label>
                        {this.LoadOptions(data, key)}
                      </div>
                    </div>
                  );
              })}
            </div>
          </form>
        </div>
        <div class="card-footer bg-white">
          {this.showRequestEditButton()}
        </div>

      </>
    )
  }

  onChange = event =>
    this.setState({
      Title: event.target.value,
      Description: event.target.value
    });

  async DeleteRequest() {
    if (window.confirm("Do you wish to delete this item?")){
    const message = await BFLOWDataService.Delete("Request", this.state.requestId);
    if (message.Code === false && message.Code !== undefined) {
      this.setState({
        showErrorMesage: true,
        errorMessage: message.Message,
        errorMessageType: 'danger'
      });
    }
    else {
      this.setState({
        showErrorMesage: true,
        errorMessage: message,
        errorMessageType: 'success'
      });
      this.getRequestList("first");
    }
    this.setTimeOutForToasterMessages();
  }
  }

  GetEditrequestData(requestData) {
    this.props.setGlobalState({ EditRequestBlockId: requestData.id });

    if (this.state.requestList !== null) {
      this.setState({
        requestList: this.state.requestList,
        requestId: requestData.id,
        Title: requestData.title,
        Description: requestData.description !== null ? requestData.description : '',
        Title: requestData.title,
        requestId: requestData.id
      });
    }
  }


  /*Method to call API to Get Request By ID*/
  async GetRequestById(requestid,isWatcher) {
debugger
    this.setState({ show: false });
    if (requestid !== this.state.requestId) {

      this.setState({ showFeedBack: "RequestTab"})
     
    }
    const responseJson = await BFLOWDataService.getbyid('Request', requestid);

    if (responseJson != undefined) {
      let lstRequest = [];
      let lsttimeline;
      let lstWorflow;
      lstRequest = responseJson.requestKeyValues;
      let lstkeyvalue;
      if (responseJson.requestKeyValues != undefined) {
        lstRequest = responseJson.requestKeyValues;
        lstkeyvalue = this.state.keyValueList.map((data, key) => {
          let filtervalue = lstRequest.filter(x => x.keyId === data.id)
          if (filtervalue.length > 0) {
            data.value = filtervalue[0].value
          }
          else {
            data.value = '';
          }
          return data;
        });

        if (responseJson.timeline != undefined) {

          lstRequest = responseJson.timeline;

          var workflowId = responseJson.currentSelectedWorkflowId;
          this.getEventWorkFlowForRequest(workflowId);
          this.setState({ Workflow: workflowId })

          lsttimeline = this.state.StatusData.map((data, key) => {

            let filtervalue = lstRequest.filter(x => x.eventId === data.id)
            if (filtervalue.length > 0) {
              if (filtervalue[0].value !== null) {
                data.value = filtervalue[0].value;
              }
            }
            else {
              data.value = null;
            }
            return data;
          });

          ;
          /*Block to get Assignee list */
          let arrAssignee = [];
          let lstAssignee = lstRequest.filter(x => x.userId != null)
          lstAssignee.map((data, key) => {
            arrAssignee.push(data.userId)
          });
          let assigneeLst;
          let arrlstAssignee = [];
          arrAssignee.map((data, key) => {

            assigneeLst = this.state.UserList.filter(item => item.id == data)

            arrlstAssignee.push(assigneeLst[0].email)
          })
          this.state.Assignee = arrlstAssignee;
        }


        /*Block to get Watchers list */
        if (responseJson.requestWatchers != undefined) {

          let arrWatchers = [];
          let lstWatchers = responseJson.requestWatchers.filter(x => x.userId != null)
          lstWatchers.map((data, key) => {
            arrWatchers.push(data.userId)
          });
          let watchersLst;
          let arrlstWatchers = [];

          arrWatchers.map((data, key) => {

            if (this.state.UserList.length > 0) {

              watchersLst = this.state.UserList.filter(item => item.id == data)
              arrlstWatchers.push(watchersLst[0].email)
            }

          });
          this.state.Watchers = arrlstWatchers;
        }
      }

      this.setState({
        editRequestData: responseJson,
        Title: responseJson.title,
        Description: responseJson.description !== null ? responseJson.description : '',
        requestId: responseJson.id,
        keyValueList: lstkeyvalue,
        DueDateTime: responseJson.dueDateTime,
        StatusData: lsttimeline,
        linkedRequests: responseJson.linkedRequests,
        errorTitle: '',
        isWatcher: isWatcher

      });

      if (responseJson.documents !== undefined) {
        this.setState({ editRequestDocumentsData: responseJson.documents })

      }
      else {
        this.setState({ editRequestDocumentData: [] })
      }

      let test = this.state.Title;
      this.getMappedMasterWithRequest(requestid);

      if (responseJson.requestFeedback.length > 0) {
        this.setState({
          Rating: responseJson.requestFeedback[0].value,
          FeedBackComments: responseJson.requestFeedback[0].comments,
        });
      }
      else {
        this.setState({
          Rating: null,
          FeedBackComments: null,
        });
      }



    }

    if (this.state.Rating > 0 && (this.state.showFeedBack === "FeedBack")) {

      this.setState({ currentActiveTab: "editRequestCard", showFeedBack: "RequestTab" })

    }

    this.state.keyValueList.map((data, key) => {
     
      this.setState({ ['err' + data.name]: undefined });
    });
  }


 
  /** Request Details Start */
  async SubmitEditRequestData() {

    this.setState({ show: false });
    var value = this.ValidateForm();
    if (value === false) {
      const RequestKeyValue = [];
      const MapRequestWithMasterAttributes = [];
      const Timeline = [];
      this.state.StatusData.map((item, key) => {
        if (item.value) {
          Timeline.push({ "EventId": item.id, "Value": item.value })
        }
      });
      if (this.state.Workflow != "") {

        Timeline.push({ "EventId": this.state.Workflow, "Value": null })
      }

      this.state.keyValueList.map((item, key) => {
        if (item.value) {
          RequestKeyValue.push({ "KeyId": item.id, "Value": item.value })
        }
      })

      this.state.CurrentSelectedMastersData.map((item, key) => {

        if (item.value === null || item.value === undefined) {
          item.value = 0;
        }
        MapRequestWithMasterAttributes.push({ "AttributeId": item.value === "" ? 0 : item.value })

      })
      this.state.Assignee.map((data, key) => {

        let assigneeLst = this.state.UserList.filter(item => item.email == data)
        Timeline.push({ "UserId": assigneeLst[0].id, "EventId": this.state.Workflow, "Value": null })
      });
      let arrRequestWatchers = [];
      this.state.Watchers.map((data, key) => {

        let assigneeLst = this.state.UserList.filter(item => item.email == data)
        arrRequestWatchers.push({ "UserId": assigneeLst[0].id, "EventId": this.state.Workflow, "Value": null })
      });
      if (this.state.Title !== "") {
        const body = JSON.stringify({
          Title: this.state.Title,
          description: this.state.Description,
          RequestKeyValues: RequestKeyValue,
          MapRequestWithMasterAttributes: MapRequestWithMasterAttributes,
          Timeline: Timeline,
          DueDateTime: this.state.DueDateTime,
          RequestWatchers: arrRequestWatchers
        });
        const message = await BFLOWDataService.put(
          "Request",
          this.state.requestId,
          body
        );
        if (message.Code === false && message.Code !== undefined) {
          this.setState({
            showErrorMesage: true,
            errorMessage: message.Message,
            errorMessageType: 'danger'
          });
        }
        else {
          this.setState({
            showErrorMesage: true,
            errorMessage: message,
            errorMessageType: 'success'
          });
          const responseJson = this.getRequestList("update");
        }
        this.ResetStateValues();
        this.setTimeOutForToasterMessages();

      }
    }
  }

  showRequestAction() {

  }

  /** Request Details end */


  /** Request Key Start */

  /*Method to reset state values */
  ResetStateValues() {
   
    this.state.keyValueList.map((data, key) => {
      data.value = '';
      this.setState({ ['err' + data.name]: undefined });
    });
    this.setState({
      errorTitle: '',
      Title: '',
      show: false,
      Description: ''
    });
  }

  /* Method to get List of Keys*/
  async GetKeyValue() {
    const responseJson = await BFLOWDataService.get("Key");
    this.setState({ keyValueList: responseJson });
  }

  /*Method to set value for particular key on Change event of textbox */
  updateKeyValue(event) {
    const _key = this.state.keyValueList.map((item, key) => {
      if (item.name === event.target.name) {
        item.value = event.target.value;
      }
      return item;
    });
    this.setState({ keyValueList: _key });
  }

  /*Method to validate key values*/
  ValidateForm() {
    let blError = false;
    let ErrMsg = '';
    if (this.state.Title == null || this.state.Title == '' || this.state.Title == undefined) {
      this.setState({ errorTitle: "*Please enter Title." });
      blError = true;
    }
    this.state.keyValueList.map((data, key) => {
      this.setState({ ['err' + data.name]: '' });
      if ((data.value == null || data.value == '' || data.value == undefined) && data.isRequired == true) {
        ErrMsg = '*Please enter ' + data.name;
        this.setState({ ['err' + data.name]: ErrMsg });
        blError = true;
      }
    })
    return blError;
  }

  /** Request Key end */

  /** Request Workflow Start */
  async getEventWorkFlowForRequest(id) {


    let statusData = await EventBFLOWDataService.getEventWorkFlowForRequest(id);
    this.setState({ StatsData: statusData });
  }

  bindWorkflow(event) {
    this.setState({ Workflow: event.target.value })
  }

  /** Request Workflow End */

  /** Request Watcher start */

  /*Method to handle change event of Assignee chip*/
  handleAssignee = Assignee => {
    this.setState({ Assignee });
  }
  /*Method to handle change event of Watchers chip*/
  handleWatcher = Watchers => {
    this.setState({ Watchers });
  }
  /*Method to call User List API*/
  async GetUser() {

    const responseJson = await BFLOWDataService.get('Users/GetUserList');

    this.setState({ UserList: responseJson });


    let arrUser = [];
    this.state.UserList.map((data, key) => {
      arrUser.push(data.email)
    });
    this.setState({ ChipsItems: arrUser })
  }

  /**Request Watcher end */

  /** Request Custom Dates Start */
  handleDate(date) {
    date = moment(date).format('YYYY-MM-DD HH:mm:ss');
    this.setState({ DueDateTime: date })

  }
  async GetStatus() {
    let responseJson = await BFLOWDataService.get("Event");
    let responseType2 = responseJson.filter(x => x.type === 2)
    this.setState({ StatusData: responseType2 });
    this.setState({ EventList: responseJson });

  }



  bindTimeline(name, date) {

    //let value=event.target.value;
    date = moment(date._d).format('YYYY-MM-DD HH:mm:ss');

    const _timeline = this.state.StatusData.map((item, key) => {
      if (item.name === name) {
        item.value = date;
      }
      return item;
    });
    this.setState({ StatusData: _timeline });
  }

  /** Request Custom Dates end */

  /** Request Masters Start */
  async GetMasters() {

    const responseJson = await BFLOWDataService.get("Masters");

    this.setState({ mastersData: responseJson });
  }
  async getMappedMasterWithRequest(id) {

    const responseJson = await RequestDataService.getMasterMapping(id);

    this.setState({
      CurrentSelectedMastersData: responseJson
    });
  }

  ResetChildDropDown(childmasterId, list, findChildrenOnDropDownChange) {

    let SelectedMasterData = list.filter(x => x.id === childmasterId);
    var mapmastervalue = SelectedMasterData[0].mapMasterWithMasters;

    mapmastervalue.forEach(element => {
      findChildrenOnDropDownChange.push(element.secondaryMasterId);
      this.ResetChildDropDown(element.secondaryMasterId, list, findChildrenOnDropDownChange);
    });
    return findChildrenOnDropDownChange;
  }
  bindDropDown(masterId, attributeid) {


    let alreadySelectedAttributeID = [];
    let list = this.state.CurrentSelectedMastersData;
    const filteredMasterDatas = this.state.mastersData;

    let SelectedMasterData = list.filter(x => x.id === masterId);
    let SelectedMasterDataAttributes = SelectedMasterData[0].attributes;
    let findChildrenOnDropDownChange = [];
    let SelectedMasterDataAttribute = SelectedMasterDataAttributes.filter(x => x.id === attributeid);
    let secondaryMasterId = [];
    // if(SelectedMasterDataAttribute.length===0){

    var mastervalue = filteredMasterDatas.filter(x => x.id === masterId);
    var mapmastervalue = mastervalue[0].mapMasterWithMasters;
    let parentMaster = [];
    list.map((item, key) => {
      if (item.id === masterId) {

        list[key].value = attributeid;
      }
      else {


        findChildrenOnDropDownChange = this.ResetChildDropDown(masterId, list, findChildrenOnDropDownChange);
        secondaryMasterId = findChildrenOnDropDownChange.filter(x => x === item.id);
        if (secondaryMasterId.length > 0) {

          list[key].isParentNode = false
          list[key].value = "";

        }

      }

    })






    //}
    if (SelectedMasterDataAttribute.length > 0) {



      let mappedAttributes = SelectedMasterDataAttribute[0].mapAttributesWithAttributes;
      let mapping = SelectedMasterData[0].mapMasterWithMasters;

      if (mapping.length === 0) {
        list.map((item, key) => {
          if (item.id === masterId) {

            list[key].value = attributeid;

            list[key].isParentNode = true
          }

        })

      }
      mapping.forEach(element => {

        list = list.map((item, key) => {
          if (item.id === masterId) {

            list[key].value = attributeid;

          }
          ;
          if (item.id === element.secondaryMasterId) {


            let requiredAttributed = [];

            let filteredData = filteredMasterDatas.filter(x => x.id === item.id)[0];
            filteredData.isParentNode = true;
            let availableAttributes = filteredData.attributes;
            if (mappedAttributes.length == 0) {
              requiredAttributed = availableAttributes.map((data, key) => {
                data.isMapped = true;
                return data;
              });
              return filteredData;
            }
            else {
              mappedAttributes.forEach(elements => {
                // ;
                if (filteredData.attributes === undefined) {
                  return filteredData;
                }

                if (availableAttributes !== undefined) {

                  requiredAttributed = availableAttributes.map((data, key1) => {
                    if (alreadySelectedAttributeID.filter(x => x === data.id).length > 0) {
                      return data;
                    }
                    if (data.id === elements.secondaryAttributeId) {
                      alreadySelectedAttributeID.push(data.id);
                      data.isMapped = false;
                      //list[key].value="";

                    }
                    else {
                      data.isMapped = true;
                    }
                    return data;
                  });
                }
              }
              )
              if (requiredAttributed.length > 0) {
                filteredData.attributes = requiredAttributed;
              }
              return filteredData;
            }
          }
          else {
            return item;
          }

        });
      });


    }

    setTimeout(
      function () {

        this.setState({ CurrentSelectedMastersData: list });
      }
        .bind(this),
      100
    );

  }

  onChangeDropDownMaster(event) {
    if (event === undefined) {
      return null;
    }

    //store the selectedAttributeid


    //get the Dropdown ID from Event Target : Drp[MasterName]_ID
    let controlId = event.target.id.split('_')
    //get the masterId

    let masterId = parseInt(controlId[1]);
    let attributeid;
    if (event.target.value !== "") {
      attributeid = parseInt(event.target.value);
    }
    else {
      attributeid = "";
    }



    this.bindDropDown(masterId, attributeid);

  }

  LoadOptions(data, key) {

    if (data.attributes !== undefined) {
      if (data.value === null) {
        data.value = ""
      }
      return (
        <select
          class="form-control border-top-0 border-right-0 border-left-0 rounded-0"
          id={"drpMaster_" + data.id} onChange={this.onChangeDropDownMaster.bind(this)} value={data.value}
          disabled={!this.state.showProductInput}
          >
          <option selected disable value="" key={key}>
            Select {data.name}
          </option>
          {data.attributes.map((attributes, key) => {
            ;
            if (attributes.isMapped === false && data.isParentNode === true) {
              return (
                <option disable value={attributes.id} key={key}>
                  {attributes.name}
                </option>
              )
            };
          })}
        </select>
      )
    }
    else {
      return (
        <select
          class="form-control border-top-0 border-right-0 border-left-0 rounded-0 "
          id="drpServiceType">
          <option selected disable value="" key={key}>
            Select {data.name}
          </option>
        </select>

      )
    }
  }

  /** Request Masters end */

  /**Edit Request List End */


  /** Linked Request List Start */

  linkedRequest() {
    if (this.state.linkedRequests.length === 0) {
      return (
        <>
          <div class="card w-100 border-bottom  border-top-0 border-right-0 border-left-0 rounded-0 bg-white" style={{ height: "74vh" }} >
            <div class="card-body">
              <div className="bf-container-center" >
                {/* createlinkedreques */}
                <label className="align-middle ">You have not created any linked requests yet.</label> <br />
                <button type="button"  disabled={this.state.isWatcher} className="btn btn-primary btn-sm align-middle bf-linkRequestButton" onClick={this.CreateLinkedRequest.bind(this)} >
                  <i className="text-muted d-inline cursor-pointer" onClick={this.CreateLinkedRequest.bind(this)} name="createlinkedreques"> <img src={createlinkedreques} /></i>
                  Create Linked Request</button>
              </div>


            </div>
          </div>
        </>

      )
    }
    else {
      return (
        <>
          <div class="card w-100 border-bottom  border-top-0 border-right-0 border-left-0 rounded-0 bg-white" style={{ height: "74vh" }} >
            <div class="card-body">
              <div>
                <div className="float-left d-inline">
                  <h6>Linked Requests</h6>
                </div>
                <div className="float-right d-inline">

                  <button type="button" disabled={this.state.isWatcher}  className="btn btn-light" onClick={this.CreateLinkedRequest.bind(this)}>
                    <i className="text-muted d-inline cursor-pointer" name="addnew"> <img src={addnew} /></i>
                    Add New</button>
                </div>
              </div>
              <table class="table" style={{ borderbottom: "1px solid #dee2e6" }}>
                <thead>
                  <tr>
                    <th scope="col" className="border-th">
                      Request ID
                </th>
                    <th scope="col" className="border-th">Created On</th>

                    <th scope="col" className="border-th">Created By</th>
                    <th scope="col" className="border-th">
                      Title of Request
                </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.linkedRequests.map((data, key) => {
                    return (
                      <tr>
                        <td>
                          <a className="common-color" onClick={this.getlinkedRequests.bind(this, data.id)}>REQ{data.id}</a>

                        </td>
                        <td>
                          {new Intl.DateTimeFormat("en-Gb", {
                            year: "numeric",
                            month: "long",
                            day: "2-digit"
                          }).format(new Date(data.createdOn))}
                        </td>
                        <td>
                          {data.createdBy}
                        </td>
                        <td >
                          <label className="d-inline-block  text-truncate" style={{ maxWidth: "200px" }} title={data.title} >{data.title}</label>
                        </td>
                      </tr>
                    )
                  })}

                </tbody>
              </table>
            </div>
          </div>
        </>

      )
    }
  }

  CreateLinkedRequest() {

    this.setState({ ParentId: this.state.requestId });
    this.showpop();
  }

  getlinkedRequests(id) {
    this.setState({ requestId: id });
    this.GetRequestById(id,this.state.isWatcher);
    this.setState({ currentActiveTab: "editRequestCard" })
  }


  /**Linked Request List End */

  /** Document  Start */

  handleCloseDocUpload() {
    this.setState({ showDocumentUpload: false });
    this.setState({ uploadedFiles: [] });
    files = [];
    DocComments = [];
    formData = new FormData();
    Documents = [];
    //this.props.hide(this.state.showDocumentUpload);
  }


  UploadRequest() {
    return (
      <>
        <nav class="navbar navbar-expand navbar-light p-0 ">
          <div class="input-group">
            <input
              placeholder="Search"
              aria-describedby="inputGroupPrepend"
              name="username"
              type="text"
              class=" search-textbox form-control rounded-0 border-right-0 border-left-0 border-top-0"
            />
            <div class="input-group-prepend">
              <span
                class="search-icon input-group-text bg-white border-left-0  border-top-0"
                id="inputGroupPrepend"
              >
                <i class="fa fa-search text-muted" aria-hidden="true" />
              </span>
            </div>

            <div class="input-group-prepend">
              <span
                class="input-group-text bg-white  border-top-0"
                id="downloadAll"
                style={{ paddingLeft: "10px", paddingRight: "10px" }}
                onClick={this.allDownload.bind(this, this.state.editRequestDocumentsData)}
              >
                <i class="fa fa-download" aria-hidden="true" style={{ paddingLeft: "10px", paddingRight: "10px" }} />
                Download all
              </span>
            </div>
            <div class= {this.state.isWatcher!==true?"input-group-prepend":"input-group-prepend disable-div"}>
              <span
                class="input-group-text bg-white border-top-0"
                id="upload"
                style={{ paddingLeft: "10px", paddingRight: "10px" }}
                onClick={this.handleShowDocUpload}
              >
                <i class="fa fa-upload" aria-hidden="true" style={{ paddingLeft: "10px", paddingRight: "10px" }} />
                Upload file
              </span>



              <Modal show={this.state.showDocumentUpload} onHide={this.handleCloseDocUpload}>
                <Modal.Header closeButton>
                  <Modal.Title>Upload file</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                  <p>Select files to upload</p>
                  <hr />
                  <div class="row pl-3 pr-3 pt-0 pb-0">
                    <div class="col-sm-12">
                      <div class="input-group">
                        <input type="file" class="custom-file-input" id="inputGroupFile01"
                          aria-describedby="inputGroupFileAddon01" multiple
                          onChange={this.onUpload.bind(this)}
                          onClick={(event) => { event.target.value = null }}
                        />
                        <label class="custom-file-label" for="uploadFiles">Browse file from your computer</label>
                      </div>
                    </div>
                  </div>


                  <div class="row pl-3 pr-3 pt-0 pb-0">
                    <div class="col-sm-12">
                      <div class="form-group">
                        <table class="table ml-3 mr-3" >
                          {this.state.uploadedFiles.map((data, key) => {
                            return (
                              <tr><td>{data.name}</td>
                                <td class="form-group">
                                  <input
                                    type="text"
                                    class="form-control border-top-0 border-right-0 border-left-0 rounded-0 "
                                    id="txtComments"
                                    placeholder="Enter your comments"
                                    onChange={this.processComments.bind(this, key, data)}
                                  />

                                </td>
                                <td>
                                  <span onClick={this.removeSelectedAttachment.bind(this, data.name)}> <i class="fa fa-times" aria-hidden="true" /></span>
                                </td>

                              </tr>

                            );
                          })
                          }
                        </table>
                      </div>
                    </div>
                  </div>



                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleCloseDocUpload}>
                    Close
            </Button>
                  <Button variant="primary" onClick={this.handleSaveDocuments.bind(this, this.state.editRequestDocumentsData.requestid)}>
                    Upload file
            </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </nav>
        <div id="attachments" style={{ height: "70vh" }}>

          <div className="mt-2 pl-3">
            {" "}
            <i class="far fa-folder mr-2" />Attachments ({this.state.editRequestDocumentsData.length})
          <hr />

            <div class="row">






              {this.state.editRequestDocumentsData.map((prop, key) => {
                var date = new Date(prop.createdOn);
                if (!prop.id !== null)
                  return (




                    <div class="card col-5  border    m-2 p-0"

                    >
                      <div class="card-header" style={{}}>


                        <div class="row">
                          <div class="col-sm-2" style={{ fontSize: "3vh" }}>
                            <i class="far fa-file-alt"></i>
                          </div>
                          <div class="col-sm-10">

                            <div class="row text-truncate">{prop.name}</div>
                            <div class="row" style={{ fontSize: "1.5vh", color: " rgb(85, 86, 90)" }}>{prop.size} KB /
            {new Intl.DateTimeFormat("en-Gb", {
                              year: "numeric",
                              month: "short",
                              day: "2-digit"
                            }).format(date)}

                              -{new Intl.DateTimeFormat("default", {
                                hour: "numeric",
                                minute: "numeric"
                              }).format(date)}

                            </div>

                          </div>
                        </div>

                      </div>
                      <div class="card-body">


                        <button
                          type="button"
                          class="btn btn-primary rounded-circle mr-2"
                          disabled
                          style={{
                            backgroundColor: "#ffffff",
                            borderColor: "#55565a",
                            fontSize: ".75rem",
                            color: "#55565a"
                          }}
                        >
                          <b>A</b>
                        </button>
                        
                        | <i class="fas fa-download m-2" style={{ color: "#55565a", fontSize: "2vh" }} onClick={this.onDownload.bind(this, prop)}></i>|<i class={this.state.isWatcher!==true? "far fa-comment-alt m-2":"far fa-comment-alt m-2 disable-div"} data-toggle="tooltip" title={prop.comment} style={{ color: "#55565a", fontSize: "2vh" }} onClick={this.handleShowCommentUpload.bind(this, prop.comment)}></i>
                        <i class={this.state.isWatcher!==true?"far fa-trash-alt float-right m-2":"far fa-trash-alt float-right m-2 disable-div"} style={{ color: "#55565a", fontSize: "2vh" }} onClick={this.DeleteDocument.bind(this, prop.id)}></i>






                        <Modal show={this.state.showCommentUpload} onHide={this.handleCloseCommentUpload}>
                          <Modal.Header closeButton>
                            <Modal.Title>Save Comment</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div class="row">
                              <div class="col-sm-12">
                                <input
                                  placeholder="Comment"
                                  aria-describedby="inputGroupPrepend"
                                  name="Comment"
                                  type="text"
                                  value={this.state.documentComment}
                                  class=" search-textbox form-control rounded-0 border-right-0 border-left-0 border-top-0"
                                  onChange={e =>
                                    this.setState({ documentComment: e.target.value })
                                  }
                                />
                              </div>

                            </div>




                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleCloseCommentUpload}>
                              Close
            </Button>
                            <Button variant="primary" onClick={this.saveComment.bind(this, prop)}>
                              Save Comment
            </Button>
                          </Modal.Footer>
                        </Modal>




                      </div>
                    </div>

                  );
              })}


            </div>

          </div>

        </div>

        {/* <div className="mt-2 pl-3">
          {" "}
          <b>Drafts</b>
          <hr />
        </div>
        <div className="mt-2 pl-3">
          {" "}
          <b>Deliverables</b>
          <hr />
        </div> */}
      </>

    )
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validateDocuments: true });
  }
  processComments = (index, file, c) => {

    let comment = c.target.value
    files[index] = {
      "name": file.name, "lastModified": file.lastModified, "lastModifiedDate": file.lastModifiedDate
      , "size": file.size, "type": file.type, "comment": comment
    }
    DocComments[index] = comment;

    this.setState({ uploadedFiles: files });
  }

  removeSelectedAttachment(key) {

    let alteredArray = [];
    alteredArray = this.state.uploadedFiles;
    alteredArray.splice(key, 1);
    this.setState({ uploadedFiles: alteredArray });
  }

  onUpload = (acceptedFiles) => {
    let documents = acceptedFiles.target.files;
    for (let index = 0; index < documents.length; index++) {
      let file = documents[index];
      if(!files.some(item => file.name === item.name && file.type === item.type)){
        debugger
        formData.append('files', file, file.name);
        files.push({
          "name": file.name, "lastModified": file.lastModified, "lastModifiedDate": file.lastModifiedDate
          , "size": file.size, "type": file.type, "comment": ""
        });
      }
    }
  
    this.setState({ uploadedFiles: files });
  }

  async handleSaveDocuments() {
    if (formData !== null) {

      Documents = await DocumentService.POST(formData)
      for (let index = 0; index < Documents.length; index++) {
        Documents[index].comment = DocComments[index];
      }
      formData = new FormData()
    }


    let id = this.state.editRequestData.id;
    const bodyDocuments = JSON.stringify({ "requestId": id, "documents": Documents });
    const message1 = await DocumentService.Upload(bodyDocuments)
    const message = await BFLOWDataService.post("Documents", bodyDocuments)
    this.setState({ validateDocuments: false, uploadedFiles: [] });
    files = [];
    DocComments = [];
    this.handleCloseDocUpload();
    this.GetRequestById(this.state.requestId,this.state.isWatcher);
    //this.setState({editRequestDocumentsData:this.state.uploadedFiles})

    //uploadedFiles
    //this.getRequestList();
  }

  handleShowDocUpload() {
    this.setState({ showDocumentUpload: true });
  }


  handleCloseCommentUpload() {
    this.setState({ showCommentUpload: false });
  }

  handleShowCommentUpload(comment) {

    this.setState({ documentComment: comment, showCommentUpload: true });
  }

  async saveComment(props) {

    this.setState({ showCommentUpload: false });

    const body = JSON.stringify({
      name: props.name,
      requestid: props.requestId,
      type: props.type,
      version: props.version,
      path: props.path,
      size: props.size,
      comment: this.state.documentComment
    });


    const message = await BFLOWDataService.put(
      "Documents",
      props.id,
      body
    );
    console.log(this.state.documentComment)
    this.GetRequestById(this.state.requestId,this.state.isWatcher);
  }

  async onDownload(file) {
    let fileUrl = file.path;

    const attachment = await DocumentService.Get(file)
  }

  //-----------------------


  async allDownload(files) {

    let fileUrl = files.map(file => { return file.path })// file.filePath + file.fileName

    const attachment = await DocumentService.GetAll(fileUrl)
  }
  async DeleteDocument(documentId) {
    const message = await BFLOWDataService.Delete("Documents", documentId);

    const documents = this.state.editRequestDocumentsData.filter(x => x.id !== documentId);
    this.setState({ editRequestDocumentsData: documents })

    //this.getRequestList();
  }


  /**Document End */


  /** Feedback  Start */

  showFeedBackButton() {
    var stars = [];
    for (var i = 1; i <= 5; i++) {
      var Class = 'star-rating__star';
      if (this.state.Rating >= i && this.state.Rating != null) {
        Class += ' is-selected';
      }
      stars.push(

        <label
          className={Class}
    
        >
          <i className='fas fa-star' style={{fontSize:"15px",paddingTop:"5px"}} />
        </label>

      );
    }
    if (this.state.Rating === null) {
      return (
        <i class="far fa-star  mr-3"  disabled={this.state.isWatcher} style={{ color: "#75787B" ,paddingTop:"10px" }} id="btnSubmitfeedback" onClick={this.FeedBackShow}>
          <p1 class="ml-1">Submit feedback</p1></i>
        /* <i className="far fa-star d-inline float-right" style={{ cursor: 'pointer' }} id="btnSubmitfeedback" onClick={this.FeedBackShow}>Submit Feedback</i> */
      )
    }
    else {
      return (
        <>
<div class="tooltiP">{stars}
 <span class="tooltiptext feedback-comment">{this.state.FeedBackComments}</span>
 </div>
        </>


      )
    }
  }

  FeedBackShow() {
    if (this.state.showFeedBack === "FeedBack") {
      this.setState({ showFeedBack: "RequestTab" })
    }
    else {
      this.setState({ showFeedBack: "FeedBack" })
    }
  }
  back() {

    this.setState({ showFeedBack: "RequestTab" })
  }

  FeedbackSubmit() {

    this.GetRequestById(this.state.requestId,this.state.isWatcher);
    this.setState({ showFeedBack: "FeedBackThanks" })
  }
  /**Feedback End */


  /** Time Formating */
  formatTime(date) {
    if (date === null) {
      return ("");
    }
    else {
      return (Intl.DateTimeFormat("default", {
        hour: "numeric",
        minute: "numeric"
      }).format(date !== null ? date : ""));
    }
  }

  formatDate(date) {
    if (date === null) {
      return ("");
    }
    else {
      return (Intl.DateTimeFormat("en-Gb", {

        year: "numeric",
        month: "short",
        day: "2-digit"
      }).format(date));
    }
  }
  /**Time Formating end */

 /*Method to user roles for feature accessibility */
 getUserAccessibility(featureGroupName,feature) {
  return RoleBFLOWDataService.getUserAccessibility(this.props.globalState.features, featureGroupName,feature);
} 
/**Method to show/hide add button based on permission */
showRequestAddButton(){
  if(this.state.showRequestAddButton===true){
    return(
      <button
      type="button"
      class="rounded-circle btn add-button-list-view common-button"
      name="btnAddRequest"
      style={{
        boxShadow:
          " 8px 4px 8px 0 rgba(0, 0, 0, 0.2), 8px 6px 20px 0 rgba(0, 0, 0, 0.19)"
      }}
      onClick={this.showpop.bind(this)}
    >
      {" "}
      <i class="fa fa-plus text-white" aria-hidden="true" />
    </button>
    );
  }
}
/**Method to show/hide update button based on permission */
showRequestEditButton(){
  if(this.state.showRequestEditButton===true){
    return(
     <> 
    <button
      type="button"
      class="common-button btn btn-dark float-right mr-2 mb-2"
      onClick={this.SubmitEditRequestData.bind(this)}
      name="AddUpdate"
      disabled={this.state.isWatcher}
    >
      Update
    </button>
    <button
      type="button"
      class=" btn btn-light float-right mr-4 mb-2"
      onClick={this.ResetEditBlockData.bind(this)}
    >
      Reset
    </button>
    </>
    );
  }
}
/**Method to show/hide delete button based on permission */
showRequestDeleteButton(){
  if(this.state.showRequestDeleteButton===true){
    //Need to add delete method
  }
}
/**Method to show/hide Assignee based on permission */
showRequestAssignee(){
  if(this.state.showRequestAssignee===true){
    return(
      <div class="col-sm-12">
                <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0 ">
                  <label class="m-0" style={{ color: "#ababab", fontSize: ".80rem" }}> Assignee </label>
                  <Chips
                    onChange={this.handleAssignee.bind(this)}
                    name="Assignee"
                    id="Assignee"
                    value={this.state.Assignee}
                    suggestions={this.state.ChipsItems}
                    className="border-top-0 border-right-0 border-left-0 rounded-0"
                    chipTheme={chipTheme}
                    theme={theme}
                    shouldRenderSuggestions={value => value.length >= 1}
                    fetchSuggestionMin={5}
                  />
                </div>
              </div>
    );
  }
}
/**Method to show/hide request button based on permission */
showRequestFeedbackButton(){
  if(this.state.showRequestFeedbackButton===true){
    return(
     this.showFeedBackButton()
    );
  }
}
/**Method to show/hide Link Request Tab based on permission */
showLinkRequestTab(){
  if(this.state.showLinkRequestTab===true){
    return(
      <Tab 
      className="tab-content-mapping"
      eventKey="LinkedRequests"
      title="Linked Requests"
    >
      {this.linkedRequest()}
    </Tab>
    );
  }
}
/**Method to show/hide Link Request Tab based on permission */
showRecurrenceRequestTab(){
  if(this.state.showRecurrenceRequestTab===true){
    return(
      <Tab
      className="tab-content-mapping"
      eventKey="Recurrence"
      title="Recurrence"
    >
    <Recurrence GetRequestByIdJson = {this.state.GetRequestByIdJson} />
    </Tab>
    );
  }
}
/**Method to show/hide Link Request Tab based on permission */
showHistoryTab(){
  if(this.state.showHistoryTab===true){
    return(
      <Tab 
      className="tab-content-mapping"
      eventKey="History"
      title="History"
    >
    </Tab>
    );
  }
}
  render() {
    /**Html Cards Start */
    // Request List
    const requestListCard = (
      <div class="card rounded-0 border-top-0" style={{ height: "90vh" }}>
        <nav class="navbar navbar-expand navbar-light p-0 ">

          <div class="input-group  RequestSerchborder ">
            {/*  <input
              placeholder="Search"
              aria-describedby="inputGroupPrepend"
              name="username"
              type="text"
              class=" search-textbox form-control rounded-0 border-right-0 border-left-0 border-top-0"
              onChange={this.search.bind(this)}
            />
            <div class="input-group-prepend">
              <span
                class="search-icon input-group-text bg-white border-left-0  border-top-0"
                id="inputGroupPrepend"
              >
                <i
                  class="fa fa-search text-muted"
                  aria-hidden="true"
                  onClick={this.search.bind(this)}
                />
              </span>
            </div> */}

            <input placeholder="Search" onChange={this.search.bind(this)} aria-describedby="inputGroupPrepend" name="username" type="text"  class=" search-textbox form-control rounded-0 border-right-0 border-left-0 border-bottom-0  pt-1 border-top-0" />
            <div class="input-group-prepend ">
              <span class="search-icon input-group-text bg-white border-right-0 border-left-0 border-bottom-0 border-top-0" id="inputGroupPrepend">
                <i class="fa fa-search text-muted" aria-hidden="true"></i>
              </span>
            </div>

            <div class="input-group-prepend Latestborder" >
              <div class="center" style={{ padding: "5px", color: "grey" }}>
                Latest
              </div>
              <div
                class="center"
                style={{ padding: "5px", paddingTop: "10px" }}
              >
                <label class="switch float-right">
                  <input
                    type="checkbox"
                    onChange={this.handleCheck.bind(this)}
                    checked={this.state.isLatest}
                  />
                  <span class="slider round" />
                </label>
              </div>
            </div>

          </div>
        </nav>
        <div class="scrollbar" id="style-4"    >
          {this.state.requestList.map((prop, key) => {

            var date = null
            if (prop.dueDateTime !== null) {
              date = new Date(prop.dueDateTime);
            }
            /** making data of unassigned requests bold*/

            let reqID;
            let title;
            let time;
            let reqdate;

            if (prop.isAssigned) {
              reqID = <span style={{ color: "#75787B" }}>REQ{prop.id}</span>;
              title = <span style={{ color: "#75787B" }}>{prop.title}</span>;
              time = <div style={{ fontSize: ".75rem", color: "#75787B" }} id={"reqTime" + prop.id}>
                {this.formatTime(date)}
              </div>
              reqdate = <div class="row" style={{ color: "#75787B", fontSize: ".75rem" }} id={"reqDate" + prop.id}>
                {this.formatDate(date)}
              </div>
            } else {
              reqID = <span style={{ color: "#00568f", fontWeight: "640" }}>REQ{prop.id}</span>;
              title = <span style={{ color: "#00568f", fontWeight: "540" }}>{prop.title}</span>;
              time = <div
                style={{ fontSize: ".75rem", color: "#75787B", fontWeight: "640" }}
                id={"reqTime" + prop.id}
              >
                {this.formatTime(date)}
              </div>
              reqdate = <div class="row" style={{ color: "#75787B", fontSize: ".75rem", fontWeight: "640" }} id={"reqDate" + prop.id}>
                {this.formatDate(date)}
              </div>
            }

            /** making data of unassigned requests bold*/

            if (!prop.id !== null)
              return (
                <ul
                  class="list-group"
                  action
                  onClick={this.GetEditrequestData.bind(this, prop)}
                  name="RequestList"

                >
                  <li
                    class=""
                    className={
                      this.state.requestId === prop.id
                        ? "list-group-item rounded-0 border-right-0 pl-2 pr-0 pt-2 pb-2 active"
                        : "list-group-item rounded-0 border-right-0 pl-2 pr-0 pt-2 pb-2 "
                    }
                    id={"req" + prop.id}
                    onClick={this.GetRequestById.bind(this, prop.id, prop.isWatcher)}
                  >
                    <div class="row">
                      <div class="col-sm-2">
                        <button
                          type="button"
                          class="btn btn-primary rounded-circle float-right"
                          disabled
                          style={{
                            backgroundColor: "#000080",
                            borderColor: "#000080",
                            fontSize: ".75rem"
                          }}
                        >
                          A
                      </button>
                      </div>

                      <div class="col-sm-10 mt-1">
                        <div class="row">
                          <div class="col-sm-9">
                            <div class="row" id={"lblReq" + prop.id}>
                              {" "}
                              {/* <i
                              class="fas fa-tag pl-0 pt-2 pb-2 pr-2"
                              style={{ fontSize: ".75rem", color: "#7f7f7f" }}
                            /> */}
                              {reqID}
                            </div>
                            <div
                              class="row text-truncate mr-2"
                              id={"pReqTitle" + prop.id}
                              style={{
                                fontWeight: "500",
                                fontFamily: "Arial, Helvetica, sans-serif"
                              }}
                            >
                              <i
                                class="fas fa-circle pl-0 pt-2 pb-2 pr-2"
                                style={{ fontSize: ".75rem", color: "#75787B" }}
                              />{" "}
                              {title}
                            </div>
                          </div>
                          <div class="col-sm-3 float-right pr-0">

                            <div class="row"
                              style={{ fontSize: ".75rem", color: "#ababab" }}
                              id={"reqTime" + prop.id}
                            >
                              {time}
                            </div>

                            <div
                              class="row"
                              style={{ fontSize: ".75rem", color: "#7f7f7f" }}
                              id={"reqDate" + prop.id}
                            >
                              {reqdate}
                            </div>
                          </div>
                        </div>
                        <div class="row mr-2">
                          <p
                            class="text-truncate test "
                            style={{ fontSize: ".75rem", color: "#ababab" }}
                            id={"pReqDescription" + prop.id}
                          >
                            {prop.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              );
          })}
          <>{this.showRequestAddButton()}</>
        </div>
      </div>
    );
    //End of Request List
    /**html Cards End */

    // Render return start: this will be final return from the component
    return (
      <>
        <AlertBanner onClose={this.handleCloseErrorMessage} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
        </AlertBanner>
        <CreateRequest show={this.state.show} create={this.create.bind(this)} hide={this.handleClose.bind(this, "show")} ParentId={this.state.ParentId} ></CreateRequest>
        <div class="container-fluid pl-0">
          <div class="row">
            <div class="col-sm-4 pr-0">{requestListCard}</div>
            <div class="col-sm-8 pl-4  ">
              <div class="row pl-0 pt-3 pb-3">
                <div class="col-sm-4">
                  <select
                    style={{ backgroundColor: "#FAFAFB" }}
                    class="form-control w-100"
                    name="drpWorkflow" onChange={this.bindWorkflow.bind(this)}
                    value={this.state.Workflow}
                  >

                    {this.state.StatsData.map((data, key) => {
                      if (data.type == 1)
                        return (
                          <option value={data.id}
                            key={key}
                          >
                            {data.name}
                          </option>
                        );
                    })}
                  </select>
                </div>
                <div class="col-sm-8 mr-0 mt-1">
                  <div class="row" style={{ float: "right" }}>
                    <div  className= {this.state.isWatcher!==true?"d-inline  align-items-center  mr-3":"d-inline  align-items-center  mr-3 disable-div"}>
                      <i class="far fa-clock mr-3" style={{ color: "#75787B" }} onClick={this.showTimeTracking.bind(this)}>
                        <p1 class="ml-1">Time tracker</p1>
                      </i>
                    </div>
                    {" "}
                    <div    className= {this.state.isWatcher!==true?"d-inline  align-items-center  mr-3":"d-inline  align-items-center  mr-3 disable-div"} >
                      {this.showRequestFeedbackButton()}
                    </div>{" "}
                    {/* | {" "} */}
                    {/* <div className="d-inline">
                    <i
                      class="fas fa-ellipsis-v ml-2 mr-2"
                      style={{ color: "#75787B" }}
                    />
                      </div> */}
                    {/* <div class="d-inline">
                      <i
                        class="fas fa-ellipsis-v ml-2 mr-2" onClick={this.showRequestAction.bind(this)}
                        style={{ color: "#75787B" }}
                      />
                    </div> */}
                    <div id="myDropdown" class={this.state.RequestActionClassName}>
                      <a>Delete</a>

                    </div>
                  </div>
                </div>
              </div>
              {this.editRequestTabSection()}
            </div>
          </div>
        </div>
      </>
    );
  }
}
// Render end
export default withGlobalState(Request);