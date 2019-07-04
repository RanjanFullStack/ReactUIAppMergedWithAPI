import React, { Component } from 'react';


import '../assets/css/app.min.css';
import '../App.css'
import { withGlobalState } from 'react-globally'
import LoadingOverlay from 'react-loading-overlay';
import {SharedServices} from '../configuration/services/SharedService';
const Header = React.lazy(() => SharedServices.retry(() =>import ( '../components/Header/Header')));
const Sidebar = React.lazy(() => SharedServices.retry(() =>import ( '../components/Sidebar/Sidebar')));
const ContentArea = React.lazy(()  => SharedServices.retry(()=>import ( '../components/ContentArea/ContentArea')));

class Layout extends Component {
   constructor(props, context) {
      super(props, context);
      this.state = {
         isOpen: false,

      }
   }
   render() {
      const { props } = this.props;
      return (

         <div class="container-fluid d-flex flex-column" style={{ height: '100vh' }}>
            <div class="row flex-fill pt-0 pb-0 pr-0">
               <div class="col-sm-2 p-0 sidebar">
               {/* {(this.state.isOpen)?    <Sidebar />:  <SidebarWithIcon /> } */}
               <Sidebar />
                
               </div>
               <div class="col-sm-10">
                  <div class="row flex-fill pt-0 pb-0 pr-0">

                     <Header historyprops={this.props} />
                  </div>
                  <div class="row flex-fill " >
                     <ContentArea></ContentArea>
                  </div>
               </div>
            </div>
         </div>
        
      )
   }
}
export default withGlobalState(Layout);