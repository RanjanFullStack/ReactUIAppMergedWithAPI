import React, { Component } from "react";
import { AuthService } from "../../configuration/services/AuthService";
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";
import { withGlobalState } from 'react-globally';
import {
  Button, Spinner
} from 'react-bootstrap';
import './Login.css';
import maksLogo from '../../assets/img/MAKS-Logo-White.png'
// import BeatFlowLogo from '../../assets/img/Beat-Logo.jpg'
import BeatFlowLogo from '../../assets/img/beat_logo_full_blue.svg'
import { SharedServices } from '../../configuration/services/SharedService';
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";

const Layout = React.lazy(() => SharedServices.retry(() => import('../../layouts/layout')))

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      UserName: '',
      Password: '',
      isloginSuccess: false,
      errorUserName: '',
      errorPassword: '',
      errorMessage: '',
      showForgotPassword: false,
      showForgotPasswordMsg: false,
      showLoginPage: true,
      loginButtonText: "Login",
      isTokenExpired: false,
    };
  }
  componentDidMount() {
    debugger
    const { match: { params } } = this.props;
    if (params.tokenExpired === 'TokenExpired') {
      this.setState({
        isTokenExpired: true,
        showForgotPassword: true
      })
    }
  }

  /**Method to login */
  async handleLogin() {
    this.resetErrorState();
    var value = this.validateForm();
    if (value === false) {
      localStorage.clear();
      this.props.setGlobalState({
        ConfigurationMenu: [],
        CreateRequestOnHideModal: false,
        RequestList: [],
        RequestModalOnHide: false,
        RequestData: null,
        EditRequestBlockId: null,
        features: [],
        IsLoadingActive: false
      });
      let appName = process.env.REACT_APP_APP_NAME;
      const body = JSON.stringify({
        Email: this.state.UserName.toLowerCase(),
        Password: this.state.Password,
        App: appName
      });
      this.props.setGlobalState({ IsLoadingActive: true });
      this.setState({ loginButtonText: "Authenticating..." })
      const Auth = await AuthService.post(body);
      if (Auth.Code === false && Auth.Code !== undefined) {
        this.setState({
          errorMessage: Auth.Message, loginButtonText: "Login"
        });
        this.props.setGlobalState({ IsLoadingActive: false });
      } else {

        if (Auth.access_token !== null || Auth.access_token !== undefined) {
          localStorage.setItem('Token', "Bearer " + Auth.access_token);
          var tokenExpiryDate = new Date();
          tokenExpiryDate.setMinutes(tokenExpiryDate.getMinutes() + parseInt(Auth.expires_in));
          localStorage.setItem('TokenExpiry', tokenExpiryDate);
          localStorage.setItem('refreshToken', Auth.refreshToken);
          localStorage.setItem('firstName', Auth.firstName);
          localStorage.setItem('lastName', Auth.lastName);
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
          this.props.setGlobalState({ features: features });
        }
        /**Call API to save login related details in BeatData Service*/
        const responseJson = await BFLOWDataService.login();
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
            this.props.setGlobalState({ IsLoadingActive: false });
            this.setState({ loginButtonText: "Login" })
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
   /**Method to redirect to login page from forgot password */
   redirectToLogin() {
    if(this.state.isTokenExpired===true)
    {
      this.setState({
        showForgotPassword: false,
        showForgotPasswordMsg: false,
        isTokenExpired: false
      });
      this.props.history.push('/');
    }
    else{
      this.resetErrorState();
      this.setState({
        showForgotPassword: false,
        showForgotPasswordMsg: false,
        isTokenExpired: false
      });
    }
    
  }
  /*Method to validate Login Form*/
  validateForm() {

    var blError = false;
    var regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.state.UserName === "" || this.state.UserName === null || this.state.UserName === undefined) {
      this.setState({ errorUserName: "Please enter email address" });
      blError = true;
    }
    else if (!regexEmail.test(String(this.state.UserName).toLowerCase())) {
      this.setState({ errorUserName: "Please enter valid email address" });
      blError = false;
    }
    if ((this.state.Password === "" || this.state.Password === null || this.state.Password === undefined) && this.state.showForgotPassword===false) {
      this.setState({ errorPassword: "Please enter password" });
      blError = true;
    }
    return blError;
  }

  /*Method to call api to send reset password mail*/
  async sendForgotPasswordMail() {
    var value = this.validateForm();
    if (value === false) {

      const body = JSON.stringify({
        Email: this.state.UserName,
        EnableNotification: true,
        App: process.env.REACT_APP_APP_NAME,
        BaseUrl: process.env.REACT_APP_API_BASE_Reset_NAME
      });
      const response = await AuthService.forgotPassword(body);
      debugger;
      console.log(response.Code)
      if (response.Code === false && response.Code !== undefined) {
        this.setState({
          errorUserName: response.Message //To show email id doesnot exist msg.
        });
      } else {
        this.setState({
          showForgotPassword: false,
          showForgotPasswordMsg: true
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
              <b className="forgot-password-text" >{this.state.isTokenExpired === true ? 'Reset Password Link Expired' : 'Forgot Password?'}</b>
              <div className="forgot-password-desc"> {this.state.isTokenExpired === true ? 'This link has expired!' : 'We will send you a link to reset your password.'}</div>
              <div className="forgot-password-desc mt-2"> {this.state.isTokenExpired === true ? 'Please try again by providing your email address below or if you happen to remember your password try logging in again.' : ''}</div>
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
            onClick={this.sendForgotPasswordMail.bind(this)}
          >Send Reset Link </Button>
          <Button
            size="large"
            type="button"
            className="btn btn-login-secondary"
            // onClick={() => this.setState({ showForgotPassword: false, showForgotPasswordMsg: false, isTokenExpired:false })}
            onClick={this.redirectToLogin.bind(this)}
          >Go To Login </Button>
        </div>
      );
    }
  }
 
  /**Method to show reset password message to user email */
  renderForgotPasswordMsg() {
    if (this.state.showForgotPassword === false && this.state.showForgotPasswordMsg === true) {
      return (
        <div className="reset-password-msg">
          <div className="row reset-password-row">
            <div className="col-sm-12">
              <b className="forgot-password-text" >Reset Password</b>
              <div className="forgot-password-desc">We have sent a reset password link to your
              email <b>{this.state.UserName}</b>. Follow the directions in the email to reset your password.
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
                onClick={() => this.setState({ showForgotPassword: false, showForgotPasswordMsg: false })}
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
    if (this.state.showLoginPage === true && this.state.showForgotPassword === false && this.state.showForgotPasswordMsg === false) {
      return (
        <div className="div-login-form">
          <center className="div-product-logo">
            <img
              src={BeatFlowLogo}
              className="product-logo"
              alt="Product Logo"
            />
          </center>
          <div
            className="errorMsg"
            style={{ paddingBottom: 40 }}
          >
            {this.state.errorMessage}
          </div>
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
                <div className="errorMsg">
                  {this.state.errorUserName}
                </div>
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
                <div className="errorMsg">
                  {this.state.errorPassword}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <div
                  className="forgot-password-link"
                  onClick={() =>
                    this.setState({ showForgotPassword: true }, () =>
                      this.resetErrorState()
                    )
                  }
                >
                  Forgot Password?
                  </div>
              </div>
            </div>
          </div>
          <div className="row login-row">
            {(this.props.globalState.IsLoadingActive) ? <Button
              size="large"
              type="button"
              className="login-button"
              label="Action"
              disabled
            >
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {" "} {this.state.loginButtonText}
            </Button> : <Button
              size="large"
              type="button"
              className="login-button"
              onClick={this.handleLogin.bind(this)}
              label="Action"
            >
                {this.state.loginButtonText}
              </Button>}


          </div>

          <div className="ContactUs">
            In case of any concern,{" "}
            <a
              style={{ color: "#00568F" }}
              href="mailto:maks_beatflow@moodys.com"
            >
              contact us
              </a>
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

            <div className="login-form pt-0 pb-0">
              {this.renderLogin()}
              {this.renderForgotPassword()}
              {this.renderForgotPasswordMsg()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withGlobalState(Login);