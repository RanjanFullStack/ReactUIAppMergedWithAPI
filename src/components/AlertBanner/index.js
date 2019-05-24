import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cancelIcon from '../../assets/fonts/cancel.svg';
import successIcon from '../../assets/fonts/success.svg';
import infoIcon from '../../assets/fonts/info.svg';
import errorIcon from '../../assets/fonts/error.svg';
import warningIcon from '../../assets/fonts/warning.svg';
import './style.css';


export default class AlertBanner extends Component {
  constructor(props) {
    super(props);
    this.state={
      visible:false
    }
 
   
  }

  componentDidMount() {
    const alertBanner = this.refs.alert;
        // Call the onClose Handler to notify the Parent
        // this.setState({visible: this.props.visible})
        //   setTimeout(() => {
        //     this.setState({visible:false})
        //     this.props.onClose();
        //   },5000);
  }

  componentWillReceiveProps(nextProps)
  {
   
    if(nextProps.visible===true){
      this.setState({visible: nextProps.visible})
      // setTimeout(() => {
      //   this.setState({visible:false})
      // }, 5000);
    }
    
  }

  showerrorMessage(){
    const {onClose,visible,top} =this.props;
    
    let className="";
    let src="";
    if(visible===true){
      if(this.props.Type==="success"){
        className="alert alert-success alertBanner alert-dismissible fade show align-middle center pl-0";
        src=successIcon;
      }
      else if(this.props.Type==="danger"){
        className="alert alert-danger alertBanner alert-dismissible fade show align-middle center pl-0";
        src=errorIcon;
      }

      else if(this.props.Type==="warning"){
        className="alert alert-warning alertBanner alert-dismissible fade show align-middle center pl-0";
        src=warningIcon;
      }
      else if(this.props.Type==="info"){
        className="alert alert-info alertBanner alert-dismissible fade show align-middle center pl-0";
        src=infoIcon;
      }
      
     
return(
 
 <div
        data-nep="AlertBanner"
        ref="alert"
        className={className}
        style={top}
      >
          <div className='content pl-2 text-size'> <i  className="pr-2 pl-0" > <img src={src}/></i> {this.props.Message}</div>
          <div className='pl-2'> <button type="button" class="close pb-5 pt-0 pr-2 toppadding" onClick={onClose} data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true" className="">&times;</span>
  </button></div>
         
      
       
      </div>

 
)
    }
    else{
     
    }
  } 

  render() {
    return  (
      <>
      {this.showerrorMessage()}
      </>
    )
  }

  

  handleCloseErrorMessage() {
   
   this.setState({visible:false})
   this.props.onClose();
}
}

const { element, bool, func, string } = PropTypes;
AlertBanner.propTypes = {
  Type: string,
  visible: bool,
  className: string,
};

AlertBanner.defaultProps = {
  className: "alert alert-success alertBanner",
  visible: false,
  Type:"success"
};
