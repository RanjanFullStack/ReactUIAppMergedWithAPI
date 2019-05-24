/**
 * BFLOW: User UI
 * Components Name: Create User, Update User, Alert Banner
 */

import React, { Component } from "react";
import {
  Modal,
} from "react-bootstrap";
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import AlertBanner from '../../components/AlertBanner/index'
import { withGlobalState } from 'react-globally'

//used for role method
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";

class UserList extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      userList: [],
      modalShow: false,
      userId: "",
      errorFName: "",
      errorLName: "",
      errorEmail: "",
      errorUserName: "",
      errorTimeZoneid: "",
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      timezonelist: [],
      timeZoneId: "",
      managerId: "",
      showErrorMesage: false,
      errorMessageType: '',
      errorMessage: '',

      showUserAddButton:false,
      showUserEditButton:false,
      showUserDeleteButton:false,

    };
  }

  async componentDidMount() {
    await this.getUser();
    this.GetTimeZone();

   const showDeleteButton=  this.getUserAccessibility("User Management","Delete");
   const showAddEditButton=  this.getUserAccessibility("User Management","Add");
   this.setState({showUserAddButton:showAddEditButton,showUserEditButton:showAddEditButton,showUserDeleteButton:showDeleteButton})
  }

  /*Method to call User List API*/
  async getUser() {
    const responseJson = await BFLOWDataService.get('Users');
    this.setState({ userList: responseJson });

    if (
      responseJson !== undefined &&
      responseJson !== null &&
      responseJson !== ""
    ) {
      this.setState({
        userId: responseJson[0].id,
        firstName: responseJson[0].firstName,
        lastName: responseJson[0].lastName,
        email: responseJson[0].email,
        userName: responseJson[0].userName,
        timeZoneId: responseJson[0].timeZoneId,
        managerId: responseJson[0].managerId
      });
    }
  }

  async GetTimeZone(){
    const responseJson = await BFLOWDataService.get('Timezone');
    this.setState({timezonelist:responseJson})
 }

  /*Method to close popup*/
  handleClose() {
    this.setState({ modalShow: false });
    this.GetUserById(this.state.userId);
    this.ResetStateValues();
  }
  /*Method to handle change event of all elements*/
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  /*Method to call Add User API*/
  async addUser(event) {
    this.setState({
      errorFName: "",
      errorLName: "",
      errorEmail: "",
      errorUserName: "",
    });
;
    // checking validateForm
    var value = this.validateForm();
    if (value === true) {
      const body = JSON.stringify({
        FirstName: this.state.firstName,
        LastName: this.state.lastName,
        Password: "abc",
        UserName: this.state.userName,
        Email: this.state.email,
        EnableNotification: true,
        IsActive: true,
        TimeZoneID: this.state.timeZoneId,
        ManagerId: this.state.managerId,
        IsFirstLogin: true,
        CreatedBy: 1,
        IsInternal: true,
        App : process.env.REACT_APP_APP_NAME
      });
      const response = await BFLOWDataService.post('Users', body);

      if (response.Code === false && response.Code !== undefined) {
        this.setState({
             showErrorMesage: true,
          errorMessage: response.Message,
          errorMessageType: 'danger'
});
      } else {
         this.setState({
          showErrorMesage: true,
          errorMessage: response,
          errorMessageType: 'success'
      });
        this.getUser();
      }
    this.handleClose();
      this.setTimeOutForToasterMessages();
  }
}

  /*Method to call Update User By ID API*/
  async updateUser() {
    this.setState({
      errorFName: "",
      errorLName: "",
      errorEmail: "",
      errorUserName: "",
    });

    // checking validateForm
    var value = this.validateForm();
    if (value === true) {
      const body = JSON.stringify({
        FirstName: this.state.firstName,
        LastName: this.state.lastName,
        UserName: this.state.userName,
        Email: this.state.email,
        EnableNotification: true,
        TimeZoneID: this.state.timeZoneId,
        ManagerId: this.state.managerId,
        App : process.env.REACT_APP_APP_NAME
      });

      const response = await BFLOWDataService.put('Users', this.state.userId, body);
      if (response.Code === false && response.Code !== undefined) {
         this.setState({
          showErrorMesage: true,
          errorMessage: response.Message,
          errorMessageType: 'danger'
      });
      } else {
        this.setState({
          showErrorMesage: true,
          errorMessage: response,
          errorMessageType: 'success'
      });
        this.getUser();
      }
      
      this.setTimeOutForToasterMessages();
  }
}

  /*Method to call Get User By ID API*/
  async GetUserById(userid) {
    this.ResetStateValues();
    const responseJson = await BFLOWDataService.getbyid('Users', userid);
    if (responseJson !== undefined) {
      this.setState({
        userId: responseJson.id,
        firstName: responseJson.firstName,
        lastName: responseJson.lastName,
        email: responseJson.email,
        userName: responseJson.userName,
        timeZoneId: responseJson.timeZoneId,
        managerId: responseJson.managerId
      });

      if (responseJson.managerId !== null) {
        this.setState({ managerId: responseJson.managerId });
      } else {
        this.setState({ managerId: "" });
      }
    }
  }
  /*Method to call Delete User API*/
  async DeleteUser() {
    if (window.confirm("Do you wish to delete this item?")){
   const response =   await BFLOWDataService.Delete('Users', this.state.userId);
      if (response.Code === false && response.Code !== undefined) {
        this.setState({
             showErrorMesage: true,
          errorMessage: response.Message,
          errorMessageType: 'danger'
});
      } else {
         this.setState({
          showErrorMesage: true,
          errorMessage: response,
          errorMessageType: 'success'
      });
        this.getUser();
      }
    }
  }
  /*Method to validate User Form*/
    validateForm() {
    var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let blError = true;
    const firstNameErrMsg = process.env.REACT_APP_USERLIST_ERROR_FIRST_NAME;
    const lastNameErrMsg = process.env.REACT_APP_USERLIST_ERROR_LAST_NAME;
    const emailErrMsg = process.env.REACT_APP_USERLIST_ERROR_EMAIL;
    const emailValidErrMsg = process.env.REACT_APP_USERLIST_ERROR_VALID_EMAIL;
    const userNameErrMsg = process.env.REACT_APP_USERLIST_ERROR_USER_NAME;
    const TimeZoneErrMsg = process.env.REACT_APP_USERLIST_ERROR_TIMEZONE;

    if (this.state.firstName==="" || this.state.firstName===null || this.state.firstName===undefined) {
      this.setState({ errorFName: firstNameErrMsg });
      blError = false;
    }
    if (this.state.lastName==="" || this.state.lastName===null || this.state.lastName===undefined) {
      this.setState({ errorLName: lastNameErrMsg });
      blError = false;
    }
    if (this.state.email==="" || this.state.email===null || this.state.email===undefined) {
      this.setState({ errorEmail: emailErrMsg });
      blError = false;
    } else if (!regexEmail.test(String(this.state.email).toLowerCase())) {
      this.setState({ errorEmail: emailValidErrMsg });
      blError = false;
    }
    if (this.state.userName ==="" || this.state.userName===null || this.state.userName===undefined) {
      this.setState({ errorUserName: userNameErrMsg });
      blError = false;
    }
    debugger;
    if (this.state.timeZoneId==="" || this.state.timeZoneId===null || this.state.timeZoneId===undefined) {
      this.setState({ errorTimeZoneid: TimeZoneErrMsg });
      blError = false;
    }
    return blError;
  }



   EditUserHtml() {
    return (
      <>
        <div className="pt-2">
          <div className="add-user-heading" />

          <div class="m-0 border-0 " style={{fontWeight:"500"}}>
          Basic Details
          </div>
          <hr />

          <div class="row pl-3 pr-3 pt-0 pb-0">
            <div>
              <div class="row">
                <div class="col-sm-4">
                  {/* <Form.Label>First Name</Form.Label> */}
                  <label className={this.state.errorFName===""?"label m-0 mandatory":"error-label label m-0 mandatory"} style={{fontSize:"1.5vh"}} >First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    aria-describedby="inputGroupPrepend"
                    style={{ color: "#55565a" }}
                    value={this.state.firstName}
                    onChange={this.handleChange.bind(this)}
                    name="firstName"
                    id="FirstName"
                    className={this.state.errorFName===""?"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"}
                  />
                  <div className="errorMsg">{this.state.errorFName}</div>
                </div>
                <div class="col-sm-4">
                  <label className={this.state.errorLName===""?"label m-0 mandatory":"error-label label m-0 mandatory"} style={{fontSize:"1.5vh"}}>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    aria-describedby="inputGroupPrepend"
                    style={{ color: "#55565a" }}
                    value={this.state.lastName}
                    onChange={this.handleChange.bind(this)}
                    name="lastName"
                    id="LastName"
                    className={this.state.errorLName===""?"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"}
                  />
                  <div className="errorMsg">{this.state.errorLName}</div>
                </div>
                <div class="col-sm-4">
                  <label className={this.state.errorEmail===""?"label m-0 mandatory":"error-label label m-0 mandatory"} style={{fontSize:"1.5vh"}}>Email</label>
                  <input
                    type="text"
                    placeholder="Email"
                    aria-describedby="inputGroupPrepend "
                    style={{ color: "#55565a" }}
                    value={this.state.email}
                    onChange={this.handleChange.bind(this)}
                    name="email"
                    id="Email"
                    className={this.state.errorEmail===""?"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"}
                  />
                  <div className="errorMsg">{this.state.errorEmail}</div>
                </div>
                <div class="col-sm-4">
                  <label className={this.state.errorUserName===""?"label m-0 mandatory":"error-label label m-0 mandatory"} style={{fontSize:"1.5vh"}}>Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend "
                    style={{ color: "#55565a" }}
                    value={this.state.userName}
                    onChange={this.handleChange.bind(this)}
                    name="userName"
                    id="UserName"
                    className={this.state.errorUserName===""?"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"}
                  />
                  <div className="errorMsg">{this.state.errorUserName}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4">
          <div class="m-0 border-0 " style={{fontWeight:"500"}}>
          Allocation Details
          
          </div>
            <hr />
            <div class="row pl-3 pr-3 pt-0 pb-0">
              <div class="col-sm-4 pl-0">
                <label  className={this.state.errorTimeZoneid===""?"label m-0 mandatory":"error-label label m-0 mandatory"} style={{fontSize:"1.5vh"}}>Time Zone</label>
                <select
                     style={{ color: "#55565a" }}
                     class="form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"
                  id="TimeZone"
                  name="timeZoneId"
                  value={this.state.timeZoneId}
                  onChange={this.handleChange.bind(this)}
                  className={this.state.errorTimeZoneid===""?"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"}
                >
                  <option value="">Select Time Zone</option>
                  {this.state.timezonelist.map((data, index) => {
                    if (data.id !== this.state.userId) {
                      return (
                        <option value={data.id}>{data.timeZoneName}</option>
                      );
                    }
                  })}
                </select>

                <div className="errorMsg">{this.state.errorTimeZoneid}</div>
              </div>
              <div class="col-sm-4">
                <label class="label m-0" style={{fontSize:"1.5vh"}}>Manager</label>
                <select
                     style={{ color: "#55565a" }}
                     class="form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"
                  id="ManagerId"
                  name="managerId"
                  value={this.state.managerId}
                  onChange={this.handleChange.bind(this)}
                >
                  <option>Select Manager </option>
                  {this.state.userList.map((data, index) => {
                    if (data.id !== this.state.userId) {
                      return <option value={data.id}>{data.userName}</option>;
                    }
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  addUserHtml() {
    return (
      <>
         <div className="">
          <div className="add-user-heading" />
          <div class="border-0 " style={{fontWeight:"500"}}>
          Basic Details
          </div>
          <hr />
          <div class="row pl-3 pr-3 pt-0 pb-0">
            <div>
              <div class="row p-4">
                <div class="col-sm-12">
                  {/* <Form.Label>First Name</Form.Label> */}
                  <label className={this.state.errorFName === "" ? "mandatory" : "error-label mandatory"} style={{fontSize:"1.5vh"}} >First Name</label>
                  <input
                
                    type="text"
                    placeholder="First Name"
                    aria-describedby="inputGroupPrepend"
                    style={{ color: "#55565a" }}
                    class={this.state.errorFName===""?" form-control border-top-0 border-right-0 border-left-0 rounded-0":"  error-textbox  form-control border-top-0 border-right-0 border-left-0 rounded-0"}
                    value={this.state.firstName}
                    onChange={this.handleChange.bind(this)}
                    name="firstName"
                    id="FirstName"
                  />
                  <div className="errorMsg">{this.state.errorFName}</div>
                </div>
                <div class="col-sm-12">
                  <label className={this.state.errorLName === "" ? "mandatory" : "error-label mandatory"} style={{fontSize:"1.5vh"}}>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    aria-describedby="inputGroupPrepend"
                    style={{ color: "#55565a" }}
                    class={this.state.errorLName===""?"form-control border-top-0 border-right-0 border-left-0 rounded-0":"  error-textbox form-control border-top-0 border-right-0 border-left-0 rounded-0"}
                    value={this.state.lastName}
                    onChange={this.handleChange.bind(this)}
                    name="lastName"
                    id="LastName"
                  />
                  <div className="errorMsg">{this.state.errorLName}</div>
                </div>
                <div class="col-sm-12">
                  <label className={this.state.errorEmail === "" ? "mandatory" : "error-label mandatory"} style={{fontSize:"1.5vh"}}>Email</label>
                  <input
                    type="text"
                    placeholder="Email"
                    aria-describedby="inputGroupPrepend "
                    style={{ color: "#55565a" }}
                    class={this.state.errorEmail===""?" form-control border-top-0 border-right-0 border-left-0 rounded-0":"  error-textbox  form-control border-top-0 border-right-0 border-left-0 rounded-0"}
                    value={this.state.email}
                    onChange={this.handleChange.bind(this)}
                    name="email"
                    id="Email"
                  />
                  <div className="errorMsg">{this.state.errorEmail}</div>
                </div>
                <div class="col-sm-12">
                <label className={this.state.errorUserName === "" ? "mandatory" : "error-label mandatory"} style={{fontSize:"1.5vh"}}>Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend "
                    style={{ color: "#55565a" }}
                    class={this.state.errorUserName===""?" form-control border-top-0 border-right-0 border-left-0 rounded-0":"  error-textbox  form-control border-top-0 border-right-0 border-left-0 rounded-0"}
                    value={this.state.userName}
                    onChange={this.handleChange.bind(this)}
                    name="userName"
                    id="UserName"
                  />
                  <div className="errorMsg">{this.state.errorUserName}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
          <div class="m-0 border-0 " style={{fontWeight:"500"}}>
          Allocation Details
          
          </div>
           
            <hr />

            <div class="row pl-3 pr-3 pt-0 pb-0">
              <div class="col-sm-5">
                <label className={this.state.errorTimeZoneid === "" ? "mandatory" : "error-label mandatory"} style={{fontSize:"1.5vh"}}>Time Zone</label>
                <select
                     style={{ color: "#55565a" }}
                     class={this.state.errorTimeZoneid===""?" form-control border-top-0 border-right-0 border-left-0 rounded-0":"  error-textbox  form-control border-top-0 border-right-0 border-left-0 rounded-0"}
                  id="TimeZone"
                  name="timeZoneId"
                  value={this.state.timeZoneId}
                  onChange={this.handleChange.bind(this)}
                >
                  <option>Select Time Zone</option>
                  {this.state.timezonelist.map((data, index) => {
                    if (data.id !== this.state.userId) {
                      return (
                        <option value={data.id}>{data.timeZoneName}</option>
                      );
                    }
                  })}
                </select>

                <div className="errorMsg">{this.state.errorTimeZoneid}</div>
              </div>
              <div class="col-sm-5  ">
                <label class="label m-0" style={{fontSize:"1.5vh"}}>Manager</label>
                <select
                     style={{ color: "#55565a" }}
                     class="form-control border-top-0 border-right-0 border-left-0 rounded-0"
                  id="Manager"
                  name="managerId"
                  value={this.state.managerId}
                  onChange={this.handleChange.bind(this)}
                >
                  <option>Select Manager </option>
                  {this.state.userList.map((data, index) => {
                    if (data.id !== this.state.userId) {
                      return <option value={data.id}>{data.userName}</option>;
                    }
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  ResetStateValues() {
    this.setState({
     firstName: "",
      lastName: "",
      email: "",
      userName: "",
      timeZoneId: "",
      managerId: "",
      errorFName: "",
      errorLName: "",
      errorEmail: "",
      errorUserName: "",
      errorTimeZoneid: "",
    });
  }

  mappingCard() {
    if (this.state.modalShow === false) {
      return (
        <div className="card-list-view-mapping" body>
          {this.EditUserHtml()}{" "}
        </div>
      );
    }
  }

/**Method to hide Alert Message */
setTimeOutForToasterMessages() {
  debugger
  setTimeout(
      function () {
        debugger
          this.setState({ showErrorMesage: false });
      }
          .bind(this),
      15000
  );
}
  /*Method to handle error message */
  handleCloseErrorMessage() {
    this.setState({ showErrorMesage: false })
}
 /*Method to user roles for feature accessibility */
getUserAccessibility(featureGroupName,feature) {
  return RoleBFLOWDataService.getUserAccessibility(this.props.globalState.features, featureGroupName,feature);
} 
/**Method to show/hide add button based on permission */
showUserAddButton(){

if(this.state.showUserAddButton){
  return(
    <button
    type="button"
    class="rounded-circle btn add-button-list-view common-button "
    name="btnAddUser"
    style={{
      boxShadow:
        " 8px 4px 8px 0 rgba(0, 0, 0, 0.2), 8px 6px 20px 0 rgba(0, 0, 0, 0.19)"
    }}
    onClick={() =>
      this.setState({ modalShow: true }, () => {
        this.ResetStateValues();
      })
    }
  >
    {" "}
    <i class="fa fa-plus text-white" aria-hidden="true" />
  </button>
  )
}
}
/**Method to show/hide update button based on permission */
showUserEditButton(){
  if(this.state.showUserEditButton){
  return(
    <>
       <button
                  type="button"
                  class="common-button btn btn-dark float-right mr-2 mb-2"
                  id="Update"
                  name="AddUpdate"
                  onClick={this.updateUser.bind(this)}
                >
                  Update
                </button>
                <button
                  type="button"
                  class=" btn btn-light float-right mr-4 mb-2"
                  id="Reset"
                  name="btnReset"
                  variant="outline-secondary"
                  onClick={() => this.setState({ modalShow: false },()=>{
                          this.GetUserById(this.state.userId)
                      })
                    }
                >
                  Reset
                </button>
    </>
  )
  }
}
/**Method to show/hide delete button based on permission */
showUserDeleteButton(){
  if(this.state.showUserDeleteButton){
return(
  <>
  <>|</>
    <i
      class="far fa-trash-alt d-inline float-right  mt-1 ml-3"
      aria-hidden="true"
      onClick={this.DeleteUser.bind(this)}
      style={{ color: " #55565a" ,fontSize: "2vh" }}
    />
  </>
);
  }
}
  render() {
    //const { validated } = this.state;
    const headerCard = (
      <div class="card w-100 border-bottom mt-2 border-top-0 border-right-0 border-left-0 rounded-0 pt-2  h-80">
        <div className="w-100 pt-2">
          <h3 class="card-title ml-4 d-inline text-truncate mt-4">Users</h3>{" "}
          <div class="d-inline" style={{ color: "#ababab" }}>
            ( {this.state.userList.length} Total )
          </div>
          <div class="float-right">
          <button type="button" class="btn btn-outline-secondary m-2"><i class="fas fa-file-upload mr-1"></i>Upload list</button>|
          <button type="button" class="btn btn-outline-secondary m-2"><i class="far fa-file-excel mr-1"></i>Export</button>|
          <button type="button" class="btn btn-outline-secondary m-2 "><i class="far fa-trash-alt mr-1"></i>Delete all</button>
          </div>
        </div>
      </div>
    );
    const displayList = (
      <div class="card rounded-0 " style={{ height: "78.8vh" }}>
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
                class="filter-sort-icon input-group-text bg-white  border-top-0"
                id="inputGroupPrepend"
              >
                <i class="fa fa-filter text-muted" aria-hidden="true" />
              </span>
            </div>
            <div class="input-group-prepend">
              <span
                class="filter-sort-icon input-group-text bg-white  border-top-0"
                id="inputGroupPrepend"
              >
                <i class="fa fa-sort text-muted" aria-hidden="true" />
              </span>
            </div>
          </div>
        </nav>
        <div class=" listGroup-scroll">
          <ul class="list-group listGroup-scroll" name="UserList">
            {this.state.userList.map((data, index) => {
              return (
                <>
                  <li
                    onClick={this.GetUserById.bind(this, data.id)}
                    name={data.id}
                    id={data.id}
                    action
                    className={
                      this.state.userId === data.id
                        ? "list-group-item rounded-0 border-right-0 pl-2 pr-0 pt-2 pb-2 active"
                        : "list-group-item rounded-0 border-right-0 pl-2 pr-0 pt-2 pb-2 "
                    }
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
                            <div
                              class="row"
                              style={{
                                fontWeight: "500",
                                fontFamily: "Arial, Helvetica, sans-serif"
                              }}
                            >
                              {" "}
                              <i
                                class="fas fa-circle pl-0 pt-2 pb-2 pr-2"
                                style={{ fontSize: ".75rem", color: "green" }}
                              />{" "}
                              {data.firstName} {data.lastName}
                            </div>
                            <div
                              class="row text-truncate mr-2 ml-1"
                              style={{
                                fontSize: "1.70vh",
                                color: "#00568F",
                                fontFamily: "Arial, Helvetica, sans-serif"
                              }}
                            >
                              {data.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              );
            })}
          </ul>
            <>{this.showUserAddButton()}</>
         
        </div>
      </div>
    );
    return (
      <>
 <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
              </AlertBanner>
        {headerCard}
        <div class="container-fluid pl-0">
          <div class="row">
            <div class="col-sm-4 pr-0">{displayList} </div>
            <div class="col-sm-8 pl-4">
              <div class="pl-0 pr-1 pt-1 pb-1 mb-2">
                <div class="row">
                  <div class="col-sm-1 mt-2 pl-0">
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
                  <div class="col-sm-11 mt-1 pl-0">
                    <div class="row">
                      <div
                        class="col-sm-9"
                        style={{ fontWeight: "700", fontSize: "2.5vh" }}
                      >
                        {" "}
                        {this.state.firstName} {this.state.lastName}{" "}
                      </div> 
                      <div  class="col-sm-3">              
                      <span className="mr-2" style={{fontSize: "2vh" }}>
                        <i
                          class="fas fa-unlock-alt mr-2"
                          style={{ color: " #55565a" }}
                        />
                        Reset Password
                      </span>
                      {this.showUserDeleteButton()}
                      </div>  
                    </div>
                    {/* <h6 style={{ color: " #55565a" }}>Analyst</h6> */}
                  </div>
                </div>
              </div>
              <div
                class="card rounded-0 border-0 shadow-sm p-3 listGroup-scroll"
                style={{ height: "60vh" }}
              >
                {this.mappingCard()}
              </div>

              <div class="card-footer bg-white" style={{ height: "8.5vh" }}>
                {this.showUserEditButton()}
              </div>

              <Modal
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={this.state.modalShow}
                onHide={this.handleClose.bind(this)}
              >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter card-header">
                    Add User
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body >{this.addUserHtml()}</Modal.Body>
              
                <div class="card-footer bg-white">
                  <button
                    type="button"
                    class="common-button btn btn-dark float-right mr-2 mb-2"
                    onClick={this.addUser.bind(this)}
                    name="AddSave"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    class=" btn btn-light float-right mr-4 mb-2"
                    onClick={this.handleClose.bind(this)}
                  >
                    Cancel
                  </button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withGlobalState(UserList);
