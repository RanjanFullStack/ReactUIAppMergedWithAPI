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
            availabelRoute: []
        };
    }

    async componentDidMount() {
        // Arrange availble features

        let features = this.props.globalState.features;
        let Accessablefeatures = [];

        if (features.length === 0) {
            features = await RoleBFLOWDataService.getUserRoles();
            this.props.setGlobalState({ features: features });
        }


        Routes.forEach((item) => {
            ;
            let modifieditem = [];
            if (features.filter(x => x.featureGroupName === item.name).length > 0) {
                ;
                if (item.children === true) {
                    item.childrenData.forEach((cData) => {
                        ;
                        if (features.filter(x => x.featureGroupName === item.name && x.feature === cData.name).length > 0) {
                            ;
                            modifieditem = modifieditem.concat(cData);
                        }

                    });
                    item.childrenData = modifieditem;
                }

                Accessablefeatures = Accessablefeatures.concat(item);
            }
        });

        this.setState({ availabelRoute: Accessablefeatures });

    }

    render() {
        return (

            this.state.availabelRoute.map((prop, key) => {
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
