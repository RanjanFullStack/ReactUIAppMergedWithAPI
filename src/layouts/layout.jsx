import React, { Component } from 'react';


import '../assets/css/app.min.css';
import '../App.css'

const Header = React.lazy(() =>import ( '../components/Header/Header'));
const Sidebar = React.lazy(() =>import ( '../components/Sidebar/Sidebar'));
const ContentArea = React.lazy(() =>import ( '../components/ContentArea/ContentArea'));

class Layout extends Component {
   render() {
      const { props } = this.props;
    
      return (
         <div class="container-fluid d-flex flex-column" style={{ height: '100vh' }}>
            <div class="row flex-fill">
               <div class="col-sm-2 p-0">
                  <Sidebar />
               </div>
               <div class="col-sm-10">
                  <div class="row flex-fill">

                     <Header />
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
export default Layout;