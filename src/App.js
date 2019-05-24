import React, { Component,Suspense  } from 'react';
import '../src/assets/css/app.min.css';
import './App.css';

import { Provider } from 'react-globally'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Loading from './components/Loader/Loading';
const login = React.lazy(() =>import ( '../src/views/Login/Login'));
const Layout = React.lazy(() =>import ( './layouts/layout'));

const initialState = {
  ConfigurationMenu: [],
   CreateRequestOnHideModal: false,
   RequestList: [],
   RequestModalOnHide: false,
   RequestData: null,
   EditRequestBlockId: null,
   Features:[]

}
class App extends Component {

  render() {
    return (
      <div className="app">
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossOrigin="anonymous">
        </link>
        <script src="https://unpkg.com/react/umd/react.production.js" crossOrigin="true" />
        <script
          src="https://unpkg.com/react-dom/umd/react-dom.production.js" crossOrigin="true" />

        <script
          src="https://unpkg.com/react-bootstrap@next/dist/react-bootstrap.min.js"
          crossOrigin="true"
        />

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
