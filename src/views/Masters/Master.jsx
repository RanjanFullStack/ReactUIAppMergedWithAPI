/**
 * BFLOW: Master UI
 */

/**import start */
import React, { Component } from 'react';
import { Button, Modal, Tab, Tabs } from 'react-bootstrap';
import { withGlobalState } from 'react-globally'

//used for Basic Verbs get, put, post, delete 
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";

//used for custom method
import { MasterBFLOWDataService } from "../../configuration/services/MasterDataService";

//used for custom method
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";

// CSS with icons
import './master.css'
import editIcon from '../../assets/fonts/edit.svg';
import confirmIcon from '../../assets/fonts/confirm.svg';
import cancelIcon from '../../assets/fonts/cancel.svg';
import DeleteIcon from '../../assets/fonts/Delete_icon.svg';
import {SharedServices} from '../../configuration/services/SharedService';
const AlertBanner = React.lazy(()=> SharedServices.retry(() => import('../../components/AlertBanner/index')));

/**import end*/

/**global variable start */

//used for handling mapped users
let UserMappedId = [];
let MapMasterAttributesWithUsers = []

/**global variable end */

class Masters extends Component {
   constructor(props) {
      //call the base constructor
      super(props)

      this.state = {
         //Masters states Start
         masterValues: '',
         Id: 0,
         mapMasterId: 0,
         isUserOnBoardingRequired: false,
         masterKeyValueId: 0,
         masterKey: '',
         masterValue: '',
         // GetMaster:[],
         masterList: [],
         mapmasterList: [],
         GetmasterKeyValue: [],
         showMasterDeleteButton: false,
         showMasterEditButton: false,
         showMasterAddButton: false,
         //Masters states End

         //Attributes states Start
         attributesList: [],
         allAttributesList: [],
         attributesName: '',
         attributesId: '',
         showAttributeTextbox: false,
         MapMasterWithAtribute: [],
         MapAtributeWithAtribute: [],
         AllMapAtributeWithAtribute: [],
         showAttributeDeleteButton: false,
         showAttributeEditButton: false,
         //Attributes states End   

         //User states Start
         UserList: [],
         AllUserListbyattributesId: [],
         SelectALLUsers: false,
         disableButton: false,
         //User states end

         // Error handling states start
         showErrorMesage: false,
         ErrorMesage: '',
         ErrorMesageType: '',
         errorsName: '',
         errorsOrder: '',
         errorsKey: '',
         errorsValue: '',
         visible: false,

         // Error handling states end 

         //Common states start
         show: false,
         showtextbox: false,
         open: false,
         fields: {},
         //Common states end
      }

      // Bind Method Start
      this.masterValue = React.createRef();
      this.AttributesKey = React.createRef();
      //Handle pop up
      this.handleClose = this.handleClose.bind(this);
      this.OpenModel = this.OpenModel.bind(this);
      this.handleCloseErrorMessage = this.handleCloseErrorMessage.bind(this);
      this.deleteMaster = this.deleteMaster.bind(this);
      this.EditMaster = this.EditMaster.bind(this);
      this.ShowtextEditMaster = this.ShowtextEditMaster.bind(this);
      this.showtextonEdit = this.showtextonEdit.bind(this);
      this.AddAttributes = this.AddAttributes.bind(this);
      this.searchAttributeHandler = this.searchAttributeHandler.bind(this);
      this.searchUserHandler = this.searchUserHandler.bind(this);
      this.EditAttribute = this.EditAttribute.bind(this);
      this.ShowtextEditAttribute = this.ShowtextEditAttribute.bind(this);
      this.showMasterDeleteButton = this.showMasterDeleteButton.bind(this);
      this.getUserAccessibility = this.getUserAccessibility.bind(this);


      // Bind Method End
   }


   // Lifecycle Event Start

   componentDidMount() {
      this.GetcomponentData(this.props);
   }
   componentWillReceiveProps(nextProps) {
      const { match: { params } } = nextProps;
      // checking pervious Props 
      if (params.name !== this.state.Id)
         this.GetcomponentData(nextProps);
   }
   // Lifecycle Event end

   // Common method used by componentDidMount and componentWillReceiveProps
   async GetcomponentData(props) {

      //Const properties 

      // Get Params from uri
      const { match: { params } } = props;
      const masterDataById = await BFLOWDataService.getbyid('Masters', params.name);

      //Reset States
      this.setState({ attributesList: [] })
      this.setState({ allAttributesList: [] })
      this.setState({ MapAtributeWithAtribute: [] })

      // set new value to states
      this.setState({ masterValues: masterDataById.name })
      this.setState({ Id: params.name, isUserOnBoardingRequired: masterDataById.isUserOnBoardingRequired })
      //this.setState({GetMaster:responseJson})
      this.setState({ showtextbox: false })
      this.setState({ open: false })
      // end of setting new value to states

      //Call the successor methods
      this.getMaster();
      this.GetAttribute(masterDataById.id)
      this.getMasterMapMaster(masterDataById.id);
      const showDeletebutton = this.getUserAccessibility("Customization", "Delete");
      const showEditbutton = this.getUserAccessibility("Customization", "Add");
      this.setState({ showMasterDeleteButton: showDeletebutton, showAttributeDeleteButton: showDeletebutton, showMasterEditButton: showEditbutton, showAttributeEditButton: showEditbutton, showMasterAddButton: showEditbutton })

      // end of method calls
   }

   //SetTimeout

   // Hide Alert Message
   setTimeOutForToasterMessages() {
      setTimeout(
         function () {
            this.setState({ showErrorMesage: false });
         }
            .bind(this),
         15000
      );
   }

   // show error message
   hideErrorMessage() {
      this.setState({ showErrorMesage: false })
   }

   // set state for open pop
   OpenModel() {
      this.setState({ show: true })
   }
   //Close pop
   handleClose() {
      this.setState({ show: false })
   }

   /**Master Section Start */

   //Get: Master Data
   async getMaster() {
      let masterList = await BFLOWDataService.get('Masters');
      const selectedMasterId = masterList.filter(x => x.id === parseInt(this.state.Id))
      masterList = masterList.filter(function (item) {
         return selectedMasterId.indexOf(item) === -1;
      })
      this.setState({ masterList: masterList });
   }

   // delete Master Record
   async deleteMaster() {
      if (window.confirm("Do you wish to delete the item?")) {
         const message = await BFLOWDataService.Delete('Masters', this.state.Id);
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
            this.props.history.push("/Dashboard");
            this.RefreshMastersAtSideBar();
         }
         this.setTimeOutForToasterMessages();
      }
   }

   async RefreshMastersAtSideBar() {
      const masterList = await MasterBFLOWDataService.getMasters();
      this.props.setGlobalState({ ConfigurationMenu: masterList });
   }

   // Edit Master
   async EditMaster() {
      const body = JSON.stringify({ name: this.masterValue.value, isUserOnBoardingRequired: this.state.isUserOnBoardingRequired });
      const response = await BFLOWDataService.put('Masters', this.state.Id, body);

      if (response.Code === false && response.Code !== undefined) {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response.Message });
         this.setState({ ErrorMesageType: 'danger' });
      }
      else {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response });
         this.setState({ ErrorMesageType: 'success' });
         this.setState({ showtextbox: false })
         // this.setState({GetMaster:responseJson})

         this.RefreshMastersAtSideBar();
         const masterById = await BFLOWDataService.getbyid('Masters', this.state.Id);
         this.setState({ masterValues: masterById.name });
      }
      this.setTimeOutForToasterMessages();
   }

   async updateisUserOnBoardingRequired() {
      this.setState({ isUserOnBoardingRequired: !this.state.isUserOnBoardingRequired })
      const body = JSON.stringify({ name: this.state.masterValues, isUserOnBoardingRequired: !this.state.isUserOnBoardingRequired });
      const response = await BFLOWDataService.put('Masters', this.state.Id, body);
      if (response.Code === false && response.Code !== undefined) {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response.Message });
         this.setState({ ErrorMesageType: 'danger' });
      }
      else {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response });
         this.setState({ ErrorMesageType: 'success' });
      }
   }

   // Click on edit button show show label to textbox for master update
   ShowtextEditMaster() {
      if (this.state.showtextbox === true)
         this.setState({ showtextbox: false })
      else {
         this.setState({ showtextbox: true })
         this.setmasterValue("true")
      }
   }

   getUserAccessibility(featureGroupName, feature) {
      return RoleBFLOWDataService.getUserAccessibility(this.props.globalState.features, featureGroupName, feature);
   }

   showMasterDeleteButton() {

      if (this.state.showMasterDeleteButton === true) {
         return (
            <div className="float-left pl-4">
               {/* <label className="px-1 text-secondary float-right"> | </label>
               <i className="text-muted cursor-pointer float-right iconhover" name="DeleteMaster" onClick={this.deleteMaster.bind(this)} ><img src={DeleteIcon} /></i> */}
               <button type="button" class="btn btn-danger" name="DeleteMaster" onClick={this.deleteMaster.bind(this)}>Delete</button>
            
            </div>
         )
      }
   }

   showAttributeDeleteButton() {

      if (this.state.showAttributeDeleteButton === true) {
         return (
            <>
               <div className="d-inline float-right">
                  <i className="text-muted cursor-pointer" onClick={this.DeleteAttribute.bind(this)} name="DeleteAttribute"><img src={DeleteIcon} /></i> </div>
               <label className="px-1 text-secondary float-right"> | </label>
            </>
         )
      }
   }


   showMasterEditButton() {

      if (this.state.showMasterEditButton === true) {
         return (
            <>
               <label className="px-1 text-secondary float-right"> | </label>
               <i className="text-muted d-inline cursor-pointer float-right iconhover" onClick={this.ShowtextEditMaster} name="EditMaster"> <img src={editIcon} /></i>
            </>
         )
      }
   }

   showAttributeEditButton() {

      if (this.state.showAttributeEditButton === true) {
         return (
            <>
               <div className="d-inline float-right">
                  <i className="text-muted cursor-pointer" onClick={this.ShowAttributetextEditMaster.bind(this)} name="EditAttribute"><img src={editIcon} /></i>
               </div>
            </>
         )
      }
   }



   // based on state change label to textbox 
   showtextonEdit() {

      const { open } = this.state;
      if (this.state.showtextbox === true) {
         return (
            <div className="w-100 pt-2">
               <input type="text"
                  aria-describedby="inputGroupPrepend"
                  placeholder="Enter Name"
                  name="EditMasterName"
                  ref={x => this.masterValue = x}
                  class="search-textbox form-control rounded-0 border-right-0 border-left-0 ml-4 border-top-0 w-25 d-inline mb-4" />
               <i onClick={this.ShowtextEditMaster} className="text-muted d-inline cursor-pointer" name="cancelAttribute"> <img src={cancelIcon} /></i>
               <i onClick={this.EditMaster.bind(this)} className="text-muted d-inline cursor-pointer" name="confirmAttribute"> <img src={confirmIcon} /></i>
               <i class={this.state.open === true ? "fas fa-angle-up float-right sidebar-list-item-arrow d-inlin open" : "fas fa-angle-down float-right sidebar-list-item-arrow d-inlin closeMaster"}
                  onClick={() => this.setState({ open: !open })}
                  aria-controls="example-collapse-text"
               // aria-expanded={open}
               />
            </div>
         )
      }
      else {
         return (
            <div class="w-100 pt-2 masterswitch">
               <h5 class="card-title ml-4 d-inline text-truncate mt-4">{this.state.masterValues}</h5>
               <i class={this.state.open === true ? "fas fa-angle-up float-right sidebar-list-item-arrow d-inlin openMaster" : "fas fa-angle-down float-right sidebar-list-item-arrow d-inlin closeMaster"}
                  onClick={() => this.setState({ open: !open })}
                  aria-controls="example-collapse-text"
               // aria-expanded={open}
               />
            
               {this.showMasterEditButton()}
               <label className="px-1 text-secondary float-right"> | </label>
               <label class="switch float-right mt-1" title="is User OnBoarding Required">
                  <input type="checkbox" checked={this.state.isUserOnBoardingRequired} onChange={this.updateisUserOnBoardingRequired.bind(this)} />
                  <span class="slider round"></span>
               </label>

            </div>
         )
      }
   }

   showMasterAddButton() {
      if (this.state.showMasterAddButton === true) {
         return (
            <button
               type="button"
               class="rounded-circle btn add-button-list-view common-button "
               name="btnAddMaster"
               style={{
                  boxShadow:
                     " 8px 4px 8px 0 rgba(0, 0, 0, 0.2), 8px 6px 20px 0 rgba(0, 0, 0, 0.19)"
               }}
               onClick={this.OpenModel}
            >
               {" "}
               <i class="fa fa-plus text-white" aria-hidden="true" />
            </button>
         );
      }
   }
   // Bind Text box with value
   setmasterValue(value) {
      if (value === "true") {
         setTimeout(
            function () {
               this.masterValue.value = this.state.masterValues
            }
               .bind(this),
            100
         );
      }
   }
   /**Master Section End */


   /**Map Masters Section Start */
   async getMasterMapMaster(id) {
      id = parseInt(id);
      let responseJson = await MasterBFLOWDataService.getMasterMapMaster(id);
      this.setState({ mapmasterList: responseJson });
      this.bindMasterWithAttribute(responseJson);
      let firstvalue = responseJson.filter(x => x.isMapped === true);
      if (firstvalue.length > 0) {
         this.GetAttributesList(firstvalue[0].id);
         this.setState({ mapMasterId: firstvalue[0].id })
      }
   }

   showMappingCard() {
      if (this.state.open === true) {
         if (this.state.mapmasterList.length > 0) {
            return (
               <div class="card shadow-sm w-100 border-bottom mt-0 border-top-0 border-right-0 border-left-0 rounded-0 pt-0  h-220">
                  <div className="col-sm-12 pl-0">
                  
                     <div class="col-sm-6 pl-0 float-left h-100  ">
                     <div className="h-120">
                      </div>
                     {this.showMasterDeleteButton()}
                     </div>
                    
                     <div class="col-sm-6 pl-4 float-right  pt-4">
                        <div className="h-120 scrollbar">
                           {this.state.mapmasterList.map((data, key) => {
                              let className = '';
                              if (data.isMapped === true) {
                                 className = 'badge  text-white ml-2 w-25 h-35 rounded-1 pt-2 common-button mapping'
                              }
                              else {
                                 className = 'badge bg-light text-dark text-white ml-2 w-25 h-35 rounded-1 pt-2 unmapping'
                              }
                              if (data.id !== this.state.Id) {
                                 return (
                                    //MasterId  className={listMasteridWithMasterId >0 ? 'badge bg-secondary text-white ml-2 w-25 h-30 rounded-1 active' : 'badge bg-secondary text-white ml-2 w-25 h-30 rounded-1'}
                                    <a onClick={this.MappedMasterWithMaster.bind(this, data.id)} className={className} name={data.name}>
                                       <label className="text-truncate h-15" >{data.name}</label>
                                    </a>
                                 )
                              }
                           })}
                        </div>
                        <div class="bg-white" style={{padding:"0px!important"}}>
                           <button type="button" class="default-button btn btn-dark float-right p-0 mr-2 mb-2 mt-2" name="AddMap" onClick={this.mapMasterWithMaster.bind(this)}>Map</button>
                           {/* <button  type="button"  class=" btn btn-light float-right mr-4 mb-2">Remove</button> */}
                        </div>
                     </div>
                  </div>
               </div>
            )
         }
         else {
            return (
               <div class="card w-100 border-bottom mt-0 border-top-0 border-right-0 border-left-0 rounded-0 pt-0 shadow-sm  h-220">
                  <div className="col-sm-12 pl-0">
                     <div class="col-sm-6 pl-0 float-left ">
                     </div>
                     <div class="col-sm-6 p-4 float-right ">
                        <label className="text-bold common-color">No Mapping Data</label>
                     </div>
                  </div>
               </div>
            )
         }
      }
   }

   MappedMasterWithMaster(id) {
      const _mapmasterList = this.state.mapmasterList.map((item, key) => {
         if (item.id === id) {
            item.isMapped = !item.isMapped;
         }
         return item;
      })
      this.setState({ mapmasterList: _mapmasterList });
   }

   async  mapMasterWithMaster() {
      const body = JSON.stringify(this.state.mapmasterList);
      const response = await MasterBFLOWDataService.mapMasterWithMaster(this.state.Id, body);
      if (response.Code === false && response.Code !== undefined) {

         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response.Message });
         this.setState({ ErrorMesageType: 'danger' });
      }
      else {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response });
         this.setState({ ErrorMesageType: 'success' });

         this.getMasterMapMaster(this.state.Id);
         this.bindMasterWithAttribute(this.state.mapmasterList)
         this.GetAttribute(this.state.Id);


      }
      this.setTimeOutForToasterMessages();

   }

   DispayBlockForMasterMapping() {
      if (this.state.MapMasterWithAtribute.length > 0) {
         return (
            <>
               <div class="card rounded-0 border-0 shadow-sm" style={{ height: '66vmin' }}>
                  <div class="card-body p-0 border-0  ">
                     <div class="row">
                        <div class="col-sm-3  d-inline  pr-0" style={{ height: '55vmin' }}>
                           <ul class="list-group scrollbar border-top-0 border-bottom-0 app" name="MapMasterWithAttributeList" style={{ border: "1px solid rgba(0,0,0,.125)", height: "100%" }}>
                              {this.state.MapMasterWithAtribute.map((data, key) => {
                                 if (data.isMapped === true) {
                                    return (
                                       //  <ListGroup.Item   action className="list-item-listview"><i class="fas fa-circle" style={{color: 'green', paddingRight:'10px',fontSize:'10px'}}></i>{data.name}</ListGroup.Item>
                                       <li onClick={this.GetAttributesList.bind(this, data.id)} className='list-group-item rounded-0 pl-5 pt-3 pb-0 text-muted text-truncate  border-0  cursor-default app' name={data.name}>
                                          <label className={this.state.mapMasterId === data.id ? "common-color text-bold" : "text-muted"}>{data.name}</label></li>
                                    );

                                 }

                              })}

                           </ul>
                        </div>
                        <div class="col-sm-9  d-inline pl-0" style={{ height: '56vmin' }}>
                           <nav class="navbar navbar-expand navbar-light p-0 border-0">
                              <div class="input-group ">
                                 <input placeholder="Search" onChange={this.searchMapAttributes.bind(this)} aria-describedby="inputGroupPrepend" name="username" type="text" class=" search-textbox form-control rounded-0 border-right-0 border-left-0 pt-1"  />
                                 <div class="input-group-prepend ">
                                    <span class="search-icon input-group-text bg-white border-left-0  border-top-0" id="inputGroupPrepend">
                                       <i class="fa fa-search text-muted" aria-hidden="true"></i>
                                    </span>
                                 </div>
                              </div>
                           </nav>
                           <div className="scrollbar" style={{ height: '50vmin' }}>
                              <ul class="list-group scrollbar border-top-0 border-bottom-0 border-left-0" name="MapAttributeWithAtributeList" style={{ border: "1px solid rgba(0,0,0,.125)" }}>
                                 {/* AllMapAtributeWithAtribute */}
                                 {this.state.MapAtributeWithAtribute.map((data, key) => {
                                    let checkedlist = false;
                                    let AttributeMaster = this.state.attributesList.filter(x => x.id === this.state.attributesId)
                                    AttributeMaster[0].mapAttributesWithAttributes.map((item, key) => {

                                       let attributeId = item.secondaryAttributeId

                                       if (attributeId === data.id) {

                                          checkedlist = true;
                                       }

                                    });

                                    return (
                                       //  <ListGroup.Item   action className="list-item-listview"><i class="fas fa-circle" style={{color: 'green', paddingRight:'10px',fontSize:'10px'}}></i>{data.name}</ListGroup.Item>
                                       <li className='list-group-item rounded-0 pl-4 pt-2 pb-2 text-muted text-truncate  border-0  cursor-default' style={{ height: "40px" }}>
                                          <div class="custom-control-lg custom-control custom-checkbox  pl-4">
                                             <input type="checkbox" class="custom-control-input" checked={checkedlist} name={data.id} onChange={this.attributeToAttributeHanlder.bind(this)} id={data.id} />
                                             <label class="custom-control-label" For={data.id} name={"chk_"+data.name}></label>
                                             <span className="text-truncate ">{data.name}</span>
                                          </div>

                                       </li>
                                    );

                                 })}

                              </ul>
                           </div>
                        </div>
                     </div>

                        <div class="bg-white">
                           <button type="button" class="default-button btn btn-dark float-right p-0 mr-2 mb-2 mt-4" name="AddMap" disabled={this.state.showErrorMesage === true} onClick={this.mapAttributes.bind(this)} >Map</button>
                           {/* <button  type="button"  class=" btn btn-light float-right mr-4 mb-2">Remove</button> */}
                        </div>
                  </div>
               </div>
            </>
         )
      }
      else {
         return (
            <div class="card rounded-0 border-0 shadow-sm" style={{ height: '66vmin' }}>
               <div class="card-body p-0 border-0  ">

                  <div style={{ padding: "200px" }}>
                     <label className="text-bold common-color">No Mapping Data</label>
                  </div>


               </div>
            </div>
         )
      }
   }
   /**Map Masters Section End */


   /** Attribute Section Start */

   // Get Attribute Record Based on master Id
   async GetAttribute(MasterId) {
      const responseJson = await MasterBFLOWDataService.getByMasterId(MasterId);
      this.setState({ showAttributeTextbox: false })
      this.setState({ attributesList: responseJson })
      this.setState({ allAttributesList: responseJson })

      if (responseJson.length > 0) {
         this.setState({ attributesName: responseJson[0].name })
         this.setState({ attributesId: responseJson[0].id })
         this.setState({ disableButton: false });

      }
      else {
         this.setState({ attributesName: '' })
         this.setState({ attributesId: 0 })
         this.setState({ disableButton: true });
      }
      this.GetUser();
   }

   async GetAttributesList(id) {

      const responseJson = await MasterBFLOWDataService.getByMasterId(id);
      this.setState({ MapAtributeWithAtribute: responseJson })
      this.setState({ AllMapAtributeWithAtribute: responseJson })

      this.setState({ MapAllAtributeWithAtribute: responseJson })
      this.setState({ mapMasterId: id })


   }

   // Add Attributes
   async AddAttributes() {
      this.setState({ errorsName: "" })
      this.setState({ errorsOrder: "" })
      // checking ValidateAttributeValue
      //var value = this.ValidateAttributeValue();
      //if (value === true) {
      const body = JSON.stringify({
         Name: this.attributesName.value,
         MasterId: this.state.Id
      });
      const response = await BFLOWDataService.post('Attributes', body);
      if (response.Code === false && response.Code !== undefined) {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response.Message });
         this.setState({ ErrorMesageType: 'danger' });
         this.handleClose();
      }
      else {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response });
         this.setState({ ErrorMesageType: 'success' });
         this.handleClose();
         this.GetAttribute(this.state.Id)
      }

      this.setTimeOutForToasterMessages();
      // }
      // else {
      //    this.setState({ showErrorMesage: true });
      // }
   }

   ValidateAttributeValue() {
      if (!this.attributesName.value) {
         this.setState({ errorsName: "*Please enter Name" })
         return false
      }
      return true;
   }

   // Edit Attribute 
   async EditAttribute() {

      if (this.state.attributesList.length > 0) {
         var id = parseInt(this.state.attributesId);
         const body = JSON.stringify({
            name: this.AttributeValue.value,
            MasterId: this.state.Id
         });
         const response = await BFLOWDataService.put('Attributes', id, body);
         if (response.Code === false && response.Code !== undefined) {
            this.setState({ showErrorMesage: true });
            this.setState({ ErrorMesage: response.Message });
            this.setState({ ErrorMesageType: 'danger' });
         }
         else {
            this.setState({ showErrorMesage: true });
            this.setState({ ErrorMesage: response });
            this.setState({ ErrorMesageType: 'success' });
            this.setState({ showAttributeTextbox: false })
            this.GetAttribute(this.state.Id);

         }

         this.setTimeOutForToasterMessages();
      }

      else {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: "Please Add Attributes" });
         this.setState({ ErrorMesageType: 'danger' });
         this.setTimeOutForToasterMessages();
      }
   }

   //on click of Edit Button set state
   ShowAttributetextEditMaster() {
      if (this.state.showAttributeTextbox === true) {
         this.setState({ showAttributeTextbox: false })
      }
      else {
         this.setState({ showAttributeTextbox: true })
         this.setAttributeValue("true")
      }
   }
   // on based on state change label to teaxt box
   ShowtextEditAttribute() {
      if (this.state.showAttributeTextbox === true) {
         return (
            <div className="h-25">
               <input type="text"
                  placeholder="Enter Name"
                  ref={x => this.AttributeValue = x}
                  name="txtEditAttribute"
                  class="form-control form-control-no-border rounded-0 border-right-0 border-left-0  border-top-0 w-50 d-inline pl-2" />
               <i onClick={this.ShowAttributetextEditMaster.bind(this)} className="text-muted d-inline cursor-pointer" name="cancelAttribute"> <img src={cancelIcon} /></i>
               <i disabled={this.state.attributesList.length === 0} onClick={this.EditAttribute} className="text-muted d-inline cursor-pointer" name="confirmAttribute"> <img src={confirmIcon} /></i>
            </div>
         )
      } else {
         return (
            <>
               <h5 class="text-truncate d-inline pl-2">{this.state.attributesName}</h5>
               {this.showAttributeDeleteButton()}
               {this.showAttributeEditButton()}
            </>
         )
      }

   }

   // set state for Attribute Name and Id For Update the Attribute
   SetattributeIdAndName(name, id) {
      this.setState({ SelectALLUsers: false })
      this.setState({ attributesName: name })
      this.setState({ attributesId: id })
      this.setState({ showAttributeTextbox: false });
   }

   // bind Attribute with textbox
   setAttributeValue(value) {
      if (value === "true") {
         setTimeout(
            function () {
               this.AttributeValue.value = this.state.attributesName
            }
               .bind(this),
            100
         );

      }
   }

   // Search Attributes List
   searchAttributeHandler(event) {

      let searcjQery = event.target.value.toLowerCase();
      const displayedContacts = this.state.allAttributesList.filter((el) => {
         let searchValue = el.name.toLowerCase();
         return searchValue.indexOf(searcjQery) !== -1;
      })
      if (searcjQery !== "") {
         this.setState({
            attributesList: displayedContacts
         })
      }
      else {
         this.setState({
            attributesList: this.state.allAttributesList
         })
      }

   }

   async DeleteAttribute() {
      if (window.confirm("Do you wish to delete this item?")) {
         var id = parseInt(this.state.attributesId);
         const response = await BFLOWDataService.Delete('Attributes', id);
         if (response.Code === false && response.Code !== undefined) {
            this.setState({ showErrorMesage: true });
            this.setState({ ErrorMesage: response.Message });
            this.setState({ ErrorMesageType: 'danger' });
         }
         else {
            this.setState({ showErrorMesage: true });
            this.setState({ ErrorMesage: "Deleted success" });
            this.setState({ ErrorMesageType: 'success' });
            this.GetAttribute(this.state.Id);
         }

         this.setTimeOutForToasterMessages();
      }
   }

   /** Attribute Section End */


   /** Attrubute Mapping Section Starts */

   //Get All users
   async GetUser() {
      UserMappedId = [];
      MapMasterAttributesWithUsers = [];
      this.setState({ SelectALLUsers: false });

      const responseJson = await BFLOWDataService.get('Users');
      this.setState({ AllUserListbyattributesId: responseJson })
      this.setState({ UserList: responseJson })
      this.state.UserList.map((data, key) => {
         data.mapMasterAttributesWithUsers.filter((item) => {
            let id = this.state.attributesId;
            let attributeId = item.attributeId
            if (attributeId === id) {
               UserMappedId.push(data.id);
            }
         })
      })
   }

   bindMasterWithAttribute(data) {
      var MasterWithMaster = data.filter(x => x.isMapped === true);
      this.setState({ MapMasterWithAtribute: MasterWithMaster })
   }


   attributeToAttributeHanlder(event) {

      const isChecked = event.target.checked;
      let checkid = parseInt(event.target.name);

      if (this.state.MapMasterWithAtribute.length === 0) {
         return
      }

      for (let index = 0; index < this.state.allAttributesList.length; index++) {

         if (this.state.allAttributesList[index].id === this.state.attributesId) {
            if (this.state.allAttributesList[index].mapAttributesWithAttributes.length === 0) {
               this.state.allAttributesList[index]["mapAttributesWithAttributes"].push({ "primaryAttributeId": this.state.attributesId, "secondaryAttributeId": checkid });
               this.setState({ attributesList: this.state.allAttributesList })
               return
            }

            for (let j = 0; j < this.state.allAttributesList[index].mapAttributesWithAttributes.length; j++) {
               var data = this.state.allAttributesList[index].mapAttributesWithAttributes;
               var dataAttributesWithAttributes = data.filter(x => x.secondaryAttributeId === checkid)

               if (isChecked === true) {
                  if (dataAttributesWithAttributes.length === 0) {
                     this.state.allAttributesList[index]["mapAttributesWithAttributes"].push({ "primaryAttributeId": this.state.attributesId, "secondaryAttributeId": checkid });
                     this.setState({ attributesList: this.state.allAttributesList })
                     return
                  }
                  else {
                     this.state.allAttributesList[index].mapAttributesWithAttributes[j]["secondaryAttributeId"] = checkid;
                     this.setState({ attributesList: this.state.allAttributesList })
                     return
                  }
               }
               else {

                  if (this.state.allAttributesList[index].mapAttributesWithAttributes[j].secondaryAttributeId === checkid) {
                     this.state.allAttributesList[index].mapAttributesWithAttributes[j]["secondaryAttributeId"] = 0;
                     this.setState({ attributesList: this.state.allAttributesList })
                     return
                  }
               }
            }
         }
      }
   }


   attributeToAttributeHanlderUsers(event) {
      let item = parseInt(event.target.name);
      const isChecked = event.target.checked;
      if (this.state.attributesList.length === 0) {
         return
      }
      if (isChecked === true) {
         UserMappedId.push(item);

         for (var i = 0; i < this.state.UserList.length; i++) {
            let { id } = this.state.UserList[i];

            if (id === item) {
               var mapMasterAttributesWithUsers = this.state.AllUserListbyattributesId[i]["mapMasterAttributesWithUsers"];

               if (mapMasterAttributesWithUsers.length > 0 && mapMasterAttributesWithUsers[0].attributeId !== 0) {
                  for (var j = 0; j < mapMasterAttributesWithUsers.length; j++) {
                     var mapMasterAttributesWithUsersArray = this.state.AllUserListbyattributesId[i]["mapMasterAttributesWithUsers"][j];
                     if (mapMasterAttributesWithUsersArray.attributeId === 0) {

                        for (var k = 0; k < this.state.AllUserListbyattributesId[j]["mapMasterAttributesWithUsers"].length; k++) {
                           let { attributeId } = this.state.AllUserListbyattributesId[j]["mapMasterAttributesWithUsers"][k];
                           if (attributeId === this.state.attributesId) {
                              this.state.AllUserListbyattributesId[j]["mapMasterAttributesWithUsers"][k]["attributeId"] = this.state.attributesId;
                              break;
                           }
                        }
                     }
                     else {
                        this.state.AllUserListbyattributesId[i]["mapMasterAttributesWithUsers"].push({ "attributeId": this.state.attributesId });
                        break;
                     }
                  }
               }
               else {
                  this.state.AllUserListbyattributesId[i]["mapMasterAttributesWithUsers"].push({ "attributeId": this.state.attributesId });
                  break;
               }
            }
         }

         this.setState({ UserList: this.state.AllUserListbyattributesId })

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
               for (var k = 0; k < this.state.AllUserListbyattributesId[j]["mapMasterAttributesWithUsers"].length; k++) {
                  let { attributeId } = this.state.AllUserListbyattributesId[j]["mapMasterAttributesWithUsers"][k];
                  if (attributeId === this.state.attributesId) {
                     this.state.AllUserListbyattributesId[j]["mapMasterAttributesWithUsers"][k]["attributeId"] = 0;
                     break;
                  }
               }

            }
         }
         this.setState({ UserList: this.state.AllUserListbyattributesId })
      }
   }

   async   mapAttributes() {
      var MapAttributesWithAttributes = [];
      this.state.attributesList.map((data, key) => {
         if (data.id === this.state.attributesId) {
            data.mapAttributesWithAttributes.map((item, key) => {
               if (item.primaryAttributeId === this.state.attributesId) {
                  MapAttributesWithAttributes.push({ "PrimaryAttributeId": item.primaryAttributeId, "SecondaryAttributeId": item.secondaryAttributeId })
               }
            });
         }

      });

      const body = JSON.stringify({
         Id: this.state.attributesId,
         MapAttributesWithAttributes: MapAttributesWithAttributes

      });

      const response = await MasterBFLOWDataService.mapAttributesWithAttributes(body);
      if (response.Code === false && response.Code !== undefined) {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response.Message });
         this.setState({ ErrorMesageType: 'danger' });
         this.handleClose();
      }
      else {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response });
         this.setState({ ErrorMesageType: 'success' });
         this.handleClose();

      }
      setTimeout(
         function () {

            this.setState({ showErrorMesage: false });
            this.setState({ disableButton: false });
         }
            .bind(this),
         5000
      );

   }

   searchUserHandler(event) {

      let searcjQery = event.target.value.toLowerCase();
      const displayedContacts = this.state.AllUserListbyattributesId.filter((el) => {
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
            UserList: this.state.AllUserListbyattributesId
         })
      }

   }

   async MapUser() {

      this.setState({ disableButton: true });
      UserMappedId.map((data, key) => {
         MapMasterAttributesWithUsers.push({ "UserId": data, })
      });

      const body = JSON.stringify({
         Id: this.state.attributesId,
         MapMasterAttributesWithUsers: MapMasterAttributesWithUsers

      });
      const response = await MasterBFLOWDataService.mapUserWithAttributes(body);
      if (response.Code === false && response.Code !== undefined) {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response.Message });
         this.setState({ ErrorMesageType: 'danger' });
         this.handleClose();
      }
      else {
         this.setState({ showErrorMesage: true });
         this.setState({ ErrorMesage: response });
         this.setState({ ErrorMesageType: 'success' });
         this.handleClose();

      }
      setTimeout(
         function () {

            this.setState({ showErrorMesage: false });
            this.setState({ disableButton: false });
         }
            .bind(this),
         5000
      );


   }

   SelectALLUsers(event) {
      const isChecked = event.target.checked;

      if (this.state.attributesList.length === 0) {
         return
      }
      if (isChecked === true) {
         this.setState({ SelectALLUsers: true })

         for (var i = 0; i < this.state.UserList.length; i++) {
            let userid = this.state.UserList[i].id;

            UserMappedId.push(userid);

            var mapMasterAttributesWithUsers = this.state.AllUserListbyattributesId[i]["mapMasterAttributesWithUsers"];
            if (mapMasterAttributesWithUsers.length > 0) {
               for (var k = 0; k < this.state.AllUserListbyattributesId[i]["mapMasterAttributesWithUsers"].length; k++) {

                  let { attributeId } = this.state.AllUserListbyattributesId[i]["mapMasterAttributesWithUsers"][k];
                  if (attributeId === this.state.attributesId) {
                     this.state.AllUserListbyattributesId[i]["mapMasterAttributesWithUsers"][k]["attributeId"] = this.state.attributesId;
                  }
                  else {
                     this.state.AllUserListbyattributesId[i]["mapMasterAttributesWithUsers"].push({ "attributeId": this.state.attributesId });
                  }
               }
            }
            else {
               this.state.AllUserListbyattributesId[i]["mapMasterAttributesWithUsers"].push({ "attributeId": this.state.attributesId });

            }



         }

         this.setState({ UserList: this.state.AllUserListbyattributesId })

      }
      else {
         this.setState({ SelectALLUsers: false })
         var userlist = this.state.UserList;
         for (var j = 0; j < userlist.length; j++) {
            let { id } = userlist[j];
            var listofproject = UserMappedId.filter(x => x === id)
            UserMappedId = UserMappedId.filter(function (id) {
               return listofproject.indexOf(id) === -1;
            })
            for (var k = 0; k < this.state.AllUserListbyattributesId[j]["mapMasterAttributesWithUsers"].length; k++) {
               let { attributeId } = this.state.AllUserListbyattributesId[j]["mapMasterAttributesWithUsers"][k];
               if (attributeId === this.state.attributesId) {
                  this.state.AllUserListbyattributesId[j]["mapMasterAttributesWithUsers"][k]["attributeId"] = 0;

               }
            }


         }
         this.setState({ UserList: this.state.AllUserListbyattributesId })
      }

   }

   showTabBasedOnAttributeValue() {
      if (this.state.attributesList.length > 0) {
         return (
            <>
               <Tabs defaultActiveKey="MasterCard" id="uncontrolled-tab-example">
                  <Tab
                     className="tab-content-mapping"
                     eventKey="MasterCard"
                     title="Team Members"
                     name="TeamMembers"
                  >
                     <div className="card rounded-0 border-0 shadow-sm" >
                        <div class="card-body p-0 border-0  ">
                           <nav class="navbar navbar-expand navbar-light p-0 border-0">
                              <div class="input-group ">
                                 <input placeholder="Search" onChange={this.searchUserHandler} aria-describedby="inputGroupPrepend" name="username" type="text" class=" search-textbox form-control rounded-0 border-right-0 border-left-0 pt-1"   />
                                 <div class="input-group-prepend ">
                                    <span class="search-icon input-group-text bg-white border-left-0 border-right-0 border-top-0" id="inputGroupPrepend">
                                       <i class="fa fa-search text-muted" aria-hidden="true"></i>
                                    </span>
                                 </div>
                              </div>
                           </nav>
                           <div class="scrollbar" style={{ height: '60vh' }}>
                              <table class="table w-95 ml-3 mr-3" style={{ borderbottom: "1px solid #dee2e6" }}>
                                 <thead>
                                    <tr>
                                       <th scope="col" className="border-th"> <div class="custom-control-lg custom-control   custom-checkbox pl-5">
                                          <input type="checkbox" class="custom-control-input" id="customCheck1" disabled={!this.state.isUserOnBoardingRequired} onChange={this.SelectALLUsers.bind(this)} checked={this.state.SelectALLUsers} />
                                          <label class="custom-control-label" for="customCheck1"></label>
                                          <span className="">UserName</span>
                                          {/* <span className="">(FirstName  LastName)</span> */}
                                       </div> 
                                       </th>
                                       <th scope="col" className="pr-5 border-th">Email</th>
                                       <th scope="col" className="pr-5 border-th">Manager</th>
                                       
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {this.state.UserList.map((data, key) => {
                                       debugger
                                       let checkedlist = false;
                                    
                                       data.mapMasterAttributesWithUsers.filter((item) => {
                                          let id = this.state.attributesId;
                                          let attributeId = item.attributeId
                                          if (attributeId === id) {
                                             checkedlist = true;
                                          }
                                       });
                                       return (
                                          <tr>
                                             <td> <div class="custom-control-lg custom-control custom-checkbox  pl-5">
                                                <input type="checkbox" class="custom-control-input" disabled={!this.state.isUserOnBoardingRequired} checked={checkedlist} name={data.id} onChange={this.attributeToAttributeHanlderUsers.bind(this)} id={data.id} />
                                                <label class="custom-control-label" for={data.id} name={"chk_"+data.userName}></label>
                                                <span className="text-truncate "><i class="fas fa-circle text-success mr-2" style={{ fontSize: ".75rem" }}></i>{data.firstName + " " + data.lastName}</span>
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
                           <div class="bg-white mr-2">
                           <button type="button" class="default-button btn btn-dark float-right p-0 mr-2 mb-2 mt-2" name="AddMap" disabled={this.state.disableButton} onClick={this.MapUser.bind(this)}>Map</button>
                              {/* <button  type="button"  class=" btn btn-light float-right mr-4 mb-2">Remove</button> */}
                           </div>
                     </div>
                  </Tab>
                  <Tab
                     className="tab-content-mapping"
                     eventKey="Feedback"
                     title="Mapping"
                     name="Mapping"
                  >
                     {this.DispayBlockForMasterMapping()}

                  </Tab>
               </Tabs>
            </>

         )
      }
      else {
         return (
            <div class="card rounded-0 border-0 shadow-sm" style={{ height: '71vh' }}>
               <div class="card-body border-0 ">
                  <div style={{ padding: "240px" }}>
                     <a onClick={this.OpenModel} className="cursor-pointer"><label className="cursor-pointer text-bold common-color">Please Add Values</label></a>
                  </div>

               </div>
            </div>
         )
      }
   }

   searchMapAttributes(event) {
      let searcjQery = event.target.value.toLowerCase();
      const displayedContacts = this.state.AllMapAtributeWithAtribute.filter((el) => {
         let searchValue = el.name.toLowerCase();
         return searchValue.indexOf(searcjQery) !== -1;
      })
      if (searcjQery !== "") {
         this.setState({
            MapAtributeWithAtribute: displayedContacts
         })
      }
      else {
         this.setState({
            MapAtributeWithAtribute: this.state.AllMapAtributeWithAtribute
         })
      }

   }
   handleCloseErrorMessage() {

      this.setState({ showErrorMesage: false })
   }

   /** Attrubute Mapping Section Ends */

   render() {
      return (
         <>
            <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.ErrorMesage} visible={this.state.showErrorMesage} Type={this.state.ErrorMesageType}>
            </AlertBanner>
            <div class="card w-100 border-bottom mt-1 border-top-0 border-right-0 border-left-0 rounded-0 pt-2 shadow-sm  h-60">
               {this.showtextonEdit()}
            </div>

            {this.showMappingCard()}
            <div class="container-fluid">
               <div class="row" >
                  <div class="col-sm-5   pl-0" >
                     <div class="card rounded-0  bg-white shadow-sm  list-card-masters" >
                        <nav class="navbar navbar-expand navbar-light p-0  shadow-sm ">
                           <div class="input-group">
                              <input type="text"
                                 placeholder="Search"
                                 aria-describedby="inputGroupPrepend"
                                 name="Search"
                                 onChange={this.searchAttributeHandler.bind(this)}
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
                                    <i class="fa fa-filter text-muted" name="sortMaster"  aria-hidden="true"></i>
                                 </span>
                              </div>
                              <div class="input-group-prepend">
                                 <span class="filter-sort-icon input-group-text bg-white  border-top-0"  id="inputGroupPrepend">
                                    <i class="fa fa-sort text-muted" name="filterMaster"  aria-hidden="true"></i>
                                 </span>
                              </div>

                           </div>
                        </nav>
                        <ul class="list-group scrollbar" name="AttributesList">
                           {this.state.attributesList.map((data, key) => {
                              return (
                                 //  <ListGroup.Item   action className="list-item-listview"><i class="fas fa-circle" style={{color: 'green', paddingRight:'10px',fontSize:'10px'}}></i>{data.name}</ListGroup.Item>
                                 <li onClick={this.SetattributeIdAndName.bind(this, data.name, data.id)} name={data.name} className={this.state.attributesId === data.id ? 'list-group-item rounded-0 pl-2 pt-3 pb-3  text-muted text-truncate  border-left-0 border-right-0 active cursor-default bf-minheight-60' : 'list-group-item rounded-0 pl-2 pt-3 pb-3 text-muted text-truncate  border-left-0 border-right-0 cursor-default bf-minheight-60'}><label>{data.name}</label></li>
                              );
                           })}
                        </ul>
                        {this.showMasterAddButton()}

                     </div>
                  </div>
                  <div class="col-sm-7 pl-2">
                     <div class="pl-0 pr-2 pt-3 pb-3 h-60  text-secondary ">
                        {this.ShowtextEditAttribute()}
                     </div>
                     {this.showTabBasedOnAttributeValue()}
                  </div>
               </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter" centered show={this.state.show} onHide={this.handleClose} >
               <Modal.Header closeButton  className="pop-Header">
                  <Modal.Title id="contained-modal-title-vcenter "><label title={this.state.masterValues} className="text-truncate" >Add  {this.state.masterValues}</label></Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <form class="form-horizontal" role="form">
                     <div class="form-group">
                        <label class="col-sm-2 control-label"
                           for="inputEmail3">Name</label>
                        <div class="col-sm-10">
                           <input type="text"
                              placeholder="Enter Name"
                              aria-describedby="inputGroupPrepend"
                              ref={x => this.attributesName = x}
                              name="txtAddAttribute"
                              class="search-textbox form-control rounded-0 border-right-0 border-left-0 border-top-0 w-100 " />
                           <label className="errorMsg">{this.state.errorsName}</label>
                           <label></label>
                        </div>
                     </div>
                  </form>
               </Modal.Body>
               <Modal.Footer className="pop-footer">
                  <Button name="btnClose" className="btn-light float-right default-button-secondary"  onClick={this.handleClose}>
                     Close
  </Button>
                  <Button  name="btnAdd" className="default-button btn-dark float-right mr-2 p-0"  onClick={this.AddAttributes}>
                     Add
  </Button>

               </Modal.Footer>
            </Modal>
         </>


      );
   }
}

export default withGlobalState(Masters)