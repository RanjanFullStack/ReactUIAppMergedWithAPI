import React, { Component } from "react";
import { AuthService } from "../../configuration/services/AuthService";
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";

import { Tab, Tabs } from "react-bootstrap";
import AlertBanner from '../../components/AlertBanner/index'
import './account-settings.css';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            currentActiveTab: '',
            userId: 0,
            firstName: '',
            lastName: '',
            email: '',
            timeZoneId: 0,
            timezonelist: [],
            errorCurrentPassword: '',
            errorNewPassword: '',
            errorConfirmPassword: '',
            errorFirstName: '',
            errorLastName: '',
            // errorEmail: '',
            errorTimeZoneId: '',
            showErrorMesage: false,
            errorMessageType: '',
            errorMessage: '',
            isFirstLogin: false
        }
    }

    async componentDidMount() {
        await this.getUser();
        this.GetTimeZone();
        var isFirstLogin = localStorage.getItem("isFirstLogin");
        if (isFirstLogin === "true") {
            this.setState({
                currentActiveTab: 'password',
                isFirstLogin: true
            })
        }
        else {
            this.setState({
                currentActiveTab: 'profile',
                isFirstLogin: false
            })
        }
    }
    /*Method to handle change event of all elements*/
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }
    /**Method to hide Alert Message */
    setTimeOutForToasterMessages(operation, errorMessageType) {
        if (operation === 'changepassword' && errorMessageType === 'success') {
            setTimeout(
                function () {
                    this.setState({ showErrorMesage: false });
                    this.logOut();
                }
                    .bind(this),
                3000
            );
        }
        else {
            setTimeout(
                function () {
                    this.setState({ showErrorMesage: false });
                }
                    .bind(this),
                15000
            );
        }
    }
    /**Method to logout on change password */
    logOut() {
        localStorage.clear();
        let url = process.env.REACT_APP_Logout_Url;
        window.location.href = (url);
    }
    /**Method to reset error state of change password */
    resetErrorState() {
        this.setState({
            errorCurrentPassword: '',
            errorNewPassword: '',
            errorConfirmPassword: ''
        })
    }
    /**Method to reset state of change password */
    resetStateValues() {
        this.setState({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        })
        this.resetErrorState();
    }
    /*Method to handle error message */
    handleCloseErrorMessage() {
        this.setState({ showErrorMesage: false })
    }
    async GetTimeZone() {
        const responseJson = await BFLOWDataService.get('Timezone');
        this.setState({ timezonelist: responseJson })
    }
    /*Method to call User List API*/
    async getUser() {
        const responseJson = await BFLOWDataService.get('Users');
        var userEmailId = localStorage.getItem("userEmailId");

        let filtervalue = responseJson.filter(x => x.email.toLowerCase() === userEmailId.toLowerCase())
        if (filtervalue !== undefined || filtervalue !== null || filtervalue !== '') {
            this.getUserById(filtervalue[0].id)
        }

    }
    /*Method to call Get User By ID API*/
    async getUserById(userid) {
        const responseJson = await BFLOWDataService.getbyid('Users', userid);
        if (responseJson !== undefined) {
            this.setState({
                userId: responseJson.id,
                firstName: responseJson.firstName,
                lastName: responseJson.lastName,
                email: responseJson.email,
                timeZoneId: responseJson.timeZoneId,
            });

        }
    }
    /*Method to call Update User By ID API*/
    async updateUser() {
        this.setState({
            errorFirstName: "",
            errorLastName: "",
            // errorEmail: "",
            // errorTimeZoneId: "",
        });

        // checking validateForm
        var value = this.validateUserForm();
        if (value === true) {
            const body = JSON.stringify({
                FirstName: this.state.firstName,
                LastName: this.state.lastName,
                // Email: this.state.email,
                TimeZoneID: this.state.timeZoneId,
                App: process.env.REACT_APP_APP_NAME
            });

            const response = await BFLOWDataService.put('Users', this.state.userId, body);
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
                //this.getUser();
            }
            this.setTimeOutForToasterMessages();
        }
    }
    /*Method to reset User Profile*/
    resetUserProfile() {
        this.setState({
            errorFirstName: '',
            errorLastName: '',
            //errorEmail:'',
            errorTimeZoneId: '',
        })
        this.getUserById(this.state.userId)
    }
    /*Method to validate User Form*/
    validateUserForm() {
        //var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let blError = true;
        const firstNameErrMsg = process.env.REACT_APP_USERLIST_ERROR_FIRST_NAME;
        const lastNameErrMsg = process.env.REACT_APP_USERLIST_ERROR_LAST_NAME;
        //const emailErrMsg = process.env.REACT_APP_USERLIST_ERROR_EMAIL;
        //const emailValidErrMsg = process.env.REACT_APP_USERLIST_ERROR_VALID_EMAIL;
        const TimeZoneErrMsg = process.env.REACT_APP_USERLIST_ERROR_TIMEZONE;

        if (this.state.firstName === "" || this.state.firstName === null || this.state.firstName === undefined) {
            this.setState({ errorFirstName: firstNameErrMsg });
            blError = false;
        }
        if (this.state.lastName === "" || this.state.lastName === null || this.state.lastName === undefined) {
            this.setState({ errorLastName: lastNameErrMsg });
            blError = false;
        }
        // if (this.state.email === "" || this.state.email === null || this.state.email === undefined) {
        //     this.setState({ errorEmail: emailErrMsg });
        //     blError = false;
        // } else if (!regexEmail.test(String(this.state.email).toLowerCase())) {
        //     this.setState({ errorEmail: emailValidErrMsg });
        //     blError = false;
        // }
        if (this.state.timeZoneId === "" || this.state.timeZoneId === null || this.state.timeZoneId === undefined) {
            this.setState({ errorTimeZoneId: TimeZoneErrMsg });
            blError = false;
        }
        return blError;
    }

    /*Method to Change Password*/
    async changePassword() {
        var value = this.validateForm();
        if (value === false) {
            let appName = process.env.REACT_APP_APP_NAME;
            var userEmailId = localStorage.getItem("userEmailId");
            var currentPassword = "";
            if (this.state.isFirstLogin === true) {
                currentPassword = "";
            } else {
                currentPassword = this.state.currentPassword;
            }
            const body = JSON.stringify({
                Email: userEmailId,
                Password: currentPassword,
                NewPassword: this.state.newPassword,
                App: appName
            });

            const response = await AuthService.changePassword(body);
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
                this.resetStateValues();
            }
            this.setTimeOutForToasterMessages("changepassword", this.state.errorMessageType);
        }
    }
    /*Method to validate Change Password Form*/
    validateForm() {
        this.resetErrorState();
        var pattern = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&_#^])[A-Za-z\d$@$!%*?&_#^].{7,19}");
        var currentPassword = this.state.currentPassword;
        var newPassword = this.state.newPassword;
        var confirmPassword = this.state.confirmPassword;
        var currentPasswordErrMsg = process.env.REACT_APP_ACCOUNT_SETTINGS_CURRENT_PASSWORD;
        var newPasswordErrMsg = process.env.REACT_APP_ACCOUNT_SETTINGS_NEW_PASSWORD;
        var confirmPasswordErrMsg = process.env.REACT_APP_ACCOUNT_SETTINGS_CONFIRM_PASSWORD;

        var blnError = false;
        if ((currentPassword === "" || currentPassword === null || currentPassword === undefined) && this.state.isFirstLogin === false) {
            this.setState({ errorCurrentPassword: currentPasswordErrMsg });
            blnError = true;
        }
        if (newPassword === "" || newPassword === null || newPassword === undefined) {
            this.setState({ errorNewPassword: newPasswordErrMsg });
            blnError = true;
        }
        else if (!pattern.test(String(newPassword))) {
            this.setState({ errorNewPassword:"The password you entered does not meet the password policy"  });
            blnError = true;
        }
        if (confirmPassword === "" || confirmPassword === null || confirmPassword === undefined) {
            this.setState({ errorConfirmPassword: confirmPasswordErrMsg });
            blnError = true;
        }
        else if (newPassword !== confirmPassword) {
            this.setState({ errorConfirmPassword: "New Password and Confirm Password did not match" });
            blnError = true;
        }
        return blnError;
    }
    /*Method to render Tab Section*/
    renderTabSection() {
        return (
            <Tabs activeKey={this.state.currentActiveTab} id="uncontrolled-tab-example"
                onSelect={currentActiveTab => this.setState({ currentActiveTab })}
            >
                <Tab
                    className="tab-content-mapping"
                    eventKey="profile"
                    title="My Profile"
                >
                    {this.renderUserProfile()}
                </Tab>
                <Tab
                    className="tab-content-mapping"
                    eventKey="password"
                    title="Password"
                >
                    {this.renderChangePassword()}
                </Tab>
                {/* <Tab
                    className="tab-content-mapping"
                    eventKey="notification"
                    title="Notification settings"
                >
                </Tab> */}
            </Tabs>
        );
    }

    renderCurrentPasswordTextbox() {
        if (this.state.isFirstLogin === false) {
            return (
                <div className="col-sm-12">
                    <div className="form-group">
                        <label htmlFor="txtCurrentPassword" id="lblCurrentPassword" className={this.state.errorCurrentPassword === "" ? "mandatory" : "error-label mandatory"}   >Current Password</label>
                        <input
                            type="password"
                            value={this.state.currentPassword}
                            onChange={this.handleChange.bind(this)}
                            style={{ color: "#55565a" }}
                            className={this.state.errorCurrentPassword === "" ? "form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0" : "error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0 "}
                            id="txtCurrentPassword"
                            name="currentPassword"
                            placeholder="Current Password"
                            maxLength="20"
                        />
                        <div className="errorMsg">{this.state.errorCurrentPassword}</div>
                    </div>
                </div>
            );
        }
    }
    /*Method to render Change Password Section*/
    renderChangePassword() {
        return (
            <div className="change-password-card" >
                <div className="card-header p-0 border-0 mb-4" >
                    <b className="change-password-text" >Change password</b>
                    <div className="password-pattern-text">Our password policy requires you set a strong password that is 8 - 20 characters long, and includes a mix of letters, numbers and symbols. </div>
                </div>
                <div className="card-body p-0  border-0 pt-2 scrollbar" id="style-4"  >  {/*  style={{ height: "55.4vh" }} */}

                    <div className="row pl-3 pr-3 pt-2 pb-0">
                        {this.renderCurrentPasswordTextbox()}
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="txtNewPassword" id="lblNewPassword" className={this.state.errorNewPassword === "" ? "mandatory" : "error-label mandatory"}   >New Password</label>
                                <input
                                    type="password"
                                    value={this.state.newPassword}
                                    onChange={this.handleChange.bind(this)}
                                    style={{ color: "#55565a" }}
                                    className={this.state.errorNewPassword === "" ? "form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0" : "error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0 "}
                                    id="txtNewPassword"
                                    name="newPassword"
                                    placeholder="New Password"
                                    maxLength="20"
                                />
                                <div className="errorMsg">{this.state.errorNewPassword}</div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="txtConfirmPassword" id="lblConfirmPassword" className={this.state.errorConfirmPassword === "" ? "mandatory" : "error-label mandatory"}   >Confirm Password</label>
                                <input
                                    type="password"
                                    value={this.state.confirmPassword}
                                    onChange={this.handleChange.bind(this)}
                                    style={{ color: "#55565a" }}
                                    className={this.state.errorConfirmPassword === "" ? "form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0" : "error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0 "}
                                    id="txtConfirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    maxLength="20"
                                />
                                <div className="errorMsg">{this.state.errorConfirmPassword}</div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="card-footer bg-white">
                    <button
                        type="button"
                        className="common-button btn btn-dark float-right mr-2 mb-2"
                        onClick={this.changePassword.bind(this)}
                        name="ChangePassword"
                        id="btnChangePassword"
                        disabled={this.state.isWatcher}
                    >
                        Change Password
                </button>
                    <button
                        type="button"
                        className=" btn btn-light float-right mr-4 mb-2"
                        onClick={this.resetStateValues.bind(this)}
                    >
                        Cancel
                </button>
                </div>
            </div>
        );
    }

    /*Method to render User Profile Section*/
    renderUserProfile() {
        return (
            <div className="change-password-card" >
                <div className="card-header p-0 border-0 mb-4" >
                    <b className="change-password-text" >My proﬁle</b>
                    <div className="password-pattern-text">This section contains your basic proﬁle information like name, email etc.</div>
                </div>
                <div className="card-body p-0  border-0 pt-2 scrollbar" id="style-4"  >  {/*  style={{ height: "55.4vh" }} */}

                    <div className="row pl-3 pr-3 pt-2 pb-0">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="txtFirstName" id="lblFirstName" className={this.state.errorFirstName === "" ? "mandatory" : "error-label mandatory"}>First name</label>
                                <input
                                    type="text"
                                    value={this.state.firstName}
                                    onChange={this.handleChange.bind(this)}
                                    style={{ color: "#55565a" }}
                                    className={this.state.errorFirstName === "" ? "form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0" : "error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0 "}
                                    id="txtFirstName"
                                    name="firstName"
                                    placeholder="First name"
                                />
                                <div className="errorMsg">{this.state.errorFirstName}</div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="txtLastName" id="lblLastName" className={this.state.errorLastName === "" ? "mandatory" : "error-label mandatory"}>Last name</label>
                                <input
                                    type="text"
                                    value={this.state.lastName}
                                    onChange={this.handleChange.bind(this)}
                                    style={{ color: "#55565a" }}
                                    className={this.state.errorLastName === "" ? "form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0" : "error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0 "}
                                    id="txtLastName"
                                    name="lastName"
                                    placeholder="Last name"
                                />
                                <div className="errorMsg">{this.state.errorLastName}</div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="txtEmail" id="lblEmail">Email Address</label>
                                {/* className={this.state.errorEmail === "" ? "mandatory" : "error-label mandatory"} */}
                                <input
                                    type="text"
                                    value={this.state.email}
                                    onChange={this.handleChange.bind(this)}
                                    style={{ color: "#55565a" }}
                                    className="form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"
                                    //className={this.state.errorEmail === "" ? "form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0" : "error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0 "}
                                    id="txtEmail"
                                    name="email"
                                    placeholder="Email"
                                    disabled
                                />
                                {/* <div className="errorMsg">{this.state.errorEmail}</div> */}
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <label className={this.state.errorTimeZoneId === "" ? "label m-0 mandatory" : "error-label label m-0 mandatory"} style={{ fontSize: "1.5vh" }}>Time Zone</label>
                            <select
                                style={{ color: "#55565a" }}
                                className="form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"
                                id="ddlTimeZone"
                                name="timeZoneId"
                                value={this.state.timeZoneId}
                                onChange={this.handleChange.bind(this)}
                                className={this.state.errorTimeZoneId === "" ? "form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0" : "error-textbox form-control textBoxCustom rounded-0  pl-0 pt-0 mt-0"}
                            >
                                <option value="">Select Time Zone</option>
                                {this.state.timezonelist.map((data, index) => {
                                    if (data.isActive === true) {
                                        return (
                                            <option value={data.id}>{data.timeZoneName}</option>
                                        );
                                    }
                                })}
                            </select>

                            <div className="errorMsg">{this.state.errorTimeZoneId}</div>
                        </div>
                    </div>

                </div>
                <div className="card-footer bg-white">
                    <button
                        type="button"
                        className="common-button btn btn-dark float-right mr-2 mb-2"
                        onClick={this.updateUser.bind(this)}
                        name="UpdateUser"
                        id="btnUpdateUser"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        className=" btn btn-light float-right mr-4 mb-2"
                        onClick={this.resetUserProfile.bind(this)}
                    >
                        Reset
                    </button>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div id="divAccountSettings">
                <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
                </AlertBanner>
                {this.renderTabSection()}
            </div>
        )
    }
}
export default ChangePassword;