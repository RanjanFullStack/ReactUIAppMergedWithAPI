import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import moment from 'moment';
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
const AlertBanner = React.lazy(() =>import ( '../../components/AlertBanner/index'));


class TimeTracking extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
timeTrackingDataOrignal:[],
timeTrackingDataNewAndUpdated:[],
currentDate:Date,
currentDay:"",
sunDate:"",
monDate:"",
tueDate:"",
wedDate:"",
thurDate:"",
friDate:"",
satDate:"",
sunData:"0",
monData:"0",
tueData:"0",
wedData:"0",
thurData:"0",
friData:"0",
satData:"0",
weekTrackingTotal:0,
weekStartDate:null,

      showTextBox:[{ show:false},
        { show:false},
        { show:false},
        { show:false},
        { show:false},
        { show:false},
        { show:false}
    ],
           // Error handling states start
           showErrorMessage: false,
           ErrorMessage: '',
           ErrorMessageType: '',
           errorsName: '',
           errorsOrder: '',
           errorsKey: '',
           errorsValue: '',
           visible: false,
  
           // Error handling states end 

        }
    
        this.NextWeek=this.NextWeek.bind(this);
        this.BackWeek=this.BackWeek.bind(this);
        this.getAllTimeTrackingData=this.getAllTimeTrackingData.bind(this);
        this.getTimeTrackingDataWithDates=this.getTimeTrackingDataWithDates.bind(this);
        this.saveTimeTrackingData=this.saveTimeTrackingData.bind(this);
        this.submitTimeTracking=this.submitTimeTracking.bind(this);
}

showInputBoxSun()
{
  let newState = Object.assign({}, this.state);
   if(this.state.showTextBox[0].show===false)
    {
      newState.showTextBox[0].show=true
  
    }
    this.setState({newState})
}

showInputBoxMon()
{
  let newState = Object.assign({}, this.state);
   if(this.state.showTextBox[1].show===false)
    {
      newState.showTextBox[1].show=true
  
    }
    this.setState({newState})
}

showInputBoxTue()
{
  let newState = Object.assign({}, this.state);
   if(this.state.showTextBox[2].show===false)
    {
      newState.showTextBox[2].show=true
  
    }
    this.setState({newState})
}

showInputBoxWed()
{
  let newState = Object.assign({}, this.state);
   if(this.state.showTextBox[3].show===false)
    {
      newState.showTextBox[3].show=true
  
    }
    this.setState({newState})
}


showInputBoxThur()
{
  let newState = Object.assign({}, this.state);
   if(this.state.showTextBox[4].show===false)
    {
      newState.showTextBox[4].show=true
  
    }
    this.setState({newState})
}


showInputBoxFri()
{
  let newState = Object.assign({}, this.state);
   if(this.state.showTextBox[5].show===false)
    {
      newState.showTextBox[5].show=true
  
    }
    this.setState({newState})
}

showInputBoxSat()
{
  let newState = Object.assign({}, this.state);
   if(this.state.showTextBox[6].show===false)
    {
      newState.showTextBox[6].show=true
  
    }
    this.setState({newState})
}


onBlurInputBoxSun()
{
  let newState = Object.assign({}, this.state);

    if(this.state.showTextBox[0].show===true)
    {
      newState.showTextBox[0].show=false
  
    }
    this.setState({newState})
}

onBlurInputBoxMon()
{
  let newState = Object.assign({}, this.state);

    if(this.state.showTextBox[1].show===true)
    {
      newState.showTextBox[1].show=false
  
    }
    this.setState({newState})
}

onBlurInputBoxTue()
{
  let newState = Object.assign({}, this.state);

    if(this.state.showTextBox[2].show===true)
    {
      newState.showTextBox[2].show=false
  
    }
    this.setState({newState})
}


onBlurInputBoxWed()
{
  let newState = Object.assign({}, this.state);

    if(this.state.showTextBox[3].show===true)
    {
      newState.showTextBox[3].show=false
  
    }
    this.setState({newState})
}


onBlurInputBoxThur()
{
  let newState = Object.assign({}, this.state);

    if(this.state.showTextBox[4].show===true)
    {
      newState.showTextBox[4].show=false
  
    }
    this.setState({newState})
}


onBlurInputBoxFri()
{
  let newState = Object.assign({}, this.state);

    if(this.state.showTextBox[5].show===true)
    {
      newState.showTextBox[5].show=false
  
    }
    this.setState({newState})
}


onBlurInputBoxSat()
{
  let newState = Object.assign({}, this.state);

    if(this.state.showTextBox[6].show===true)
    {
      newState.showTextBox[6].show=false
  
    }
    this.setState({newState})
}

getWeekTotal()
{debugger
  setTimeout(
    function () {
      var weekTotal=parseInt(this.state.monData) + parseInt(this.state.tueData) + parseInt(this.state.wedData) + parseInt(this.state.thurData) + parseInt(this.state.friData) + parseInt(this.state.satData) + parseInt(this.state.sunData);
      this.setState({weekTrackingTotal:weekTotal})
    }
      .bind(this),
    20
  );
 

}



// async componentDidMount()
// {
 
// this.getAllTimeTrackingData();
// const responseJson = await BFLOWDataService.get("TimeTracking");
// this.setState({ timeTrackingDataOrignal: responseJson,timeTrackingDataUpdated:responseJson });
// this.setState({
//   monDate:moment().startOf('week').format('ddd Do YYYY'),
//   tueDate:moment().startOf('week').add('d',1).format('ddd Do YYYY'),
//   wedDate:moment().startOf('week').add('d',2).format('ddd Do YYYY'),
//   thurDate:moment().startOf('week').add('d',3).format('ddd Do YYYY'),
//   friDate:moment().startOf('week').add('d',4).format('ddd Do YYYY'),
//   satDate:moment().startOf('week').add('d',5).format('ddd Do YYYY'),
//   sunDate:moment().startOf('week').subtract('d',1).format('ddd Do YYYY'),
// })



// var weekStart= moment().startOf('week').format('DD');

// this.setState({weekStartDate:weekStart});

// this.getTimeTrackingDataWithDates();

// }





async componentDidMount()
{
 debugger
this.getAllTimeTrackingData();
const responseJson = await BFLOWDataService.get("TimeTracking");
this.setState({ timeTrackingDataOrignal: responseJson });
  var date = new Date();
this.setState({currentDate:date});
  var today = new Date();
  date=today.getDay();
  this.setState({currentDate:date});


  if(date===1)
  {
    debugger
    let begin=moment().startOf('week').format('dddd DD-MM-YYYY');
    this.setState({
      monDate:moment().toDate().toDateString(),
      tueDate:moment().add(1,'d').toDate().toDateString(),
      wedDate:moment().add(2,'d').toDate().toDateString(),
      thurDate:moment().add(3,'d').toDate().toDateString(),
      friDate:moment().add(4,'d').toDate().toDateString(),
      satDate:moment().add(5,'d').toDate().toDateString(),
      sunDate:moment().subtract(1,'d').toDate().toDateString(),
})

var weekStart= moment().subtract(2,'d').toDate();
}


  if(date===2)
  {
    debugger
    let begin=moment().startOf('week').format('dddd DD-MM-YYYY');
    this.setState({
      monDate:moment().subtract(1,'d').toDate().toDateString(),
      tueDate:moment().toDate().toDateString(),
      wedDate:moment().add(1,'d').toDate().toDateString(),
      thurDate:moment().add(2,'d').toDate().toDateString(),
      friDate:moment().add(3,'d').toDate().toDateString(),
      satDate:moment().add(4,'d').toDate().toDateString(),
      sunDate:moment().subtract(2,'d').toDate().toDateString(),
})

var weekStart= moment().subtract(2,'d').toDate();
}




  if(date===3)
  {
    var mon= moment().subtract(2,'d').toDate().toDateString();
    var tue= moment().subtract(1,'d').toDate().toDateString();
    var wed=moment().toDate().toDateString();
    var thur= moment().add(1,'d').toDate().toDateString();
    var fri= moment().add(2,'d').toDate().toDateString();
    var sat= moment().add(3,'d').toDate().toDateString();
    var sun= moment().subtract(3,'d').toDate().toDateString();

    this.setState({
     monDate:mon,
     tueDate:tue,
     wedDate:wed,
     thurDate:thur,
     friDate:fri,
     satDate:sat,
     sunDate:sun
  })

  var weekStart= moment().subtract(2,'d').toDate();

 

}
  if(date===4)
  {


    this.setState({
      monDate:moment().subtract(3,'d').toDate().toDateString(),
      tueDate:moment().subtract(2,'d').toDate().toDateString(),
      wedDate:moment().subtract(1,'d').toDate().toDateString(),
      thurDate:moment().toDate().toDateString(),
      friDate:moment().add(1,'d').toDate().toDateString(),
      satDate:moment().add(2,'d').toDate().toDateString(),
      sunDate:moment().subtract(4,'d').toDate().toDateString(),
        
  })

  var weekStart= moment().subtract(11,'d').toDate();
  }
  if(date===5)
  {


     
    this.setState({
      monDate:moment().subtract(4,'d').toDate().toDateString(),
      tueDate:moment().subtract(3,'d').toDate().toDateString(),
      wedDate:moment().subtract(2,'d').toDate().toDateString(),
      thurDate:moment().subtract(1,'d').toDate().toDateString(),
      friDate:moment().toDate().toDateString(),
      satDate:moment().add(1,'d').toDate().toDateString(),
      sunDate:moment().subtract(5,'d').toDate().toDateString(),
})



var weekStart= moment().subtract(5,'d').toDate();



}

if(date===6)
{
  this.setState({
    monDate:moment().subtract(5,'d').toDate().toDateString(),
    tueDate:moment().subtract(4,'d').toDate().toDateString(),
    wedDate:moment().subtract(3,'d').toDate().toDateString(),
    thurDate:moment().subtract(2,'d').toDate().toDateString(),
    friDate:moment().subtract(1,'d').toDate().toDateString(),
    satDate:moment().toDate().toDateString(),
    sunDate:moment().subtract(6,'d').toDate().toDateString(),
})



var weekStart= moment().subtract(5,'d').toDate();




}
var abc=weekStart.getDate();
this.setState({weekStartDate:abc});
  
this.getTimeTrackingDataWithDates();
}



saveTimeTrackingData()
{
  debugger

  let newState = Object.assign({}, this.state);
  let timeTrackingDataOrignal= this.state.timeTrackingDataOrignal;
  // let timeTrackingDataNewAndUpdated= this.state.timeTrackingDataNewAndUpdated;
  


//monday
let flagMon=0;
this.state.timeTrackingDataOrignal.map((element, key) => {
    if(moment(this.state.monDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
      {
          if(this.state.monData !==element.hours)
          {
            newState.timeTrackingDataOrignal[key].hours = this.state.monData;
            // let valueArrayData=newState.timeTrackingDataOrignal[key];
          }
          flagMon=1;
      }
    }
   );
if(flagMon===0 && this.state.monData>0)
{
  var data ={trackingDate:this.state.monDate , hours:this.state.monData};
  timeTrackingDataOrignal.push(data); 
  
}

//end monday



//TueData
let flagtue=0;
this.state.timeTrackingDataOrignal.map((element, key) => {
    if(moment(this.state.tueDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
      {
          if(this.state.tueData !==element.hours)
          {
            newState.timeTrackingDataOrignal[key].hours = this.state.tueData;
          }
          flagtue=1;
      }
    }
   );
if(flagtue===0 && this.state.tueData >0)
{
  var data ={trackingDate:this.state.tueDate , hours:this.state.tueData};
  timeTrackingDataOrignal.push(data); 
  
}

//end Tuesday

  
//wedData
let flagWed=0;
this.state.timeTrackingDataOrignal.map((element, key) => {
    if(moment(this.state.wedDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
      {
          if(this.state.wedData !==element.hours)
          {
            newState.timeTrackingDataOrignal[key].hours = this.state.wedData;
          }
          flagWed=1;
      }
    }
   );
if(flagWed===0 && this.state.wedData >0)
{
  var data ={trackingDate:this.state.wedDate , hours:this.state.wedData};
  timeTrackingDataOrignal.push(data); 
  
}

//end wednesday


//thurData
let flagThur=0;
this.state.timeTrackingDataOrignal.map((element, key) => {
    if(moment(this.state.thurDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
      {
          if(this.state.thurData !==element.hours)
          {
            newState.timeTrackingDataOrignal[key].hours = this.state.thurData;
          }
          flagThur=1;
      }
    }
   );
if(flagThur===0 && this.state.thurData >0)
{
  var data ={trackingDate:this.state.thurDate , hours:this.state.thurData};
  timeTrackingDataOrignal.push(data); 
  
}

//end thurData



//friData
let flagFri=0;
this.state.timeTrackingDataOrignal.map((element, key) => {
    if(moment(this.state.friDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
      {
          if(this.state.friData !==element.hours)
          {
            newState.timeTrackingDataOrignal[key].hours = this.state.friData;
          }
          flagFri=1;
      }
    }
   );
if(flagFri===0 && this.state.friData >0)
{
  var data ={trackingDate:this.state.friDate , hours:this.state.friData};
  timeTrackingDataOrignal.push(data); 
  
}

//end friData



//satData
let flagSat=0;
this.state.timeTrackingDataOrignal.map((element, key) => {
    if(moment(this.state. satDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
      {
          if(this.state.satData !==element.hours)
          {
            newState.timeTrackingDataOrignal[key].hours = this.state.satData;
          }
          flagSat=1;
      }
    }
   );
if(flagSat===0 && this.state.satData >0)
{
  var data ={trackingDate:this.state.satDate , hours:this.state.satData};
  timeTrackingDataOrignal.push(data); 
  
}

//end satData



//sunData
let flagSun=0;
this.state.timeTrackingDataOrignal.map((element, key) => {
    if(moment(this.state. sunDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
      {
          if(this.state.sunData !==element.hours)
          {
            newState.timeTrackingDataOrignal[key].hours = this.state.sunData;
          }
          flagSun=1;
      }
    }
   );
if(flagSun===0 && this.state.sunData >0)
{
  var data ={trackingDate:this.state.sunDate , hours:this.state.sunData};
  timeTrackingDataOrignal.push(data); 
  
}

//end sunData









 this.setState(newState);

    setTimeout(
      function () {
        this.setState({
          timeTrackingDataOrignal:timeTrackingDataOrignal
          });
      }
        .bind(this),
      20
    );

}



getTimeTrackingDataWithDates()
{
  
let nullHours=0

this.setState({
  monData:nullHours,
  tueData:nullHours,
  wedData:nullHours,
  thurData:nullHours,
  friData:nullHours,
  satData:nullHours,
  sunData:nullHours,
  
  })
  

  setTimeout(
    function () {
      
      this.state.timeTrackingDataOrignal.forEach(element => {
      
      if(element !== undefined)
      {
        if(moment(this.state.monDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
        {
            this.setState({monData:element.hours,})
               
        }
      
        if(moment(this.state.tueDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
        {
            this.setState({tueData:element.hours})
           
        }
      
      
        if(moment(this.state.wedDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
        {
            this.setState({wedData:element.hours})
           
        }
       
        if(moment(this.state.thurDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
        {
            this.setState({thurData:element.hours})
           
        }
      
        if(moment(this.state.friDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
        {
            this.setState({friData:element.hours})
           
        }
      
        if(moment(this.state.satDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
        {
            this.setState({satData:element.hours})
          
         
        }
       
        if(moment(this.state.sunDate).isSame(moment(element.trackingDate).format('YYYY-MM-DD')))
        {
            this.setState({sunData:element.hours})
          
           
        }
      }
      });
      this.getWeekTotal();
    }.bind(this),
    20
  );
  
  

 
}

async getAllTimeTrackingData() {
  const responseJson = await BFLOWDataService.get("TimeTracking");
  this.setState({ timeTrackingDataOrignal: responseJson });
}


NextWeek()
{ 

this.saveTimeTrackingData();
  this.setState({
  monDate:moment(this.state.monDate).add(7,'d').toDate().toDateString(),
  tueDate:moment(this.state.tueDate).add(7,'d').toDate().toDateString(),
  wedDate:moment(this.state.wedDate).add(7,'d').toDate().toDateString(),
  thurDate:moment(this.state.thurDate).add(7,'d').toDate().toDateString(),
  friDate:moment(this.state.friDate).add(7,'d').toDate().toDateString(),
  satDate:moment(this.state.satDate).add(7,'d').toDate().toDateString(),
  sunDate:moment(this.state.sunDate).add(7,'d').toDate().toDateString(),  })

  

setTimeout(
function () {
this.getTimeTrackingDataWithDates();
var weekStart= moment(this.state.sunDate).toDate();
  var abc=weekStart.getDate();
  this.setState({weekStartDate:abc});
}.bind(this),
20
);


}


BackWeek()
{
  this.saveTimeTrackingData();

      this.setState({
          monDate:moment(this.state.monDate).subtract(7,'d').toDate().toDateString(),
          tueDate:moment(this.state.tueDate).subtract(7,'d').toDate().toDateString(),
          wedDate:moment(this.state.wedDate).subtract(7,'d').toDate().toDateString(),
          thurDate:moment(this.state.thurDate).subtract(7,'d').toDate().toDateString(),
          friDate:moment(this.state.friDate).subtract(7,'d').toDate().toDateString(),
          satDate:moment(this.state.satDate).subtract(7,'d').toDate().toDateString(),
          sunDate:moment(this.state.sunDate).subtract(7,'d').toDate().toDateString(),  })

    
  setTimeout(
    function () {
      this.getTimeTrackingDataWithDates();
      var weekStart= moment(this.state.sunDate).toDate();
          var abc=weekStart.getDate();
          this.setState({weekStartDate:abc});
          
    }.bind(this),
    20
  );

}




handleCloseErrorMessage() {

    this.setState({ showErrorMessage: false })
 }

 // Hide Alert Message
 setTimeOutForToasterMessages() {
    setTimeout(
       function () {
          this.setState({ showErrorMessage: false });
       }
          .bind(this),
       15000
    );
 }

 // show error message
 hideErrorMessage() {
    this.setState({ showErrorMessage: false })
 }


async submitTimeTracking()
{
  this.saveTimeTrackingData();

  if(this.state.timeTrackingDataOrignal.length>0)
  {
  const body = JSON.stringify(this.state.timeTrackingDataOrignal);
  const method = "TimeTracking/AddTimeTrackingBulk"
  var message=await  BFLOWDataService.post(method,body);
  debugger
  if (message.Code === false && message.Code !== undefined) {
     this.setState({
       showErrorMessage: true,
       errorMessage: message.Message,
       errorMessageType: 'danger'
     });
   }
   else {
     this.setState({
       showErrorMessage: true,
       errorMessage: message,
       errorMessageType: 'success'
     });
 
  
   }
 
   this.setTimeOutForToasterMessages();
  }


  const responseJson = await BFLOWDataService.get("TimeTracking");
  
setTimeout(
  function () {
    this.setState({ timeTrackingDataOrignal: responseJson });
    
  }
    .bind(this),
  20
);
this.getWeekTotal();
}

  render() {
    return (<>
        <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.errorMessage} visible={this.state.showErrorMessage} Type={this.state.errorMesageType}>
            </AlertBanner>
      <div class="card  border-0">
        {/* <span
          class="card-header border-0"
          style={{
            fontWeight: "600",
            color: "#55565a",
            backgroundColor: "white"
          }}
        >
          <i class="fas fa-arrow-left mr-3" />
          Time Tracking
        </span> */}

        <div
          class="card-body"
          style={{
            fontWeight: "600",
            color: "#55565a",
            backgroundColor: "white"
          }}
        >
          <div class="row">

            <div class="col-sm-12">
              <Tabs defaultActiveKey="week" id="uncontrolled-tab-example">
                <Tab eventKey="week" title="Week">

<div class="mt-2">
                <div class="row ">
             <div class="col-sm-12">
              <div class="float-right mr-3">
                <i class="fas fa-chevron-left mr-2" onClick={this.BackWeek.bind(this)} />{this.state.weekStartDate} - {this.state.satDate}{" "}
                <i class="fas fa-chevron-right ml-2" onClick={this.NextWeek.bind(this)} />
              </div>
            </div></div>


                  <div class="row m-3 ">
                    <table
                      class="table table-bordered"
                      style={{ color: "#55565a" }}
                    >
                      <thead>
                        <tr class="text-center">
                          <th scope="col" > <p style={{fontSize:".90rem"  }} >{this.state.sunDate}</p></th>
                          <th scope="col" > <p style={{fontSize:".90rem"  }}>{this.state.monDate}</p></th>
                          <th scope="col" > <p style={{fontSize:".90rem"  }}>{this.state.tueDate}</p></th>
                          <th scope="col" > <p style={{fontSize:".90rem"  }}>{this.state.wedDate}</p></th>
                          <th scope="col" > <p style={{fontSize:".90rem"  }}>{this.state.thurDate}</p></th>
                          <th scope="col" > <p style={{fontSize:".90rem"  }}>{this.state.friDate}</p></th>
                          <th scope="col" > <p style={{fontSize:".90rem"  }}>{this.state.satDate}</p></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="text-center">
                        <td class="p-4" >{(this.state.showTextBox[0].show)?<input  class="w-75" onChange={e => this.setState({ sunData: e.target.value })} defaultValue={this.state.sunData} onBlur={this.onBlurInputBoxSun.bind(this)}   type="number" min="0" max="23"></input>:<div  onDoubleClick={this.showInputBoxSun.bind(this)}>{this.state.sunData}</div>  }</td>
                          {/* <div editable>{this.state.sunData}</div> <input  class="w-50" onChange={e => this.setState({ sunData: e.target.value }) } type="number" min="0" max="23"></input>  </td> */}
                          <td class="p-4">{(this.state.showTextBox[1].show)?<input  class="w-75" onChange={e => this.setState({ monData: e.target.value })} defaultValue={this.state.monData} onBlur={this. onBlurInputBoxMon.bind(this)}   type="number" min="0" max="23"></input>:<div  onDoubleClick={this.showInputBoxMon.bind(this)}>{this.state.monData}</div>  }</td>
                          <td class="p-4">{(this.state.showTextBox[2].show)?<input  class="w-75" onChange={e => this.setState({ tueData: e.target.value })} defaultValue={this.state.tueData} onBlur={this.  onBlurInputBoxTue.bind(this)}   type="number" min="0" max="23"></input>:<div  onDoubleClick={this.showInputBoxTue.bind(this)}>{this.state.tueData}</div>  }</td>                          
                          <td class="p-4">{(this.state.showTextBox[3].show)?<input  class="w-75" onChange={e => this.setState({ wedData: e.target.value })} defaultValue={this.state.wedData} onBlur={this.  onBlurInputBoxWed.bind(this)}   type="number" min="0" max="23"></input>:<div  onDoubleClick={this.showInputBoxWed.bind(this)}>{this.state.wedData}</div>  }</td>                          
                          <td class="p-4">{(this.state.showTextBox[4].show)?<input  class="w-75" onChange={e => this.setState({ thurData: e.target.value })} defaultValue={this.state.thurData} onBlur={this.onBlurInputBoxThur.bind(this)}   type="number" min="0" max="23"></input>:<div  onDoubleClick={this.showInputBoxThur.bind(this)}>{this.state.thurData}</div>  }</td>                         
                          <td class="p-4">{(this.state.showTextBox[5].show)?<input  class="w-75" onChange={e => this.setState({ friData: e.target.value })} defaultValue={this.state.friData} onBlur={this.  onBlurInputBoxFri.bind(this)}   type="number" min="0" max="23"></input>:<div  onDoubleClick={this.showInputBoxFri.bind(this)}>{this.state.friData}</div>  }</td>                         
                          <td class="p-4">{(this.state.showTextBox[6].show)?<input  class="w-75" onChange={e => this.setState({ satData: e.target.value })} defaultValue={this.state.satData} onBlur={this.  onBlurInputBoxSat.bind(this)}   type="number" min="0" max="23"></input>:<div  onDoubleClick={this.showInputBoxSat.bind(this)}>{this.state.satData}</div>  }</td>                        </tr>
                      </tbody>
                    </table>
                  </div>
                  </div>
                  <div class="row ml-2 mt-2" style={{ color: "#55565a" }}>Total : {this.state.weekTrackingTotal} hrs</div>
                </Tab>
                {/* <Tab eventKey="month" title="Month">
                  <div class="m-3">dddd</div>
                </Tab> */}
              </Tabs>
            </div>
            {/* <div class="col-sm-3 ">
              {" "}
              <div class="float-right">
                <i class="fas fa-chevron-left mr-2" /> 7 - 13 April 2019{" "}
                <i class="fas fa-chevron-right ml-2" />
              </div>
            </div> */}
          </div>

         

        </div>
        <div class="card-footer bg-white border-top-0">
          <button
            type="button"
            class="common-button btn btn-dark float-right mr-2 mb-2"

            name="AddUpdate"
            onClick={this.submitTimeTracking.bind(this)}
          >
            Submit
          </button>
          <button
            type="button"
            class=" btn btn-light float-right mr-4 mb-2"

          >
            Cancel
          </button>


        </div>
      </div>
      </>
    );
  }
}
export default TimeTracking;
