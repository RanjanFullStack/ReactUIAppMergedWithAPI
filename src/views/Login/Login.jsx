import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';
import { AuthService } from "../../configuration/services/AuthService";
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";
import { withGlobalState } from 'react-globally'

import {
  Row, Container,
  Form,
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
      isloginSuccess: false
    };
  }

  componentDidMount() {

  }

  async handleLogin() {

    localStorage.clear();
    ;
    let appName = process.env.REACT_APP_APP_NAME;
    const body = JSON.stringify({
      Email: this.state.UserName,
      Password: this.state.Password,
      App: appName
    });

    const Auth = await AuthService.post(body);
    if (Auth !== null) {

      if (Auth.access_token !== null || Auth.access_token !== undefined)
        localStorage.setItem('Token', "Bearer " + Auth.access_token);
      var tokenExpiryDate = new Date();

      tokenExpiryDate.setMinutes(tokenExpiryDate.getMinutes() + parseInt(Auth.expires_in));
      localStorage.setItem('TokenExpiry', tokenExpiryDate);
      localStorage.setItem('refreshToken', Auth.refreshToken);

      this.setState({ isloginSuccess: true });
      this.props.history.push("/Dashboard");
      localStorage.setItem("menuHeaderName", "Dashboard")
      localStorage.setItem("MenuName", "Dashboard")

      // const features = await RoleBFLOWDataService.getUserRoles();
      // debugger;
      // this.props.setGlobalState({ Features: features });

    // get user roles

      // setTimeout(
      //   function () {
 

      //   }
      //     .bind(this),
      //   5000
      // );

    }
    else {
      alert("Invalid Credentials");
    }
  }

  test() {

    if (this.state.isloginSuccess === true)
      return (<Layout></Layout>)
  }


  /*Method to handle change event of all elements*/
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value })
  }
  render() {


    return (

      <div className="login-container">
        <div className="login-wrapper">
          <div style={{ minWidth: "25%" }} className="login-responsive">
            <img src={maksLogo} alt="MAKS LOGO" className="brand-logo" />
            <div className="login-form">
              <Container className="placeholder">
                <form>
                  <Row className="login-row">
                    <img
                      src={BeatFlowLogo}

                      className="product-logo"
                    />
                  </Row>
                  {/* <Row className="login-row">
                        {this.state.userState === "unauthenticated" ? (
                          <ErrorMessage message="Incorrect email address/password" />
                        ) : (
                            <ErrorMessage message="" className="errorMessage span" />
                          )}
                      </Row> */}
                  <Row className="login-row">
                    <Form.Control
                      type="text"
                      aria-describedby="inputGroupPrepend"
                      className="control-input LineInput"
                      placeholder="Your Email Address"
                      value={this.state.UserName}
                      name="UserName"

                      onChange={this.handleChange.bind(this)}
                    />
                  </Row>
                  {/* <Row className="login-row">
                        {!this.state.email.valid &&
                          this.state.email.value !== "" ? (
                            <ErrorMessage
                              message="Invalid Email"
                              className="errorMessage"
                            />
                          ) : (
                            <ErrorMessage message="" className="errorMessage span" />
                          )}
                      </Row> */}
                  <Row className="login-row">
                    <Form.Control
                      type="password"
                      placeholder="Your Password"
                      aria-describedby="inputGroupPrepend"
                      className="control-input LineInput"
                      value={this.state.Password}
                      type="password"
                      name="Password"
                      onChange={this.handleChange.bind(this)}
                    />
                  </Row>
                  {/* <Row className="login-row">
                        {!this.state.password.valid &&
                          this.state.password.value !== "" ? (
                            <ErrorMessage
                              message="Invalid password"
                              className="errorMessage "
                            />
                          ) : (
                            <ErrorMessage message="" className="errorMessage span" />
                          )}
                      </Row> */}
                  <Row>
                    <Button
                      primary
                      size="large"
                      type="button"
                      className="login-button"
                      onClick={this.handleLogin.bind(this)}
                      label="Action"
                    >
                      Login
                        </Button>
                  </Row>
                </form>

              </Container>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }
}
export default withGlobalState(Login);