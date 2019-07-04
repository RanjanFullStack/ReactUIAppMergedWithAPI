import React, { Component } from "react";

import AlertBanner from '../../components/AlertBanner/index'
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import "./RequestPreferences.css";

class RequestPreferences extends Component {

    constructor(props) {
        super(props)
        this.state = {
          
            showErrorMesage: false,
            errorMessageType: '',
            errorMessage: '',
            requestPreferencesList:[]
        
        }
      
    }
    componentDidMount() {
        this.getRequestPreferences();
    }

    async getRequestPreferences() {
        let preferences = await BFLOWDataService.get("RequestPreferences");
        this.setState({ requestPreferencesList: preferences })
     
    }

    async  handleCheck(id,event){
      debugger
      const isChecked = event.target.checked;

      const body = JSON.stringify({ ForCreateRequest: isChecked });
      const response = await BFLOWDataService.put('RequestPreferences', id, body);
      debugger
      if (response.Code === false && response.Code !== undefined) {
         this.setState({
            showErrorMesage: true,
            errorMessage: response.Message,
            errorMessageType: 'danger'
         });
      } else {
         this.setState({
            showErrorMesage: true,
            errorMessage: response,
            errorMessageType: 'success'
         });
         this.getRequestPreferences();
      }
      this.setTimeOutForToasterMessages();
    }

    setTimeOutForToasterMessages() {
        setTimeout(
           function () {
              this.setState({ showErrorMesage: false });
           }
              .bind(this),
           15000
        );
     }
    
    /*Method to handle error message */
    handleCloseErrorMessage() {
        this.setState({ showErrorMesage: false })
    }
    render() {

        return (
            <>
                <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
                </AlertBanner>
                <div className="container-fluid scrollbar" style={{backgroundColor:"#FAFAFB"}}>
                    <div className="row" >
                        <div className="col-sm-12   p-0" >
                          
                            <div className="card border-0  bg-white scrollbar pr-2 border-0 shadow-sm" style={{ fontSize: "1.25rem", borderRadius: "8px", margin: "8rem", height: "40vh" }}>
                                {/* style={{ height: '72vmin' }} */}
                                <ul className="list-group preferencesList" name="preferencesList">
                                    {this.state.requestPreferencesList.map((data, key) => {
                                      
                                            return (
                                                //  <ListGroup.Item   action className="list-item-listview"><i className="fas fa-circle" style={{color: 'green', paddingRight:'10px',fontSize:'10px'}}></i>{data.name}</ListGroup.Item>
                                                <li className='list-group-item rounded-0 pl-2 m-2 pt-3 pb-3 text-muted text-truncate  border-bottom border-top-0 border-left-0 border-right-0 cursor-default bf-minheight-60' Id={data.id} name={data.name} >
                                                    {data.name}
                                                    <label class="switch float-right">
                                                    <input type="checkbox"  onChange={this.handleCheck.bind(this,data.id)}  checked={data.forCreateRequest} />
                                                      <span class="slider round"></span>
                                                            </label>
                                                  
                                                </li>
                                            );
                                        
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                   
                </div>
              
            </>
        );
    }
}

export default RequestPreferences;