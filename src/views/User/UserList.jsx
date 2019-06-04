/**
 * BFLOW: User Profile UI
 * Components Name: Create User, Update User, Alert Banner
 */

import React, { Component } from "react";
import {
  Modal,Button
} from "react-bootstrap";
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import AlertBanner from '../../components/AlertBanner/index'
import { withGlobalState } from 'react-globally'

//used for role method
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";

import LoadingOverlay from 'react-loading-overlay';
import ContentLoader, { Facebook } from 'react-content-loader'
// import d from '../../components/Loader/ContentLoaderCustom'
class UserList extends Component {
  constructor(props, context) {
    super(props, context);

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
      showDeleteModal: false,
      showUserAddButton:false,
      showUserEditButton:false,
      showUserDeleteButton:false,

    };
    this.handleCloseDeleteAndDeleteUser = this.handleCloseDeleteAndDeleteUser.bind(this);
    this.handleShowDelete = this.handleShowDelete.bind(this);
    this.handleCloseDelete = this.handleCloseDelete.bind(this);
   
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
    this.props.setGlobalState({ IsLoadingActive: true });
    const responseJson = await BFLOWDataService.get('Users');

    if(responseJson.length===0){
      this.props.setGlobalState({ IsLoadingActive: false });
    }

  if(responseJson.length>0)
  { this.props.setGlobalState({ IsLoadingActive: false });}

    this.setState({ userList: responseJson });

    if (
      responseJson !== undefined &&
      responseJson !== null &&
      responseJson !== ""
    ) {
      if(this.state.userId!=="" && this.state.userId!==null && this.state.userId!==undefined){
        this.getUserById(this.state.userId) //get selected user from the list
      }
      else{
        //get first user from the list
        this.getUserById(responseJson[0].id);
     }
    }
  }

  async GetTimeZone(){
    const responseJson = await BFLOWDataService.get('Timezone');
    this.setState({timezonelist:responseJson})
 }

  /*Method to close popup*/
  handleClose() {
    this.setState({ modalShow: false });
    this.getUserById(this.state.userId);
    this.ResetStateValues();
  }
  /*Method to handle change event of all elements*/
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }


  handleCloseDeleteAndDeleteUser() {
    this.setState({ showDeleteModal: false });
    this.DeleteUser();
  }
  handleCloseDelete() {
    this.setState({ showDeleteModal: false });
  }
  handleShowDelete() {
    this.setState({ showDeleteModal: true });
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
        Email: this.state.email.toLowerCase(),
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
  async getUserById(userid) {
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
    // if (window.confirm("Do you wish to delete this item?")){
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
    // }
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
    ;
    if (this.state.timeZoneId==="" || this.state.timeZoneId===null || this.state.timeZoneId===undefined) {
      this.setState({ errorTimeZoneid: TimeZoneErrMsg });
      blError = false;
    }
    return blError;
  }


DeleteUserModal()
{

  return(
<>
    <Modal show={this.state.showDeleteModal} onHide={this.handleCloseDelete}>
    <Modal.Header closeButton>
      <Modal.Title>Modal heading</Modal.Title>
    </Modal.Header>
    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={this.handleCloseDelete}>
        Close
      </Button>
      <Button variant="primary" onClick={this.handleCloseDelete}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
  </>
  )
}


  

   EditUserHtml() {
    return (
      <>
        <div className="">
          <div className="add-user-heading" />

          <div class="m-0 border-0 " style={{fontWeight:"500", lineHeight: "1rem"}}>
          Basic Details
          </div>
          <hr />

          <div class="row pl-3 pr-3 pt-0 pb-0">
            <div>
              <div class="row">
                <div class="col-sm-4">
                  {/* <Form.Label>First Name</Form.Label> */}
                  <label className={this.state.errorFName===""?"label m-0 mandatory":"error-label label m-0 mandatory"} 
                  style={{lineHeight: "0.9375rem",fontSize:"0.75rem",color: "#ababab"}} >First Name</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    aria-describedby="inputGroupPrepend"
                    style={{ lineHeight: "1rem", color: "#55565a" }}
                    value={this.state.firstName}
                    onChange={this.handleChange.bind(this)}
                    name="firstName"
                    id="FirstName"
                    className={this.state.errorFName===""?"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"}
                  />
                  <div className="errorMsg">{this.state.errorFName}</div>
                </div>
                <div class="col-sm-4">
                  <label className={this.state.errorLName===""?"label m-0 mandatory":"error-label label m-0 mandatory"} 
                  style={{lineHeight: "0.9375rem", fontSize:"0.75rem",color:"#ababab"}}>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    aria-describedby="inputGroupPrepend"
                    style={{ lineHeight: "1rem",color: "#55565a" }}
                    value={this.state.lastName}
                    onChange={this.handleChange.bind(this)}
                    name="lastName"
                    id="LastName"
                    className={this.state.errorLName===""?"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"}
                  />
                  <div className="errorMsg">{this.state.errorLName}</div>
                </div>
                <div class="col-sm-4">
                  <label className={this.state.errorEmail===""?"label m-0 mandatory":"error-label label m-0 mandatory"} 
                  style={{lineHeight: "0.9375rem",fontSize:"0.75rem",color:"#ababab" }}>Email</label>
                  <input
                    type="text"
                    placeholder="Email"
                    aria-describedby="inputGroupPrepend "
                    style={{ lineHeight: "1rem",color: "#55565a" }}
                    value={this.state.email}
                    onChange={this.handleChange.bind(this)}
                    name="email"
                    id="Email"
                    className={this.state.errorEmail===""?"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"}
                  />
                  <div className="errorMsg">{this.state.errorEmail}</div>
                </div>
                <div class="col-sm-4">
                  <label className={this.state.errorUserName===""?"label m-0 mandatory":"error-label label m-0 mandatory"} 
                  style={{lineHeight: "0.9375rem",fontSize:"0.75rem",color:"#ababab" }}>Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend "
                    style={{lineHeight: "1rem", color: "#55565a" }}
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
          <div class="m-0 border-0 " style={{lineHeight: "1rem",fontWeight:"500"}}>
          Allocation Details
          
          </div>
            <hr />
            <div class="row pl-3 pr-3 pt-0 pb-0">
              <div class="col-sm-4 pl-0">
                <label  className={this.state.errorTimeZoneid===""?"label m-0 mandatory":"error-label label m-0 mandatory"} 
                style={{lineHeight: "0.9375rem",fontSize:"0.75rem",color: "#ababab"}}>Time Zone</label>
                <select
                     style={{ lineHeight: "1rem",color: "#55565a" }}
                     class="form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"
                  id="TimeZone"
                  name="timeZoneId"
                  value={this.state.timeZoneId}
                  onChange={this.handleChange.bind(this)}
                  className={this.state.errorTimeZoneid===""?"form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0":"error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"}
                >
                  <option value="">Select Time Zone</option>
                  {this.state.timezonelist.map((data, index) => {
                    if (data.isActive===true) {
                      return (
                        <option value={data.id}>{data.timeZoneName}</option>
                      );
                    }
                  })}
                </select>

                <div className="errorMsg">{this.state.errorTimeZoneid}</div>
              </div>
              <div class="col-sm-4">
                <label class="label m-0" style={{lineHeight: "0.9375rem",fontSize:"0.75rem",color: "#ababab"}}>Manager</label>
                <select
                     style={{ lineHeight: "1rem",color: "#55565a" }}
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
          <div class="border-0 " style={{ fontWeight:"500", fontSize: "1rem", lineHeight: "1rem"}}>
          Basic Details
          </div>
          <hr />
          <div class="row pl-3 pr-3 pt-0 pb-0">
            <div>
              <div class="row " style={{padding: "1.25rem"}}>
                <div class="col-sm-12">
                  {/* <Form.Label>First Name</Form.Label> */}
                  <label className={this.state.errorFName === "" ? "mandatory" : "error-label mandatory"} 
                  style={{color: "#ababab",fontSize: "0.75rem", marginBottom:"0px"}} >First Name</label>
                  <input
                
                    type="text"
                    placeholder="First Name"
                    aria-describedby="inputGroupPrepend"
                    style={{ color: "#55565a", padding: "0" }}
                    class={this.state.errorFName===""?" form-control border-top-0 border-right-0 border-left-0 rounded-0":"  error-textbox  form-control border-top-0 border-right-0 border-left-0 rounded-0"}
                    value={this.state.firstName}
                    onChange={this.handleChange.bind(this)}
                    name="firstName"
                    id="FirstName"
                  />
                  <div className="errorMsg">{this.state.errorFName}</div>
                </div>
                <div class="col-sm-12">
                  <label className={this.state.errorLName === "" ? "mandatory" : "error-label mandatory"}
                   style={{color: "#ababab",fontSize: "0.75rem", marginBottom:"0px"}}>Last Name</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    aria-describedby="inputGroupPrepend"
                    style={{ color: "#55565a", padding: "0" }}
                    class={this.state.errorLName===""?"form-control border-top-0 border-right-0 border-left-0 rounded-0":"  error-textbox form-control border-top-0 border-right-0 border-left-0 rounded-0"}
                    value={this.state.lastName}
                    onChange={this.handleChange.bind(this)}
                    name="lastName"
                    id="LastName"
                  />
                  <div className="errorMsg">{this.state.errorLName}</div>
                </div>
                <div class="col-sm-12">
                  <label className={this.state.errorEmail === "" ? "mandatory" : "error-label mandatory"} 
                  style={{color: "#ababab",fontSize: "0.75rem", marginBottom:"0px"}}>Email</label>
                  <input
                    type="text"
                    placeholder="Email"
                    aria-describedby="inputGroupPrepend "
                    style={{ color: "#55565a", padding: "0" }}
                    class={this.state.errorEmail===""?" form-control border-top-0 border-right-0 border-left-0 rounded-0":"  error-textbox  form-control border-top-0 border-right-0 border-left-0 rounded-0"}
                    value={this.state.email}
                    onChange={this.handleChange.bind(this)}
                    name="email"
                    id="Email"
                  />
                  <div className="errorMsg">{this.state.errorEmail}</div>
                </div>
                <div class="col-sm-12">
                <label className={this.state.errorUserName === "" ? "mandatory" : "error-label mandatory"}
                 style={{color: "#ababab",fontSize: "0.75rem", marginBottom:"0px"}}>Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    aria-describedby="inputGroupPrepend "
                    style={{ color: "#55565a", padding: "0" }}
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
          <div class="m-0 border-0 " style={{fontWeight:"500",fontSize: "1rem", lineHeight:"1rem"}}>
          Allocation Details
          
          </div>
           
            <hr />

            <div class="row pl-3 pr-3 pt-0 pb-0">
              <div class="col-sm-5">
                <label className={this.state.errorTimeZoneid === "" ? "mandatory" : "error-label mandatory"} 
                style={{color: "#ababab",fontSize: "0.75rem", marginBottom:"0px"}}>Time Zone</label>
                <select
                     style={{ color: "#55565a", padding: "0" }}
                     class={this.state.errorTimeZoneid===""?" form-control border-top-0 border-right-0 border-left-0 rounded-0":"  error-textbox  form-control border-top-0 border-right-0 border-left-0 rounded-0"}
                  id="TimeZone"
                  name="timeZoneId"
                  value={this.state.timeZoneId}
                  onChange={this.handleChange.bind(this)}
                >
                  <option>Select Time Zone</option>
                  {this.state.timezonelist.map((data, index) => {
                    if (data.isActive===true) {
                      return (
                        <option value={data.id}>{data.timeZoneName}</option>
                      );
                    }
                  })}
                </select>

                <div className="errorMsg">{this.state.errorTimeZoneid}</div>
              </div>
              <div class="col-sm-5  ">
                <label class="label m-0" style={{fontSize:"0.75rem",color: "#ababab", marginBottom:"0px"}}>Manager</label>
                <select
                     style={{ color: "#55565a", padding: "0" }}
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
  
  setTimeout(
      function () {
        
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
    class="rounded-circle btn add-button-list-view  "
    name="btnAddUser"
    style={{
      backgroundColor: "#00568f",
      borderRadius: "50%",
      boxShadow: "0 0.0625rem 0.75rem rgba(0, 0, 0, .3)",
      height: "2.25rem",
      width: "2.25rem",
      padding: "0",
      border: "0"
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
                  class="common-button btn-dark float-right mr-2 mb-2"
                  id="Update"
                  name="AddUpdate"
                  onClick={this.updateUser.bind(this)}
                  style={{ borderRadius: "0.25rem", width: "5.25rem", height: "2rem",  border: "0.0625rem solid transparent"}}
                >
                  Update
                </button>
                <button
                  type="button"
                  class=" btn-light float-right mr-4 mb-2"
                  id="Reset"
                  name="btnReset"
                  variant="outline-secondary"
                  onClick={() => this.setState({ modalShow: false },()=>{
                          this.getUserById(this.state.userId)
                      })
                    }
                    style={{ borderRadius: "0.21875rem",width: "4.1875rem",height: "1.9375rem",border: "0.0625rem solid #dedfe0"}}
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
      onClick={this.handleShowDelete}
     
      style={{ color: " #55565a" ,fontSize: "2vh" }}
    />
  </>
);
  }
}
  render() {

    const Loader = () => (
      <ContentLoader 
      height={40}
      width={400}
      speed={2}
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
    >
      <rect x="41" y="5" rx="4" ry="4" width="343" height="7" /> 
      <circle cx="17" cy="17" r="17" /> 
      <rect x="41" y="21" rx="4" ry="4" width="343" height="7" />
    </ContentLoader>
    )


const UserListLoader=() => (
  <div class="list-card-Loading">
<div class="p-3">
    <Loader />
</div>
<div class="p-3">
<Loader />

</div>
<div class="p-3">
<Loader />

</div>
<div class="p-3">
<Loader />

</div>
<div class="p-3">
<Loader />

</div>
<div class="p-3">
<Loader />

</div>
<div class="p-3">
<Loader />

</div>
<div class="p-3">
<Loader />

</div>

</div>
)


const UserList=()=>(    <div class="scrollbar">
<ul class="list-group scrollbar" name="UserList">
  {this.state.userList.map((data, index) => {
    return (
      <>
    
        <li
          onClick={this.getUserById.bind(this, data.id)}
          name={data.id}
          id={data.id}
          className={
            this.state.userId === data.id
              ? "list-group-item rounded-0 border-right-0 pl-2 pr-0 pt-2 pb-2 active"
              : "list-group-item rounded-0 border-right-0 pl-2 pr-0 pt-2 pb-2 "
          }
        >
          <div class="row">
            <div class="col-sm-2" style={{ alignSelf: "center"}}>
              <button
                type="button"
                class="btn-primary rounded-circle float-right"
                disabled
                style={{ backgroundColor: "#273a92", borderRadius: "50%",width: "1.5rem",height: "1.5rem",borderColor: "#000080",fontSize: "0.625rem",
                  padding: "0",position: "relative",bottom: "0.25rem",border:" 1px solid transparent" }}
              >
                A
              </button>
            </div>

            <div class="col-sm-10 mt-1">
              <div class="row">
                <div class="col-sm-9">
                  <div
                    class="row"
                    style={{fontSize: "0.875rem",alignItems:"center",fontWeight: "500",fontFamily: "Arial, Helvetica, sans-serif"}}
                  >
                    {" "}
                    <i
                      class="fas fa-circle pl-0 pt-2 pb-2 pr-2"
                      style={{ borderRadius: "50%",
                        fontSize: "0.5rem",
                        color: "#78be20" }}
                    />{" "}
                    {data.firstName} {data.lastName}
                  </div>
                  <div
                    class="row text-truncate mr-2 ml-1"
                    style={{fontSize: "0.75rem",color: "#00568f",fontFamily: "Arial, Helvetica, sans-serif"}}
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

</div>);

    //const { validated } = this.state;
    const headerCard = (
      <div class="card w-100 border-bottom border-top-0 border-right-0 border-left-0 rounded-0  h-60" 
      style={{ height: "3.75rem", letterSpacing: "0.018rem",padding: "15px" }}>
        <div className="w-100" style={{ }}>
          <h5 class="card-title d-inline text-truncate mt-2" style={{fontSize: "1.5rem"}}>Users</h5>{" "}
          <div class="d-inline" style={{ color: "#ababab" }}>
            ({this.state.userList.length} Total)
          </div>
          <div class="float-right" style={{ position: "relative", bottom: "0.875rem"}}>
          <button type="button" class="btn btn-outline-secondary m-2"><i class="fas fa-file-upload mr-1"></i>Upload list</button>|
          <button type="button" class="btn btn-outline-secondary m-2"><i class="far fa-file-excel mr-1"></i>Export</button>|
          <button type="button" class="btn btn-outline-secondary m-2 "><i class="far fa-trash-alt mr-1"></i>Delete all</button>
          </div>
        </div>
      </div>
    );
    const displayList = (
      <div class="card rounded-0 list-card-user" >
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
                <i class="fa fa-search text-muted" aria-hidden="true" style={{ fontSize:" 0.75rem"}}/>
              </span>
            </div>
            <div class="input-group-prepend">
              <span
                class="filter-sort-icon input-group-text bg-white  border-top-0"
                id="inputGroupPrepend"
              >
                <i class="fa fa-filter text-muted" aria-hidden="true" style={{ fontSize:" 0.75rem"}} />
              </span>
            </div>
            <div class="input-group-prepend">
              <span
                class="filter-sort-icon input-group-text bg-white  border-top-0"
                id="inputGroupPrepend"
              >
                <i class="fa fa-sort text-muted" aria-hidden="true" style={{ fontSize:" 0.75rem"}}/>
              </span>
            </div>
          </div>
        </nav>
        
        {(this.props.globalState.IsLoadingActive)?  <UserListLoader /> : <UserList /> }


      </div>
    );
    return (
      <>
 <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
              </AlertBanner>
        {headerCard}
        <div class="container-fluid pl-0">
          <div class="row">
            <div class="col-sm-4 pr-0 ">
            
            {/* <LoadingOverlay
  active={this.props.globalState.IsLoadingActive}
  spinner
  text='Loading Users...'
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
  
  }}
  > */}
            {displayList}
            
            {/* </LoadingOverlay> */}
             </div>
            <div class="col-sm-8" style={{paddingLeft: "1.25rem"}}>
              <div class="pl-0 pr-1 pt-1 pb-1 mb-2">
                <div class="row" style={{alignItems: "center"}}>
                  <div class="col-sm-1 mt-2 pl-0">
                    <button
                      type="button"
                      class="btn-primary rounded-circle float-right"
                      disabled
                      style={{ backgroundColor: "#273a92",borderColor: "#000080",fontSize: ".75rem",border: "1px solid transparent"}}
                    >
                      A
                    </button>
                  </div>
                  <div class="col-sm-11 mt-1 pl-0">
                    <div class="row">
                      <div
                        class="col-sm-9"
                        style={{ fontWeight: "700", fontSize: "1.25rem" }}
                      >
                        {" "}
                        {this.state.firstName} {this.state.lastName}{" "}
                      </div> 
                      <div  class="col-sm-3" style={{height: "2rem"}}>              
                      <span className="mr-2" style={{fontSize: "0.875rem",color: "#55565a" }}>
                        <i
                          class="fas fa-unlock-alt mr-2"
                          style={{ color: "#55565a" }}
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
                class="card rounded-0 border-0 shadow-sm scrollbar"
                style={{ padding: "1.25rem", height: "60vh" }}
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
                    class="common-button btn-dark float-right mr-2 mb-2"
                    onClick={this.addUser.bind(this)}
                    name="AddSave"
                  style={{borderRadius: "0.25rem",width: "7.5rem",height: "2rem",border: "0.0625rem solid transparent"}}>
                    Save
                  </button>
                  <button
                    type="button"
                    class=" btn-light float-right mr-4 mb-2"
                    onClick={this.handleClose.bind(this)}
                  style={{ borderRadius: "0.21875rem",width: "4.1875rem",height: "1.9375rem",border: "0.0625rem solid rgb(222, 223, 224)"}}>
                    Cancel
                  </button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
        <>
    <Modal show={this.state.showDeleteModal} onHide={this.handleCloseDelete}>
    <Modal.Header closeButton>
      <Modal.Title>Delete User</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div class="ml-5">
      <div>You have requested to reset the password for</div>
      <div> <b>{this.state.firstName} {this.state.lastName}</b>. Upon conï¬rmation, the user will</div>
      <div>receive an email with a link to a form to reset</div>
      <div>his own password. </div>


      <div class="mt-2">Please make sure that the email address </div>
      <div><b>{this.state.email}</b> is correct before </div>
      <div>continuing. Are you sure you want to continue ?</div>
      </div>
 </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={this.handleCloseDelete}>
        Cancel
      </Button>
      <Button variant="primary" onClick={this.handleCloseDeleteAndDeleteUser}>
       Delete
      </Button>
    </Modal.Footer>
  </Modal>
  </>
      </>
    );
  }
}
export default withGlobalState(UserList);
