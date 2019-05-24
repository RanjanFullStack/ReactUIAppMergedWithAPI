import React, { Component } from 'react';
import './TimeZone.css'
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import { withGlobalState } from 'react-globally'
import AlertBanner from '../../components/AlertBanner/index'

class TimeZone extends Component {
   constructor(props) {


      super(props)
      this.state = {
         timezonelist: [],
         Alltimezonelist: [],
         TimeZoneName: '',
         TimeZoneId: 0,
         isTimeZoneActive: false,
         TimeZoneCode: '',
         systemTimeZoneId: '',
         showErrorMesage: false,
         errorMessageType: '',
         errorMessage: '',
      }
      this.searchHandler = this.searchHandler.bind(this);
   }

   componentDidMount() {
      this.GetTimeZone()

      var usaTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
      usaTime = new Date(usaTime);
      console.log('USA time: ' + usaTime.toLocaleString())
   }





   async GetTimeZone() {
      const responseJson = await BFLOWDataService.get('Timezone');
      this.setState({ Alltimezonelist: responseJson })
      this.setState({ timezonelist: responseJson })
      this.setState({ TimeZoneName: responseJson[0].timeZoneName })
      this.setState({ TimeZoneId: responseJson[0].id })
      this.setState({ isTimeZoneActive: responseJson[0].isActive })
      this.setState({ TimeZoneCode: responseJson[0].timeZoneCode })
      this.setState({ systemTimeZoneId: responseJson[0].systemTimeZoneId })
   }

   SetTimezoneIdAndName(id, name, isActive, TimeZoneCode, SystemTimeZoneID) {
      this.setState({ TimeZoneName: name })
      this.setState({ TimeZoneId: id })
      this.setState({ isTimeZoneActive: isActive })
      this.setState({ TimeZoneCode: TimeZoneCode })
      this.setState({ systemTimeZoneId: SystemTimeZoneID })

   }

   async handleCheck() {

      var id = parseInt(this.state.TimeZoneId)
      var checking = !this.state.isTimeZoneActive;
      this.setState({ isTimeZoneActive: checking });


      const body = JSON.stringify({ isActive: checking });
      const response = await BFLOWDataService.put('Timezone', id, body);
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
         this.GetTimeZone();
      }
      this.setTimeOutForToasterMessages();
   }
   // Bind Text box with value
   setMasterValue(value) {

      if (value === "true") {
         setTimeout(
            function () {
               this.MasterValue.value = this.state.Mastervalues
            }
               .bind(this),
            100
         );

      }
   }

   hideErrorMessage() {
      this.setState({ showErrorMesage: false })
   }

   // Search Attributes List
   searchHandler(event) {

      let searcjQery = event.target.value.toLowerCase();
      const displayedContacts = this.state.Alltimezonelist.filter((el) => {
         let searchValue = el.timeZoneName.toLowerCase();
         return searchValue.indexOf(searcjQery) !== -1;
      })
      if (searcjQery !== "") {
         this.setState({
            timezonelist: displayedContacts
         })
      }
      else {
         this.setState({
            timezonelist: this.state.Alltimezonelist
         })
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
   render() {

      return (
         <>

            <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
              </AlertBanner>

            {/* <div class="card w-100 border-bottom mt-2 border-top-0 border-right-0 border-left-0 rounded-0 pt-2  h-80">

            <div class="w-100 pt-2">        
           
           <h3 class="card-title ml-4 d-inline text-truncate mt-4">Time Zone</h3> 
          
           </div>
           </div> */}
            <div class="container-fluid">
               <div class="row" >
                  <div class="col-sm-5   pl-0" >
                     <div class="card rounded-0  bg-white" style={{ height: '80.5vmin' }}>
                        <nav class="navbar navbar-expand navbar-light p-0  shadow-sm ">
                           <div class="input-group">
                              <input type="text"
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
                        <ul class="list-group listGroup-scroll" name="TimeZoneList">


                           {this.state.timezonelist.map((data, key) => {

                              return (
                                 //  <ListGroup.Item   action className="list-item-listview"><i class="fas fa-circle" style={{color: 'green', paddingRight:'10px',fontSize:'10px'}}></i>{data.name}</ListGroup.Item>
                                 <li onClick={this.SetTimezoneIdAndName.bind(this, data.id, data.timeZoneName, data.isActive, data.timeZoneCode, data.systemTimeZoneId)} className={this.state.TimeZoneName === data.timeZoneName ? 'list-group-item rounded-0 pl-2 pt-3 pb-3 text-muted text-truncate  border-left-0 border-right-0 cursor-default bf-minheight-60 active' : 'list-group-item rounded-0 pl-2 pt-3 pb-3 text-muted text-truncate  border-left-0 border-right-0 cursor-default bf-minheight-60'}><i class="fas fa-circle"
                                    style={data.isActive == true ? { color: "green", paddingRight: "10px", fontSize: "15px" } : { color: "red", paddingRight: "10px", fontSize: "15px" }}></i>{data.timeZoneName}</li>
                              );

                           })}

                        </ul>


                     </div>
                  </div>
                  <div class="col-sm-7 pl-2">
                     <div class="pl-0 pr-2 pt-3 pb-3 h-60  text-secondary ">
                        {/* {this.ShowtextEditAttribute()} */}

                        <h5 class="text-truncate d-inline pl-2">{this.state.TimeZoneName}</h5>
                        <label class="switch float-right">
                           <input type="checkbox" onChange={this.handleCheck.bind(this)} checked={this.state.isTimeZoneActive} />
                           <span class="slider round"></span>
                        </label>

                     </div>
                     <div class="card rounded-0 border-0 shadow-sm listGroup-scroll" style={{ height: '70vmin' }}>

                        <table class="table table-bordered mt-5">
                           <thead>

                           </thead>
                           <tbody>
                              <tr>
                                 <th scope="row">Time Zone Code</th>
                                 <td>{this.state.TimeZoneCode}</td>
                              </tr>
                              <tr>
                                 <th scope="row">Time Zone ID</th>
                                 <td>{this.state.systemTimeZoneId}</td>
                              </tr>

                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

            </div>


         </>


      );
   }
}

export default withGlobalState(TimeZone)