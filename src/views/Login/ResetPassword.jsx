import React, { Component } from "react";
import { AuthService } from "../../configuration/services/AuthService";
import {
    Button
} from 'react-bootstrap';
import maksLogo from '../../assets/img/MAKS-Logo-White.png'
import queryString from 'query-string';
import './Login.css';

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resetPasswordUrl: undefined,
            newPassword: '',
            confirmPassword: '',
            errorMessage: '',
            errorNewPassword:'',
            errorConfirmPassword:'',
            ConfirmMessage:'',
        }
    }

    componentDidMount() {
        debugger;
        let url = this.props.location.search;
        let params = queryString.parse(url);
        if (params.url !== undefined) {
            this.setState({
                resetPasswordUrl: params.url,
                showLoginPage: false
            });
        }
        console.log(params.url);
    }
    /*Method to handle change event of all elements*/
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value })
    }
    /*Method to validate Reset Password Form*/
    validateResetPasswordForm() {
        // this.resetErrorState();
        var pattern = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&_#^])[A-Za-z\d$@$!%*?&_#^].{7,19}");
        var newPassword = this.state.newPassword;
        var confirmPassword = this.state.confirmPassword;
        var newPasswordErrMsg = process.env.REACT_APP_ACCOUNT_SETTINGS_NEW_PASSWORD;
        var confirmPasswordErrMsg = process.env.REACT_APP_ACCOUNT_SETTINGS_CONFIRM_PASSWORD;

        var blnError = false;
        if (newPassword === "" || newPassword === null || newPassword === undefined) {
            this.setState({ errorNewPassword: newPasswordErrMsg });
            blnError = true;
        }
        else if (!pattern.test(String(newPassword))) {
            this.setState({ errorNewPassword: "Password doesnot match the policy." });
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

    /*Method to call api to reset password*/
    async forgotPassword() {
        debugger;
        var value = this.validateResetPasswordForm();
        if (value === false) {
            const body = JSON.stringify({
                ResetPasswordToken: this.state.resetPasswordUrl,
                NewPassword: this.state.newPassword,
                App: process.env.REACT_APP_APP_NAME,
                BaseUrl: process.env.REACT_APP_API_BASE_Reset_NAME
            });
            const response = await AuthService.forgotPassword(body);
            if (response.Code === false && response.Code !== undefined) {
                this.setState({
                    errorMessage: response.Message,
                });
            } else {

               
              
                this.setState({
                    ConfirmMessage: 'Your password have been changed successfully.'
                })
                setTimeout(
                    function () {
                        window.location.href = process.env.REACT_APP_Logout_Url;
                    }
                       .bind(this),
                    2000
                 );
            }
        }
    }
    /**Method to show reset password screen*/
    renderResetPassword() {
        if (this.state.resetPasswordUrl !== undefined) {
            return (
                <div>
                    <div className={this.state.errorMessage!=""?"alert-danger":""} style={{ paddingTop: 10 ,fontSize:"12px"}} >{this.state.errorMessage}</div>
                    <div className={this.state.ConfirmMessage!=""?"alert-success":""} style={{ paddingTop: 10, fontSize:"12px"}}>{this.state.ConfirmMessage}</div>
                    <div className="reset-password" >
                        <div className="row mb-3">
                            <b className="forgot-password-text ml-3">Reset your Password</b>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <input
                                        type="password"
                                        aria-describedby="inputGroupPrepend"
                                        className="form-control border-top-0 border-right-0 border-left-0 rounded-0"
                                        placeholder="New Password"
                                        value={this.state.newPassword}
                                        name="newPassword"
                                        onChange={this.handleChange.bind(this)}
                                    />
                                    <div className="errorMsg">{this.state.errorNewPassword}</div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <input
                                        type="password"
                                        aria-describedby="inputGroupPrepend"
                                        className="form-control border-top-0 border-right-0 border-left-0 rounded-0"
                                        placeholder="Confirm Password"
                                        value={this.state.confirmPassword}
                                        name="confirmPassword"
                                        onChange={this.handleChange.bind(this)}
                                    />
                                    <div className="errorMsg">{this.state.errorConfirmPassword}</div>
                                 
                                </div>
                            </div>
                        </div>
                        <div>
                            <div><span className="password-policy-text">Your password must have:</span></div>
                            <div><i class="fas fa-check check-icon mr-2"></i><span className="password-policy-text">8 or more characters</span></div>
                            <div><i class="fas fa-check check-icon mr-2"></i><span className="password-policy-text">Upper and lower letters</span></div>
                            <div><i class="fas fa-check check-icon mr-2"></i><span className="password-policy-text"> At least one number</span></div>
                            <div><i class="fas fa-check check-icon mr-2"></i><span className="password-policy-text"> At least one special character</span></div>
                        </div>
                        <div className="div-reset-password-btn">
                            <Button
                                primary
                                size="large"
                                type="button"
                                className="login-button mb-0"
                                onClick={this.forgotPassword.bind(this)}
                                label="Action"
                            > Reset Password </Button>
                            {/* <Button
                                size="large"
                                type="button"
                                className="btn btn-login-secondary"
                                // onClick={this.handleLogin.bind(this)}
                                label="Action"
                            >Cancel
              </Button> */}
                        </div>
                    </div>
                </div>
            );
        }
    }
    render() {
        return (
            <div className="login-container">
                <div className="login-wrapper">
                    <div style={{ minWidth: "25%" }} className="login-responsive">
                        <div className="div-brand-log" >
                            <img src={maksLogo} alt="MAKS LOGO" className="brand-logo" />
                        </div>
                        <div className="reset-password-form pt-0 pb-0">
                            {this.renderResetPassword()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default ResetPassword;
