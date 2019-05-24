import React, { Component } from "react";
import {
  Modal,
} from "react-bootstrap";
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";

import DeleteIcon from '../../assets/fonts/Delete_icon.svg';
import editIcon from '../../assets/fonts/edit.svg';


import { EventBFLOWDataService } from "../../configuration/services/EventDataService";
import './dragdrop.css';
import AlertBanner from '../../components/AlertBanner/index'
let SuccessorEventId = [];
let eventArray = [];
class Events extends Component {
  constructor(context, props) {
    super(context, props);

    this.state = {
      eventList: [],
      eventpopName: '',
      eventIsActive: false,
      eventIsMappedToRequest: false,
      isEdit: false,
      eventId: 0,
      eventName: '',
      childList: [],
      show: false,
      tasks: [],
      eventdata: [],
      isDefault: false,
      errorEventName: '',
      showErrorMesage: false,
      errorMessageType: '',
      errorMessage: ''
    };
    // this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.CreateEvent = this.CreateEvent.bind(this);
    this.GetEventData = this.GetEventData.bind(this);
    this.ShowEditEvent = this.ShowEditEvent.bind(this);
    this.UpdateEvent = this.UpdateEvent.bind(this);
    this.BuildWorkFlow = this.BuildWorkFlow.bind(this);
  }

  //Drag and Drop start

  componentDidMount() {
    this.GetEvents();
  }

  onDragStart = (ev, id) => {
    ev.dataTransfer.setData("id", id);
  }

  onDragOver = (ev) => {

    ev.preventDefault();
  }

  onDrop = (ev, cat) => {

    let id = ev.dataTransfer.getData("id");

    let tasks = this.state.tasks.map((task) => {
      if (task.name === id) {
        task.category = cat;
        if (cat === "selected") {
          SuccessorEventId.push({ "EventId": this.state.eventId, "SuccessorEventId": task.id });
        }
        else {
          let filtervalue = this.state.eventList.filter(x => x.name === id);
          var listofproject = SuccessorEventId.filter(j => j.SuccessorEventId === filtervalue[0].id)
          SuccessorEventId = SuccessorEventId.filter(function (id) {
            return listofproject.indexOf(id) === -1;
          })
        }
      }

      return task;
    });

    this.setState({
      ...this.state,
      tasks,

    });
  }

  //Drag and Drop End

  ShowEditEvent() {
    this.setState({ isEdit: true })
    if (this.state.show === true)
      this.setState({ show: false })
    else {
      this.setState({ show: true });
    }
    this.setState({
      eventIsActive: this.state.eventdata.isActive,
      eventIsMappedToRequest: this.state.eventdata.isMappedToRequest,
      eventpopName: this.state.eventdata.name,
    });

  }


  async GetEventsbyId(id, data) {

    let responseJson = await EventBFLOWDataService.mapUserWithEventsById(id);

    eventArray = [];

    if (responseJson.length > 0) {
      responseJson.map((value) => {
        var eventid = this.state.eventId;
        if (value.id !== eventid && value.type === 1) {
          if (value.ismapped === true) {
            eventArray.push({ "id": value.id, "name": value.name, "category": "selected" })

            SuccessorEventId.push({ "EventId": eventid, "SuccessorEventId": value.id });


          } else {
            eventArray.push({ "id": value.id, "name": value.name, "category": "unselected" })

          }
        }
      })


    }
    setTimeout(() => {
      this.setState({ tasks: eventArray })
    }, 1000);

  }


  async GetEvents() {

    const responseJson = await BFLOWDataService.get("Event");

    let eventarray = [];
    this.setState({ eventList: responseJson });

    this.GetEventData(responseJson[0]);
    responseJson.map((data, key) => {
      if (data.id !== this.state.eventId) {
        if (data.type === 1) {
          eventarray.push({ "id": data.id, "name": data.name, "category": "unselected" })
        }
      }
    })

    this.setState({
      tasks: eventarray,
    });
  }



  handleClose() {
    this.setState({ show: false, isEdit: false, errorEventName: '' });
  }
  onChange = event =>
    this.setState({
      eventName: event.target.value,
      eventIsActive: event.target.value,
      eventIsMappedToRequest: event.target.value
    });

  handleSubmit(event) {
    event.preventDefault();

  }

  async DeleteEvent() {
    if (window.confirm("Do you wish to delete this item?")){
    const response = await BFLOWDataService.Delete("Event", this.state.eventId);
    if (response.Code === false && response.Code !== undefined) {
      this.setState({
        showErrorMesage: true,
        errorMessage: response.Message,
        errorMessageType: 'danger'
      });
    }
    else {
      this.setState({
        showErrorMesage: true,
        errorMessage: response,
        errorMessageType: 'success'
      });
      this.GetEvents();
    }
    this.setTimeOutForToasterMessages();
  }
  }


  componentDidMount() {
    this.GetEvents();
  }

  async UpdateEvent() {
    var value = this.validateForm();
    if (value === false) {
      if (this.state.eventpopName !== "") {
        const body = JSON.stringify({
          name: this.state.eventpopName,
          isActive: this.state.eventIsActive,
          isMappedToRequest: this.state.eventIsMappedToRequest,
          Type: 1
        });

        const response = await BFLOWDataService.put("Event", this.state.eventId, body);
        if (response.Code === false && response.Code !== undefined) {
          this.setState({
            showErrorMesage: true,
            errorMessage: response.Message,
            errorMessageType: 'danger',
            Key: ''
          });
        }
        else {
          this.setState({
            showErrorMesage: true,
            errorMessage: response,
            errorMessageType: 'success',
            Key: ''
          });
          this.GetEvents();
        }
        this.handleClose();
        this.setTimeOutForToasterMessages();
      }
    }
  }

  async CreateEvent() {
    var value = this.validateForm();
    if (value === false) {
      if (this.state.eventpopName !== "") {
        const body = JSON.stringify({
          name: this.state.eventpopName,
          isActive: this.state.eventIsActive,
          isMappedToRequest: this.state.eventIsMappedToRequest,
          Type: 1
        });

        const response = await BFLOWDataService.post("Event", body);
        this.setState({ eventpopName: '', eventIsMappedToRequest: false, eventIsActive: false });
        if (response.Code === false && response.Code !== undefined) {
          this.setState({
            showErrorMesage: true,
            errorMessage: response.Message,
            errorMessageType: 'danger',
            Key: ''
          });
        }
        else {
          this.setState({
            showErrorMesage: true,
            errorMessage: response,
            errorMessageType: 'success',
            Key: ''
          });
          this.GetEvents();
        }
        this.handleClose();
        this.setTimeOutForToasterMessages();

      }
    }
  }
  /*Method to validate key values*/
  validateForm() {
    let blError = false;
    const EventNameErrMsg = process.env.REACT_APP_WORKFLOW_ERROR_EVENT_NAME;
    if (this.state.eventpopName === null || this.state.eventpopName === '' || this.state.eventpopName === undefined) {
      this.setState({ errorEventName: EventNameErrMsg });
      blError = true;
    }
    return blError;
  }

  OpenModel() {

    this.setState({ show: true })
    if (this.state.isEdit === false) {
      this.setState({
        eventIsActive: false,
        eventIsMappedToRequest: false,
        eventpopName: ''

      });
    }




  }
  //Close pop



  handleData(data) {
    //SuccessorEventId = [];
    //SuccessorEventId.push(data);
  }

  GetEventData(eventData) {
    SuccessorEventId = [];
    if (eventData !== null) {
      this.setState({
        eventId: eventData.id,
        eventIsActive: eventData.isActive,
        eventIsMappedToRequest: eventData.isMappedToRequest,
        eventName: eventData.name,
        eventpopName: eventData.name,
        eventdata: eventData,
        isDefault: eventData.isDefault

      });

    }
    this.GetEventsbyId(eventData.id, eventData)

  }


  async BuildWorkFlow() {

    if (SuccessorEventId.length === 0) {
      SuccessorEventId.push({ "EventId": this.state.eventId, "SuccessorEventId": 0 });
    }
    const body = JSON.stringify(SuccessorEventId);

    const response = await EventBFLOWDataService.mapUserWithEvents(body);
    if (response.Code === false && response.Code !== undefined) {
      this.setState({
        showErrorMesage: true,
        errorMessage: response.Message,
        errorMessageType: 'danger'
      });
    }
    else {
      this.setState({
        showErrorMesage: true,
        errorMessage: response,
        errorMessageType: 'success'
      });
    }
    this.setTimeOutForToasterMessages();


  }
  ShowDeleteIcon() {
    if (this.state.isDefault === false) {
      return (<div className="d-inline float-right" >  <i className="text-muted cursor-pointer" onClick={this.DeleteEvent.bind(this)}  ><img src={DeleteIcon} /></i></div>)
    }
  }
  /*Method to handle error message */
  handleCloseErrorMessage() {
    this.setState({ showErrorMesage: false })
  }
  /**Method to hide Alert Message */
  setTimeOutForToasterMessages() {
    setTimeout(
      function () {
        this.setState({ showErrorMesage: false });
      }
        .bind(this),
      15000
    );
  }
  render() {

    //Drag and drop start

    var tasks = {
      unselected: [],
      selected: []
    }

    this.state.tasks.map((t) => {

      tasks[t.category].push(

        <div name="eventsGroup" class="btn-group paddingtop rounded-0" style={{ paddingLeft: "10px" }}>
          <div key={t.name}
            onDragStart={(e) => this.onDragStart(e, t.name)}
            draggable
            className="btn btn-primary common-button rounded-0" style={{ paddingLeft: "10px", width: "100px" }}>
            <span className="badge badge-light">{t.name}</span>
          </div>
        </div>

      );
    });
    //Drag and drop end
    let submitButton;

    if (this.state.isEdit === false) {
      submitButton = <button type="submit"
        name="createEvent"
        className="btn btn-primary"
        closeButton
        onClick={this.CreateEvent.bind(this)}
      >Create</button>;
    } else {
      submitButton = <button type="submit"
        name="createEvent"
        className="btn btn-primary"
        closeButton
        onClick={this.UpdateEvent.bind(this)}
      >Update</button>;
    }

    return (
      <>
        <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
        </AlertBanner>
        <div class="container-fluid">
          <div class="row" >
            <div class="col-sm-5   pl-0" >
              <div class="card rounded-0  bg-white" style={{ height: '80vh' }}>
                <nav class="navbar navbar-expand navbar-light p-0  shadow-sm ">
                  <div class="input-group">
                    <input
                      placeholder="Search"
                      aria-describedby="inputGroupPrepend"
                      name="Search"
                      onChange={this.searchHandler}
                      className="search-textbox"
                      type="text"
                      class=" search-textbox form-control rounded-0 border-right-0 border-left-0 border-top-0" />
                    <div class="input-group-prepend">
                      <span class="search-icon input-group-text bg-white border-left-0  border-top-0" id="inputGroupPrepend">
                        <i class="fa fa-search text-muted" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div class="input-group-prepend">
                      <span class="filter-sort-icon input-group-text bg-white  border-top-0" id="inputGroupPrepend">
                        <i class="fa fa-filter text-muted" aria-hidden="true"></i>
                      </span>
                    </div>
                    <div class="input-group-prepend">
                      <span class="filter-sort-icon input-group-text bg-white  border-top-0" id="inputGroupPrepend">
                        <i class="fa fa-sort text-muted" aria-hidden="true"></i>
                      </span>
                    </div>

                  </div>
                </nav>
                <ul class="list-group listGroup-scroll" name="EventList">


                  {this.state.eventList.map((data, key) => {


                    if (data.id !== null && data.type === 1) {


                      return (
                        //  <ListGroup.Item   action className="list-item-listview"><i class="fas fa-circle" style={{color: 'green', paddingRight:'10px',fontSize:'10px'}}></i>{data.name}</ListGroup.Item>
                        <li onClick={this.GetEventData.bind(this, data)} className={
                          this.state.eventId === data.id
                            ? 'list-group-item rounded-0 pl-2 pt-3 pb-3 text-muted text-truncate  border-left-0 border-right-0 cursor-default bf-minheight-60 active' : 'list-group-item rounded-0 pl-2 pt-3 pb-3 text-muted text-truncate  border-left-0 border-right-0 cursor-default bf-minheight-60'
                        }><label>{data.name}</label>


                          <label className="float-right" >{data.isDefault === true ? "Default" : ""}</label>

                        </li>
                      );
                    }
                  })}

                </ul>
                <button
                  type="button"
                  class="rounded-circle btn add-button-list-view common-button "
                  name="btnAddEvent"
                  style={{
                    boxShadow:
                      " 8px 4px 8px 0 rgba(0, 0, 0, 0.2), 8px 6px 20px 0 rgba(0, 0, 0, 0.19)"
                  }}
                  onClick={this.OpenModel.bind(this)}
                >
                  {" "}
                  <i class="fa fa-plus text-white" aria-hidden="true" />
                </button>

              </div>
            </div>
            <div class="col-sm-7 pl-2">
              <div class="pl-0 pr-2 pt-3 pb-3 h-60  text-secondary ">
                <h5 class="text-truncate d-inline pl-2">{this.state.eventName}</h5>
                {this.ShowDeleteIcon()}

                <div className="d-inline float-right">
                  <i className="text-muted cursor-pointer" onClick={this.ShowEditEvent.bind(this)} ><img src={editIcon} alt="editIcon" /></i>
                </div>
              </div>

              <div class="card rounded-0 border-0 shadow-sm listGroup-scroll" style={{ height: '65vh' }}>
                <div class="card-body p-0 border-0  ">
                  <div className="col-sm-12 pl-5 pr-5 pt-5">
                    {/* _______________________________________________________ */}
                    <div name="DragAndDrop" className="">
                      {/* <div className="container-drag"> */}
                      <div className="row">
                        <div className="wip w-90 active"
                          onDragOver={(e) => this.onDragOver(e)}
                          onDrop={(e) => { this.onDrop(e, "unselected") }}>

                          {tasks.unselected}
                        </div>
                      </div>

                      {/* </div> */}
                      <div className="row marginTop" >
                        <div className="droppable w-90"
                          onDragOver={(e) => this.onDragOver(e)}
                          onDrop={(e) => this.onDrop(e, "selected")}>

                          {tasks.selected}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              <div class="bg-white" >
                <div class="card-footer bg-white">
                  <button type="button"
                    className="common-button btn btn-dark float-right mr-2 mb-2" name="AddBuild"
                    id="Build" onClick={this.BuildWorkFlow.bind(this)} >Build</button>
                  {/* <button  type="button"  class=" btn btn-light float-right mr-4 mb-2">Remove</button> */}
                </div>
              </div>

            </div>
          </div>
        </div>
        <Modal name="addeventModel" show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title name="addEventModelTitle">{this.state.isEdit === false ? "Add" : "Edit"} Workflow</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={this.handleSubmit}>
              <div className="container">
                <div className="row" style={{ paddingLeft: "10px" }}>
                  <div className="col-12">
                    <label className={this.state.errorEventName === "" ? "mandatory" : "error-label mandatory"}>Event Name</label>
                    <input
                      placeholder="Enter Event Name"
                      type="text"
                      name="eventpopName"
                      className={this.state.errorEventName === "" ? "form-control rounded-0 border-right-0 border-left-0 border-top-0 w-100" : "error-textbox form-control rounded-0 border-right-0 border-left-0 border-top-0 w-100"}
                      value={this.state.eventpopName}
                      onChange={e => this.setState({ eventpopName: e.target.value })}
                    />
                    <div className="errorMsg">{this.state.errorEventName}</div>
                  </div>
                </div>
                <br />
                <div className="row" style={{ paddingLeft: "10px" }}>
                  <div className="col-6">
                    <div id="formGridCheckbox" className="form-group">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          label="Is active"
                          className="form-check-input"
                          checked={this.state.eventIsActive}
                          onChange={e =>
                            this.setState({
                              eventIsActive: !this.state.eventIsActive
                            })
                          }
                          name="eventIsActive"
                          value={this.state.eventIsActive}
                        />
                        <label class="form-check-label">
                          IsActive
                  </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div id="formGridCheckbox" className="form-group">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          label="Is mapped to request"
                          className="form-check-input"
                          checked={this.state.eventIsMappedToRequest}
                          onChange={e =>
                            this.setState({
                              eventIsMappedToRequest: !this.state
                                .eventIsMappedToRequest
                            })
                          }
                          name="eventIsMappedToRequest"
                          value={this.state.eventIsMappedToRequest}
                        />
                        <label class="form-check-label">
                          IsMappedToRequest
                  </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button name="closeEventModal" type="button" className="btn btn-secondary" onClick={this.handleClose}>Close</button>
            {submitButton}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Events;
