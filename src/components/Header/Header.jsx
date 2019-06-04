import React, { Component } from "react";
import {  NavDropdown } from 'react-bootstrap';

import { withGlobalState } from 'react-globally'
import './header.css'
//used for role method
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";

const CreateRequest = React.lazy(() =>import ( '../../views/Request/CreateRequest'));

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { modalShow: false,
      showCreateRequest:false,
      showRequestAddButton:false,
      firstName:'',
    };
  }

  logout() {
    localStorage.clear();
    this.props.historyprops.history.push("/login");
  }

  handleClose(){
   
    this.setState({showCreateRequest:false})

  }
  create(){
    this.setState({showCreateRequest:false});
    this.props.setGlobalState({ RequestModalOnHide: true });
  }
  
  getUserAccessibility(featureGroupName, feature) {
    ;
    return RoleBFLOWDataService.getUserAccessibility(this.props.globalState.features, featureGroupName, feature);
 }

 async componentDidMount() {
  let features = this.props.globalState.features;

  if (features === undefined) {
     features = await RoleBFLOWDataService.getUserRoles();
     this.props.setGlobalState({ features: features });
  }
  var name=localStorage.getItem("firstName");
  if(name!="" && name!=undefined){
    var res = name.substring(0,1);
    this.setState({firstName:res})
  }
 const showAddButton=  this.getUserAccessibility("Requests","Create request");
 this.setState({showRequestAddButton:showAddButton})
}
showRequestAddButton(){
  var isFirstLogin = localStorage.getItem("isFirstLogin");
  if(this.state.showRequestAddButton===true && isFirstLogin==="false"){
    return(
      <>
        <button type="button" class="btn bf-btn-outline-secondary" style={{height:"2rem",padding:"0",width:"8.063rem"}} id="btnCreateRequest" onClick={() => this.setState({ showCreateRequest: true })}>Create Request</button>
            <CreateRequest show={this.state.showCreateRequest} create={this.create.bind(this)}  hide={this.handleClose.bind(this)}></CreateRequest>
            <label className="px-4 text-secondary"> | </label>
      </>
    );
  }
}
/**Method tp redirect to Account Settings page*/
redirectToAccountSettings(){
  localStorage.setItem("menuHeaderName","Account Settings");
  this.props.historyprops.history.push("/user/AccountSettings");
}
  render() {
    let menuname =   localStorage.getItem("menuHeaderName");
    
    return (
    <> 
      <nav class="navbar navbar-expand navbar-light bg-white w-100 pt-3 border-bottom" style={{height:"60px"}}>

        <div class="collapse navbar-collapse mb-2" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto " name="HeaderList" style={{ paddingLeft:"0.25rem"}}>
          <h4>{menuname}</h4>
            {/* <ol class="breadcrumb p-0 bg-white">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item"><a href="#">Library</a></li>
              <li class="breadcrumb-item active" aria-current="page">Data</li>
            </ol> */}

          </ul>
          <form class="form-inline my-2 my-lg-0" >
            {this.showRequestAddButton()}
          {/* <i class="far fa-bell common-icon-color" style={{width:"24px",height:"24px",paddingTop:"6px"}}></i>
            <label className="px-4 text-secondary"> | </label> */}
            <div class="form-group headerdropdown">

              {/* <button
                class="form-control btn btn-primary rounded-circle"
                id="drpStatus"
                type="button"
                onClick={this.logout.bind(this)}
              >
                <option selected disable>
                  {" "}
                  N
                    </option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </button> */}

         <NavDropdown title={this.state.firstName}  className="btn btn-primary rounded-circle p-0 roundbutton "
               
                id="basic-nav-dropdown" >
        <NavDropdown.Item onClick={this.redirectToAccountSettings.bind(this)}>Account Settings</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={this.logout.bind(this)}>Logout</NavDropdown.Item>
      </NavDropdown>
            </div>
          </form>
        </div>
      </nav>
      </>
    );
  }
}
export default withGlobalState(Header);