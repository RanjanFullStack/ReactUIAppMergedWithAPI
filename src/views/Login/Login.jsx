import React, { Component } from "react";
import { AuthService } from "../../configuration/services/AuthService";
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";
import { withGlobalState } from 'react-globally';
import {
  Button
} from 'react-bootstrap';
import './Login.css';
import maksLogo from '../../assets/img/MAKS-Logo-White.png'
import BeatFlowLogo from '../../assets/img/Beat-Logo.jpg'
const Layout = React.lazy(() => import('../../layouts/layout'))

class Login extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      UserName: '',
      Password: '',
      isloginSuccess: false,
      errorUserName: '',
      errorPassword: '',
      errorMessage: '',
      showForgotPassword: false,
      showResetPasswordMsg: false,
      showLoginPage: true,
    };
  }
 
  /**Method to login */
  async handleLogin() {
    this.resetErrorState();
    var value = this.validateForm();
    if (value === false) {

      localStorage.clear();
      let appName = process.env.REACT_APP_APP_NAME;
      const body = JSON.stringify({
        Email: this.state.UserName.toLowerCase(),
        Password: this.state.Password,
        App: appName
      });
      const Auth = await AuthService.post(body);
      if (Auth.Code === false && Auth.Code !== undefined) {
        this.setState({
          errorMessage: Auth.Message,
        });
      } else {

        if (Auth.access_token !== null || Auth.access_token !== undefined) {
          localStorage.setItem('Token', "Bearer " + Auth.access_token);
          var tokenExpiryDate = new Date();
          tokenExpiryDate.setMinutes(tokenExpiryDate.getMinutes() + parseInt(Auth.expires_in));
          localStorage.setItem('TokenExpiry', tokenExpiryDate);
          localStorage.setItem('refreshToken', Auth.refreshToken);
          localStorage.setItem('firstName', Auth.firstName);
          localStorage.setItem("userEmailId", this.state.UserName.toLowerCase());
          localStorage.setItem("isFirstLogin", Auth.is_firstlogin);
        }
        this.setState({ isloginSuccess: true });
        // get user roles
        const features = await RoleBFLOWDataService.getUserRoles();
        if (features.Code === false && features.Code !== undefined) {
          this.setState({
            errorMessage: features.Message,
          });
        } else {
          this.props.setGlobalState({ Features: features });
        }
        setTimeout(
          function () {
            if (Auth.is_firstlogin === true) {
              this.props.history.push("/user/AccountSettings");
              localStorage.setItem("menuHeaderName", "Account Settings");
            }
            else {
              this.props.history.push("/Dashboard");
              localStorage.setItem("menuHeaderName", "Dashboard");
              localStorage.setItem("MenuName", "Dashboard");
            }
          }
            .bind(this),
          3000
        );
      }
    }
  }

  test() {
    if (this.state.isloginSuccess === true)
      return (<Layout></Layout>)
  }
  /*Method to handle change event on "enter" key press*/
  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.handleLogin();
    }
  }
  /*Method to handle change event of all elements*/
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value })
  }

  /*Method to reset error state*/
  resetErrorState() {
    this.setState({
      errorMessage: '',
      errorUserName: '',
      errorPassword: ''

    })
  }
  /*Method to validate Login Form*/
  validateForm() {
    var blError = false;
    var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.state.UserName === "" || this.state.UserName === null || this.state.UserName === undefined) {
      this.setState({ errorUserName: "Please enter Email Address." });
      blError = true;
    }
    else if (!regexEmail.test(String(this.state.UserName).toLowerCase())) {
      this.setState({ errorUserName: "Please enter valid Email Address." });
      blError = false;
    }
    if (this.state.Password === "" || this.state.Password === null || this.state.Password === undefined) {
      this.setState({ errorPassword: "Please enter Password." });
      blError = true;
    }
    return blError;
  }
 
  /*Method to call api to send reset password mail*/
  async sendResetPasswordMail() {
    debugger;
    var value = this.validateForm();
    if (value === false) {
    
      const body = JSON.stringify({
        Email: this.state.UserName,
        EnableNotification: true,
        App: process.env.REACT_APP_APP_NAME,
        BaseUrl: process.env.REACT_APP_API_BASE_Reset_NAME
      });
      const response = await AuthService.resetPassword(body);
      debugger;
      console.log(response.Code)
      if (response.Code === false && response.Code !== undefined) {
        this.setState({
          errorMessage: response.Message,
        });
      } else {
        this.setState({
          showForgotPassword: false,
          showResetPasswordMsg: true
        })
      }
    }
  }
 
  /**Method to show forgot password screen */
  renderForgotPassword() {
    if (this.state.showForgotPassword === true) {
      return (
        <div className="div-forgot-password-form">
          <div className="errorMsg" style={{ paddingTop: 10, paddingLeft: 45 }} >{this.state.errorMessage}</div>
          <div className="row">
            <div className="col-sm-12">
              <b className="forgot-password-text" >Forgot Password?</b>
              <div className="forgot-password-desc">We will send you a link to reset your password.<br />
                Enter Email Address
                </div>
            </div>
          </div>
          <div className="row forgot-password-email">
            <div className="col-sm-12">
              <div className="form-group">
                <input
                  type="text"
                  aria-describedby="inputGroupPrepend"
                  className="form-control border-top-0 border-right-0 border-left-0 rounded-0"
                  placeholder="Your Email Address"
                  value={this.state.UserName}
                  name="UserName"
                  onChange={this.handleChange.bind(this)}
                />
                <div className="errorMsg">{this.state.errorUserName}</div>
              </div>
            </div>
          </div>
          <Button
            size="large"
            type="button"
            className="login-button mb-0 mt-4"
            onClick={this.sendResetPasswordMail.bind(this)}
          >Send Reset Link </Button>
          <Button
            size="large"
            type="button"
            className="btn btn-login-secondary"
            onClick={() => this.setState({ showForgotPassword: false, showResetPasswordMsg: false })}
          >Go To Login </Button>
        </div>
      );
    }
  }
  /**Method to show reset password message to user email */
  renderResetPasswordMsg() {
    if (this.state.showForgotPassword === false && this.state.showResetPasswordMsg === true) {
      return (
        <div className="reset-password-msg">
          <div className="row">
            <div className="col-sm-12">
              <b className="forgot-password-text" >Reset Password</b>
              <div className="forgot-password-desc">We have sent a reset password link to your
              email <b>{this.state.UserName}</b> Follow the directions in the Email to reset your password.
            </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <Button
                primary
                size="large"
                type="button"
                className="login-button"
                onClick={() => this.setState({ showForgotPassword: false, showResetPasswordMsg: false })}
                label="Action"
              >Login</Button>
            </div>
          </div>
        </div>
      );
    }
  }
  
  /**Method to show login screen*/
  renderLogin() {
    if (this.state.showLoginPage === true && this.state.showForgotPassword === false && this.state.showResetPasswordMsg === false) {
      {
        return (
          <div className="div-login-form">
            <div className="div-product-logo">
              <img
                src={BeatFlowLogo}
                className="product-logo"
                alt="Product Logo"
              />
            </div>
            <div className="errorMsg" style={{ paddingTop: 10, paddingLeft: 45, paddingBottom: 20 }} >{this.state.errorMessage}</div>
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <input
                    type="text"
                    aria-describedby="inputGroupPrepend"
                    className="form-control border-top-0 border-right-0 border-left-0 rounded-0"
                    placeholder="Your Email Address"
                    value={this.state.UserName}
                    name="UserName"
                    onChange={this.handleChange.bind(this)}
                    onKeyDown={this._handleKeyDown.bind(this)}
                  />
                  <div className="errorMsg">{this.state.errorUserName}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <input
                    placeholder="Your Password"
                    aria-describedby="inputGroupPrepend"
                    className="form-control border-top-0 border-right-0 border-left-0 rounded-0"
                    value={this.state.Password}
                    type="password"
                    name="Password"
                    onChange={this.handleChange.bind(this)}
                    onKeyDown={this._handleKeyDown.bind(this)}
                  />
                  <div className="errorMsg">{this.state.errorPassword}</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <div className="forgot-password-link" onClick={() => this.setState({ showForgotPassword: true }, () => this.resetErrorState())} >Forgot Password?</div>
                </div>
              </div>
            </div>
            <div className="row login-row">
              <Button
                size="large"
                type="button"
                className="login-button"
                onClick={this.handleLogin.bind(this)}
                label="Action"
              >
                Login
              </Button>
            </div>
          </div>
        );
      }
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
            <div className="login-form pt-0 pb-0">
              {this.renderLogin()}
              {this.renderForgotPassword()}
              {this.renderResetPasswordMsg()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withGlobalState(Login);