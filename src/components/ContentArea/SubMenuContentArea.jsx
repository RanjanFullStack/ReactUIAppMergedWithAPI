import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
class ContentArea extends Component {
    render() {
       
        return (
      
                <Switch>
                    {this.props.childrendata.map((prop, key) => {
                   
                            return (
                                <Route exact path={prop.path} component={prop.component} key={key} />
                            );
                        
                    })}
                </Switch>
           
        );
    }
}

export default ContentArea; 
