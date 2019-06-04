import React, { Component,Suspense  } from 'react';
import '../src/assets/css/app.min.css';
import './App.css';
import './index.css';
import '../src/assets/css/bootstrap-4.3.1-dist/bootstrap-4.3.1-dist/css/bootstrap.min.css'
import { Provider } from 'react-globally'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import Loading from './components/Loader/Loading';
const login = React.lazy(() =>import ( '../src/views/Login/Login'));
const Layout = React.lazy(() =>import ( './layouts/layout'));
const AccountSettings = React.lazy(() =>import ( './views/User/AccountSettings'));
const ResetPassword = React.lazy(() =>import ( './views/Login/ResetPassword'));
const initialState = {
  ConfigurationMenu: [],
   CreateRequestOnHideModal: false,
   RequestList: [],
   RequestModalOnHide: false,
   RequestData: null,
   EditRequestBlockId: null,
   Features:[],
   IsLoadingActive:false

}
class App extends Component {

  render() {
    return (
      <div className="app">
 
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossOrigin="anonymous">
        </link>
        <script src="https://unpkg.com/react/umd/react.production.js" crossOrigin="true" />
        <script
          src="https://unpkg.com/react-dom/umd/react-dom.production.js" crossOrigin="true" />

    

        <script>
          var Alert = ReactBootstrap.Alert;
      </script>
      <Suspense fallback={<Loading />}>
        <Provider globalState={initialState}>
          
          {/* <Router  basename= {process.env.REACT_APP_API_BASE_NAME} > */}
          <Switch basename= {process.env.REACT_APP_API_BASE_NAME}>
          <Route exact path="/" component={Layout} />
          
          <Route  path="/login" component={login} />
          {/* <Route path="/app" component={Layout} /> */}
        
          <Route path='/user/AccountSettings' exact={true} component={AccountSettings} />
          <Route path='/resetpassword'   component={ResetPassword} />
          <Route path='*' exact={true} component={Layout} />
          </Switch>
          {/* </Router> */}
        </Provider>
        </Suspense>
      </div>
    );
  }
}

export default App;
