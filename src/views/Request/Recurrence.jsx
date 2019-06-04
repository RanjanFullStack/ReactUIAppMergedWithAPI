import React, { Component } from 'react';
import DateTime from 'react-datetime'
import moment from 'moment';
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import './Recurrence.css';
import { Button } from 'react-bootstrap';

class Recurrence extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      StartDate: new Date(),
      EndBy: new Date(),
      Mode: 'Daily',
      SelectedMonth: 1,
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      WeeklyInterval: 1,
      MonthlyInterval: 1,
      DailyInterval: 1,
      YearlyInterval: 1,
      DayOfMonth: 1,
      Occurrences:1,
      EndAfterRadio:true,
      EndByRadio:false,
      MonthNames: [
        { name: 'January', id: 1 },
        { name: 'February', id: 2 },
        { name: 'March', id: 3 },
        { name: 'April', id: 4 },
        { name: 'May', id: 5 },
        { name: 'June', id: 6 },
        { name: 'July', id: 7 },
        { name: 'August', id: 8 },
        { name: 'September', id: 9 },
        { name: 'October', id: 10 },
        { name: 'November', id: 11 },
        { name: 'December', id: 12 }
      ]
    };
  }

  handleSundayChange() {
    
    this.setState({ Sunday: !this.state.Sunday });
  }

  handleMondayChange() {
    
    this.setState({ Monday: !this.state.Monday });
  }
  handleTuesdayChange() {
    this.setState({ Tuesday: !this.state.Tuesday });
  }
  handleWednesdayChange() {
    
    this.setState({ Wednesday: !this.state.Wednesday });
  }
  handleThursdayChange() {
    
    this.setState({ Thursday: !this.state.Thursday });
  }
  handleFridayChange() {
    
    this.setState({ Friday: !this.state.Friday });
  }
  handleSaturdayChange() {
    
    this.setState({ Saturday: !this.state.Saturday });
  }
  
  handleOccurrences(e) {

    this.setState({ Occurrences: e.target.value});
  }
  handleEndAfterRadio(e) {
    
    this.setState({ EndAfterRadio: e.target.checked, EndByRadio: false});
  }
  handleEndByRadio(e) {
    this.setState({ EndByRadio: e.target.checked, EndAfterRadio:false});
  }


  handleDaily() {
    
    this.setState({ Mode: 'Daily' });
  }

  handleWeekly() {
    
    this.setState({ Mode: 'Weekly' });
  }

  handleMonthly() {
    
    this.setState({ Mode: 'Monthly' });
  }

  handleYearly() {
    
    this.setState({ Mode: 'Yearly' });
  }

  handleDateForStartDate(date) {
    date = moment(date).format('MMMM DD YYYY');
    this.setState({ StartDate: date })

  }

  handleDateForEndByDate(date) {
    date = moment(date).format('MMMM DD YYYY');
    this.setState({ EndBy: date })

  }

  handleMonthChange(e) {
    
    this.setState({ SelectedMonth: e.target.value })
  }

  async handleReset() {
    const responseJson = await BFLOWDataService.get("Recurrence");
    this.setState({ recurrence: responseJson });

  }

  handleDailyInterval(e) {
    
    this.setState({ DailyInterval: e.target.value });
  }

  handleWeeklyInterval(e) {
    
    this.setState({ WeeklyInterval: e.target.value });
  }

  handleMonthlyInterval(e) {
    
    this.setState({ MonthlyInterval: e.target.value });
  }

  handleYearlyInterval(e) {
    
    this.setState({ YearlyInterval: e.target.value });
  }


  handleDayOfMonth(e) {
    
    this.setState({ DayOfMonth: e.target.value });
  }


  /** Request Details Start */
 async handleSave() {
   
    //this.setState({ show: false });
    var value = false;//this.ValidateForm();
    if (value === false) {
      const responseJson = this.props.GetRequestByIdJson;
      let arrRecurrence = [];
      arrRecurrence.push(
        {
          "recurrenceTypeId": this.state.Mode === "Daily" ? 1 : this.state.Mode === "Weekly" ? 2 : this.state.Mode === "Monthly" ? 3 : this.state.Mode === "Yearly" ? 4 : 0,
          "interval": this.state.Mode === "Daily" ? this.state.DailyInterval : this.state.Mode === "Weekly" ? this.state.WeeklyInterval : this.state.Mode === "Monthly" ? this.state.MonthlyInterval : this.state.Mode === "Yearly" ? this.state.YearlyInterval : 0,
          "monthOfYear": this.state.Mode === "Yearly" ? this.state.SelectedMonth : null,
          "occurrences": this.state.EndAfterRadio ? this.state.Occurrences : null,
          "startDate": this.state.StartDate,
          "endDate": this.state.EndByRadio ? this.state.EndBy : null,
          "dayOfMonth": this.state.Mode === "Monthly" || this.state.Mode === "Yearly" ? this.state.DayOfMonth : null,
          "Monday": this.state.Mode === "Weekly" ? this.state.Monday : false,
          "Tuesday": this.state.Mode === "Weekly" ? this.state.Tuesday: false,
          "Wednesday": this.state.Mode === "Weekly" ? this.state.Wednesday: false,
          "Thursday": this.state.Mode === "Weekly" ? this.state.Thursday: false,
          "Friday": this.state.Mode === "Weekly" ? this.state.Friday: false,
          "Saturday": this.state.Mode === "Weekly" ? this.state.Saturday: false,
          "Sunday": this.state.Mode === "Weekly" ? this.state.Sunday: false
        })

      if (this.state.Title !== "") {
      
        const body = JSON.stringify({
          Title: responseJson.title,
          description: responseJson.description,
          isRecurrence: true,
          RequestKeyValues: responseJson.requestKeyValues,
          MapRequestWithMasterAttributes: responseJson.mapRequestWithMasterAttributes,
          Timeline: responseJson.timeline,
          DueDateTime: responseJson.dueDateTime,
          RequestWatchers: responseJson.requestWatchers,
          Recurrence: arrRecurrence
        });
        const message = await BFLOWDataService.put(
          "Request",
          responseJson.id,
          body
        );
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
          this.props.callRequestListFromRecurrence();

        }
        this.ResetStateValues();
        //this.setTimeOutForToasterMessages();

      }
    }
  }

  ResetStateValues() {

    this.setState({ StartDate: new Date(),
      EndBy: new Date(),
      Mode: 'Daily',
      SelectedMonth: 1,
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      WeeklyInterval: 1,
      MonthlyInterval: 1,
      DailyInterval: 1,
      YearlyInterval: 1,
      DayOfMonth: 1,
      Occurrences:1,
      EndAfterRadio:true,
      EndByRadio:false })
  }

  render() {
    let optionTemplate = this.state.MonthNames.map(v => (
      <option value={v.id}>{v.name}</option>
    ));
    return (
      <>

        <div class="mr-3 ml-3 mt-2 mb-0" style={{ fontWeight: "500" }}>
         <h5 style={{ fontSize: "1rem",fontWeight: "500",color: "#55565a" }}> Set recurrence</h5>
       </div>
        <div class="ml-3 mb-0 mr-3 mt-0" style={{ fontWeight: "300",fontSize: "0.75rem",color: "#7f7f7f" }}>
          Create a recurring request that repeats at regular intervals
       </div>
        <br></br>
        <div class="card ml-3  mr-3 mb-0 border-0 p-2" style={{backgroundColor:"#FAFAFB"}}>
          <div class="card-body">
            <div class="container">
              <div class="row">
                <div class="col-sm-3 ml-0 pr-0">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" style={{width:"20px",height:"20px"}} name="RadioInterval" id="DailyRadio" value="option1" checked = {this.state.Mode === "Daily" ? true : false } onClick={this.handleDaily.bind(this)} />
                    <label class="form-check-label labelColor ml-3 pt-1" for="DailyRadio">
                      Daily
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" style={{width:"20px",height:"20px"}} name="RadioInterval" id="WeeklyRadio" value="option2" onClick={this.handleWeekly.bind(this)} />
                    <label class="form-check-label labelColor ml-3 pt-1" for="WeeklyRadio">
                      Weekly
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input p-4" type="radio" style={{width:"20px",height:"20px"}} name="RadioInterval" id="MonthlyRadio" value="option3" onClick={this.handleMonthly.bind(this)} />
                    <label class="form-check-label labelColor ml-3 pt-1" for="MonthlyRadio">
                      Monthly
                   </label>
                  </div>
                  <div class="form-check">
                    {/* <input class="form-check-input" type="radio" style={{width:"20px",height:"20px"}} name="RadioInterval" id="YearlyRadio" value="option4" onClick={this.handleYearly.bind(this)} />
                    <label class="form-check-label labelColor ml-3 pt-1" for="YearlyRadio">
                      Yearly
                    </label> */}
                  </div>
                </div>
                <div class="col-sm-1 vl m-0"> </div>
                <div class="col-sm-8"style={{paddingLeft:"none !important"}}>
                  <div>
                    {(() => {
                      // ;
                      if (this.state.Mode === 'Weekly') {
                        return (
                          <div>
                            <div class="mt-2 mb-2 mr-2"  style={{ color: "#ababab",fontSize:"0.75rem" }} >Every</div>
                            <div><input name="weeklyInterval" class="mb-2 mr-2 p-1 w-25 labelColor numberInputCustom" style={{}} value={this.state.WeeklyInterval}  type="number" min="1" max="999" onChange={this.handleWeeklyInterval.bind(this)} /><span class="labelColor">Weeks(s)</span></div>

                            {/* <NumericInput class="form-control border mb-2 mr-2" min={1} max={999} value={this.state.WeeklyInterval} onChange={this.handleWeeklyInterval} /> Weeks(s) */}
                            <div>
                              <Button name ="su "variant="outline-primary" className={this.state.Sunday===true ? "rounded-circle p-0 roundedButton active":"rounded-circle p-0 roundedButton"} onClick={this.handleSundayChange.bind(this)} >Su</Button>
                              <Button name ="mo"  variant="outline-primary" className={this.state.Monday===true ? "rounded-circle p-0 roundedButton active":"rounded-circle p-0 roundedButton"} onClick={this.handleMondayChange.bind(this)} >Mo</Button>
                              <Button name ="tu"  variant="outline-primary" className={this.state.Tuesday===true ? "rounded-circle p-0 roundedButton active":"rounded-circle p-0 roundedButton"} onClick={this.handleTuesdayChange.bind(this)}>Tu</Button>
                              <Button name ="we"  variant="outline-primary" className={this.state.Wednesday===true ? "rounded-circle p-0 roundedButton active":"rounded-circle p-0 roundedButton"} onClick={this.handleWednesdayChange.bind(this)} >We</Button>
                              <Button name ="th"  variant="outline-primary" className={this.state.Thursday===true ? "rounded-circle p-0 roundedButton active":"rounded-circle p-0 roundedButton"} onClick={this.handleThursdayChange.bind(this)}>Th</Button>
                              <Button name ="fr"  variant="outline-primary" className={this.state.Friday===true ? "rounded-circle p-0 roundedButton active":"rounded-circle p-0 roundedButton"} onClick={this.handleFridayChange.bind(this)} >Fr</Button>
                              <Button name ="sa"  variant="outline-primary" className={this.state.Saturday===true ? "rounded-circle p-0 roundedButton active":"rounded-circle p-0 roundedButton"} onClick={this.handleSaturdayChange.bind(this)}>Sa</Button>
                            </div>
                          </div>
                        )
                      } else if (this.state.Mode === 'Monthly') {
                        return (
                          <div class="mt-3">
                            <span class="labelColor">Day</span>
                            <input name="dayOfMonth" class="ml-3 mt-3 mb-3 mr-1 p-1 labelColor numberInputCustom" value={this.state.DayOfMonth} style={{width:"3.625rem",height:"2rem",color:"#55565a"}}  type="number" min="1" max="999" onChange={this.handleDayOfMonth.bind(this)}></input><span class="labelColor"> of every</span> 
                            <input name="monthlyInterval" class="ml-1 mt-3 mb-3 mr-3 p-1 w-25 labelColor numberInputCustom" value={this.state.MonthlyInterval} style={{width:"7.813rem",height:"2rem",color:"#55565a"}}   type="number" min="1" max="999" onChange={this.handleMonthlyInterval.bind(this)}></input><span class="labelColor"> Month(s)</span>
                            {/* <input min={1} type="number" class="w-25" max={999} value={1} onChange={this.handleDayOfMonth} /> of every */}
                            {/* <NumericInput min={1} max={999} value={this.state.MonthlyInterval} onChange={this.handleMonthlyInterval} /> Month(s) */}
                          </div>
                        )
                      }
                      else if (this.state.Mode === 'Yearly') {
                        return (
                          <div>
                            <span class="labelColor">Day</span>
                            <input name="yearlyDayOfMonthInterval" class="ml-3 mt-3 mb-3 mr-1 p-1 labelColor numberInputCustom" style={{width:"3.625rem ",height:"2rem !important"}} value={1}   type="number" min="1" max="999" onChange={this.handleDayOfMonth.bind(this)}></input>
                            <span class="labelColor"> Month</span>
                            <label>
                              <select name="MonthSelection" class="p-1 ml-2 labelColor numberInputCustom" value={this.state.SelectedMonth} onChange={this.handleMonthChange.bind(this)} >
                                {optionTemplate}
                              </select>
                            </label>
                            <div class="" style={{marginLeft:"1.625rem"}}>
                              <input name="yearlyInterval" class="ml-3 mt-3 mb-3 mr-1 p-1 labelColor numberInputCustom"  value={this.state.YearlyInterval}  style={{width:"3.625rem",height:"2rem !important"}} type="number" min="1" max="999"  onChange={this.handleYearlyInterval.bind(this)}></input><span class="labelColor"> Year(s)</span>
                            </div>
                            {/* <NumericInput min={1} max={999} value={this.state.YearlyInterval} onChange={this.handleYearlyInterval.bind(this)} /> Year(s) */}
                          </div>
                        )
                      }
                      else {
                        return (
                          <div>
                            
                            <div class="mt-2 mb-2 mr-2"  style={{ color: "#ababab",fontSize:"0.75rem"  }}><span class="labelColor">Every</span></div>
                            <div><input name="dailyInterval" class="mb-2 mr-2 p-1 labelColor numberInputCustom" style={{fontSize: "0.875rem"}} value={this.state.DailyInterval} onChange={this.handleDailyInterval.bind(this)}  type="number" min="1" max="999" /><span class="labelColor">Day(s)</span></div>

                            {/* <NumericInput class="form-control border" min={1} max={999} value={this.state.DailyInterval} onChange={this.handleDailyInterval.bind(this)} /> Days */}
                          </div>
                        )
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <br></br>

        <div class="card ml-3  mr-3 mb-0 border-0 p-2"  style={{backgroundColor:"#FAFAFB"}}>
          <div class="card-body">
            <div class="container">
              <div class="row">
                <div class="col-sm-3 mr-0 pr-0">
                  <p class="labelColor form-check-label">Start date</p>
                  <br></br>
                  <p class="mt-4 labelColor form-check-label">End date</p>
                </div>
                <div class="col-sm-1 vl m-0"> </div>
                <div class="col-sm-8 mr-0 pr-0">
                  <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0 ">
                    <label class="m-0 mb-2" style={{ color: "#ababab", fontSize: "0.75rem" }}>
                      Start Date
                    </label>
<div class="w-75">
                    <DateTime
                    
                    viewMode='days'
                      timeFormat={false}
                      defaultValue={new Date()}
                      viewDate={this.state.StartDate === null ? moment(new Date()).format('MMMM DD YYYY') : this.state.StartDate}
                      dateFormat='MMMM DD YYYY'
                      isValidDate={current => current.isAfter(DateTime.moment(new Date()).startOf('day') - 1)}
                      // timeConstraints={hours{min:9, max:15, step:2}
                      onChange={this.handleDateForStartDate.bind(this)}
                      name="StartDate"
                      id="StartDate"
                      value={this.state.StartDate !== null ? moment(this.state.StartDate).format('MMMM DD YYYY') : ''}
                      selected={this.state.StartDate}
                      //timeConstraints={{ hours: { min: this.state.StartDate !== null ? new Date(this.state.StartDate).getHours() : new Date().getHours(), max: 23, step: 1 }, minutes: { min: this.state.StartDate !== null ? new Date(this.state.StartDate).getMinutes() : new Date().getMinutes(), max: 59, step: 1 } }}
                      inputProps={{ readOnly: true }}
                      
                    /></div>
                    <br></br>
                    <div class="row">
                      <div class="col-sm-3" style={{paddingLeft:"none !important"}}>
                        <div class="form-check mr-0 pr-0">
                          <input class="form-check-input" type="radio" style={{width:"20px",height:"20px"}} name="RadioEnd" id="EndAfterRadio" value="option1" onClick={this.handleEndAfterRadio.bind(this)} defaultChecked/>
                          <label class="form-check-label labelColor ml-3  pt-1" for="EndAfterRadio">
                            End after
                          </label>
                        </div>

                      </div>
                      <div class="col-sm-8 m-0">
                      <input name="occurrences" class=" mb-3 mr-1 p-1 labelColor numberInputCustom w-75" style={{}} value={this.state.Occurrences}  type="number" min="1" max="999"  onChange={this.handleOccurrences.bind(this)}></input>

                        {/* <NumericInput min={1} max={999} value={this.state.Occurrences} onChange={this.handleOccurrences.bind(this)}/> */}
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-sm-3"style={{paddingLeft:"none !important"}}>
                        <br></br>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="RadioEnd" id="EndByRadio" style={{width:"20px",height:"20px"}} value="option2" onClick={this.handleEndByRadio.bind(this)}/>
                          <label class="form-check-label labelColor ml-3 pt-1" for="EndByRadio">
                            End by
                          </label>
                        </div>
                      </div>
                      <div class="col-sm-6 mt-3 labelColor umberInputCustom w-75">
                        <DateTime
                          viewMode='days'
                          timeFormat={false}
                          defaultValue={new Date()}
                          class="umberInputCustom w-50"
                          viewDate={this.state.EndBy === null ? moment(new Date()).format('MMMM DD YYYY') : this.state.EndBy}
                          dateFormat='MMMM DD YYYY'
                          isValidDate={current => current.isAfter(DateTime.moment(new Date()).startOf('day') - 1)}
                          onChange={this.handleDateForEndByDate.bind(this)}
                          name="EndBy"
                          id="EndBy"
                          value={this.state.EndBy !== null ? moment(this.state.EndBy).format('MMMM DD YYYY') : ''}
                          selected={this.state.EndBy}
                          inputProps={{ readOnly: true }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <div class="card-footer bg-white">



          {/* {this.showSubmit()}  */}
          <button                                                                                                       
            type="button"
            class=" default-button btn-dark float-right mr-2"
            onClick={this.handleSave.bind(this)}
          >
            Save
          </button>
          <button
            type="button" 
            class=" btn btn-light float-right default-button-secondary"
            onClick={this.handleReset.bind(this)}
          >
            Reset
          </button>
        </div>

      </>
    );
  }
}
export default Recurrence;