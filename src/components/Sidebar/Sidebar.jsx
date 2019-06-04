import React, { Component } from "react";
import logo from '../../assets/img/BEATFlow_logo.svg'
import Routes from "../../configuration/routes/route";
import { Link, withRouter } from "react-router-dom";
import { Collapse } from 'react-bootstrap';
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
//used for custom method
import { MasterBFLOWDataService } from "../../configuration/services/MasterDataService";
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";
import confirmIcon from '../../assets/fonts/confirm.svg';
import cancelIcon from '../../assets/fonts/cancel.svg';

import { withGlobalState } from 'react-globally'
const AlertBanner = React.lazy(() => import('../../components/AlertBanner/index'));

class Sidebar extends Component {
   constructor(props, context) {
      super(props, context);
      this.state = {
         ActiveMenu: "",
         width: window.innerWidth,
         MasterMenu: [],
         showAddMaster: false,
         ActiveSelectMenu: '',

         //messages
         showErrorMesage: false,
         errorMessage: '',
         errorMessageType: '',
         availableRoute: [],
         showMasterAddButton: false,
         isFirstLogin:false
      };

      this.toggleSideBar = this.toggleSideBar.bind(this);
      this.AddMaster = this.AddMaster.bind(this);
      this.ShowMasterTextBox = this.ShowMasterTextBox.bind(this);
      this.ShowTextBox = this.ShowTextBox.bind(this);
      this.CloseTextBox = this.CloseTextBox.bind(this);
      this.handleCloseErrorMessage = this.handleCloseErrorMessage.bind(this);


   }


   getUserAccessibility(featureGroupName, feature) {
      return RoleBFLOWDataService.getUserAccessibility(this.props.globalState.features, featureGroupName, feature);
   }

   async getMaster() {
     
      const responseJson = await MasterBFLOWDataService.getMasters();
      this.setState({ MasterMenu: responseJson     
       });
      this.props.setGlobalState({ ConfigurationMenu: responseJson });

   }

   async componentDidMount() {
      // Arrange availble features
      var isFirstLogin = localStorage.getItem("isFirstLogin");
      this.setState({ isFirstLogin:isFirstLogin});

      let features = this.props.globalState.features;
      let Accessablefeatures = [];

      if (features === undefined) {
         features = await RoleBFLOWDataService.getUserRoles();
         this.props.setGlobalState({ features: features });
      }

      Routes.forEach((item) => {
         if (features.filter(x => x.featureGroupName === item.name).length > 0) {
            Accessablefeatures = Accessablefeatures.concat(item);
         }
      });

      this.setState({ availableRoute: Accessablefeatures });

      if (this.state.ActiveSelectMenu === '') {
         const menuname = localStorage.getItem("MenuName")
         this.setState({ ActiveSelectMenu: menuname });
      }
      if (this.state.ActiveMenu === '') {
         const menuItem = localStorage.getItem("MenuItem")
         this.setState({ ActiveMenu: menuItem });
      }
      this.getMaster();


      const showAddbutton = this.getUserAccessibility("Customization", "Add");
      this.setState({ showMasterAddButton: showAddbutton })

   }

   ShowMasterTextBox() {
      if (this.state.showMasterAddButton === true) {


         if (this.state.showAddMaster === true) {

            return (
               <>

                  <li class="list-group-item rounded-0  border-right-0 border-left-0 w-100  border-top-0 common-default-color  sidebar-mainmenu ml-1 sidebar">

                     <div>
                        <input type="text"
                           aria-describedby="inputGroupPrepend"
                           placeholder="Enter Name"
                           name="MasterName"
                           ref={node => this.MasterName = node}
                           autoFocus={true}
                           class="form-control form-control-no-border rounded-0 border-right-0 border-left-0 ml-0 border-top-0   d-inline pr-1 common-default-color sidebar" style={{ color: "white" }} />
                     </div>
                     <div className="h-30 w-100 pr-3">
                        <div className="float-left w-70 h-30">
                        </div>
                        <div className="float-right w-65 bg-white h-30">
                           <i onClick={this.CloseTextBox} className="pl-2 pt-2 pb-2" name="link_Close" > <img src={cancelIcon} /></i>
                           <i onClick={this.AddMaster} className="pr-2 pt-2 pb-2" name="link_AddMaster" > <img src={confirmIcon} /></i>
                        </div>

                     </div>
                  </li>
                  {/* <li class="list-group-item  common-default-color col-auto sidebar-mainmenu pt-0 sidebarbutton w-100 h-50" >


</li> */}
               </>
            )


         }
         else {
            return (
               <li class="list-group-item border-0 common-default-color col-auto sidebar-mainmenu ml-4 text-truncate">
                  <i onClick={this.ShowTextBox} aria-controls="configuration-collapse" class="fa fa-plus MasterAdd cursor-pointer text-truncate" aria-hidden="true" name="link_ShowText">Add to Preferences</i></li>
            )
         }
      }
   }


   ShowTextBox() {
      this.setState({ showAddMaster: true })
   }

   CloseTextBox() {
      this.setState({ showAddMaster: false })
   }

   ToggleMenuCollapse(MenuItem) {


      if (this.state.ActiveMenu === MenuItem) {
         this.setState({ ActiveMenu: "None" });
         // this.setState({ActiveSelectMenu: ""});
      }
      else {
         this.setState({ ActiveMenu: MenuItem });
         localStorage.setItem("MenuItem", MenuItem)
         // this.setState({ActiveSelectMenu: MenuItem});
      }
   }

   ShowSelectMenu(SelectName, Name) {

      this.setState({ ActiveSelectMenu: SelectName });
      localStorage.setItem("MenuName", SelectName)
      localStorage.setItem("menuHeaderName", Name)
   }



   ShowMenu(name) {
      let list = this.state.open;
      return list.find((item) => name === item.MenuItem).Show;
   }



   async AddMaster() {
      const body = JSON.stringify({ Name: this.MasterName.value });
      const message = await BFLOWDataService.post('Masters', body);
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
         this.getMaster();
         this.MasterName.value = '';
      }

      this.setTimeOutForToasterMessages();


   }

   setTimeOutForToasterMessages() {
      setTimeout(
         function () {
            this.setState({ showErrorMesage: false });
         }
            .bind(this),
         5000
      );
   }

   toggleSideBar() {
      this.setState({
         showSidebar: !this.state.showSidebar
      });
   }
   handleCloseErrorMessage() {
      this.setState({ showErrorMesage: false })
   }
   render() {
      const { open, showSidebar, collapseConfiguration } = this.state;
      return (
         <>
            <AlertBanner onClose={this.handleCloseErrorMessage} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
            </AlertBanner>
            <div  className={this.state.isFirstLogin==="true" ?'disable-div ':' '} >
               <ul className="list-group" name="SideBarList">
                  <a href='#' className='header-logo'><img src={logo} /></a>
                  {this.state.availableRoute.map((prop, key) => {
                      if (!prop.redirect && prop.children === false && prop.IsInternal !== true)
                        return (
                           <li key={key} class={prop.name === this.state.ActiveSelectMenu ? "list-group-item border-0 common-default-color p-1 Sidebaractive" : "list-group-item border-0 common-default-color p-1"}>
                              <Link to={prop.path}
                                 onClick={() => this.ShowSelectMenu(prop.name, prop.name)}
                                 className="sidebar-mainmenu"
                                 activeClassName="active">
                                 <i className={prop.icon} />
                                 <span class="">{prop.name}</span>
                              </Link>
                           </li>
                        );
                     //------------------------------------------
                     if (prop.name === "Customization")
                        return (
                           <li key={key} class="list-group-item border-0 common-default-color pl-1  pt-2 pb-1 pr-1"  >
                              <div className={prop.name === this.state.ActiveMenu ? "Sidebaractive h-35" : "h-35"}>
                                 <Link
                                    onClick={() => this.ToggleMenuCollapse(prop.name)}
                                    className="sidebar-mainmenu"
                                    activeClassName="active">
                                    <i className={prop.icon} />
                                    <span class="">Preferences</span>


                                    <i
                                       aria-controls="configuration-collapse"
                                       aria-expanded={this.state.ActiveMenu === (prop.name) ? true : false}
                                       className={this.state.ActiveMenu == (prop.name) ? "fas fa-angle-up float-right sidebar-list-item-arrow Sidebaractive" : "fas fa-angle-down float-right sidebar-list-item-arrow"}
                                    />
                                 </Link>
                              </div>
                              <Collapse in={this.state.ActiveMenu === (prop.name)}>
                                 <div id="configuration-collapse" >
                                    <ul className="list-group" name="SideBarList">

                                       {this.ShowMasterTextBox()}

                                       {this.props.globalState.ConfigurationMenu.map((data, key) => {
                                          if (!prop.redirect)
                                             return (
                                                <li key={key} className={parseInt(this.state.ActiveSelectMenu) === data.id ? "list-group-item border-0 common-default-color pr-1 pb-1 pt-1 Sidebaractive" : "list-group-item border-0 common-default-color pr-1 pb-1 pt-1"} >
                                                   <Link to={`/Master/${data.id}`}
                                                      onClick={() => this.ShowSelectMenu(data.id, "Preferences")}
                                                      className="sidebar-mainmenu"
                                                      activeClassName="active">
                                                      <span class="d-inline-block  text-truncate ml-4" name={data.name} style={{ maxWidth: "100px" }} title={data.name}>{data.name}</span>
                                                   </Link>
                                                </li>
                                             );
                                          return null;
                                       })}
                                       {/* <li>
                                          <input placeholder="Name" type="text" ref={node => this.MasterName = node} />
                                       </li>
                                       <li>
                                          <Button variant="primary" onClick={this.AddMaster}>Primary</Button>
                                       </li> */}



                                    </ul>
                                 </div>
                              </Collapse>
                           </li>
                        );

                     //----------------------------------------


                     if (prop.children === true)
                        return (
                           <li key={key} class="list-group-item border-0 common-default-color p-1 text-truncate" >
                              <div className={prop.name === this.state.ActiveMenu ? "Sidebaractive h-35" : "h-35"}>
                                 <Link to={prop.path}
                                    onClick={() => this.ToggleMenuCollapse(prop.name)}
                                    className="sidebar-mainmenu"
                                    activeClassName="active">
                                    <i className={prop.icon} />
                                    <span class="text-truncate">{prop.name}</span>
                                    <i
                                       aria-controls={prop.name}
                                       aria-expanded={this.state.ActiveMenu === (prop.name)}
                                       name={prop.name}
                                       className={this.state.ActiveMenu === (prop.name) ? "fas fa-angle-up float-right sidebar-list-item-arrow" : "fas fa-angle-down float-right sidebar-list-item-arrow"}
                                    />
                                 </Link>
                              </div>
                              <Collapse in={this.state.ActiveMenu === (prop.name)}>
                                 <div id={prop.name}>
                                    <ul className="list-group" name="SideBarList">
                                       {prop.childrenData.map((data, key) => {
                                          if (!prop.redirect && prop.IsInternal!==true)
                                             return (
                                                <li key={key} className={data.name === this.state.ActiveSelectMenu ? "list-group-item border-0 common-default-color  Sidebaractive pt-2 pb-2" : "list-group-item border-0 common-default-color pt-2 pb-2"}>
                                                   <Link to={data.path}
                                                      onClick={() => this.ShowSelectMenu(data.name, data.name)}
                                                      className="sidebar-mainmenu"
                                                      activeClassName="active">
                                                      <span class="text-truncate ml-4" name={data.name}>{data.name}</span>
                                                   </Link>
                                                </li>
                                             );
                                          return null;
                                       })}
                                    </ul>
                                 </div>
                              </Collapse>
                           </li>
                        );
                     return null;
                  })}
               </ul>
            </div>
         </>
      );
   }
}
export default withGlobalState(Sidebar);