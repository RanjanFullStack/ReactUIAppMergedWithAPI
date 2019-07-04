import React, { Component } from 'react';
import { Button, Modal, Alert, Tab, Tabs } from 'react-bootstrap';

import './Role.css'


import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";
import { withGlobalState } from 'react-globally'
import editIcon from '../../assets/fonts/edit.svg';
import confirmIcon from '../../assets/fonts/confirm.svg';
import cancelIcon from '../../assets/fonts/cancel.svg';
import DeleteIcon from '../../assets/fonts/Delete_icon.svg';

import document from '../../assets/fonts/document-grey.svg';
import effortmanagement from '../../assets/fonts/effort_management-grey.svg';
import request from '../../assets/fonts/request-grey.svg';
import usermanagement from '../../assets/fonts/user_management-grey.svg';
import Preperences from '../../assets/fonts/Preperences_grey.svg';
import Settings from '../../assets/fonts/Settings_grey.svg';
import AlertBanner from '../../components/AlertBanner/index'

let UserMappedId = [];
let MapUserWithRoles = []

class Role extends Component {
  constructor(props) {

    super(props)
    this.state = {
      Rolelist: [],
      AllRolelist: [],
      UserList: [],
      AllUserList: [],
      AllUserListbyRole: [],
      Rolelistbyid: [],
      RoleName: '',
      RoleId: 0,
      isRoleActive: false,
      ErrorMesage: '',
      ErrorMesageType: '',
      showRoleTextbox: false,
      show: false,
      isDefault: false,
      Name: '',
      SelectAll: false,
      disableButton: false,
      checkedItems: new Map(),
      showFeatures: '',
      FeaturesList: [],
      MainFeaturesList: [],
      showFeaturesView: '',
      errorName: '',
      showErrorMesage: false,
      errorMessageType: '',
      errorMessage: '',
      isNotifiedOnCreateRequest:false,
      isNotifiedOnCreateRequestupdate:false,
    }
    this.searchHandler = this.searchHandler.bind(this);
    this.searchUserHandler = this.searchUserHandler.bind(this);
  }

  componentDidMount() {
    this.GetRole()
    this.GetUser()
    this.getFeatures();
  }


  async GetRole() {
    const responseJson = await BFLOWDataService.get('Role');


    this.setState({ AllRolelist: responseJson })
    this.setState({ Rolelist: responseJson })
   
    if (responseJson.length > 0 && this.state.RoleId===0) {
      this.setState({ RoleName: responseJson[0].name })
      this.setState({ RoleId: responseJson[0].id })
      this.setState({ isRoleActive: responseJson[0].isActive })
      this.getRoleByID(responseJson[0].id);
      this.setState({isNotifiedOnCreateRequestupdate:responseJson[0].isNotifiedOnCreateRequest})
      this.setState({isDefault:responseJson[0].isDefault})
      this.setState({ disableButton: false })
    }
    else if(this.state.RoleId!==0){
      this.whileupdategetrolebyid(this.state.RoleId);
    }
    else {
      this.setState({ disableButton: true });
    }

  }

  SetRoleIdandName(id, name, isActive,isNotified,_isDefault) {
    UserMappedId = [];
    MapUserWithRoles = [];
    //this.setState({FeaturesList:[]})
    this.getFeatures();
    this.setState({RoleName:name})
    this.setState({RoleId:id})
    this.setState({isRoleActive:isActive})
    this.setState({RoleValue:name})
    this.setState({SelectAll: false})
    this.setState({isNotifiedOnCreateRequestupdate:isNotified})
    this.setState({isDefault:_isDefault})
    //this.getFeatures();
    this.getRoleByID(id);
    this.GetUser();


  }

  async getFeatures() {
    const responseJson = await BFLOWDataService.get('Features');
    this.setState({ FeaturesList: responseJson, MainFeaturesList: responseJson });

    let test = [];
    let list = this.state.FeaturesList;
    test = list.map((data, key) => {
      data.features.map((featuresdata, featureskey) => {
        featuresdata.mapRoleWithFeatures.filter((item) => {
          let id = this.state.RoleId;
          let roleId = item.roleId

          if (roleId === id) {
            return list[key].features[featureskey].isMapped = true;
          }
          else {
            return data;
          }
        });

      })
    })

    test = this.state.FeaturesList;
    this.setState({ FeaturesList: test });
  }

  async  whileupdategetrolebyid(id){
    const responseJson = await BFLOWDataService.getbyid('Role', id);
    this.setState({ RoleName: responseJson.name })
    this.setState({ RoleId: responseJson.id })
    this.setState({ isRoleActive: responseJson.isActive })
    this.getRoleByID(responseJson.id);
    this.setState({isNotifiedOnCreateRequestupdate:responseJson.isNotifiedOnCreateRequest})
    this.setState({ disableButton: false })

  }

  async  getRoleByID(id) {    
    const responseJson = await BFLOWDataService.getbyid('Role', id);
    this.setState({ Rolelistbyid: responseJson,
      RoleValue :responseJson.name,
      RoleName: responseJson.name
    })

  }




  // Search Attributes List
  searchHandler(event) {

    let searcjQery = event.target.value.toLowerCase();
    const displayedContacts = this.state.AllRolelist.filter((el) => {
      let searchValue = el.name.toLowerCase();
      return searchValue.indexOf(searcjQery) !== -1;
    })
    if (searcjQery !== "") {
      this.setState({
        Rolelist: displayedContacts
      })
    }
    else {
      this.setState({
        Rolelist: this.state.AllRolelist
      })
    }

  }

  ShowRoleEdit() {
    this.setState({ showRoleTextbox: false })
  }

  handelchange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value })

  }
  OpenModel() {
    this.setState({Name:""})
    this.setState({ show: true })
  }
  //Close pop
  handleClose() {
    this.setState({
      show: false,
      errorName: ''
    })
  }

  ShowDeleteIcon() {
    if (this.state.isDefault === false) {
      return (  
        <>
      <div className="d-inline float-right">
      <i className="text-muted cursor-pointer" onClick={this.DeleteRole.bind(this)} ><img src={DeleteIcon} /></i> </div>
      <label className="px-1 text-secondary float-right"> | </label>
      </>
    )
    }
  }

  showFeatures(name) {
    if (this.state.showFeaturesView === name) {
      this.setState({ showFeaturesView: '' })
    }
    else {
      this.setState({ showFeaturesView: name })
    }

  }


  ShowtextEditRole() {

    if (this.state.showRoleTextbox === true) {
      return (



        <div class="h-25">

          <input type="text"

            placeholder="Enter Name"

            value={this.state.RoleValue}
            onChange={this.handelchange.bind(this)}
            name="RoleValue"
            class="form-control form-control-no-border rounded-0 border-right-0 border-left-0  border-top-0 w-50 d-inline pl-2" />


          <i onClick={this.ShowRoleEdit.bind(this)} className="text-muted d-inline cursor-pointer"> <img src={cancelIcon} alt="cancelIcon" /></i>
          <i disabled={this.state.Rolelist.length === 0} onClick={this.EditRole.bind(this)} className="text-muted d-inline cursor-pointer"> <img src={confirmIcon} alt="confirmIcon" /></i>
        </div>

      )
    } else {

      return (


        <>


          <h5 class="text-truncate text-muted d-inline pl-2">{this.state.RoleName}</h5>
          {this.ShowDeleteIcon()}
          <div className="d-inline float-right">

           
            <div className="d-inline float-right">
              <i className="text-muted cursor-pointer" onClick={this.ShowRoletextEdit.bind(this)} ><img src={editIcon} /></i> </div>
            <div className="d-inline float-right"></div>
 <label className="px-1 text-secondary float-right"> | </label>
            <label class="switch float-right mt-1" title="Is Notified On Create Request">
                           <input type="checkbox"  checked={this.state.isNotifiedOnCreateRequestupdate}  onChange={this.updateNotifiedOnCreateReques.bind(this)} />
                           <span class="slider round"></span>
                        </label>

          </div>
        </>
      )
    }

  }

  ShowRoletextEdit() {

    if (this.state.showRoleTextbox === true)
      this.setState({ showRoleTextbox: false })
    else {
      this.setState({ showRoleTextbox: true })
      this.setState({ RoleValue: this.state.RoleName })
    }
  }
  /*Method to validate Role*/
  ValidateForm() {
    let blError = false;
    const NameErrMsg = process.env.REACT_APP_ROLE_ERROR_NAME;
    if (this.state.Name === null || this.state.Name === '' || this.state.Name === undefined) {
      this.setState({ errorName: NameErrMsg });
      blError = true;
    }
  
    return blError;
  }

  ValidateFormEditRole() {
    let blError = false;
    const NameErrMsg = process.env.REACT_APP_ROLE_ERROR_NAME;
    if (this.state.RoleValue === null || this.state.RoleValue === '' || this.state.RoleValue === undefined) {
      this.setState({ errorName: NameErrMsg });
      blError = true;
    }
  
    return blError;
  }

  async  AddRole() {
    var value = this.ValidateForm();
    if (value === false) {
      var today = new Date(),
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      const body = JSON.stringify({
        Name: this.state.Name,
        IsNotifiedOnCreateRequest:this.state.isNotifiedOnCreateRequest
      });
      const response = await BFLOWDataService.post('Role', body);
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
        this.GetRole()
      }
      this.handleClose();
      this.setTimeOutForToasterMessages();
    }

  }


  async EditRole() {
    var value = this.ValidateFormEditRole();
    if (value === false) {
      const body = JSON.stringify({ Name: this.state.RoleValue,IsNotifiedOnCreateRequest: this.state.isNotifiedOnCreateRequestupdate });
        
      const response = await BFLOWDataService.put('Role', this.state.RoleId, body);
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
          errorMessageType: 'success',
          showtextbox: false,
          showRoleTextbox: false
        
        });
        this.GetRole()
      }
      this.handleClose();
      this.setTimeOutForToasterMessages();
    }
    
  }

  async updateNotifiedOnCreateReques(){
    
    this.setState({isNotifiedOnCreateRequestupdate:!this.state.isNotifiedOnCreateRequestupdate})
    const body = JSON.stringify({ Name: this.state.RoleValue ,IsNotifiedOnCreateRequest: !this.state.isNotifiedOnCreateRequestupdate });
    const response = await BFLOWDataService.put('Role', this.state.RoleId, body);
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
        errorMessageType: 'success',
        showtextbox: false,
        showRoleTextbox: false
      });
      this.GetRole();
    }
    this.handleClose();
    this.setTimeOutForToasterMessages();
  
  }

  async DeleteRole() {
    if (window.confirm("Do you wish to delete this item?")) {
      const response = await BFLOWDataService.Delete('Role', this.state.RoleId);
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
        this.GetRole()
      }
      this.setTimeOutForToasterMessages();
    }
  }

  async GetUser() {

    const responseJson = await BFLOWDataService.get('Users');
    UserMappedId = [];
    MapUserWithRoles = [];
    this.setState({ AllUserList: responseJson })
    this.setState({ UserList: responseJson })
    this.setState({ AllUserListbyRole: responseJson })
    this.setState({ SelectAll: false })
    this.state.UserList.map((data, key) => {


      data.roles.filter((item) => {

        let username = data.userName;
        let id = this.state.RoleId;
        let roleId = item.roleId

        if (roleId === id) {
          UserMappedId.push(data.id);
        }
      });
    })


  }

  handlefeaturesCheck(event) {

    let item = parseInt(event.target.name);
    const isChecked = event.target.checked;
    if (this.state.Rolelist.length === 0) {
      return;
    }
    let test = [];
    let list = this.state.FeaturesList;
    test = list.map((data, key) => {
      data.features.map((featuresdata, featureskey) => {
        if (featuresdata.id === item) {

          if (isChecked === true) {


            return list[key].features[featureskey].isMapped = true;
          }
          else {
            return list[key].features[featureskey].isMapped = false;
          }
        }
        return data;
      })
    })
    test = this.state.FeaturesList;
    this.setState({ FeaturesList: test })
  }

  async  Mapfeatures() {

    let MapRoleWithFeatures = [];
    this.state.FeaturesList.map((data, key) => {
      data.features.map((featuresdata, key) => {

        if (featuresdata.isMapped === true) {
          MapRoleWithFeatures.push({ "RoleId": this.state.RoleId, "FeatureId": featuresdata.id })
        }
      })
    })

    const body = JSON.stringify(MapRoleWithFeatures);
    const response = await BFLOWDataService.put('Features', this.state.RoleId, body);
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
      this.GetRole()
    }
    this.setTimeOutForToasterMessages();

  }

  handleCheck(event) {

    let item = parseInt(event.target.name);
    const isChecked = event.target.checked;
    if (this.state.Rolelist.length === 0) {
      return;
    }
    if (isChecked === true) {
      UserMappedId.push(item);

      for (var i = 0; i < this.state.UserList.length; i++) {
        let { id } = this.state.UserList[i];

        if (id === item) {
          var roles = this.state.AllUserListbyRole[i]["roles"];

          if (roles.length > 0 && roles[0].roleId !== 0) {
            for (var j = 0; j < roles.length; j++) {
              var rolesArray = this.state.AllUserListbyRole[i]["roles"][j];
              if (rolesArray.roleId === 0) {

                for (var k = 0; k < this.state.AllUserListbyRole[j]["roles"].length; k++) {
                  let { roleId } = this.state.AllUserListbyRole[j]["roles"][k];
                  if (roleId === this.state.RoleId) {
                    this.state.AllUserListbyRole[j]["roles"][k]["roleId"] = this.state.RoleId;
                    break;
                  }


                }
              }
              else {
                this.state.AllUserListbyRole[i]["roles"].push({ "roleId": this.state.RoleId });
                break;
              }

            }
          }
          else {
            this.state.AllUserListbyRole[i]["roles"].push({ "roleId": this.state.RoleId });
            break;
          }


        }
      }

      this.setState({ UserList: this.state.AllUserListbyRole })

    }
    else {
      var listofproject = UserMappedId.filter(x => x === item)
      UserMappedId = UserMappedId.filter(function (item) {
        return listofproject.indexOf(item) === -1;
      })
      var userlist = this.state.UserList;
      for (var j = 0; j < userlist.length; j++) {
        let { id } = userlist[j];

        if (id === item) {
          for (var k = 0; k < this.state.AllUserListbyRole[j]["roles"].length; k++) {
            let { roleId } = this.state.AllUserListbyRole[j]["roles"][k];
            if (roleId === this.state.RoleId) {
              this.state.AllUserListbyRole[j]["roles"][k]["roleId"] = 0;
              break;
            }
          }

        }
      }
      this.setState({ UserList: this.state.AllUserListbyRole })
    }


  }

  searchUserHandler(event) {

    let searcjQery = event.target.value.toLowerCase();
    const displayedContacts = this.state.AllUserListbyRole.filter((el) => {
      let searchValue = el.userName.toLowerCase();
      return searchValue.indexOf(searcjQery) !== -1;
    })
    if (searcjQery !== "") {
      this.setState({
        UserList: displayedContacts
      })
    }
    else {
      this.setState({
        UserList: this.state.AllUserListbyRole
      })
    }

  }

  async MapUser() {


    this.setState({ disableButton: true });
    UserMappedId.map((data, key) => {
      MapUserWithRoles.push({ "UserId": data, })
    });

    const body = JSON.stringify({
      Id: this.state.RoleId,
      MapUserWithRoles: MapUserWithRoles

    });
    const response = await RoleBFLOWDataService.mapUserWithRoles(body);
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
      this.GetRole()
    }
    this.handleClose();
    this.setTimeOutForToasterMessages();


  }

  SelectAllUser(event) {
    const isChecked = event.target.checked;


    if (this.state.Rolelist.length === 0) {
      return;
    }
    if (isChecked === true) {
      this.setState({ SelectAll: true })

      for (var i = 0; i < this.state.UserList.length; i++) {
        let userid = this.state.UserList[i].id;

        UserMappedId.push(userid);

        var roles = this.state.AllUserListbyRole[i]["roles"];
        if (roles.length > 0) {
          for (var k = 0; k < this.state.AllUserListbyRole[i]["roles"].length; k++) {

            let { roleId } = this.state.AllUserListbyRole[i]["roles"][k];
            if (roleId === this.state.RoleId) {
              this.state.AllUserListbyRole[i]["roles"][k]["roleId"] = this.state.RoleId;
            }
            else {
              this.state.AllUserListbyRole[i]["roles"].push({ "roleId": this.state.RoleId });
            }
          }
        }
        else {
          this.state.AllUserListbyRole[i]["roles"].push({ "roleId": this.state.RoleId });

        }



      }

      this.setState({ UserList: this.state.AllUserListbyRole })

    }
    else {
      this.setState({ SelectAll: false })
      var userlist = this.state.UserList;
      for (var j = 0; j < userlist.length; j++) {
        let { id } = userlist[j];
        var listofproject = UserMappedId.filter(x => x === id)
        UserMappedId = UserMappedId.filter(function (id) {
          return listofproject.indexOf(id) === -1;
        })
        for (var k = 0; k < this.state.AllUserListbyRole[j]["roles"].length; k++) {
          let { roleId } = this.state.AllUserListbyRole[j]["roles"][k];
          if (roleId === this.state.RoleId) {
            this.state.AllUserListbyRole[j]["roles"][k]["roleId"] = 0;

          }
        }


      }
      this.setState({ UserList: this.state.AllUserListbyRole })
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
  handleCloseErrorMessage() {

    this.setState({ showErrorMesage: false })
  }

  render() {

    return (
      <>
        <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
        </AlertBanner>

        {/* <div class="card w-100 border-bottom mt-2 border-top-0 border-right-0 border-left-0 rounded-0 pt-2  h-80">

<div class="w-100 pt-2">        
           
           <h3 class="card-title ml-4 d-inline text-truncate mt-4">Role</h3> 
          
           
          
           </div>
           
   </div> */}

        <div class="container-fluid">



          <div class="row" >
            <div class="col-sm-5   pl-0" >
              <div class="card rounded-0  bg-white" style={{ height: '78.6vh' }}>
                <nav class="navbar navbar-expand navbar-light p-0  shadow-sm ">
                  <div class="input-group">
                    <input type="text"
                      placeholder="Search"
                      aria-describedby="inputGroupPrepend"
                      name="Search"
                      onChange={this.searchHandler}
                   
                      type="text"
                      className="search-textbox form-control rounded-0 border-right-0 border-left-0 border-top-0" style={{borderBottom:" border:1px solid #CAC9C7 !important"}} />
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
                <ul class="list-group scrollbar" name="RoleList">


                  {this.state.Rolelist.map((data, key) => {

                    return (
                      //  <ListGroup.Item   action className="list-item-listview"><i class="fas fa-circle" style={{color: 'green', paddingRight:'10px',fontSize:'10px'}}></i>{data.name}</ListGroup.Item>
                      <li onClick={this.SetRoleIdandName.bind(this, data.id, data.name, data.isActive,data.isNotifiedOnCreateRequest,data.isDefault)} name={data.id} id={data.id} action className={this.state.RoleId === data.id ? 'list-group-item rounded-0 pl-2 pt-3 pb-3 text-muted text-truncate  border-left-0 border-right-0 cursor-default bf-minheight-60 active' : 'list-group-item rounded-0 pl-2 pt-3 pb-3 text-muted text-truncate  border-left-0 border-right-0 cursor-default bf-minheight-60'}><i class="fas fa-circle text-success mr-2" style={{ fontSize: ".75rem" }}></i>{data.name}
                         <label className="float-right" >{data.isDefault === true ? "Default" : ""}</label>
                      </li>
                    );

                  })}

                </ul>
                <button
                  type="button"
                  class="rounded-circle btn add-button-list-view common-button "
                  name="btnAddRole"
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
                {this.ShowtextEditRole()}



              </div>

              <Tabs defaultActiveKey="editRequestCard" id="uncontrolled-tab-example">

                <Tab
                  className="tab-content-mapping"
                  eventKey="editRequestCard"
                  title="Team Members"
                >
                  <nav class="navbar navbar-expand navbar-light p-0 border-0">
                    <div class="input-group ">
                      <input placeholder="Search" onChange={this.searchUserHandler} aria-describedby="inputGroupPrepend" name="username" type="text" class=" search-textbox form-control rounded-0 border-right-0 border-left-0 pt-1 border-top-0" />
                      <div class="input-group-prepend ">
                        <span class="search-icon input-group-text bg-white border-left-0 border-right-0 border-top-0" id="inputGroupPrepend">
                          <i class="fa fa-search text-muted" aria-hidden="true"></i>
                        </span>
                      </div>


                    </div>


                  </nav>
                  <div class="card rounded-0 border-0 shadow-sm scrollbar" style={{ height: '51vh' }}>
                    <div class="card-body p-0 border-0  ">

                      <table class="table w-95 ml-3 mr-3 " style={{ borderbottom: "1px solid #dee2e6" }}>
                        <thead>
                          <tr>

                            <th scope="col" className="border-th border-top-0"> <div class="custom-control-lg custom-control   custom-checkbox pl-5">
                              <input type="checkbox" disabled={this.state.isDefault === true} class="custom-control-input" id="customCheck1" onChange={this.SelectAllUser.bind(this)} checked={this.state.SelectAll} />
                              <label class="custom-control-label" for="customCheck1"></label>
                              <span className="">UserName</span>
                            </div> </th>
                            <th scope="col" className="pr-5 border-th border-top-0">Email</th>
                             <th scope="col" className="pr-5 border-th border-top-0">Manager</th>

                          </tr>
                        </thead>
                        <tbody>
                          {this.state.UserList.map((data, key) => {

                            let checkedlist = false;
                            data.roles.filter((item) => {
                              let id = this.state.RoleId;
                              let roleId = item.roleId

                              if (roleId === id) {

                                checkedlist = true;
                              }

                            });
                            return (
                              <tr>
                                <td> <div class="custom-control-lg custom-control custom-checkbox  pl-5">
                                  <input type="checkbox" name={data.id} disabled={this.state.isDefault === true} checked={checkedlist} name={data.id} id={data.id} onChange={this.handleCheck.bind(this)} class="custom-control-input" id={data.id} />
                                  <label class="custom-control-label" for={data.id}></label>
                                  <span className="text-truncate "><i class="fas fa-circle text-success mr-2" style={{ fontSize: ".75rem" }} name={data.userName} id={data.userName}></i>{data.firstName + " " + data.lastName}</span>
                                </div>

                                </td>
                                <td className="pr-5"><label className="text-truncate">{data.email}</label></td>

                           <td className="pr-5"><label className="text-truncate">{data.managerId!==null?data.manager.firstName + " "+ data.manager.lastName:"-"}</label></td>

                              </tr>
                            )
                          })}

                        </tbody>
                      </table>




                    </div>
                  </div>
                  <div class="bg-white">
                    <div class="card-footer bg-white">
                    <button type="button" class="default-button btn btn-dark float-right mr-2 p-0" name="AddMap" disabled={this.state.disableButton} onClick={this.MapUser.bind(this)}>Map</button>
                      {/* <button  type="button"  class=" btn btn-light float-right mr-4 mb-2">Remove</button> */}
                    </div>
                  </div>
                </Tab>

                <Tab
                  className="tab-content-mapping"
                  eventKey="Features"
                  title="Features"
                >
                  <div class="container pt-2 bg-white scrollbar " style={{ height: '56vh' }}>

                    <div id="accordion">
                      {this.state.FeaturesList.map((data, key) => {
                        var image = '';
                        if (data.isDeafult === false) {
                          //  import documentgrey from '../../assets/fonts/document-grey.svg';
                          // import effortmanagementgrey from '../../assets/fonts/effort_management-grey.svg';
                          // import requestgrey from '../../assets/fonts/request-grey.svg';
                          // import usermanagementgrey from '../../assets/fonts/user_management-grey.svg';
                          // import Preperencesgrey from '../../assets/fonts/Preperences_grey.svg';
                          // import Settingsgrey from '../../assets/fonts/Settings_grey.svg';
                          if (data.name === "Requests") {
                            image = request
                          }
                          if (data.name === "Effort Management") {
                            image = effortmanagement
                          }
                          if (data.name === "Documents") {
                            image = document
                          }
                          if (data.name === "User Management") {
                            image = usermanagement
                          }
                          if (data.name === "Preferences") {
                            image = Preperences
                          }
                          if (data.name === "Settings") {
                            image = Settings
                          }


                          return (
                            <div className={this.state.showFeaturesView === data.name ? "card mt-2" : "card mt-2"}>
                              <div class="card-header bg-white scrollbar  border-bottom-0 cursor-pointer   Pointer-hover" onClick={this.showFeatures.bind(this, data.name)}>
                                <a class="card-link " data-toggle="collapse"  >
                                  <i className="text-muted cursor-pointer"  ><img src={image} /></i>
                                  <label className="pl-3 text-bold-500 cursor-pointer"> {data.name}</label>


                                </a>

                                <i aria-controls="configuration-collapse"
                                  className={this.state.showFeaturesView === data.name ? "fas fa-angle-up float-right sidebar-list-item-arrow" : "fas fa-angle-down float-right sidebar-list-item-arrow"}
                                />
                              </div>
                              <div id="collapseOne" class={this.state.showFeaturesView === data.name ? "collapse show" : "collapse"}>
                                <div class="card-body bordertop">
                                  <ul class="list-group scrollbar" name="AttributesList">


                                    {data.features.map((featuresdata, key) => {



                                      return (
                                        //  <ListGroup.Item   action className="list-item-listview"><i class="fas fa-circle" style={{color: 'green', paddingRight:'10px',fontSize:'10px'}}></i>{data.name}</ListGroup.Item>
                                        <li name={featuresdata.name} className="list-group-item rounded-0 pl-2 pt-2 pb-2 text-muted text-truncate  border-left-0 border-right-0  border-top-0 border-bottom-0 cursor-default bf-minheight-30"><label>{featuresdata.name}</label>
                                          <label class="switch float-right">
                                            <input type="checkbox" name={featuresdata.id} disabled={this.state.isDefault === true} onChange={this.handlefeaturesCheck.bind(this)} checked={featuresdata.isMapped} />
                                            <span class="slider round"></span>
                                          </label>
                                        </li>
                                      );

                                    })}

                                  </ul>

                                </div>
                              </div>
                            </div>
                          )
                        }
                      })}

                    </div>
                  </div>

                  <div class="bg-white">
                    <div class="card-footer bg-white">
                      <button type="button" class="common-button btn btn-dark float-right mr-2" name="AddMap" disabled={this.state.disableButton} onClick={this.Mapfeatures.bind(this)}>Map</button>
                      {/* <button  type="button"  class=" btn btn-light float-right mr-4 mb-2">Remove</button> */}
                    </div>
                  </div>
                </Tab>
              </Tabs>

            </div>
          </div>
        </div>


        <Modal aria-labelledby="contained-modal-title-vcenter" centered show={this.state.show} onHide={this.handleClose.bind(this)} >
          <Modal.Header closeButton className="pop-Header">
            <Modal.Title id="contained-modal-title-vcenter "><label  className="text-truncate" >Add  Role</label ></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form class="form-horizontal">
              <div class="form-group">
                <label
                  className={this.state.errorName === "" ? "col-sm-2 control-label mandatory" : "error-label col-sm-2 control-label mandatory"}
                  for="inputEmail3">Name</label>
                <div class="col-sm-10">
                  <input type="text"
                    placeholder="Enter Name"
                    aria-describedby="inputGroupPrepend"
                    value={this.state.Name}
                    onChange={this.handelchange.bind(this)}
                    name="Name"
                    className={this.state.errorName === "" ? "form-control rounded-0 border-right-0 border-left-0 border-top-0 w-100" : "error-textbox form-control rounded-0 border-right-0 border-left-0 border-top-0 w-100"}
                  />
                  <div className="errorMsg">{this.state.errorName}</div>
                </div>
                <div class="custom-control-lg custom-control custom-checkbox  pl-5">
                                                <input type="checkbox" class="custom-control-input" id="chkIsNotifiedOnCreateRequest" name="IsNotifiedOnCreateRequest" onChange={()=>this.setState({isNotifiedOnCreateRequest:!this.state.isNotifiedOnCreateRequest})}  />
                                                <label class="custom-control-label" for="chkIsNotifiedOnCreateRequest"></label>
                                                <span className="text-truncate ">Is Notified On Create Request</span>
                                             </div>
              </div>
            </form>

          </Modal.Body>
          <Modal.Footer className="pop-footer">
            <Button  className="btn-light float-right default-button-secondary"  name="btnClose" onClick={this.handleClose.bind(this)}>
              Close
  </Button>
            <Button className="default-button  btn-dark float-right mr-2 p-0"  name="btnAdd" onClick={this.AddRole.bind(this)}>
              Add
  </Button>

          </Modal.Footer>
        </Modal>
      </>


    );
  }
}
export default withGlobalState(Role)