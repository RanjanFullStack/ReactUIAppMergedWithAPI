import React, { Component } from "react";
import {
  Modal, Button
} from "react-bootstrap";
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import DeleteIcon from '../../assets/fonts/Delete_icon.svg';
import editIcon from '../../assets/fonts/edit.svg';
import AlertBanner from '../../components/AlertBanner/index'

class Status extends Component {
  constructor(context, props) {
    super(context, props);

    this.state = {
      Status: '',
      StatusList: [],
      AllStatusList: [],
      StatusName: null,
      StatusId: 0,
      isEdit: false,
      StatusIsActive: false,
      StatusIsMappedToRequest: false,
      show: false,
      StatusEventType: 2,
      Statusdata: [],
      showErrorMesage: false,
      errorMessageType: '',
      errorMessage: '',
      updateButton: true,
      errorStatusName: '',
      showdel: false
    };
    this.handleShowdel = this.handleShowdel.bind(this);
    this.handleClosedel = this.handleClosedel.bind(this);
  }

  async componentDidMount() {
    await this.GetStatus();
  }
  async GetStatus() {
    const responseJson = await BFLOWDataService.get("Event");
    this.setState({ StatusList: responseJson, AllStatusList: responseJson });
  }
  /*Method to validate Custom Dates*/
  validateForm() {
    ;
    let blError = false;
    const StatusNameMsg = process.env.REACT_APP_CUSTOM_DATES_ERROR_STATUS_NAME;
    if (this.state.StatusName === null || this.state.StatusName === '' || this.state.StatusName === undefined) {
      this.setState({ errorStatusName: StatusNameMsg });
      blError = true;
    }
    return blError;
  }
  /*Method to Create status*/
  async CreateStatus() {
    var value = this.validateForm();
    if (value === false) {
      if (this.state.StatusName !== "") {
        const body = JSON.stringify({
          name: this.state.StatusName,
          isActive: this.state.StatusIsActive,
          isMappedToRequest: this.state.StatusIsMappedToRequest,
          Type: this.state.StatusEventType
        });
        const response = await BFLOWDataService.post("Event", body);
        this.setState({ StatusName: '', StatusIsMappedToRequest: false, StatusIsActive: false });
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
          this.GetStatus();
        }
        this.handleClose();
        this.setTimeOutForToasterMessages();
      }

    }
  }
  handleClosedel() {
    this.setState({ showdel: false });
  }

  handleShowdel() {
    this.setState({ showdel: true });
  }

  /*Method to delete status*/
  async  DeleteStatus(id) {

    const response = await BFLOWDataService.Delete('Event', id);

    if (response.Code === false && response.Code !== undefined) {
      this.setState({
        showErrorMesage: true,
        errorMessage: response.Message,
        errorMessageType: 'danger',
        Status: ''
      });
    }
    else {
      this.setState({
        showErrorMesage: true,
        errorMessage: response,
        errorMessageType: 'success',
        Status: ''
      });
      this.GetStatus()
    }
    this.handleClosedel();
    this.setTimeOutForToasterMessages();


  }

  async UpdateStatus() {
    var value = this.validateForm();
    if (value === false) {
      const body = JSON.stringify({
        Name: this.state.StatusName,
        IsActive: this.state.StatusIsActive,
        IsMappedToRequest: this.state.StatusIsMappedToRequest,
      });
      const response = await BFLOWDataService.put('Event', this.state.StatusId, body);
      this.setState({ IsActive: !this.state.IsActive })
      this.setState({ IsMappedToRequest: !this.state.IsMappedToRequest })
      if (response.Code === false && response.Code !== undefined) {
        this.setState({
          showErrorMesage: true,
          errorMessage: response.Message,
          errorMessageType: 'danger',
          Status: ''
        });

      }
      else {
        this.setState({
          showErrorMesage: true,
          errorMessage: response,
          errorMessageType: 'success',
          Status: ''
        });
        this.GetStatus()
      }
      this.setTimeOutForToasterMessages();
      this.handleClose();
    }
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
  moderPopButton() {
    if (this.state.updateButton === true) {
      return (

        <>  <Button variant="outline-secondary" name="btnClose" onClick={this.handleClose.bind(this)}>
          Close
</Button>
          <Button variant="primary" name="btnAdd" className="common-button" onClick={this.CreateStatus.bind(this)} >
            Add
</Button>
        </>

      )
    }
    else {
      return (
        <>  <Button variant="outline-secondary" name="btnClose" onClick={this.handleClose.bind(this)}>
          Close
</Button>
          <Button variant="primary" name="btnUpdate" onClick={this.UpdateStatus.bind(this)} >
            Update
</Button>
        </>
      )
    }

  }
  ShowEditStatus(lstStatus) {
    this.setState({ isEdit: true })
    if (this.state.show === true)
      this.setState({ show: false })
    else {
      this.setState({ show: true });
    }

    this.setState({
      StatusName: lstStatus.name,
      StatusIsActive: lstStatus.isActive,
      StatusIsMappedToRequest: lstStatus.isMappedToRequest,
      updateButton: false,
      StatusId: lstStatus.id
    });

  }
  OpenModel() {
    this.setState({
      updateButton: true,
      StatusName: '',
      StatusIsActive: false,
      StatusIsMappedToRequest: false,
      show: true,
      StatusId: 0
    });

  }
  handelchangeIsActive() {
    this.setState({ StatusIsActive: !this.state.StatusIsActive })
  }
  handelchangeIsMappedToRequest() {
    this.setState({ StatusIsMappedToRequest: !this.state.StatusIsMappedToRequest })
  }
  //Close pop
  handleClose() {
    this.setState({
      show: false,
      StatusIsMappedToRequest: false,
      StatusIsActive: false,
      errorStatusName: ''
    });
  }
  /*Method to handle error message */
  handleCloseErrorMessage() {
    this.setState({ showErrorMesage: false })
  }

  searchHandler(event) {

    let search = event.target.value.toLowerCase();
    const displayStatusList = this.state.AllStatusList.filter((el) => {
      let searchValue = el.name.toLowerCase();
      return searchValue.indexOf(search) !== -1;
    })
    if (search !== "") {
      this.setState({
        StatusList: displayStatusList
      })
    }
    else {
      this.setState({
        StatusList: this.state.AllStatusList
      })
    }
  }
  render() {

    const headerCard = (
      <div name="headerCard" className="card w-100 border-bottom mt-2 border-top-0 border-right-0 border-left-0 rounded-0 pt-4 ">
        <h4 name="title" className="card-title ml-4">Custom Dates</h4>
      </div>
    );
    const displayList = (
      <div className="col-sm-12   p-0">
        <nav className="navbar navbar-expand navbar-light p-0">
          <div className="input-group border">
            <input
              placeholder="Search"
              aria-describedby="inputGroupPrepend"
              name="Search"
              onChange={this.searchHandler.bind(this)}
              type="text"
              className=" search-textbox form-control rounded-0 " />
            <div className="input-group-prepend">
              <span className="search-icon input-group-text bg-white border-left-0   border-top-0" id="inputGroupPrepend">
                <i className="fa fa-search text-muted" aria-hidden="true"></i>
              </span>
            </div>

          </div>
        </nav>
        <div className="card border-0  bg-white scrollbar pr-2 border-0 shadow-sm" style={{ fontSize: "1.25rem", borderRadius: "8px", margin: "8rem", height: "50vh" }}>
          {this.state.StatusList.map((data) => {
            if (data.type == 2)
              return (
                <ul className="list-group" name="StatusList"
                  action
                // onClick={this.StatusList.bind(this, data)}
                >
                  <li action class=""
                    className={
                      this.state.StatusId === data.id
                        ? "list-group-item rounded-0 pl-2 m-2 pt-3 pb-3 text-muted text-truncate  border-bottom border-top-0 border-left-0 border-right-0  cursor-default bf-minheight-60 active"
                        : "list-group-item rounded-0 pl-2 m-2 pt-3 pb-3 text-muted text-truncate  border-bottom border-top-0 border-left-0 border-right-0  cursor-default bf-minheight-60"
                    }
                  >
                    <div className="d-inline float-right">
                      <i className="text-muted cursor-pointer" name="DltCustomDates" onClick= {this.handleShowdel}><img src={DeleteIcon} /></i>
                      <Modal aria-labelledby="contained-modal-title-vcenter" centered show={this.state.showdel} onHide={this.handleClosedel}>
                        <Modal.Header closeButton>
                          <Modal.Title id="contained-modal-title-vcenter">Delete Custom Dates</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Are you sure you want to delete the field?
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" id="btnCloseDate" onClick={this.handleClosedel}>
                            Close
                          </Button>
                          <Button variant="primary" id="btnDeleteDate" onClick={this.DeleteStatus.bind(this, data.id)}>
                            Delete
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                    <div className="d-inline float-right">
                      <i className="text-muted cursor-pointer" name="editCustomDates" onClick={this.ShowEditStatus.bind(this, data)}> <img src={editIcon} /></i>
                    </div>
                    <div className="row">
                      <div className="col-sm-10 ml-2 pr-0"  >
                        <div className="row" >
                          <div className="d-inline text-truncate">
                            {" "}
                            {/* <i className="fas fa-circle "
                            style={data.isActive == true ? { color: "green", paddingRight: "10px", fontSize: ".75rem" } : { color: "red", paddingRight: "10px", fontSize: ".75rem" }}
                          /> */}
                            <p1
                              name="StatusName"
                              className="d-inline text-truncate"
                              style={{ fontSize: "1.25rem" }}
                            >
                              {data.name}
                            </p1>
                          </div>{" "}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              );
          }
          )}

        </div>
        <button
          name="addStatusButton"
          type="button"
          className="rounded-circle btn add-button-list-view common-button bf-margin-right-75"
          name="btnAddStatus"
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
    );
    // let submitButton;
    //if {
    //   submitButton = <button type="submit"
    //     name="createStatus"
    //     className="btn btn-primary"
    //     closeButton
    //     // onClick={this.UpdateStatus.bind(this)}
    //   >Update</button>;
    // }
    const createStatusModal = (
      <Modal name="addStatusModel" show={this.state.show} onHide={this.handleClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter "><label className="text-truncate" >{(this.state.updateButton === true) ? "Create" : "Edit"} Custom Date</label></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={this.handleSubmit} >
            <div className="container">
              <div className="row" style={{ paddingLeft: "10px" }}>
                <div className="col-12">
                  <label className={this.state.errorStatusName === "" ? "mandatory" : "error-label mandatory"}>Custom Date Name</label>
                  <input
                    placeholder="Enter Custom Date Name"
                    type="text"
                    name="statusName"
                    checked={this.state.done || this.props.done}
                    value={this.state.StatusName}
                    onChange={e => this.setState({ StatusName: e.target.value })}
                    className={this.state.errorStatusName === "" ? "form-control rounded-0 border-right-0 border-left-0 border-top-0 w-100" : "error-textbox form-control rounded-0 border-right-0 border-left-0 border-top-0 w-100"}
                  />
                  <div className="errorMsg">{this.state.errorStatusName}</div>
                </div>
              </div>
              <br />

            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          {this.moderPopButton()}
        </Modal.Footer>
      </Modal>
    );
    return (

      <>
        <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
        </AlertBanner>
        <div className="container-fluid scrollbar" style={{backgroundColor:"#FAFAFB"}}>
          <div className="row">
            {/* <div className="w-100 heading-card">
              <div className="col-sm-12   p-0">{headerCard}</div>
            </div> */}
            {createStatusModal}
            {displayList}
          </div>
        </div>
      </>
    );
  }
}
export default Status;
