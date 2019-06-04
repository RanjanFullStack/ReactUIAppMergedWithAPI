/**
 * BFLOW: Custom Field UI
 * Components Name: Create, Update, Delete - Custom Field
 */
import React, { Component } from "react";
import { Button, Modal } from 'react-bootstrap';
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import DeleteIcon from '../../assets/fonts/Delete_icon.svg';
import editIcon from '../../assets/fonts/edit.svg';
import AlertBanner from '../../components/AlertBanner/index'

class KeyValue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Key: '',
            show: false,
            KeyList: [],
            allKeyList: [],
            isRequired: false,
            updateButton: true,
            keyId: 0,
            showErrorMesage: false,
            errorMessageType: '',
            errorMessage: '',
            errorKey: ''
        }
        this.handleClose = this.handleClose.bind(this)
    }
    /** Lifecycle Event */
    componentDidMount() {
        this.getKey();
    }
    /*Method to get key values*/
    async getKey() {
        const responseJson = await BFLOWDataService.get('Key');
        this.setState({ allKeyList: responseJson })
        this.setState({ KeyList: responseJson })
        this.setTimeOutForToasterMessages();
    }
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value })
    }

    openModel() {
        this.setState({ updateButton: true });
        this.setState({ show: true })
    }
    //Close pop
    handleClose() {
        this.setState({ show: false })

        this.setState({ isRequired: false })
        this.setState({ Key: '', errorKey: '' })
    }
    /*Method to validate key values*/
    validateForm() {
        let blError = false;
        const KeyErrMsg = process.env.REACT_APP_CUSTOM_FIELD_ERROR_KEY;
        if (this.state.Key === null || this.state.Key === '' || this.state.Key === undefined) {
            this.setState({ errorKey: KeyErrMsg });
            blError = true;
        }
        return blError;
    }
    /*Method to add key values*/
    async addKey() {
        var value = this.validateForm();
        if (value === false) {
            const body = JSON.stringify({
                Name: this.state.Key,
                IsMappedToRequest: true,
                isRequired: this.state.isRequired,
            });
            const response = await BFLOWDataService.post('Key', body);

            if (response.Code === false && response.Code !== undefined) {
                this.setState({
                    showErrorMesage: true,
                    errorMessage: response.Message,
                    errorMessageType: 'danger'
                });
            }
            else {
                this.setState({
                    showErrorMesage: true,
                    errorMessage: response,
                    errorMessageType: 'success'
                });
                this.getKey()
            }
            this.handleClose();
            this.setTimeOutForToasterMessages();

        }
    }
    /*Method to add delete values*/
    async  keyDelete(id) {
        if (window.confirm("Do you wish to delete this item?")){
        const response = await BFLOWDataService.Delete('Key', id);

        if (response.Code === false && response.Code !== undefined) {
            this.setState({
                showErrorMesage: true,
                errorMessage: response.Message,
                errorMessageType: 'danger',
                Key: ''
            });
        }
        else {
            this.setState({
                showErrorMesage: true,
                errorMessage: response,
                errorMessageType: 'success',
                Key: ''
            });
            this.getKey()
        }
        this.handleClose();
        this.setTimeOutForToasterMessages();
    }
    }
    /*Method to Search Key List*/
    searchHandler(event) {

        let searcjQery = event.target.value.toLowerCase();
        const displayedContacts = this.state.allKeyList.filter((el) => {
            let searchValue = el.name.toLowerCase();
            return searchValue.indexOf(searcjQery) !== -1;
        })
        if (searcjQery !== "") {
            this.setState({
                KeyList: displayedContacts
            })
        }
        else {
            this.setState({
                KeyList: this.state.allKeyList
            })
        }
    }

    handelchangeIsActive(event) {
        this.setState({ IsActive: !this.state.IsActive })
    }
    handleChangeIsRequired(event) {
        this.setState({ isRequired: !this.state.isRequired })
    }

    /*Method to handle error message */
    handleCloseErrorMessage() {
        this.setState({ showErrorMesage: false })
    }

    moderPopButton() {
        if (this.state.updateButton === true) {
            return (
                <>
                    <Button variant="outline-secondary" name="btnClose" onClick={this.handleClose}> Close</Button>
                    <Button variant="primary" name="btnAdd" className="common-button" onClick={this.addKey.bind(this)} >Add</Button>
                </>
            )
        }
        else {
            return (
                <>
                    <Button variant="outline-secondary" name="btnClose" onClick={this.handleClose}>Close</Button>
                    <Button variant="primary" name="btnUpdate" onClick={this.updateKey.bind(this)} >Update</Button>
                </>
            )
        }

    }
    /*Method to update Key*/
    async  updateKey() {
        var value = this.validateForm();
        if (value === false) {
            const body = JSON.stringify({
                Name: this.state.Key,
                isRequired: this.state.isRequired,

            });
            const response = await BFLOWDataService.put('Key', this.state.keyId, body);
            this.setState({ IsActive: !this.state.IsActive })
            this.setState({ isRequired: !this.state.isRequired })
            if (response.Code === false && response.Code !== undefined) {
                this.setState({
                    showErrorMesage: true,
                    errorMessage: response.Message,
                    errorMessageType: 'danger',
                    Key: ''
                });
            }
            else {
                this.setState({
                    showErrorMesage: true,
                    errorMessage: response,
                    errorMessageType: 'success',
                    Key: ''
                });

                this.getKey()
            }
            this.handleClose();
            this.setTimeOutForToasterMessages();
        }
    }


    keyValue(id, name, IsActive, isRequired) {
        this.setState({
            updateButton: false,
            Key: name,
            IsActive: IsActive,
            isRequired: isRequired,
            show: true,
            keyId: id
        })
    }
    /**Method to hide Alert Message */
    setTimeOutForToasterMessages() {
        setTimeout(
            function () {
                this.setState({ showErrorMesage: false });
            }
                .bind(this),
            15000
        );
    }
    render() {

        return (
            <>
                <AlertBanner onClose={this.handleCloseErrorMessage.bind(this)} Message={this.state.errorMessage} visible={this.state.showErrorMesage} Type={this.state.errorMessageType}>
                </AlertBanner>
                <div className="container-fluid scrollbar" style={{backgroundColor:"#FAFAFB"}}>
                    <div className="row" >
                        <div className="col-sm-12   p-0" >
                            <nav className="navbar navbar-expand navbar-light p-0  shadow-sm ">
                                <div className="input-group border">
                                    <input
                                        placeholder="Search"
                                        aria-describedby="inputGroupPrepend"
                                        name="Search"
                                        onChange={this.searchHandler.bind(this)}
                                        type="text"
                                        className=" search-textbox form-control rounded-0 " />
                                    <div className="input-group-prepend" >
                                        <span className="search-icon input-group-text bg-white border-left-0   border-top-0" id="inputGroupPrepend">
                                            <i className="fa fa-search text-muted" aria-hidden="true" name="SearchField"></i>
                                        </span>
                                    </div>

                                </div>
                            </nav>
                            <div className="card border-0  bg-white scrollbar pr-2 border-0 shadow-sm" style={{ fontSize: "1.25rem", borderRadius: "8px", margin: "8rem", height: "50vh" }}>
                                {/* style={{ height: '72vmin' }} */}
                                <ul className="list-group" name="KeyList">
                                    {this.state.KeyList.map((data, key) => {
                                        if (data.isMappedToRequest) {
                                            return (
                                                //  <ListGroup.Item   action className="list-item-listview"><i className="fas fa-circle" style={{color: 'green', paddingRight:'10px',fontSize:'10px'}}></i>{data.name}</ListGroup.Item>
                                                <li className='list-group-item rounded-0 pl-2 m-2 pt-3 pb-3 text-muted text-truncate  border-bottom border-top-0 border-left-0 border-right-0 cursor-default bf-minheight-60' Id={data.id} name={data.name} >
                                                    {data.name}
                                                    <i className="text-muted float-right mb-1" name="dltCustomFields" onClick={this.keyDelete.bind(this, data.id)} ><img src={DeleteIcon} alt="Delete" /></i>
                                                    <i className="text-muted d-inline float-right mb-1" name="editCustomFields" onClick={this.keyValue.bind(this, data.id, data.name, data.isActive, data.isRequired)}> <img src={editIcon} alt="Edit" /></i>
                                                </li>
                                            );
                                        }
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="rounded-circle btn add-button-list-view common-button bf-margin-right-75"
                        name="btnAddKey"
                        style={{
                            boxShadow:
                                " 8px 4px 8px 0 rgba(0, 0, 0, 0.2), 8px 6px 20px 0 rgba(0, 0, 0, 0.19)"
                        }}
                        onClick={this.openModel.bind(this)}
                    >
                        {" "}
                        <i className="fa fa-plus text-white" aria-hidden="true" />
                    </button>
                </div>
                <Modal aria-labelledby="contained-modal-title-vcenter" centered show={this.state.show} onHide={this.handleClose} >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter "><label className="text-truncate" >{(this.state.updateButton === true) ? "Add" : "Edit"} Custom Field</label></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form className="form-horizontal">
                            <div className="form-group">
                                <div className="col-sm-10">
                                    <label for="lblCustomField"
                                        className={this.state.errorKey === "" ? " mandatory" : "error-label mandatory"}
                                    >Custom Field</label>
                                    <input type="text"
                                        placeholder="Enter Custom Field*"
                                        aria-describedby="inputGroupPrepend"
                                        name="Key"
                                        value={this.state.Key}
                                        onChange={this.handleChange.bind(this)}
                                        className={this.state.errorKey === "" ? "form-control rounded-0 border-right-0 border-left-0 border-top-0 w-100" : "error-textbox form-control rounded-0 border-right-0 border-left-0 border-top-0 w-100"}
                                    />
                                    <div className="errorMsg">{this.state.errorKey}</div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="col-sm-12 float-right d-inline">
                                    <div className="custom-control-sm custom-control custom-checkbox d-inline">
                                        <input type="checkbox"
                                            className="custom-control-input"
                                            id="IsRequired"
                                            onChange={this.handleChangeIsRequired.bind(this)}
                                            checked={this.state.isRequired}
                                            name="IsRequired"
                                        />
                                        <label className="custom-control-label" for="IsRequired">Is Required</label>
                                        <label className="errorMsg"></label>
                                        <label></label>
                                    </div>
                                </div>
                            </div>

                        </form>

                    </Modal.Body>
                    <Modal.Footer>
                        {this.moderPopButton()}

                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
export default KeyValue;