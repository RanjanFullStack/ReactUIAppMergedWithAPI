import React from 'react';

import {SharedServices} from '../../configuration/services/SharedService';

const Dashboard = React.lazy(()=> SharedServices.retry(() => import ("../../views/Dashboard/Dashboard")));
const UserList = React.lazy(() => SharedServices.retry(()=>  import ("../../views/User/UserList")));
const Master = React.lazy(() => SharedServices.retry(()=> import ("../../views/Masters/Master")));
const Request = React.lazy(() => SharedServices.retry(()=> import ('../../views/Request/Request')));
const TimeZone = React.lazy(() => SharedServices.retry(()=> import ( '../../views/System/TimeZone')));
const Events = React.lazy(() => SharedServices.retry(()=>import ('../../views/Settings/Events')));
const KeyValue = React.lazy(() => SharedServices.retry(()=>import ('../../views/Settings/KeyValue')));
const Role = React.lazy(() => SharedServices.retry(()=>import ( '../../views/System/Role')));
const Status = React.lazy(() => SharedServices.retry(()=>import ('../../views/Settings/Status')));
const EmailNotifications = React.lazy(() => SharedServices.retry(()=>import ( '../../views/System/EmailNotifications')));
const AccountSettings = React.lazy(() => SharedServices.retry(()=>import ('../../views/User/AccountSettings')));
const DocumentRepository = React.lazy(()=> SharedServices.retry(() => import ("../../views/DocumentRepository/DocumentRepository")));
const Reports = React.lazy(() => SharedServices.retry(()=>import ('../../views/Reports/Reports')));
const RequestPreferences = React.lazy(() => SharedServices.retry(()=>import ('../../views/Settings/RequestPreferences')));



const Routes = [
  {
    path: "/Dashboard",
    name: "Dashboard",
    icon: "fas fa-chart-bar sidebar-list-item-icon",
    component: Dashboard,
    children: false,
   
  },

  {
    path: "/Requests",
    name: "Requests",
    icon: "fas fa-file-medical sidebar-list-item-icon",
    component: Request,
    children: false,
    
  },
  {
    path: "/master/:name",
    name: "Customization",
    icon: "fas fa-sliders-h sidebar-list-item-icon",
    component: Master,
    Dynamic: true,
   

  },
  {
    path: null,
    name: "Settings",
    icon: "fas fa-cogs sidebar-list-item-icon",
    component: null,
    children: true,
   
    childrenData: [
      { path: "/Workflow", name: "Workflow", icon: "far fa-snowflake sidebar-list-item-icon", component: Events },
   
      { path: "/CustomFields", name: "Custom Fields", icon: "far fa-snowflake sidebar-list-item-icon", component: KeyValue },
      { path: "/CustomDates",name : "Custom Dates" ,icon:"far fa-snowflake sidebar-list-item-icon", component:Status},
      { path: "/EmailNotifications",name : "Email Notifications" ,icon:"far fa-snowflake sidebar-list-item-icon", component:EmailNotifications}
    ]
  },
  {
    path: null,
    name: "User Management",
    icon: "fas fa-user-friends sidebar-list-item-icon",
    component: null,
    children: true,
  
    childrenData: [
      { path: "/user/TimeZone", name: "Time Zone", icon: "far fa-snowflake sidebar-list-item-icon", component: TimeZone },
      { path: "/user/Role", name: "Role", icon: "far fa-snowflake sidebar-list-item-icon", component: Role },
      { path: "/user/userprofile", name: "User Profile", icon: "far fa-snowflake sidebar-list-item-icon", component: UserList },
      // { path: "/user/AccountSettings", name: "Change Password", icon: "far fa-snowflake sidebar-list-item-icon", component: AccountSettings }
    ]
  },

  {
    path: "/user/AccountSettings",
    name: "AccountSettings",
    icon: "",
    component: AccountSettings,
    children: false,
    IsInternal:true

  },

  {
    path: null,
    name: "Options",
    icon: "fas fa-user-friends sidebar-list-item-icon",
    component: null,
    children: true,
  
    childrenData: [
      { path: "/RequestOptions", name: "Request Options", icon: "far fa-snowflake sidebar-list-item-icon", component: RequestPreferences },
      // { path: "/user/AccountSettings", name: "Change Password", icon: "far fa-snowflake sidebar-list-item-icon", component: AccountSettings }
    ]
  },

  {
    path: "/Reports",
    name: "Reports",
    icon: "fas fa-chart-bar sidebar-list-item-icon",
    component: Reports,
    children: false,


  },
  {
    path: "/DocumentRepository",
    name: "Document Repository",
    icon: "fa fa-folder sidebar-list-item-icon",
    component: DocumentRepository,
    children: false,
   
  },
  
 
];

export default Routes;
