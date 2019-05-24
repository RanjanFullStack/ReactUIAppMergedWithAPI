import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import Routes from '../../configuration/routes/route'
import SubMenuContentArea from './SubMenuContentArea'
import { RoleBFLOWDataService } from "../../configuration/services/RolesDataService";
import { withGlobalState } from 'react-globally'

class ContentArea extends Component {

    constructor(props) {
        super(props);
        this.state = {
        availableRoute : []
        };
    }
        
    async componentDidMount() {
        // Arrange availble features
  
        let features = this.props.globalState.features;
        let Accessablefeatures = [];
     
        if(features===undefined)
        {
           features = await RoleBFLOWDataService.getUserRoles();
           this.props.setGlobalState({ features: features });
        }
      
        Routes.forEach((item)=>{
            debugger;
            let modifieditem = [];
         if(features.filter(x=> x.featureGroupName === item.name).length > 0)
        {
            debugger;
            if(item.children === true)
            {
                item.childrenData.forEach((cData)=>{
                    debugger;
                    if(features.filter(x=> x.featureGroupName === item.name && x.feature === cData.name).length > 0)
                    {
                        debugger;
                        modifieditem = modifieditem.concat(cData); 
                    }
                    
                });
                item.childrenData =   modifieditem; 
            }
             
           Accessablefeatures = Accessablefeatures.concat(item);
        }
        });
        
        this.setState({availableRoute : Accessablefeatures});

    }

    render() {
        return (

           this.state.availableRoute.map((prop, key) => {
                if (prop.children === false && prop.name !== "Customization")
                    return (<Route path={prop.path} component={prop.component} key={key} />);
                //-----------------------------------
                if (prop.name === "Customization") {

                    return (<Route path={`${prop.path}`} component={prop.component} key={key} />);
                }
                //--------------------------
                if (prop.children === true && prop.name !== "Customization") {
                   
                    return (<SubMenuContentArea childrendata={prop.childrenData} />);
                }
            })


        );
    }
}

export default withGlobalState(ContentArea); 
