import React, { Component } from 'react';

import { NotificationsBFLOWDataService } from "../../configuration/services/NotificationsDataService";
import editIcon from '../../assets/fonts/edit.svg';

import {SharedServices} from '../../configuration/services/SharedService';
import './EmailNotifications.css'
const AlertBanner = React.lazy(() => SharedServices.retry(()=> import('../../components/AlertBanner/index')))

let EmailNotificationsList=[];
class EmailNotifications extends Component {


    constructor(context, props) {
        super(context, props);
    
        this.state = {
          eventList: [],
          //messages
      showErrorMesage: false,
      errorMessage: '',
      errorMessageType: ''
          
        };
        this.handleCloseErrorMessage = this.handleCloseErrorMessage.bind(this);
       
      }
    componentDidMount() {
        this.GetEvents();
      }
      handleCloseErrorMessage() {
        this.setState({ showErrorMesage: false })
      }
    

      async GetEvents() {
        
        const responseJson = await NotificationsBFLOWDataService.getEventType();
      
        this.setState({ eventList: responseJson });
      }

      mapEmailNotifications(EventId,Name,Type,event){
        
        const isChecked = event.target.checked;
      let eventtypelist=this.state.eventList;
     
for (let i = 0; i < eventtypelist.length; i++) {
  if(eventtypelist[i].name===Name){
    for (let j = 0; j <  eventtypelist[i].events.length; j++) {
      if(EventId===eventtypelist[i].events[j].id){

     
    
      if(isChecked===true){
        if(Type==="Requester"){
          eventtypelist[i].events[j].emailNotifications[0].forRequestor=true
        }
       else if(Type==="Asignee"){
          eventtypelist[i].events[j].emailNotifications[0].forAssignee=true
        }
       else if(Type==="Watcher"){
          eventtypelist[i].events[j].emailNotifications[0].forWatcher=true
        }
        else if(Type==="All"){
          eventtypelist[i].events[j].emailNotifications[0].forRequestor=true
          eventtypelist[i].events[j].emailNotifications[0].forAssignee=true
          eventtypelist[i].events[j].emailNotifications[0].forWatcher=true
          
        }
  
       
      }
      else{
        if(Type==="Requester"){
          eventtypelist[i].events[j].emailNotifications[0].forRequestor=false
        }
       else if(Type==="Asignee"){
          eventtypelist[i].events[j].emailNotifications[0].forAssignee=false
        }
       else if(Type==="Watcher"){
          eventtypelist[i].events[j].emailNotifications[0].forWatcher=false
        }
        else if(Type==="All"){
          eventtypelist[i].events[j].emailNotifications[0].forRequestor=false
          eventtypelist[i].events[j].emailNotifications[0].forAssignee=false
          eventtypelist[i].events[j].emailNotifications[0].forWatcher=false
          
        }
      }
    }
  }
   
   }

  
}

this.setState({eventList:eventtypelist})

      }

    async  mapNotification(){
        
       let emailNotifications=[];
        this.state.eventList.map((data, key) => {
          data.events.map((item, key) => {
            emailNotifications=  emailNotifications.concat(item.emailNotifications[0]);
          })
        })

        const body = JSON.stringify(emailNotifications);
        
       const response = await NotificationsBFLOWDataService.mapEmailNotifications(body);
       
       if (response.Code === false && response.Code !== undefined) {
          this.setState({ showErrorMesage: true });
          this.setState({ errorMessage: response.Message });
          this.setState({ errorMessageType: 'danger' });
         
       }
       else {
          this.setState({ showErrorMesage: true });
          this.setState({ errorMessage: response });
          this.setState({ errorMessageType: 'success' });
          this.GetEvents();
        
       }
 
       this.setTimeOutForToasterMessages();
        
      }

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

    render() {

        return (
        <>
 <AlertBanner onClose={this.handleCloseErrorMessage} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
        </AlertBanner>
<div class="container-fluid" >
<div class="row" >
<div className="scrollbar w-100" style={{height:"77.1vh",backgroundColor:"#FAFAFB"}}>
{this.state.eventList.map((data, key) => {
  return(
    <div class="col-sm-12 pt-4 pb-2" >
<div className="card border-0 shadow-sm  bg-white scrollbar pr-0  rounded-0" style={{fontSize:"1.25rem",borderRadius:"8px", marginLeft:"15rem" ,marginTop:".5rem" ,marginRight:"15rem"}}>
<table className="">
  <tr className="app">
      <th className="col-sm-4"> <label style={{fontSize:"1rem", fontWeight: "640"}}>{data.name}
</label></th>
      <th className="col-sm-2"> <label style={{fontSize:"1rem" ,fontWeight: "400"}}>Requester</label></th>
      <th className="col-sm-2"><label style={{ fontSize:"1rem", fontWeight: "400"}}>Assignee</label></th>
      <th className="col-sm-2"><label style={{fontSize:"1rem",fontWeight: "400"}}>Watcher</label></th>
      <th className="col-sm-2"><label style={{fontSize:"1rem",fontWeight: "400"}}>All</label></th>
  </tr>
   {data.events.map((item, key) => {
   
     var checked=false;
     if(item.emailNotifications[0].forRequestor===true && item.emailNotifications[0].forAssignee ===true && item.emailNotifications[0].forWatcher===true){
      checked=true;
     }

      return(
        <tr className="pt-4">
        <td className="col-sm-4"><label className="pl-2 pt-2" style={{ fontSize:"1rem", fontWeight: "400"}}> {item.name}</label>
  
        </td>
        <td className="col-sm-3">
      
        <div class="checkbox_wrapper ml-4">
                    <input type="checkbox" checked={item.emailNotifications[0].forRequestor}  id={"Requester"+ item.name} onChange={this.mapEmailNotifications.bind(this,item.id,data.name,"Requester")}/>
                 <label></label>
               </div>
  
  
  </td>
  <td className="col-sm-2"> 
  <div class="checkbox_wrapper ml-3">
                    <input type="checkbox" checked={item.emailNotifications[0].forAssignee}  id={"Asignee"+ item.name} onChange={this.mapEmailNotifications.bind(this,item.id,data.name,"Asignee")}/>
                 <label></label>
               </div>   
  </td>
  <td className="col-sm-2">  
  <div class="checkbox_wrapper ml-3">
                    <input type="checkbox" checked={item.emailNotifications[0].forWatcher}  id={"Watcher"+ item.name}  onChange={this.mapEmailNotifications.bind(this,item.id,data.name,"Watcher")}/>
                 <label ></label>
               </div>
  
  
  </td>
  <td className="col-sm-2 tableboder">  
  <div class="checkbox_wrapper ">
                    <input type="checkbox" checked={checked}  id={"All"+ item.name} name={data.name+item.name} onChange={this.mapEmailNotifications.bind(this,item.id,data.name,"All")}/>
                 <label ></label>
               </div>

             
  
  </td>
        </tr> 
      )
      
   })}
    
    
</table>
</div>
    </div>
     )
  
  })}


    </div>
    <div class="pt-3 w-100 border-0 shadow-sm"  style={{fontSize:"1.25rem",borderRadius:"8px", marginLeft:"15rem"  ,marginRight:"15rem" , height:"150%"}}>
                           <div class="card-footer bg-white border-0 shadow-sm" style={{height:"80px"}}  >
                           <button type="button" class="default-button btn btn-dark float-right mr-2 mb-0 mt-2 p-0" name="AddMap"  onClick={this.mapNotification.bind(this)}>Save</button>
                              {/* <button  type="button"  class=" btn btn-light float-right mr-4 mb-2">Remove</button> */}
                           </div>
                        </div>
    </div>
    </div>
  
   
          </>
)
        }
}
export default EmailNotifications