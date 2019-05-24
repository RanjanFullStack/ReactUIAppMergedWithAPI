import React from 'react';

const Dashboard = React.lazy(() => import ("../../views/Dashboard/Dashboard"));
const UserList = React.lazy(() =>  import ("../../views/User/UserList"));
const Master = React.lazy(() => import ("../../views/Masters/Master"));
const Request = React.lazy(() => import ('../../views/Request/Request'));
const TimeZone = React.lazy(() => import ( '../../views/System/TimeZone'));
const Events = React.lazy(() =>import ('../../views/Settings/Events'));
const KeyValue = React.lazy(() =>import ('../../views/Settings/KeyValue'));
const Role = React.lazy(() =>import ( '../../views/System/Role'));
const Status = React.lazy(() =>import ('../../views/Settings/Status'));
const EmailNotifications = React.lazy(() =>import ( '../../views/System/EmailNotifications'));
const Routes = [
  {
    path: "/Dashboard",
    name: "Dashboard",
    icon: "fas fa-chart-bar sidebar-list-item-icon",
    component: Dashboard,
    children: false
  },

  {
    path: "/Request",
    name: "Request",
    icon: "fas fa-file-medical sidebar-list-item-icon",
    component: Request,
    children: false
  },
  {
    path: "/master/:name",
    name: "Customization",
    icon: "fas fa-sliders-h sidebar-list-item-icon",
    component: Master,
    Dynamic: true

  },
  {
    path: null,
    name: "Settings",
    icon: "fas fa-cogs sidebar-list-item-icon",
    component: null,
    children: true,
    childrenData: [
      { path: "/Workflow", name: "Work Flow", icon: "far fa-snowflake sidebar-list-item-icon", component: Events },
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
      { path: "/user/Timezone", name: "Timezone", icon: "far fa-snowflake sidebar-list-item-icon", component: TimeZone },
      { path: "/user/Role", name: "Role", icon: "far fa-snowflake sidebar-list-item-icon", component: Role },
      { path: "/user/userprofile", name: "User Profile", icon: "far fa-snowflake sidebar-list-item-icon", component: UserList }
    ]
  }
];

export default Routes;
