import React, { Component } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { withGlobalState } from "react-globally";
import moment from 'moment';
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";
import {SharedServices} from '../../configuration/services/SharedService';
import { timingSafeEqual } from "crypto";
const AlertBanner = React.lazy(() => SharedServices.retry(()=>import ( '../../components/AlertBanner/index')))    ;


class TimeTracking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestId: null,
      requestData:[],
      timeTrackingDataOrignal: [],
      timeTrackingDataNewAndUpdated: [],
      timeTrackingDataOverAll: [],
      currentDate: Date,
      currentDay: "",
      sunDate: "",
      monDate: "",
      tueDate: "",
      wedDate: "",
      thurDate: "",
      friDate: "",
      satDate: "",
      sunData: "0",
      monData: "0",
      tueData: "0",
      wedData: "0",
      thurData: "0",
      friData: "0",
      satData: "0",
      //------------------
      prevSunValue: "1",
      prevMonValue: "1",
      prevTueValue: "1",
      prevWedValue: "1",
      prevThurValue: "1",
      prevFriValue: "1",
      prevSatValue: "1",
      //-------------
      userSunData: "0",
      userMonData: "0",
      userTueData: "0",
      userWedData: "0",
      userThurData: "0",
      userFriData: "0",
      userSatData: "0",
      weekTrackingTotal: 0,
      weekStartDate: null,
      showSubmitButtononPermission: false,

      showTextBox: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      // Error handling states start
      showErrorMessage: false,
      ErrorMessage: "",
      ErrorMessageType: "",
      errorsName: "",
      errorsOrder: "",
      errorsKey: "",
      errorsValue: "",
      visible: false

      // Error handling states end
    };

    this.NextWeek = this.NextWeek.bind(this);
    this.BackWeek = this.BackWeek.bind(this);
    this.getTimeTrackingDataByRequestId = this.getTimeTrackingDataByRequestId.bind(
      this
    );
    this.getTimeTrackingDataWithDates = this.getTimeTrackingDataWithDates.bind(
      this
    );
    this.saveTimeTrackingData = this.saveTimeTrackingData.bind(this);
    this.submitTimeTracking = this.submitTimeTracking.bind(this);
  }

  showInputBoxSun() {
    
    if(moment(this.state.sunDate).isSameOrAfter(moment(this.props.requestData.createdOn  ).format("YYYY-MM-DD")))
    {
      debugger
    let newState = Object.assign({}, this.state);
    if (this.state.showTextBox[0].show === false) {
      newState.showTextBox[0].show = true;
      newState.showTextBox[1].show = false;
      newState.showTextBox[2].show = false;
      newState.showTextBox[3].show = false;
      newState.showTextBox[4].show = false;
      newState.showTextBox[5].show = false;
	  newState.showTextBox[6].show = false;
    }
    this.setState({ newState });
  }
  }

  showInputBoxMon() {
    if(moment(this.state.monDate).isSameOrAfter(moment(this.props.requestData.createdOn  ).format("YYYY-MM-DD")))
    {
    let newState = Object.assign({}, this.state);
    if (this.state.showTextBox[1].show === false) {
      newState.showTextBox[1].show = true;
      newState.showTextBox[0].show = false;
      newState.showTextBox[2].show = false;
      newState.showTextBox[3].show = false;
      newState.showTextBox[4].show = false;
      newState.showTextBox[5].show = false;
	  newState.showTextBox[6].show = false;
    }
    this.setState({ newState });
  }
  }

  showInputBoxTue() {
    if(moment(this.state.tueDate).isSameOrAfter(moment(this.props.requestData.createdOn  ).format("YYYY-MM-DD")))
    {
    let newState = Object.assign({}, this.state);
    if (this.state.showTextBox[2].show === false) {
      newState.showTextBox[2].show = true;
      newState.showTextBox[1].show = false;
      newState.showTextBox[0].show = false;
      newState.showTextBox[3].show = false;
      newState.showTextBox[4].show = false;
      newState.showTextBox[5].show = false;
	  newState.showTextBox[6].show = false;
    }
    this.setState({ newState });
  }
  }

  showInputBoxWed() {
    if(moment(this.state.wedDate).isSameOrAfter(moment(this.props.requestData.createdOn  ).format("YYYY-MM-DD")))
    {
    let newState = Object.assign({}, this.state);
    if (this.state.showTextBox[3].show === false) {
      newState.showTextBox[3].show = true;
      newState.showTextBox[1].show = false;
      newState.showTextBox[2].show = false;
      newState.showTextBox[0].show = false;
      newState.showTextBox[4].show = false;
      newState.showTextBox[5].show = false;
	  newState.showTextBox[6].show = false;
    }
    this.setState({ newState });
  }
  }

  ValidateHours(Hours) {
    if (Hours < 0 || Hours > 23.59) {
      this.setState({
        showErrorMessage: true,
        errorMessage: "Invalid time format",
        errorMessageType: "danger"
      });
      this.setTimeOutForToasterMessages();
      return false;
    }

    if (
      Hours.toString().match(/^([0-1]?[0-9]|[2][0-3]).?([0-5][0-9]?)?$/g) ==
      null
    ) {
      this.setState({
        showErrorMessage: true,
        errorMessage: "Invalid time format",
        errorMessageType: "danger"
      });
      this.setTimeOutForToasterMessages();
      return false;
    }

    return true;
  }

  showInputBoxThur() {
    if(moment(this.state.thurDate).isSameOrAfter(moment(this.props.requestData.createdOn  ).format("YYYY-MM-DD")))
    {
    let newState = Object.assign({}, this.state);
    if (this.state.showTextBox[4].show === false) {
      newState.showTextBox[4].show = true;
      newState.showTextBox[1].show = false;
      newState.showTextBox[2].show = false;
      newState.showTextBox[3].show = false;
      newState.showTextBox[0].show = false;
      newState.showTextBox[5].show = false;
	  newState.showTextBox[6].show = false;
    }
    this.setState({ newState });
  }
}

  showInputBoxFri() {
    if(moment(this.state.friDate).isSameOrAfter(moment(this.props.requestData.createdOn  ).format("YYYY-MM-DD")))
    {
    let newState = Object.assign({}, this.state);
    if (this.state.showTextBox[5].show === false) {
      newState.showTextBox[5].show = true;
      newState.showTextBox[1].show = false;
      newState.showTextBox[2].show = false;
      newState.showTextBox[3].show = false;
      newState.showTextBox[4].show = false;
      newState.showTextBox[0].show = false;
	  newState.showTextBox[6].show = false;
    }
    this.setState({ newState });
  }
  }
  showInputBoxSat() {
    if(moment(this.state.satDate).isSameOrAfter(moment(this.props.requestData.createdOn  ).format("YYYY-MM-DD")))
    {
    let newState = Object.assign({}, this.state);
    if (this.state.showTextBox[6].show === false) {
      newState.showTextBox[6].show = true;
      newState.showTextBox[1].show = false;
      newState.showTextBox[2].show = false;
      newState.showTextBox[3].show = false;
      newState.showTextBox[4].show = false;
      newState.showTextBox[5].show = false;
	  newState.showTextBox[0].show = false;
    }
    this.setState({ newState });
  }
}

  updateOverAllValues(day) {

    //---------------sun data---------------------------
    if ((day === "sun")) {
      this.state.timeTrackingDataOrignal.forEach(element => {
        if (element !== undefined) {
          if (
            moment(this.state.sunDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            debugger
            console.log(this.state.sunData)
            console.log(this.state.userSunData)
            console.log(element.hours)
            if (parseInt(this.state.userSunData) > 0) {
              // let data= parseInt(this.state.userSunData) + parseInt(this.state.sunData)
              // this.setState({userSunData:data});
              if (element.hours < this.state.sunData) {
                let dataSelf = parseInt(this.state.sunData) - parseInt(element.hours);
                let data = parseInt(this.state.userSunData) + dataSelf;
                this.setState({ userSunData: data });
              }
              if (element.hours > this.state.sunData) {
                let dataSelf = parseInt(element.hours) - parseInt(this.state.sunData);
                let data = parseInt(this.state.userSunData) - dataSelf;
                this.setState({ userSunData: data });
              }
           
            }
          }
        }
      });
      if (parseInt(this.state.userSunData) === 0) {
        let data = parseInt(this.state.sunData);
        this.setState({ userSunData: data });
      }
      if(parseInt(this.state.prevSunValue)===0)
      {
        debugger
        let data = parseInt(this.state.userSunData) + parseInt(this.state.sunData);
        this.setState({ userSunData: data });
        this.setState({ prevSunValue: 1 });
      }
      
    }
//-------------------sun data end--------------------------------

     //---------------mon data---------------------------
  
     if ((day === "mon")) {
      this.state.timeTrackingDataOrignal.forEach(element => {
        if (element !== undefined) {
          if (
            moment(this.state.monDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if (parseInt(this.state.userMonData) > 0) {
              // let data= parseInt(this.state.userMonData) + parseInt(this.state.monData)
              // this.setState({userMonData:data});
              if (element.hours < this.state.monData) {
                let dataSelf =
                  parseInt(this.state.monData) - parseInt(element.hours);
                let data = parseInt(this.state.userMonData) + dataSelf;
                this.setState({ userMonData: data });
              }
              if (element.hours > this.state.monData) {
                let dataSelf =
                  parseInt(element.hours) - parseInt(this.state.monData);
                let data = parseInt(this.state.userMonData) - dataSelf;
                this.setState({ userMonData: data });
              }
            }
          }
        }
      });
      if (parseInt(this.state.userMonData) === 0) {
        let data = parseInt(this.state.monData);
        this.setState({ userMonData: data });
      }
      if(parseInt(this.state.prevMonValue)===0)
      {
        debugger
        let data = parseInt(this.state.userMonData) + parseInt(this.state.monData);
        this.setState({ userMonData: data });
        this.setState({ prevMonValue: 1 });
      }
    }
	//-------------------mon data end--------------------------------

     //---------------tue data---------------------------
  
     if ((day === "tue")) {
      this.state.timeTrackingDataOrignal.forEach(element => {
        if (element !== undefined) {
          if (
            moment(this.state.tueDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if (parseInt(this.state.userTueData) > 0) {
              // let data= parseInt(this.state.userTueData) + parseInt(this.state.tueData)
              // this.setState({userTueData:data});
              if (element.hours < this.state.tueData) {
                let dataSelf =
                  parseInt(this.state.tueData) - parseInt(element.hours);
                let data = parseInt(this.state.userTueData) + dataSelf;
                this.setState({ userTueData: data });
              }
              if (element.hours > this.state.tueData) {
                let dataSelf =
                  parseInt(element.hours) - parseInt(this.state.tueData);
                let data = parseInt(this.state.userTueData) - dataSelf;
                this.setState({ userTueData: data });
              }
            }
          }
        }
      });
      if (parseInt(this.state.userTueData) === 0) {
        let data = parseInt(this.state.tueData);
        this.setState({ userTueData: data });
      }
      if(parseInt(this.state.prevTueValue)===0)
      {
        debugger
        let data = parseInt(this.state.userTueData) + parseInt(this.state.tueData);
        this.setState({ userTueData: data });
        this.setState({ prevTueValue: 1 });
      }
    }
	//-------------------tue data end--------------------------------

     //---------------wed data---------------------------
  
     if ((day === "wed")) {
      this.state.timeTrackingDataOrignal.forEach(element => {
        if (element !== undefined) {
          if (
            moment(this.state.wedDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if (parseInt(this.state.userWedData) > 0) {
              // let data= parseInt(this.state.userWedData) + parseInt(this.state.wedData)
              // this.setState({userWedData:data});
              if (element.hours < this.state.wedData) {
                let dataSelf =
                  parseInt(this.state.wedData) - parseInt(element.hours);
                let data = parseInt(this.state.userWedData) + dataSelf;
                this.setState({ userWedData: data });
              }
              if (element.hours > this.state.wedData) {
                let dataSelf =
                  parseInt(element.hours) - parseInt(this.state.wedData);
                let data = parseInt(this.state.userWedData) - dataSelf;
                this.setState({ userWedData: data });
              }
            }
          }
        }
      });
      if (parseInt(this.state.userWedData) === 0) {
        let data = parseInt(this.state.wedData);
        this.setState({ userWedData: data });
      }
      if(parseInt(this.state.prevWedValue)===0)
      {
        debugger
        let data = parseInt(this.state.userWedData) + parseInt(this.state.wedData);
        this.setState({ userWedData: data });
        this.setState({ prevWedValue: 1 });
      }
    }
	//-------------------wed data end--------------------------------


     //---------------thur data---------------------------
  
     if ((day === "thur")) {
      this.state.timeTrackingDataOrignal.forEach(element => {
        if (element !== undefined) {
          if (
            moment(this.state.thurDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if (parseInt(this.state.userThurData) > 0) {
              // let data= parseInt(this.state.userThurData) + parseInt(this.state.thurData)
              // this.setState({userThurData:data});
              if (element.hours < this.state.thurData) {
                let dataSelf =
                  parseInt(this.state.thurData) - parseInt(element.hours);
                let data = parseInt(this.state.userThurData) + dataSelf;
                this.setState({ userThurData: data });
              }
              if (element.hours > this.state.thurData) {
                let dataSelf =
                  parseInt(element.hours) - parseInt(this.state.thurData);
                let data = parseInt(this.state.userThurData) - dataSelf;
                this.setState({ userThurData: data });
              }
            }
          }
        }
      });
      if (parseInt(this.state.userThurData) === 0) {
        let data = parseInt(this.state.thurData);
        this.setState({ userThurData: data });
      }
      if(parseInt(this.state.prevThurValue)===0)
      {
        debugger
        let data = parseInt(this.state.userThurData) + parseInt(this.state.thurData);
        this.setState({ userThurData: data });
        this.setState({ prevThurValue: 1 });
      }
    }
	//-------------------thur data end--------------------------------

     //---------------fri data---------------------------
  
     if ((day === "fri")) {
      this.state.timeTrackingDataOrignal.forEach(element => {
        if (element !== undefined) {
          if (
            moment(this.state.friDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if (parseInt(this.state.userFriData) > 0) {
              // let data= parseInt(this.state.userFriData) + parseInt(this.state.friData)
              // this.setState({userFriData:data});
              if (element.hours < this.state.friData) {
                let dataSelf =
                  parseInt(this.state.friData) - parseInt(element.hours);
                let data = parseInt(this.state.userFriData) + dataSelf;
                this.setState({ userFriData: data });
              }
              if (element.hours > this.state.friData) {
                let dataSelf =
                  parseInt(element.hours) - parseInt(this.state.friData);
                let data = parseInt(this.state.userFriData) - dataSelf;
                this.setState({ userFriData: data });
              }
            }
          }
        }
      });
      if (parseInt(this.state.userFriData) === 0) {
        let data = parseInt(this.state.friData);
        this.setState({ userFriData: data });
      }
      if(parseInt(this.state.prevFriValue)===0)
      {
        debugger
        let data = parseInt(this.state.userFriData) + parseInt(this.state.friData);
        this.setState({ userFriData: data });
        this.setState({ prevFriValue: 1 });
      }
    }
	//-------------------fri data end--------------------------------

     //---------------sat data---------------------------
  
     if ((day === "sat")) {
      this.state.timeTrackingDataOrignal.forEach(element => {
        if (element !== undefined) {
          if (
            moment(this.state.satDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if (parseInt(this.state.userSatData) > 0) {
              // let data= parseInt(this.state.usersatData) + parseInt(this.state.satData)
              // this.setState({usersatData:data});
              if (element.hours < this.state.satData) {
                let dataSelf =
                  parseInt(this.state.satData) - parseInt(element.hours);
                let data = parseInt(this.state.userSatData) + dataSelf;
                this.setState({ userSatData: data });
              }
              if (element.hours > this.state.satData) {
                let dataSelf =
                  parseInt(element.hours) - parseInt(this.state.satData);
                let data = parseInt(this.state.userSatData) - dataSelf;
                this.setState({ userSatData: data });
              }
            }
          }
        }
      });
      if (parseInt(this.state.userSatData) === 0) {
        let data = parseInt(this.state.satData);
        this.setState({ userSatData: data });
      }
      if(parseInt(this.state.prevSatValue)===0)
      {
        debugger
        let data = parseInt(this.state.userSatData) + parseInt(this.state.satData);
        this.setState({ userSatData: data });
        this.setState({ prevSatValue: 1 });
      }
    }
  //-------------------sat data end--------------------------------
  setTimeout(
    function() {
      this.saveTimeTrackingData();
    }.bind(this),
    20
  );
 
  }

  onBlurInputBoxSun() {
    this.getWeekTotal();
    var response = this.ValidateHours(this.state.sunData);
    if (response === false) {
      this.setState({ sunData: "0" });
    }
    let newState = Object.assign({}, this.state);

    if (this.state.showTextBox[0].show === true) {
      newState.showTextBox[0].show = false;
      if (response === true) {
      this.saveTimeTrackingDataOverAll();
      this.updateOverAllValues("sun");
      }
    }
    this.setState({ newState });
  }

  onBlurInputBoxMon() {
    debugger
    this.getWeekTotal();
    var response = this.ValidateHours(this.state.monData);
    if (response === false) {
      this.setState({ monData: "0" });
    }
    let newState = Object.assign({}, this.state);

    if (this.state.showTextBox[1].show === true) {
      newState.showTextBox[1].show = false;
      if (response === true) {
      this.saveTimeTrackingDataOverAll();
      this.updateOverAllValues("mon");
      }
    }
    this.setState({ newState });
  }

  onBlurInputBoxTue() {
    this.getWeekTotal();
    var response = this.ValidateHours(this.state.tueData);
    if (response === false) {
      this.setState({ tueData: "0" });
    }
    let newState = Object.assign({}, this.state);

    if (this.state.showTextBox[2].show === true) {
      newState.showTextBox[2].show = false;
      if (response === true) {
      this.saveTimeTrackingDataOverAll();
      this.updateOverAllValues("tue");
      }
    }
    this.setState({ newState });
  }

  onBlurInputBoxWed() {
    this.getWeekTotal();
    var response = this.ValidateHours(this.state.wedData);
    if (response === false) { 
      this.setState({ wedData: "0" });
    }
    let newState = Object.assign({}, this.state);

    if (this.state.showTextBox[3].show === true) {
      newState.showTextBox[3].show = false;
      if (response === true) {
      this.saveTimeTrackingDataOverAll();
      this.updateOverAllValues("wed");
      }
    }
    this.setState({ newState });
  }

  onBlurInputBoxThur() {
    this.getWeekTotal();
    var response = this.ValidateHours(this.state.thurData);
    if (response === false) {
      this.setState({ thurData: "0" });
    }
    let newState = Object.assign({}, this.state);

    if (this.state.showTextBox[4].show === true) {
      newState.showTextBox[4].show = false;
      if (response === true) {
      this.saveTimeTrackingDataOverAll();
      this.updateOverAllValues("thur");
      }
    }
    this.setState({ newState });
  }

  onBlurInputBoxFri() {
    this.getWeekTotal();
    var response = this.ValidateHours(this.state.friData);
    if (response === false) {
      this.setState({ friData: "0" });
    }
    let newState = Object.assign({}, this.state);

    if (this.state.showTextBox[5].show === true) {
      newState.showTextBox[5].show = false;
      if (response === true) {
      this.saveTimeTrackingDataOverAll();
      this.updateOverAllValues("fri");
      }
    }
    this.setState({ newState });
  }

  onBlurInputBoxSat() {
    this.getWeekTotal();
    var response = this.ValidateHours(this.state.satData);
    if (response === false) {
      this.setState({ satData: "0" });
    }
    let newState = Object.assign({}, this.state);

    if (this.state.showTextBox[6].show === true) {
      newState.showTextBox[6].show = false;
      if (response === true) {
      this.saveTimeTrackingDataOverAll();
      this.updateOverAllValues("sat");
      }
    }
    this.setState({ newState });
  }

  getWeekTotal() {
    setTimeout(
      function() {
        var weekTotal =
          parseInt(this.state.userMonData) +
          parseInt(this.state.userTueData) +
          parseInt(this.state.userWedData) +
          parseInt(this.state.userThurData) +
          parseInt(this.state.userFriData) +
          parseInt(this.state.userSatData) +
          parseInt(this.state.userSunData);
        this.setState({ weekTrackingTotal: weekTotal });
      }.bind(this),
      20
    );
  }


  hideInputBar()
  {
    let newState = Object.assign({}, this.state);
  
      newState.showTextBox[6].show = false;
      newState.showTextBox[1].show = false;
      newState.showTextBox[2].show = false;
      newState.showTextBox[3].show = false;
      newState.showTextBox[4].show = false;
      newState.showTextBox[5].show = false;
	  newState.showTextBox[0].show = false;
    setTimeout(
      function() {
    this.setState({ newState });
  }.bind(this),
  200
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

  componentWillReceiveProps(nextProps) {
    if (this.props.requestId !== nextProps.requestId) {
      this.props = nextProps;
      this.initTimeTracker();
    }
  }

  async componentDidMount() {
    this.initTimeTracker();
  }

  getUserAccessibility(featureGroupName, feature) {
    return RoleBFLOWDataService.getUserAccessibility(
      this.props.globalState.features,
      featureGroupName,
      feature
    );
  }

  async initTimeTracker() {
    await this.getTimeTrackingDataByRequestId();
    await this.getTimeTrackingDataByUserId();
    const showAddEditButton = this.getUserAccessibility(
      "Effort Management",
      "Submit tracker for requests"
    );
    this.setState({ showSubmitButtononPermission: showAddEditButton });

    console.log(this.props);
    var date = new Date();
    this.setState({ currentDate: date });
    var today = new Date();
    date = today.getDay();
    this.setState({ currentDate: date });
    var weekStart = new Date();

    if (date === 1) {
      let begin = moment()
        .startOf("week")
        .format("dddd DD-MM-YYYY");
      this.setState({
        monDate: moment()
          .toDate()
          .toDateString(),
        tueDate: moment()
          .add(1, "d")
          .toDate()
          .toDateString(),
        wedDate: moment()
          .add(2, "d")
          .toDate()
          .toDateString(),
        thurDate: moment()
          .add(3, "d")
          .toDate()
          .toDateString(),
        friDate: moment()
          .add(4, "d")
          .toDate()
          .toDateString(),
        satDate: moment()
          .add(5, "d")
          .toDate()
          .toDateString(),
        sunDate: moment()
          .subtract(1, "d")
          .toDate()
          .toDateString()
      });
      weekStart = moment()
        .subtract(2, "d")
        .toDate();
    }

    if (date === 2) {
      let begin = moment()
        .startOf("week")
        .format("dddd DD-MM-YYYY");
      this.setState({
        monDate: moment()
          .subtract(1, "d")
          .toDate()
          .toDateString(),
        tueDate: moment()
          .toDate()
          .toDateString(),
        wedDate: moment()
          .add(1, "d")
          .toDate()
          .toDateString(),
        thurDate: moment()
          .add(2, "d")
          .toDate()
          .toDateString(),
        friDate: moment()
          .add(3, "d")
          .toDate()
          .toDateString(),
        satDate: moment()
          .add(4, "d")
          .toDate()
          .toDateString(),
        sunDate: moment()
          .subtract(2, "d")
          .toDate()
          .toDateString()
      });

      weekStart = moment()
        .subtract(2, "d")
        .toDate();
    }

    if (date === 3) {
      var mon = moment()
        .subtract(2, "d")
        .toDate()
        .toDateString();
      var tue = moment()
        .subtract(1, "d")
        .toDate()
        .toDateString();
      var wed = moment()
        .toDate()
        .toDateString();
      var thur = moment()
        .add(1, "d")
        .toDate()
        .toDateString();
      var fri = moment()
        .add(2, "d")
        .toDate()
        .toDateString();
      var sat = moment()
        .add(3, "d")
        .toDate()
        .toDateString();
      var sun = moment()
        .subtract(3, "d")
        .toDate()
        .toDateString();

      this.setState({
        monDate: mon,
        tueDate: tue,
        wedDate: wed,
        thurDate: thur,
        friDate: fri,
        satDate: sat,
        sunDate: sun
      });
      weekStart = moment()
        .subtract(2, "d")
        .toDate();
    }

    if (date === 4) {
      this.setState({
        monDate: moment()
          .subtract(3, "d")
          .toDate()
          .toDateString(),
        tueDate: moment()
          .subtract(2, "d")
          .toDate()
          .toDateString(),
        wedDate: moment()
          .subtract(1, "d")
          .toDate()
          .toDateString(),
        thurDate: moment()
          .toDate()
          .toDateString(),
        friDate: moment()
          .add(1, "d")
          .toDate()
          .toDateString(),
        satDate: moment()
          .add(2, "d")
          .toDate()
          .toDateString(),
        sunDate: moment()
          .subtract(4, "d")
          .toDate()
          .toDateString()
      });

      weekStart = moment()
        .subtract(11, "d")
        .toDate();
    }
    if (date === 5) {
      this.setState({
        monDate: moment()
          .subtract(4, "d")
          .toDate()
          .toDateString(),
        tueDate: moment()
          .subtract(3, "d")
          .toDate()
          .toDateString(),
        wedDate: moment()
          .subtract(2, "d")
          .toDate()
          .toDateString(),
        thurDate: moment()
          .subtract(1, "d")
          .toDate()
          .toDateString(),
        friDate: moment()
          .toDate()
          .toDateString(),
        satDate: moment()
          .add(1, "d")
          .toDate()
          .toDateString(),
        sunDate: moment()
          .subtract(5, "d")
          .toDate()
          .toDateString()
      });

      weekStart = moment()
        .subtract(5, "d")
        .toDate();
    }

    if (date === 6) {
      this.setState({
        monDate: moment()
          .subtract(5, "d")
          .toDate()
          .toDateString(),
        tueDate: moment()
          .subtract(4, "d")
          .toDate()
          .toDateString(),
        wedDate: moment()
          .subtract(3, "d")
          .toDate()
          .toDateString(),
        thurDate: moment()
          .subtract(2, "d")
          .toDate()
          .toDateString(),
        friDate: moment()
          .subtract(1, "d")
          .toDate()
          .toDateString(),
        satDate: moment()
          .toDate()
          .toDateString(),
        sunDate: moment()
          .subtract(6, "d")
          .toDate()
          .toDateString()
      });
      weekStart = moment()
        .subtract(5, "d")
        .toDate();
    }

    if (date === 0) {
      this.setState({
        monDate: moment()
          .add(1, "d")
          .toDate()
          .toDateString(),
        tueDate: moment()
          .add(2, "d")
          .toDate()
          .toDateString(),
        wedDate: moment()
          .add(3, "d")
          .toDate()
          .toDateString(),
        thurDate: moment()
          .add(4, "d")
          .toDate()
          .toDateString(),
        friDate: moment()
          .add(5, "d")
          .toDate()
          .toDateString(),
        satDate: moment()
          .add(6, "d")
          .toDate()
          .toDateString(),
        sunDate: moment()
          .toDate()
          .toDateString()
      });
      weekStart = moment()
        .subtract(5, "d")
        .toDate();
    }

    var startDate = weekStart.getDate();

    this.setState({ weekStartDate: startDate });

    this.getTimeTrackingDataWithDates();
    this.getTimeTrackingDataOverAllWithDates();
    this.setPreValueAsZero();
    console.log(this.state.timeTrackingDataOrignal);
  }

  //----------------time tracking overall save----------------------
  saveTimeTrackingDataOverAll() {
    let requestId = this.props.requestId;
    let newState = Object.assign({}, this.state);
    let timeTrackingDataOverAll = this.state.timeTrackingDataOverAll;
    // let timeTrackingDataNewAndUpdated= this.state.timeTrackingDataNewAndUpdated;

    // if(this.state.timeTrackingDataOverAll.length >0 )
    // {

    //monday
    let flagMon = 0;
    this.state.timeTrackingDataOverAll.map((element, key) => {
      if (
        moment(this.state.monDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.userMonData !== element.hours) {
          newState.timeTrackingDataOverAll[key].hours = this.state.userMonData;
          // let valueArrayData=newState.timeTrackingDataOverAll[key];
        }
        flagMon = 1;
      }
    });
    if (flagMon === 0 && this.state.userMonData > 0) {
      var data = {
        trackingDate: this.state.monDate,
        hours: this.state.userMonData,
        requestId: requestId
      };
      timeTrackingDataOverAll.push(data);
    }

    //end monday

    //userTueData
    let flagtue = 0;
    this.state.timeTrackingDataOverAll.map((element, key) => {
      if (
        moment(this.state.tueDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.userTueData !== element.hours) {
          newState.timeTrackingDataOverAll[key].hours = this.state.userTueData;
        }
        flagtue = 1;
      }
    });
    if (flagtue === 0 && this.state.userTueData > 0) {
      var data = {
        trackingDate: this.state.tueDate,
        hours: this.state.userTueData,
        requestId: requestId
      };
      timeTrackingDataOverAll.push(data);
    }

    //end Tuesday

    //userWedData
    let flagWed = 0;
    this.state.timeTrackingDataOverAll.map((element, key) => {
      if (
        moment(this.state.wedDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.userWedData !== element.hours) {
          newState.timeTrackingDataOverAll[key].hours = this.state.userWedData;
        }
        flagWed = 1;
      }
    });
    if (flagWed === 0 && this.state.userWedData > 0) {
      var data = {
        trackingDate: this.state.wedDate,
        hours: this.state.userWedData,
        requestId: requestId
      };
      timeTrackingDataOverAll.push(data);
    }

    //end wednesday

    //userThurData
    let flagThur = 0;
    this.state.timeTrackingDataOverAll.map((element, key) => {
      if (
        moment(this.state.thurDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.userThurData !== element.hours) {
          newState.timeTrackingDataOverAll[key].hours = this.state.userThurData;
        }
        flagThur = 1;
      }
    });
    if (flagThur === 0 && this.state.userThurData > 0) {
      var data = {
        trackingDate: this.state.thurDate,
        hours: this.state.userThurData,
        requestId: requestId
      };
      timeTrackingDataOverAll.push(data);
    }

    //end userThurData

    //userFriData
    let flagFri = 0;
    this.state.timeTrackingDataOverAll.map((element, key) => {
      if (
        moment(this.state.friDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.userFriData !== element.hours) {
          newState.timeTrackingDataOverAll[key].hours = this.state.userFriData;
        }
        flagFri = 1;
      }
    });
    if (flagFri === 0 && this.state.userFriData > 0) {
      var data = {
        trackingDate: this.state.friDate,
        hours: this.state.userFriData,
        requestId: requestId
      };
      timeTrackingDataOverAll.push(data);
    }

    //end userFriData

    //userSatData
    let flagSat = 0;
    this.state.timeTrackingDataOverAll.map((element, key) => {
      if (
        moment(this.state.satDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.userSatData !== element.hours) {
          newState.timeTrackingDataOverAll[key].hours = this.state.userSatData;
        }
        flagSat = 1;
      }
    });
    if (flagSat === 0 && this.state.userSatData > 0) {
      var data = {
        trackingDate: this.state.satDate,
        hours: this.state.userSatData,
        requestId: requestId
      };
      timeTrackingDataOverAll.push(data);
    }

    //end userSatData

    //userSunData
    let flagSun = 0;
    this.state.timeTrackingDataOverAll.map((element, key) => {
      if (
        moment(this.state.sunDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.userSunData !== element.hours) {
          newState.timeTrackingDataOverAll[key].hours = this.state.userSunData;
        }
        flagSun = 1;
      }
    });
    if (flagSun === 0 && this.state.userSunData > 0) {
      var data = {
        trackingDate: this.state.sunDate,
        hours: this.state.userSunData,
        requestId: requestId
      };
      timeTrackingDataOverAll.push(data);
    }

    //end userSunData

    //}

    this.setState(newState);

    setTimeout(
      function() {
        this.setState({
          timeTrackingDataOverAll: timeTrackingDataOverAll
        });
      }.bind(this),
      20
    );
  }

  //----overall time tracking------------

  saveTimeTrackingData() {
    let requestId = this.props.requestId;
    let newState = Object.assign({}, this.state);
    let timeTrackingDataOrignal = this.state.timeTrackingDataOrignal;
    // let timeTrackingDataNewAndUpdated= this.state.timeTrackingDataNewAndUpdated;

    // if(this.state.timeTrackingDataOrignal.length >0 )
    // {

    //monday
    let flagMon = 0;
    this.state.timeTrackingDataOrignal.map((element, key) => {
      if (
        moment(this.state.monDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.monData !== element.hours) {
          newState.timeTrackingDataOrignal[key].hours = this.state.monData;
          // let valueArrayData=newState.timeTrackingDataOrignal[key];
        }
        flagMon = 1;
      }
    });
    if (flagMon === 0 && this.state.monData > 0) {
      var data = {
        trackingDate: this.state.monDate,
        hours: this.state.monData,
        requestId: requestId
      };
      timeTrackingDataOrignal.push(data);
    }

    //end monday

    //TueData
    let flagtue = 0;
    this.state.timeTrackingDataOrignal.map((element, key) => {
      if (
        moment(this.state.tueDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.tueData !== element.hours) {
          newState.timeTrackingDataOrignal[key].hours = this.state.tueData;
        }
        flagtue = 1;
      }
    });
    if (flagtue === 0 && this.state.tueData > 0) {
      var data = {
        trackingDate: this.state.tueDate,
        hours: this.state.tueData,
        requestId: requestId
      };
      timeTrackingDataOrignal.push(data);
    }

    //end Tuesday

    //wedData
    let flagWed = 0;
    this.state.timeTrackingDataOrignal.map((element, key) => {
      if (
        moment(this.state.wedDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.wedData !== element.hours) {
          newState.timeTrackingDataOrignal[key].hours = this.state.wedData;
        }
        flagWed = 1;
      }
    });
    if (flagWed === 0 && this.state.wedData > 0) {
      var data = {
        trackingDate: this.state.wedDate,
        hours: this.state.wedData,
        requestId: requestId
      };
      timeTrackingDataOrignal.push(data);
    }

    //end wednesday

    //thurData
    let flagThur = 0;
    this.state.timeTrackingDataOrignal.map((element, key) => {
      if (
        moment(this.state.thurDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.thurData !== element.hours) {
          newState.timeTrackingDataOrignal[key].hours = this.state.thurData;
        }
        flagThur = 1;
      }
    });
    if (flagThur === 0 && this.state.thurData > 0) {
      var data = {
        trackingDate: this.state.thurDate,
        hours: this.state.thurData,
        requestId: requestId
      };
      timeTrackingDataOrignal.push(data);
    }

    //end thurData

    //friData
    let flagFri = 0;
    this.state.timeTrackingDataOrignal.map((element, key) => {
      if (
        moment(this.state.friDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.friData !== element.hours) {
          newState.timeTrackingDataOrignal[key].hours = this.state.friData;
        }
        flagFri = 1;
      }
    });
    if (flagFri === 0 && this.state.friData > 0) {
      var data = {
        trackingDate: this.state.friDate,
        hours: this.state.friData,
        requestId: requestId
      };
      timeTrackingDataOrignal.push(data);
    }

    //end friData

    //satData
    let flagSat = 0;
    this.state.timeTrackingDataOrignal.map((element, key) => {
      if (
        moment(this.state.satDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.satData !== element.hours) {
          newState.timeTrackingDataOrignal[key].hours = this.state.satData;
        }
        flagSat = 1;
      }
    });
    if (flagSat === 0 && this.state.satData > 0) {
      var data = {
        trackingDate: this.state.satDate,
        hours: this.state.satData,
        requestId: requestId
      };
      timeTrackingDataOrignal.push(data);
    }

    //end satData

    //sunData
    let flagSun = 0;
    this.state.timeTrackingDataOrignal.map((element, key) => {
      if (
        moment(this.state.sunDate).isSame(
          moment(element.trackingDate).format("YYYY-MM-DD")
        )
      ) {
        if (this.state.sunData !== element.hours) {
          newState.timeTrackingDataOrignal[key].hours = this.state.sunData;
        }
        flagSun = 1;
      }
    });
    if (flagSun === 0 && this.state.sunData > 0) {
      var data = {
        trackingDate: this.state.sunDate,
        hours: this.state.sunData,
        requestId: requestId
      };
      timeTrackingDataOrignal.push(data);
    }

    //end sunData

    //}

    this.setState(newState);

    setTimeout(
      function() {
        this.setState({
          timeTrackingDataOrignal: timeTrackingDataOrignal
        });
      }.bind(this),
      20
    );



    
  }

  showSubmitButton() {
    if (this.state.showSubmitButtononPermission === true) {
      return (
        <>
          <button
            type="button"
            class="common-button btn btn-dark float-right mr-2 mb-2"
            name="AddUpdate"
            onClick={this.submitTimeTracking.bind(this)}
          >
            Submit
          </button>
        </>
      );
    }
  }


setPreValueAsZero()
{
  setTimeout(
    function() {
      // if(this.state.timeTrackingDataOrignal.length >0 )
      // {
      this.state.timeTrackingDataOverAll.forEach(element => {
        if (element !== undefined) {
          if ( moment(this.state.monDate).isSame(moment(element.trackingDate).format("YYYY-MM-DD")   ) ) {
         
              if(element.hours>0 && this.state.monData===0)
              {
                this.setState({ prevMonValue: 0});
              }
          
          
     
          }

          if (
            moment(this.state.tueDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if(element.hours>0 && this.state.tueData===0)
            {
              this.setState({ prevTueValue: 0 });
            }
          }

          if (
            moment(this.state.wedDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if(element.hours>0 && this.state.wedData===0)
            {
              this.setState({ prevWedValue: 0 });
            }
          }

          if (
            moment(this.state.thurDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if(element.hours>0 && this.state.thurData===0)
            {
              this.setState({ prevThurValue: 0 });
            }
          }

          if (
            moment(this.state.friDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if(element.hours>0 && this.state.friData===0)
            {
              this.setState({ prevFriValue: 0 });
            }
          }

          if (
            moment(this.state.satDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if(element.hours>0 && this.state.satData===0)
            {
              this.setState({ prevSatValue: 0 });
            }
          }

          if (
            moment(this.state.sunDate).isSame(
              moment(element.trackingDate).format("YYYY-MM-DD")
            )
          ) {
            if(element.hours>0 && this.state.sunData===0)
            {
              this.setState({ prevSunValue: 0 });
            }
          }
        }
      });
      //}
      this.getWeekTotal();
    }.bind(this),
    20
  );
}



  getTimeTrackingDataOverAllWithDates() {
    let nullHours = 0;

    this.setState({
      userMonData: nullHours,
      userTueData: nullHours,
      userWedData: nullHours,
      userThurData: nullHours,
      userFriData: nullHours,
      userSatData: nullHours,
      userSunData: nullHours
    });

    setTimeout(
      function() {
        // if(this.state.timeTrackingDataOrignal.length >0 )
        // {
        this.state.timeTrackingDataOverAll.forEach(element => {
          if (element !== undefined) {
            if (
              moment(this.state.monDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              
              this.setState({ userMonData: element.hours });
            }

            if (
              moment(this.state.tueDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              this.setState({ userTueData: element.hours });
            }

            if (
              moment(this.state.wedDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              this.setState({ userWedData: element.hours });
            }

            if (
              moment(this.state.thurDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              this.setState({ userThurData: element.hours });
            }

            if (
              moment(this.state.friDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              this.setState({ userFriData: element.hours });
            }

            if (
              moment(this.state.satDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              this.setState({ userSatData: element.hours });
            }

            if (
              moment(this.state.sunDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              this.setState({ userSunData: element.hours });
            }
          }
        });
        //}
        this.getWeekTotal();
      }.bind(this),
      20
    );
  }

  //----end overall----------------

  getTimeTrackingDataWithDates() {
    let nullHours = 0;

    this.setState({
      monData: nullHours,
      tueData: nullHours,
      wedData: nullHours,
      thurData: nullHours,
      friData: nullHours,
      satData: nullHours,
      sunData: nullHours
    });

    setTimeout(
      function() {
        // if(this.state.timeTrackingDataOrignal.length >0 )
        // {
        this.state.timeTrackingDataOrignal.forEach(element => {
          if (element !== undefined) {
            if (
              moment(this.state.monDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              if(element.hours===0)
              {
                this.setState({ prevMonValue: element.hours });
              }
              this.setState({ monData: element.hours });
            
            }

            if (
              moment(this.state.tueDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              if(element.hours===0)
              {
                this.setState({ prevTueValue: element.hours });
              }
              this.setState({ tueData: element.hours });
            }

            if (
              moment(this.state.wedDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              if(element.hours===0)
              {
                this.setState({ prevThurValue: element.hours });
              }
              this.setState({ wedData: element.hours });
            }

            if (
              moment(this.state.thurDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              if(element.hours===0)
              {
                this.setState({ prevThurValue: element.hours });
              }
              this.setState({ thurData: element.hours });
            }

            if (
              moment(this.state.friDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              if(element.hours===0)
              {
                this.setState({ prevFriValue: element.hours });
              }
              this.setState({ friData: element.hours });
            }

            if (
              moment(this.state.satDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              if(element.hours===0)
              {
                this.setState({ prevSatValue: element.hours });
              }
              this.setState({ satData: element.hours });
            }

            if (
              moment(this.state.sunDate).isSame(
                moment(element.trackingDate).format("YYYY-MM-DD")
              )
            ) {
              if(element.hours===0)
              {
                this.setState({ prevSunValue: element.hours });
              }
              this.setState({ sunData: element.hours });
            }
          }
        });
        //}
        this.getWeekTotal();
      }.bind(this),
      20
    );
  }

  async getTimeTrackingDataByRequestId() {
    let Id = this.props.requestId;
    if (Id !== 0) {
      const method = "TimeTracking/GetByRequestId/" + Id;
      const responseJson = await BFLOWDataService.get(method);
      debugger;
      this.setState({
        timeTrackingDataOverAll: responseJson
      });
    }
  }

  async getTimeTrackingDataByUserId() {
    let Id = this.props.requestId;
    if (Id !== 0) {
      const method = "TimeTracking/GetByUserId/" + Id;
      const responseJson = await BFLOWDataService.get(method);
      this.setState({
        timeTrackingDataOrignal: responseJson
      });
    }
  }

  NextWeek() {
    this.hideInputBar();
    this.saveTimeTrackingData();
    this.saveTimeTrackingDataOverAll();

    this.setState({
      monDate: moment(this.state.monDate)
        .add(7, "d")
        .toDate()
        .toDateString(),
      tueDate: moment(this.state.tueDate)
        .add(7, "d")
        .toDate()
        .toDateString(),
      wedDate: moment(this.state.wedDate)
        .add(7, "d")
        .toDate()
        .toDateString(),
      thurDate: moment(this.state.thurDate)
        .add(7, "d")
        .toDate()
        .toDateString(),
      friDate: moment(this.state.friDate)
        .add(7, "d")
        .toDate()
        .toDateString(),
      satDate: moment(this.state.satDate)
        .add(7, "d")
        .toDate()
        .toDateString(),
      sunDate: moment(this.state.sunDate)
        .add(7, "d")
        .toDate()
        .toDateString()
    });

    setTimeout(
      function() {
        this.getTimeTrackingDataWithDates();
        this.getTimeTrackingDataOverAllWithDates();
        this.setPreValueAsZero();
        var weekStart = moment(this.state.sunDate).toDate();
        var startDate = weekStart.getDate();
        this.setState({ weekStartDate: startDate });
      }.bind(this),
      20
    );
  }

  BackWeek() {
    this.hideInputBar();
    this.saveTimeTrackingData();
    this.saveTimeTrackingDataOverAll();

    this.setState({
      monDate: moment(this.state.monDate)
        .subtract(7, "d")
        .toDate()
        .toDateString(),
      tueDate: moment(this.state.tueDate)
        .subtract(7, "d")
        .toDate()
        .toDateString(),
      wedDate: moment(this.state.wedDate)
        .subtract(7, "d")
        .toDate()
        .toDateString(),
      thurDate: moment(this.state.thurDate)
        .subtract(7, "d")
        .toDate()
        .toDateString(),
      friDate: moment(this.state.friDate)
        .subtract(7, "d")
        .toDate()
        .toDateString(),
      satDate: moment(this.state.satDate)
        .subtract(7, "d")
        .toDate()
        .toDateString(),
      sunDate: moment(this.state.sunDate)
        .subtract(7, "d")
        .toDate()
        .toDateString()
    });

    setTimeout(
      function() {
        this.getTimeTrackingDataWithDates();
        this.getTimeTrackingDataOverAllWithDates();
        this.setPreValueAsZero();
        var weekStart = moment(this.state.sunDate).toDate();
        var startDate = weekStart.getDate();
        this.setState({ weekStartDate: startDate });
      }.bind(this),
      20
    );
  }

  Cancel() {
    this.props.hideTrackingWindow();
  }

  handleCloseErrorMessage() {
    this.setState({ showErrorMessage: false });
  }

  // Hide Alert Message
  setTimeOutForToasterMessages() {
    setTimeout(
      function() {
        this.setState({ showErrorMessage: false });
      }.bind(this),
      15000
    );
  }

  // show error message
  hideErrorMessage() {
    this.setState({ showErrorMessage: false });
  }

  async submitTimeTracking() {
    this.saveTimeTrackingData();

    if (this.state.timeTrackingDataOrignal.length > 0) {
      const body = JSON.stringify(this.state.timeTrackingDataOrignal);
      const method = "TimeTracking/AddTimeTrackingBulk";
      var message = await BFLOWDataService.post(method, body);

      if (message.Code === false && message.Code !== undefined) {
        this.setState({
          showErrorMessage: true,
          errorMessage: message.Message,
          errorMessageType: "danger"
        });
      } else {
        this.setState({
          showErrorMessage: true,
          errorMessage: message,
          errorMessageType: "success"
        });
        //  this.props.callRequestList();
      }

      this.setTimeOutForToasterMessages();
    }

    debugger;
    // const responseJson = await this.getTimeTrackingDataByRequestId();

    // setTimeout(
    //   function () {
    //     this.setState({ timeTrackingDataOrignal: responseJson });

    //   }
    //     .bind(this),
    //   20
    // );
    this.getWeekTotal();
  }

  render() {
    let sun = moment(this.state.sunDate).format("ddd");
    let mon = moment(this.state.monDate).format("ddd");
    let tue = moment(this.state.tueDate).format("ddd");
    let wed = moment(this.state.wedDate).format("ddd");
    let thur = moment(this.state.thurDate).format("ddd");
    let fri = moment(this.state.friDate).format("ddd");
    let sat = moment(this.state.satDate).format("ddd");
    let sunDate = moment(this.state.sunDate).format("Do MMM");
    let monDate = moment(this.state.monDate).format("Do MMM");
    let tueDate = moment(this.state.tueDate).format("Do MMM");
    let wedDate = moment(this.state.wedDate).format("Do MMM");
    let thurDate = moment(this.state.thurDate).format("Do MMM");
    let friDate = moment(this.state.friDate).format("Do MMM");
    let satDate = moment(this.state.satDate).format("Do MMM");
    let firstday = moment(this.state.sunDate).format("Do");
    let lastDay = moment(this.state.satDate).format("Do MMM");
    return (
      <>
        <AlertBanner
          onClose={this.handleCloseErrorMessage.bind(this)}
          Message={this.state.errorMessage}
          visible={this.state.showErrorMessage}
          Type={this.state.errorMesageType}
        />
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
                          <div class="float-right mr-3" ref={node => {
                                  if (node) {
                                    node.style.setProperty(
                                      "width",
                                      "20% ",
                                      "important"
                                    );
                                    node.style.setProperty(
                                      "float",
                                      "right ",
                                      "important"
                                    );
                                 
                                  }
                                }}>
                            <i
                              class="fas fa-chevron-left mr-2 mt-1 cursor-pointer float-left"
                              onClick={this.BackWeek.bind(this)}
                            />
                            <div class="d-inline ml-2  mr-2  float-right"  ><span class="float-right"> {firstday} - {lastDay}
                            <i
                              class="fas fa-chevron-right ml-2 mt-1 cursor-pointer float-right"
                              onClick={this.NextWeek.bind(this)}
                            /></span>
                            </div>
                            
                          
                          </div>
                        </div>
                      </div>

                      <div class="row m-3 ">
                        <table
                          class="table table-bordered"
                          style={{ color: "#55565a" }}
                        >
                          <thead>
                            <tr class="text-center">
                              <th 
                                ref={node => {
                                  if (node) {
                                    node.style.setProperty(
                                      "width",
                                      "12.5% ",
                                      "important"
                                    );
                                 
                                  }
                                }}
                              
                              scope="col" />
                              <th 
                                ref={node => {
                                  if (node) {
                                    node.style.setProperty(
                                      "width",
                                      "12.5% ",
                                      "important"
                                    );
                                 
                                  }
                                }}
                              scope="col">
                                {" "}
                                <p
                                  style={{ fontSize: ".90rem", margin: "4px" }}
                                >
                                  {sun}
                                </p>
                                <p
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "rgb(171, 171, 171)",
                                    fontWeight: "400",
                                    margin: "0"
                                  }}
                                >
                                  {sunDate}
                                </p>
                              </th>
                              <th   ref={node => {
                                  if (node) {
                                    node.style.setProperty(
                                      "width",
                                      "12.5% ",
                                      "important"
                                    );
                                 
                                  }
                                }} scope="col">
                                {" "}
                                <p
                                  style={{ fontSize: ".90rem", margin: "4px" }}
                                >
                                  {mon}
                                </p>
                                <p
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "rgb(171, 171, 171)",
                                    fontWeight: "400",
                                    margin: "0"
                                  }}
                                >
                                  {monDate}
                                </p>
                              </th>
                              <th   ref={node => {
                                  if (node) {
                                    node.style.setProperty(
                                      "width",
                                      "12.5% ",
                                      "important"
                                    );
                                 
                                  }
                                }} scope="col">
                                {" "}
                                <p
                                  style={{ fontSize: ".90rem", margin: "4px" }}
                                >
                                  {tue}
                                </p>
                                <p
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "rgb(171, 171, 171)",
                                    fontWeight: "400",
                                    margin: "0"
                                  }}
                                >
                                  {tueDate}
                                </p>
                              </th>
                              <th   ref={node => {
                                  if (node) {
                                    node.style.setProperty(
                                      "width",
                                      "12.5% ",
                                      "important"
                                    );
                                 
                                  }
                                }} scope="col">
                                {" "}
                                <p
                                  style={{ fontSize: ".90rem", margin: "4px" }}
                                >
                                  {wed}
                                </p>
                                <p
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "rgb(171, 171, 171)",
                                    fontWeight: "400",
                                    margin: "0"
                                  }}
                                >
                                  {wedDate}
                                </p>
                              </th>
                              <th   ref={node => {
                                  if (node) {
                                    node.style.setProperty(
                                      "width",
                                      "12.5% ",
                                      "important"
                                    );
                                 
                                  }
                                }} scope="col">
                                {" "}
                                <p
                                  style={{ fontSize: ".90rem", margin: "4px" }}
                                >
                                  {thur}
                                </p>
                                <p
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "rgb(171, 171, 171)",
                                    fontWeight: "400",
                                    margin: "0"
                                  }}
                                >
                                  {thurDate}
                                </p>
                              </th>
                              <th   ref={node => {
                                  if (node) {
                                    node.style.setProperty(
                                      "width",
                                      "12.5% ",
                                      "important"
                                    );
                                 
                                  }
                                }} scope="col">
                                {" "}
                                <p
                                  style={{ fontSize: ".90rem", margin: "4px" }}
                                >
                                  {fri}
                                </p>
                                <p
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "rgb(171, 171, 171)",
                                    fontWeight: "400",
                                    margin: "0"
                                  }}
                                >
                                  {friDate}
                                </p>
                              </th>
                              <th   ref={node => {
                                  if (node) {
                                    node.style.setProperty(
                                      "width",
                                      "12.5% ",
                                      "important"
                                    );
                                 
                                  }
                                }} scope="col">
                                {" "}
                                <p
                                  style={{ fontSize: ".90rem", margin: "4px" }}
                                >
                                  {sat}
                                </p>
                                <p
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "rgb(171, 171, 171)",
                                    fontWeight: "400",
                                    margin: "0"
                                  }}
                                >
                                  {satDate}
                                </p>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr class="text-center" ref={node => {
                                  if (node) {
                                    node.style.setProperty(
                                      "background-Color",
                                      "#f0f0f1",
                                      "important"
                                    );
                                 
                                  }
                                }} >
                              <td class="pt-1 pb-1 pl-4 pr-4">
                                <p
                                  style={{ fontSize: ".90rem", margin: "4px" }}
                                >
                                  Overall
                                </p>
                              </td>
                              <td class="pt-1 pb-1 pl-4 pr-4">{this.state.userSunData}</td>
                              {/* <div editable>{this.state.sunData}</div> <input  class="w-50" onChange={e => this.setState({ sunData: e.target.value }) } type="number" min="0" max="23"></input>  </td> */}
                              <td class="pt-1 pb-1 pl-4 pr-4">{this.state.userMonData}</td>
                              <td class="pt-1 pb-1 pl-4 pr-4">{this.state.userTueData}</td>
                              <td class="pt-1 pb-1 pl-4 pr-4">{this.state.userWedData}</td>
                              <td class="pt-1 pb-1 pl-4 pr-4">{this.state.userThurData}</td>
                              <td class="pt-1 pb-1 pl-4 pr-4">{this.state.userFriData}</td>
                              <td class="pt-1 pb-1 pl-4 pr-4">{this.state.userSatData}</td>{" "}
                            </tr>

                            <tr class="text-center">
                              <td class="pt-4 pb-4 pl-2 pr-2">
                                <p
                                  style={{ fontSize: ".90rem", margin: "4px" }}
                                >
                                  Self
                                </p>
                              </td>
                              <td class="p-4" >
                                {this.state.showTextBox[0].show ? (
                                  <input
                                    class="w-75 cursor-pointer text-center"
                                    onChange={e =>
                                      this.setState({ sunData: e.target.value })
                                    }
                                    defaultValue={this.state.sunData}
                                    onBlur={this.onBlurInputBoxSun.bind(this)}
                                    
                                    type="number"
                                    min="0"
                                    max="23"
                                  />
                                ) : (
                                  <div
                                    class="cursor-pointer"
                                    onClick={this.showInputBoxSun.bind(this)}
                                  >
                                    {" "}
                                    {this.state.sunData}
                                  </div>
                                )}
                              </td>
                              {/* <div editable>{this.state.sunData}</div> <input  class="w-50" onChange={e => this.setState({ sunData: e.target.value }) } type="number" min="0" max="23"></input>  </td> */}
                              <td class="p-4">
                                {this.state.showTextBox[1].show ? (
                                  <input
                                    class="w-75 cursor-pointer text-center"
                                    onChange={e =>
                                      this.setState({ monData: e.target.value })
                                    }
                                    defaultValue={this.state.monData}
                                    onBlur={this.onBlurInputBoxMon.bind(this)}
                                    type="number"
                                    min="0"
                                    max="23"
                                  />
                                ) : (
                                  <div
                                    class="cursor-pointer"
                                    onClick={this.showInputBoxMon.bind(this)}
                                  >
                                    {this.state.monData}
                                  </div>
                                )}
                              </td>
                              <td class="p-4">
                                {this.state.showTextBox[2].show ? (
                                  <input
                                    class="w-75 cursor-pointer text-center"
                                    onChange={e =>
                                      this.setState({ tueData: e.target.value })
                                    }
                                    defaultValue={this.state.tueData}
                                    onBlur={this.onBlurInputBoxTue.bind(this)}
                                    type="number"
                                    min="0"
                                    max="23"
                                  />
                                ) : (
                                  <div
                                    class="cursor-pointer"
                                    onClick={this.showInputBoxTue.bind(this)}
                                  >
                                    {this.state.tueData}
                                  </div>
                                )}
                              </td>
                              <td class="p-4">
                                {this.state.showTextBox[3].show ? (
                                  <input
                                    class="w-75 cursor-pointer text-center"
                                    onChange={e =>
                                      this.setState({ wedData: e.target.value })
                                    }
                                    defaultValue={this.state.wedData}
                                    onBlur={this.onBlurInputBoxWed.bind(this)}
                                    type="number"
                                    min="0"
                                    max="23"
                                  />
                                ) : (
                                  <div
                                    class="cursor-pointer"
                                    onClick={this.showInputBoxWed.bind(this)}
                                  >
                                    {this.state.wedData}
                                  </div>
                                )}
                              </td>
                              <td class="p-4">
                                {this.state.showTextBox[4].show ? (
                                  <input
                                    class="w-75 cursor-pointer text-center"
                                    onChange={e =>
                                      this.setState({
                                        thurData: e.target.value
                                      })
                                    }
                                    defaultValue={this.state.thurData}
                                    onBlur={this.onBlurInputBoxThur.bind(this)}
                                    type="number"
                                    min="0"
                                    max="23"
                                  />
                                ) : (
                                  <div
                                    class="cursor-pointer"
                                    onClick={this.showInputBoxThur.bind(this)}
                                  >
                                    {this.state.thurData}
                                  </div>
                                )}
                              </td>
                              <td class="p-4">
                                {this.state.showTextBox[5].show ? (
                                  <input
                                    class="w-75 cursor-pointer text-center"
                                    onChange={e =>
                                      this.setState({ friData: e.target.value })
                                    }
                                    defaultValue={this.state.friData}
                                    onBlur={this.onBlurInputBoxFri.bind(this)}
                                    type="number"
                                    min="0"
                                    max="23"
                                  />
                                ) : (
                                  <div
                                    class="cursor-pointer"
                                    onClick={this.showInputBoxFri.bind(this)}
                                  >
                                    {this.state.friData}
                                  </div>
                                )}
                              </td>
                              <td class="p-4">
                                {this.state.showTextBox[6].show ? (
                                  <input
                                    class="w-75 cursor-pointer text-center"
                                    onChange={e =>
                                      this.setState({ satData: e.target.value })
                                    }
                                    defaultValue={this.state.satData}
                                    onBlur={this.onBlurInputBoxSat.bind(this)}
                                    type="number"
                                    min="0"
                                    max="23"
                                  />
                                ) : (
                                  <div
                                    class="cursor-pointer"
                                    onClick={this.showInputBoxSat.bind(this)}
                                  >
                                    {this.state.satData}
                                  </div>
                                )}
                              </td>{" "}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class="row ml-0 mt-2" style={{ color: "#55565a" }}>
                      Total : {this.state.weekTrackingTotal} hrs
                    </div>
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
            {this.showSubmitButton()}
            <button
              type="button"
              class=" btn btn-light float-right mr-4 mb-2"
              onClick={this.Cancel.bind(this)}
            >
              Cancel
            </button>
          </div>
        </div>
      </>
    );
  }
}
export default withGlobalState(TimeTracking);
