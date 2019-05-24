import React, { Component } from 'react';
import DateTime from 'react-datetime'
import moment from 'moment';
import NumericInput from 'react-numeric-input';

import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
// import { RequestDataService } from "../../configuration/services/RequestDataService";
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

  handleSundayChange(e) {
    debugger
    this.setState({ Sunday: !this.state.Sunday });
  }

  handleMondayChange() {
    debugger
    this.setState({ Monday: !this.state.Monday });
  }
  handleTuesdayChange() {
    this.setState({ Tuesday: !this.state.Tuesday });
  }
  handleWednesdayChange() {
    debugger
    this.setState({ Wednesday: !this.state.Wednesday });
  }
  handleThursdayChange() {
    debugger
    this.setState({ Thursday: !this.state.Thursday });
  }
  handleFridayChange() {
    debugger
    this.setState({ Friday: !this.state.Friday });
  }
  handleSaturdayChange() {
    debugger
    this.setState({ Saturday: !this.state.Saturday });
  }
  
  handleOccurrences(e) {
    debugger
    this.setState({ Occurrences: e});
  }
  handleEndAfterRadio(e) {
    debugger
    this.setState({ EndAfterRadio: e});
  }
  handleEndByRadio(e) {
    debugger
    this.setState({ EndByRadio: e});
  }


  handleDaily() {
    debugger
    this.setState({ Mode: 'Daily' });
  }

  handleWeekly() {
    debugger
    this.setState({ Mode: 'Weekly' });
  }

  handleMonthly() {
    debugger
    this.setState({ Mode: 'Monthly' });
  }

  handleYearly() {
    debugger
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
    debugger
    this.setState({ SelectedMonth: e.target.value })
  }

  async handleReset() {
    const responseJson = await BFLOWDataService.get("Recurrence");
    this.setState({ recurrence: responseJson });

  }

  handleDailyInterval(e) {
    debugger
    this.setState({ DailyInterval: e });
  }

  handleWeeklyInterval(e) {
    debugger
    this.setState({ WeeklyInterval: e });
  }

  handleMonthlyInterval(e) {
    debugger
    this.setState({ MonthlyInterval: e });
  }

  handleYearlyInterval(e) {
    debugger
    this.setState({ YearlyInterval: e });
  }


  handleDayOfMonth(e) {
    debugger
    this.setState({ DayOfMonth: e });
  }


  /** Request Details Start */
  handleSave() {
    debugger
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
          // "weekOfMonth": this.state.Mode === "Yearly" ? this.state.DayOfMonth : null,
          "dayOfMonth": this.state.Mode === "Monthly" ? this.state.DayOfMonth : null,
          "Monday": this.state.Mode === "Weekly" ? this.state.Monday : false,
          "Tuesday": this.state.Mode === "Weekly" ? this.state.Tuesday: false,
          "Wednesday": this.state.Mode === "Weekly" ? this.state.Wednesday: false,
          "Thursday": this.state.Mode === "Weekly" ? this.state.Thursday: false,
          "Friday": this.state.Mode === "Weekly" ? this.state.Friday: false,
          "Saturday": this.state.Mode === "Weekly" ? this.state.Saturday: false,
          "Sunday": this.state.Mode === "Weekly" ? this.state.Sunday: false
        })

      if (this.state.Title !== "") {
        debugger
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
        const message = BFLOWDataService.put(
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

        }
        //this.ResetStateValues();
        //this.setTimeOutForToasterMessages();

      }
    }
  }

  // validateForm() {
  //   let blError = true;
  //   if (!this.state.timeZoneId) {
  //     this.setState({ errorTimeZoneid: TimeZoneErrMsg });
  //     blError = false;
  //   }
  //   return blError;
  // }


  /*Method to handle change event of all elements*/
  // handleChange(event) {
  //   const { name, value } = event.target;
  //   this.setState({ [name]: value })
  // }
  render() {
    let optionTemplate = this.state.MonthNames.map(v => (
      <option value={v.id}>{v.name}</option>
    ));
    return (
      <>

        <div class=" " style={{ fontWeight: "500" }}>
          Set recurrence
       </div>
        <div class=" " style={{ fontWeight: "300" }}>
          Create a recurring request that repeats at regular intervals
       </div>
        <br></br>
        <div class="card w-100">
          <div class="card-body">
            <div class="container">
              <div class="row">
                <div class="col-sm-3">
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="RadioInterval" id="DailyRadio" value="option1" onClick={this.handleDaily.bind(this)} defaultChecked />
                    <label class="form-check-label" for="DailyRadio">
                      Daily
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="RadioInterval" id="WeeklyRadio" value="option2" onClick={this.handleWeekly.bind(this)} />
                    <label class="form-check-label" for="WeeklyRadio">
                      Weekly
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="RadioInterval" id="MonthlyRadio" value="option3" onClick={this.handleMonthly.bind(this)} />
                    <label class="form-check-label" for="MonthlyRadio">
                      Monthly
                   </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="RadioInterval" id="YearlyRadio" value="option4" onClick={this.handleYearly.bind(this)} />
                    <label class="form-check-label" for="YearlyRadio">
                      Yearly
                    </label>
                  </div>
                </div>
                <div class="col-sm-9">
                  <div>
                    {(() => {
                      // debugger;
                      if (this.state.Mode === 'Weekly') {
                        return (
                          <div>
                            <div>Every</div>
                            <NumericInput min={1} max={999} value={this.state.WeeklyInterval} onChange={this.handleWeeklyInterval} /> Weeks
                            <div>
                              <Button variant="outline-primary" className="rounded-circle p-0 roundbutton" onClick={this.handleSundayChange.bind(this)} >Su</Button>
                              <Button variant="outline-primary" className="rounded-circle p-0 roundbutton" onClick={this.handleMondayChange.bind(this)} >Mo</Button>
                              <Button variant="outline-primary" className="rounded-circle p-0 roundbutton" onClick={this.handleTuesdayChange.bind(this)} >Tu</Button>
                              <Button variant="outline-primary" className="rounded-circle p-0 roundbutton" onClick={this.handleWednesdayChange.bind(this)} >We</Button>
                              <Button variant="outline-primary" className="rounded-circle p-0 roundbutton" onClick={this.handleThursdayChange.bind(this)} >Th</Button>
                              <Button variant="outline-primary" className="rounded-circle p-0 roundbutton" onClick={this.handleFridayChange.bind(this)} >Fr</Button>
                              <Button variant="outline-primary" className="rounded-circle p-0 roundbutton" onClick={this.handleSaturdayChange.bind(this)} >Sa</Button>
                            </div>
                          </div>
                        )
                      } else if (this.state.Mode === 'Monthly') {
                        return (
                          <div>
                            Day
                            <NumericInput min={1} max={999} value={1} onChange={this.handleDayOfMonth} /> of every
                            <NumericInput min={1} max={999} value={this.state.MonthlyInterval} onChange={this.handleMonthlyInterval} /> Month(s)
                          </div>
                        )
                      }
                      else if (this.state.Mode === 'Yearly') {
                        return (
                          <div>
                            Day
                            <NumericInput min={1} max={999} value={1} onChange={this.handleDayOfMonth} /> Month
                            <label>
                              <select name="MonthSelection" value={this.state.SelectedMonth} onChange={this.handleMonthChange.bind(this)} >
                                {optionTemplate}
                              </select>
                            </label>
                            <NumericInput min={1} max={999} value={this.state.YearlyInterval} onChange={this.handleYearlyInterval.bind(this)} /> Year(s)
                          </div>
                        )
                      }
                      else {
                        return (
                          <div>
                            <div>Every</div>
                            <NumericInput min={1} max={999} value={this.state.DailyInterval} onChange={this.handleDailyInterval.bind(this)} /> Days
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

        <div class="card w-100">
          <div class="card-body">
            <div class="container">
              <div class="row">
                <div class="col-sm-3">
                  <p>Start date</p>
                  <br></br>
                  <p>End date</p>
                </div>
                <div class="col-sm-9">
                  <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0 ">
                    <label class="m-0" style={{ color: "#ababab", fontSize: ".80rem" }}>
                      Start Date
                    </label>
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
                    />
                    <br></br>
                    <div class="row">
                      <div class="col-sm-3">
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="RadioEnd" id="EndAfterRadio" value="option1" onClick={this.handleEndAfterRadio.bind(this)} defaultChecked/>
                          <label class="form-check-label" for="EndAfterRadio">
                            End after
                          </label>
                        </div>

                      </div>
                      <div class="col-sm-9">
                        <NumericInput min={1} max={999} value={this.state.Occurrences} onChange={this.handleOccurrences.bind(this)}/>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-sm-3">
                        <br></br>
                        <div class="form-check">
                          <input class="form-check-input" type="radio" name="RadioEnd" id="EndByRadio" value="option2" onClick={this.handleEndByRadio.bind(this)}/>
                          <label class="form-check-label" for="EndByRadio">
                            End by
                          </label>
                        </div>
                      </div>
                      <div class="col-sm-9">
                        <DateTime
                          viewMode='days'
                          timeFormat={false}
                          defaultValue={new Date()}
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
            class=" btn btn-light float-right mr-4 mb-2"
            onClick={this.handleSave.bind(this)}
          >
            Save
          </button>
          <button
            type="button"
            class=" btn btn-light float-right mr-4 mb-2"
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