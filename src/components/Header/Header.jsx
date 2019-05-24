import React, { Component } from "react";
import {  NavDropdown } from 'react-bootstrap';

import { withGlobalState } from 'react-globally'
import './header.css'
//used for role method
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";

const CreateRequest = React.lazy(() =>import ( '../../views/Request/CreateRequest'));

class Header extends Component {
  constructor(...args) {
    super(...args);
    this.state = { modalShow: false,
      showCreateRequest:false,
      showRequestAddButton:false
    };
  }

  logout() {
    localStorage.clear();
    let url =process.env.REACT_APP_Logout_Url;
    window.location.href = (url);
  }

  handleClose(){
   
    this.setState({showCreateRequest:false})

  }
  create(){
    this.setState({showCreateRequest:false});
    this.props.setGlobalState({ RequestModalOnHide: true });
  }
  
  getUserAccessibility(featureGroupName, feature) {
    debugger;
    return RoleBFLOWDataService.getUserAccessibility(this.props.globalState.features, featureGroupName, feature);
 }

 async componentDidMount() {
  let features = this.props.globalState.features;

  if (features === undefined) {
     features = await RoleBFLOWDataService.getUserRoles();
     this.props.setGlobalState({ features: features });
  }
 const showAddButton=  this.getUserAccessibility("Request","Create request");
 this.setState({showRequestAddButton:showAddButton})
}
showRequestAddButton(){
  if(this.state.showRequestAddButton===true){
    return(
      <>
        <button type="button" class="btn btn-outline-secondary" id="btnCreateRequest" onClick={() => this.setState({ showCreateRequest: true })}>Create Request</button>
            <CreateRequest show={this.state.showCreateRequest} create={this.create.bind(this)}  hide={this.handleClose.bind(this)}></CreateRequest>
            <label className="px-4 text-secondary"> | </label>
      </>
    );
  }
}
  render() {
    let menuname =   localStorage.getItem("menuHeaderName");
    
    return (
    <> 
      <nav class="navbar navbar-expand-lg navbar-light bg-white w-100 pt-3 border-bottom">

        <div class="collapse navbar-collapse mb-2" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto " name="HeaderList">
          <h4>{menuname}</h4>
            {/* <ol class="breadcrumb p-0 bg-white">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item"><a href="#">Library</a></li>
              <li class="breadcrumb-item active" aria-current="page">Data</li>
            </ol> */}

          </ul>
          <form class="form-inline my-2 my-lg-0" >
            {this.showRequestAddButton()}
            
            <i class="far fa-bell" style={{color:" #55565a" ,fontSize:"1.25rem"}}></i>
            <label className="px-4 text-secondary"> | </label>
            <div class="form-group ">

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

         <NavDropdown title="N"  className="btn btn-primary rounded-circle p-0 roundbutton"
               
                id="basic-nav-dropdown" >
        <NavDropdown.Item >Profile</NavDropdown.Item>
        <NavDropdown.Item >setting</NavDropdown.Item>
        <NavDropdown.Item >Activity Log</NavDropdown.Item>
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