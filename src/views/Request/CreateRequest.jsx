import React, { Component } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Form,
  ButtonToolbar,
  ModalTitle
} from "react-bootstrap";
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import { withGlobalState } from "react-globally";
import DateTime from "react-datetime";
import "../../assets/css/DateTime.css";
import moment from "moment";
import { DocumentService } from "../../configuration/services/DocumentService";
import AlertBanner from "../../components/AlertBanner/index";
import infoconfirmation from "../../assets/fonts/Info_icon.svg";
import "./CreateRequest.css";
import BrowseIcon from "../../assets/fonts/browse.svg";
import LoadingOverlay from "react-loading-overlay";



let files = [];
let formData = new FormData();
let Documents = [];
let DocComments = [];
let docSize = 0;
let totalSizeInMB = 0;

class CreateRequest extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      validated: false,
      mastersData: [],
      keyValueList: [],
      dynamicArray: [],
      show: false,
      CurrentSelectedMastersData: [],
      StatusData: [],
      DueDateTime: null,
      parentId: 0,
      uploadedFiles: [],
      IsSubmitDisable: false,
      Title: "",
      Description: "",
      errorTitle: "",
      showPopUp: false,
      preferenceslist: []
    };
    this.getRequestList = this.getRequestList.bind(this);
    this.modalClose = this.modalClose.bind(this);
    this.removeSelectedAttachment = this.removeSelectedAttachment.bind(this);
    this.intialize = this.intialize.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const { show, ParentId } = this.props;
    if (show === true) {
      this.intialize(this.props);
      this.resetValueAfterSubmit();
      totalSizeInMB = 0;
    }
  }

  //  componentWillReceiveProps(nextProps) {

  //   this.intialize(nextProps);
  //   }

  componentWillReceiveProps(nextProps) {
    const { show, ParentId } = nextProps;
    if (show === true) {
      this.intialize(nextProps);
      this.resetValueAfterSubmit();
      totalSizeInMB = 0;
    }
  }



  getValidTimes(dateTime) {
    var hours = moment(new Date())
      .format("HH");

    var minutes = moment(new Date())
      .format("mm");
    var date = moment(new Date())
      .format("MMMM DD YYYY")
    if (moment(new Date()).isSame(dateTime, 'day')) {

      return {
        hours: {
          min: hours,
          max: 23,
          step: 1,
        },
        minutes: {
          min: minutes,
          max: 59,
          step: 1,
        },
      };
    }

    // date is in the future, so allow all times
    return {
      hours: {
        min: 0,
        max: 23,
        step: 1,
      },
      minutes: {
        min: 0,
        max: 59,
        step: 1,
      },
    };

  }


  /** Attachments PopUp */
  handleShow() {
    this.setState({ showPopUp: true });
  }

  //Close pop
  handleClose() {
    this.setState({ showPopUp: false });
  }

  intialize(props) {
    const { show, ParentId } = props;
    formData = new FormData();
    this.setState({ StatusData: [], CurrentSelectedMastersData: [], keyValueList: [] })


    this.GetRequestPreferences();

    this.setState({
      parentId: ParentId,
      uploadedFiles: [],
      IsSubmitDisable: false,
      show: show
    });
    files = [];
    DocComments = [];
    Documents = [];
    totalSizeInMB = 0;
    this.state.keyValueList.map((data, key) => {
      data.value = "";
      this.setState({ ["err" + data.name]: undefined });
    });
  }

  onUpload = acceptedFiles => {
    this.setState({ fileValidation: "" });
    let documents = acceptedFiles.target.files;
    for (let index = 0; index < documents.length; index++) {
      let file = documents[index];
      var fileSize = (file.size / 1048576).toFixed(2);
      totalSizeInMB = parseFloat(totalSizeInMB) + parseFloat(fileSize);

      if (
        !files.some(item => file.name === item.name && file.type === item.type)
      ) {
        formData.append("files", file, file.name);
        files.push({
          name: file.name,
          lastModified: file.lastModified,
          lastModifiedDate: file.lastModifiedDate,
          size: fileSize,
          type: file.type,
          comment: ""
        });
      }
    }
    this.setState({ uploadedFiles: files });
  };

  processComments = (index, file, c) => {
    let comment = c.target.value;
    files[index] = {
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      size: file.size,
      type: file.type,
      comment: comment
    };
    DocComments[index] = comment;
    console.log(files);
    this.setState({ uploadedFiles: files });
  };

  handleSubmit(event) {
    const form = event.currentTarget;
    if (this.state.Title === "") {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
  }

  handleDate(date) {
    date = moment(date).format("YYYY-MM-DD HH:mm:ss");
    this.setState({ DueDateTime: date });
  }
  async GetMasters() {
    const responseJson = await BFLOWDataService.get(
      "Masters/GetMasterForRequest"
    );
    this.setState({ mastersData: responseJson });
    this.setState({ CurrentSelectedMastersData: responseJson });
  }
  /* Method to get List of Keys*/
  async GetKeyValue() {
    const responseJson = await BFLOWDataService.get("Key");
    this.setState({ keyValueList: responseJson });
  }
  async getRequestList() {
    // const responseJson = await BFLOWDataService.get('Request');
    //this.props.setGlobalState({ RequestList: responseJson });
    //this.props.setGlobalState({ RequestModalOnHide: false });
    this.handleClose("");
  }

  create() {
    this.CreateRequest();
  }

  async CreateRequest() {
    

    var value = this.validateForm();
    this.setState({ fileValidation: "" });
    const SUPPORTED_DOCUMENT_FORMATS =
      process.env.REACT_APP_SUPPORTED_DOCUMENT_FORMATS;
    var documentFormats = SUPPORTED_DOCUMENT_FORMATS.split(",");
    const MAX_DOCUMENTS_SIZE = process.env.REACT_APP_MAX_DOCUMENTS_SIZE;
    let invalidFileType = "";
    let hasSupportedDocumentsFormat = true;
    {
      this.state.uploadedFiles.map((data, key) => {
        var fileData = data.name.split(".");
        var index = fileData.length - 1;
        var extension = fileData[index];

        if (!documentFormats.includes(extension)) {
          invalidFileType = extension;
          hasSupportedDocumentsFormat = false;
          return invalidFileType;
        }
      });
    }

    let isValid = true;
    if (value === false) {
      this.setState({ IsSubmitDisable: true });
      if (formData !== null && this.state.uploadedFiles.length > 0) {
        if (totalSizeInMB < MAX_DOCUMENTS_SIZE && hasSupportedDocumentsFormat) {
          // this.props.setGlobalState({ IsLoadingActive: true });
          Documents = await DocumentService.POST(formData);
          // this.props.setGlobalState({ IsLoadingActive: false });
          for (let index = 0; index < Documents.length; index++) {
            Documents[index].comment = DocComments[index];
          }
          formData = new FormData();
        } else if (!hasSupportedDocumentsFormat) {
          const DOCUMENTS_FORMAT_VALIDATION =
            process.env.REACT_APP_DOCUMENTS_FORMAT_VALIDATION;
          this.setState({
            fileValidation:
              "." + invalidFileType + " " + DOCUMENTS_FORMAT_VALIDATION
          });
          isValid = false;
        } else {
          const DOCUMENTS_SIZE_VALIDATION =
            process.env.REACT_APP_DOCUMENTS_SIZE_VALIDATION;
          this.setState({
            fileValidation:
              DOCUMENTS_SIZE_VALIDATION +
              ", while the selected attachment size is " +
              totalSizeInMB.toFixed(2) +
              " MB."
          });
          isValid = false;
        }
      }

      const RequestKeyValue = [];
      const MapRequestWithMasterAttributes = [];
      const Timeline = [];
      this.state.StatusData.map((item, key) => {
        if (item.value) {
          Timeline.push({ EventId: item.id, Value: item.value });
        }
      });

      this.state.keyValueList.map((item, key) => {
        if (item.value) {
          RequestKeyValue.push({ KeyId: item.id, Value: item.value });
        }
      });

      this.state.CurrentSelectedMastersData.map((item, key) => {
        if (item.value === null || item.value === undefined) {
          item.value = 0;
        }
        MapRequestWithMasterAttributes.push({
          AttributeId: item.value === "" ? 0 : item.value
        });
      });

      if (isValid === true) {
        if (this.state.Title !== "") {
          const body = JSON.stringify({
            Title: this.state.Title,
            Description: this.state.Description,
            ParentId: this.state.parentId,
            RequestKeyValues: RequestKeyValue,
            MapRequestWithMasterAttributes: MapRequestWithMasterAttributes,
            Timeline: Timeline,
            DueDateTime: this.state.DueDateTime,
            Documents: Documents
          });
          this.resetValueAfterSubmit();
          this.props.setGlobalState({ IsLoadingActive: true });

          const message = await BFLOWDataService.post("Request", body);
                  this.props.setGlobalState({ IsLoadingActive: false });
          if (message.Code === false && message.Code !== undefined) {
            this.setState({
              showErrorMesage: true,
              errorMessage: message.Message,
              errorMessageType: "danger"
            });
          } else {
           this.props.create();
          // this.props.setGlobalState({ RequestModalOnHide: true });
            this.setState({
              showErrorMesage: true,
              errorMessage: message,
              errorMessageType: "success",
              mastersData: [],
              keyValueList: [],
              dynamicArray: [],
              CurrentSelectedMastersData: [],
              DueDateTime: null,
              show: false
            });
            this.setState({ validated: false, parentId: 0 });
            const responseJson = await BFLOWDataService.get("Request");
     
            let reqID = responseJson[0].id;
            const bodyDocuments = JSON.stringify({
              requestId: reqID,
              documents: Documents
            });
            if (this.state.uploadedFiles.length > 0) {
              const message1 = await DocumentService.Upload(bodyDocuments);
            }
            this.setState({ validated: false, uploadedFiles: [] });
            files = [];
            DocComments = [];
            totalSizeInMB = 0;
          }
          this.ResetStateValues();
          this.setTimeOutForToasterMessages();
       
        }
      }
      this.setState({ IsSubmitDisable: false });
    
    }
 

  }
  /*Modal close and document array empty*/
  modalClose() {
    this.setState({ uploadedFiles: [] });
    files = [];
    DocComments = [];
    formData = new FormData();
    Documents = [];
    totalSizeInMB = 0;
    this.props.hide(this.state.show);
  }
  /*For removing selected document from array*/

  removeSelectedAttachment(name) {
    totalSizeInMB = 0;
    this.setState({ fileValidation: "" });
    let alteredArray = [];

    alteredArray = this.state.uploadedFiles;

    var listofproject = alteredArray.filter(x => x.name === name);
    alteredArray = alteredArray.filter(function (name) {
      return listofproject.indexOf(name) === -1;
    });

    let oldformData = formData;
    formData = new FormData();
    for (var pair of oldformData.entries()) {
      if (name !== pair[1].name) {
        formData.append(pair[0], pair[1], pair[2]);
      }
    }

    if (alteredArray.length > 0) {
      this.setState({ uploadedFiles: alteredArray });
      files = alteredArray;

      for (let index = 0; index < alteredArray.length; index++) {
        let file = alteredArray[index];

        totalSizeInMB = parseFloat(totalSizeInMB) + parseFloat(file.size);
      }
    } else {
      this.setState({ uploadedFiles: [] });
      files = [];
      formData = new FormData();
      totalSizeInMB = 0;
    }
  }

  /*Method to validate key values*/
  validateForm() {
    let blError = false;
    let ErrMsg = "";
    if (
      this.state.Title == null ||
      this.state.Title == "" ||
      this.state.Title == undefined
    ) {
      this.setState({ errorTitle: "*Please enter Title." });
      blError = true;
    }
    this.state.keyValueList.map((data, key) => {
      this.setState({ ["err" + data.name]: "" });
      if (
        (data.value == null || data.value == "" || data.value == undefined) &&
        data.isRequired == true
      ) {
        ErrMsg = "*Please enter " + data.name;
        this.setState({ ["err" + data.name]: ErrMsg });
        blError = true;
      }
    });
    return blError;
  }

  async GetRequestPreferences() {
    debugger;
    let preferences = await BFLOWDataService.get("RequestPreferences");
    debugger;
    this.setState({ preferenceslist: preferences })
    if (preferences !== null || preferences !== undefined) {
      if (preferences.filter(x => x.name === "Preferences" && x.forCreateRequest === true).length > 0) {
        this.GetMasters();
      }


      if (preferences.filter(x => x.name === "Custom Fields" && x.forCreateRequest === true).length > 0) {
        this.GetKeyValue();
      }

      this.GetStatus();

    }
  }
  async GetStatus() {
    let responseJson = await BFLOWDataService.get("Event");
    let responseType2 = responseJson.filter(x => x.type === 2);
    let responseType1 = responseJson.filter(x => x.type === 1);
    if (this.state.preferenceslist.filter(x => x.name === "Custom Dates" && x.forCreateRequest === true).length > 0) {
      this.setState({ StatusData: responseType2 });
    }
    this.setState({ StatsData: responseType1 });
  }

  bindDocuments() {
    if (this.state.preferenceslist.filter(x => x.name === "Documents" && x.forCreateRequest === true).length > 0) {
      return (
        <>

          <b class="pl-3">
            Attachments
              <div class="tooltiP">
              <i
                id="infoClick"
                className="text-muted p-2"
                aria-hidden="true"
                style={{ padding: "0.5rem 0.5rem 0.5rem 0" }}
              >
                <span
                  class="tooltiptext"
                  style={{
                    width: "500px",
                    fontSize: "13px",
                    fontWeight: "250"
                  }}
                >
                  Supported file types are: Microsoft Word, Excel, PowerPoint,
                  PDF, Text, Zip and images.
                  </span>

                <img src={infoconfirmation} />
              </i>
            </div>
          </b>


          <div class="row pl-3 pr-3 pt-0 pb-0">
            <div class="col-sm-12">
              <div class="input-group">
                <label class="custom-file-upload details-label">
                  <input
                    type="file"
                    id="inputGroupFile01"
                    aria-describedby="inputGroupFileAddon01"
                    multiple
                    onChange={this.onUpload.bind(this)}
                    onClick={event => {
                      event.target.value = null;
                    }}
                    style={{ display: "none" }}
                  />
                  <div class="addDoc mt-3">
                    <i
                      className="text-muted cursor-pointer"
                      aria-hidden="true"
                      style={{ padding: "0.5rem 0.5rem 0.5rem 0" }}
                    >
                      <img src={BrowseIcon} />
                    </i>
                    Browse
                    </div>
                </label>
              </div>
            </div>
          </div>
          <div class="row pl-3 pr-3 pt-0 pb-0">
            <div class="col-sm-12">
              <div class="form-group">
                <table class="table ml-3 mr-3">
                  {this.state.uploadedFiles.map((data, key) => {
                    return (
                      <tr>
                        <td>{data.name}</td>
                        <td class="form-group">
                          <input
                            type="text"
                            class="form-control border-top-0 border-right-0 border-left-0 rounded-0 "
                            id="txtComments"
                            placeholder="Enter your comments"
                            onChange={this.processComments.bind(
                              this,
                              key,
                              data
                            )}
                          />
                        </td>
                        <td>
                          <span
                            onClick={this.removeSelectedAttachment.bind(
                              this,
                              data.name
                            )}
                          >
                            {" "}
                            <i class="fa fa-times" aria-hidden="true" />
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <div className="errorMsg">
                      {this.state.fileValidation}
                    </div>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </>
      )
    }
  }
  /*Method to set value for particular key on Change event of textbox */
  updateKeyValue(event) {
    const _key = this.state.keyValueList.map((item, key) => {
      if (item.name === event.target.name) {
        item.value = event.target.value;
      }
      return item;
    });
    this.setState({ keyValueList: _key });
    this.setState({ ["err" + event.target.name]: undefined });
  }
  handelchangetitel(event) {
    this.setState({ Title: event.target.value });
    if (event.target.value !== "" && this.state.errorTitle !== "") {
      this.setState({ errorTitle: "" });
    }
  }

  bindTimeline(name, date) {
    //let value=event.target.value;
    date = moment(date._d).format("YYYY-MM-DD HH:mm:ss");
    const _timeline = this.state.StatusData.map((item, key) => {
      if (item.name === name) {
        item.value = date;
      }
      return item;
    });
    this.setState({ StatusData: _timeline });
  }

  ResetChildDropDown(masterId, list, findChildrenOnDropDownChange) {
    let SelectedMasterData = list.filter(x => x.id === masterId);
    var mapmastervalue = SelectedMasterData[0].mapMasterWithMasters;

    mapmastervalue.forEach(element => {
      findChildrenOnDropDownChange.push(element.secondaryMasterId);
      this.ResetChildDropDown(
        element.secondaryMasterId,
        list,
        findChildrenOnDropDownChange
      );
    });
    return findChildrenOnDropDownChange;
  }

  bindDropDown(masterId, attributeid) {
    let alreadySelectedAttributeID = [];
    let list = this.state.CurrentSelectedMastersData;
    const filteredMasterDatas = this.state.mastersData;

    let SelectedMasterData = list.filter(x => x.id === masterId);
    let SelectedMasterDataAttributes = SelectedMasterData[0].attributes;
    let findChildrenOnDropDownChange = [];
    let SelectedMasterDataAttribute = SelectedMasterDataAttributes.filter(
      x => x.id === attributeid
    );
    let secondaryMasterId = [];
    // if(SelectedMasterDataAttribute.length===0){
    let unselectvalue = this.state.CurrentSelectedMastersData;
    var mastervalue = filteredMasterDatas.filter(x => x.id === masterId);
    var mapmastervalue = mastervalue[0].mapMasterWithMasters;

    unselectvalue.map((item, key) => {
      if (item.id === masterId) {
        unselectvalue[key].value = attributeid;
      } else {
        findChildrenOnDropDownChange = this.ResetChildDropDown(
          masterId,
          list,
          findChildrenOnDropDownChange
        );
        secondaryMasterId = findChildrenOnDropDownChange.filter(
          x => x === item.id
        );
        if (secondaryMasterId.length > 0) {
          unselectvalue[key].isParentNode = false;
          unselectvalue[key].value = "";
        }
      }
    });
    //     this.setState({CurrentSelectedMastersData : unselectvalue });
    // }
    if (SelectedMasterDataAttribute.length > 0) {
      let mappedAttributes =
        SelectedMasterDataAttribute[0].mapAttributesWithAttributes;
      let mapping = SelectedMasterData[0].mapMasterWithMasters;

      if (mapping.length === 0) {
        list.map((item, key) => {
          if (item.id === masterId) {
            list[key].value = attributeid;

            list[key].isParentNode = true;
          }
        });
      }
      mapping.forEach(element => {
        list = list.map((item, key) => {
          if (item.id === masterId) {
            list[key].value = attributeid;
          }
          if (item.id === element.secondaryMasterId) {
            let requiredAttributed = [];

            let filteredData = filteredMasterDatas.filter(
              x => x.id === item.id
            )[0];
            filteredData.isParentNode = true;
            let availableAttributes = filteredData.attributes;
            if (mappedAttributes.length == 0) {
              requiredAttributed = availableAttributes.map((data, key) => {
                data.isMapped = true;
                return data;
              });
              return filteredData;
            } else {
              mappedAttributes.forEach(elements => {
                // ;
                if (filteredData.attributes === undefined) {
                  return filteredData;
                }

                if (availableAttributes !== undefined) {
                  requiredAttributed = availableAttributes.map((data, key) => {
                    if (
                      alreadySelectedAttributeID.filter(x => x === data.id)
                        .length > 0
                    ) {
                      return data;
                    }
                    if (data.id === elements.secondaryAttributeId) {
                      alreadySelectedAttributeID.push(data.id);
                      data.isMapped = false;
                    } else {
                      data.isMapped = true;
                    }
                    return data;
                  });
                }
              });
              if (requiredAttributed.length > 0) {
                filteredData.attributes = requiredAttributed;
              }
              return filteredData;
            }
          } else {
            return item;
          }
        });
      });
    }
    this.setState({ CurrentSelectedMastersData: list });
  }

  onChangeDropDownMaster(event) {
    if (event === undefined) {
      return null;
    }

    //store the selectedAttributeid

    //get the Dropdown ID from Event Target : Drp[MasterName]_ID
    let controlId = event.target.id.split("_");
    //get the masterId

    let masterId = parseInt(controlId[1]);
    let attributeid;
    if (event.target.value !== "") {
      attributeid = parseInt(event.target.value);
    } else {
      attributeid = "";
    }

    this.bindDropDown(masterId, attributeid);
  }

  LoadOptions(data, key) {
    if (data.attributes !== undefined) {
      return (
        <select
          class="form-control border-top-0 border-right-0 border-left-0 rounded-0 "
          id={"drpMaster_" + data.id}
          onChange={this.onChangeDropDownMaster.bind(this)}
          value={data.value}
        >
          <option selected disable value="" key={key}>
            Select {data.name}
          </option>
          {data.attributes.map((attributes, key) => {
            if (attributes.isMapped === false && data.isParentNode === true) {
              return (
                <option disable value={attributes.id} key={key}>
                  {attributes.name}
                </option>
              );
            }
          })}
        </select>
      );
    } else {
      return (
        <select
          class="form-control border-top-0 border-right-0 border-left-0 rounded-0 "
          id="drpServiceType"
        >
          <option selected disable value="" key={key}>
            Select {data.name}
          </option>
        </select>
      );
    }
  }

  // handleClose(create) {
  //
  //   this.ResetStateValues();
  //   this.setState({ show: false });
  //   //this.props.submitRequest(create);
  //
  //   // window.location.href="/Request"
  //   this.props.hide(create);
  // }

  /*Method to reset state values */

  ResetStateValues() {
    this.setState({ fileValidation: "" });
    this.resetValueAfterSubmit();
    this.setState({
      show: false
    });

    this.props.hide();
  }

  resetValueAfterSubmit() {
    // this.props.setGlobalState({ RequestModalOnHide: false });
    this.state.keyValueList.map((data, key) => {
      data.value = "";
      this.setState({ ["err" + data.name]: undefined });
    });
    this.setState({
      errorTitle: "",
      Title: "",
      Description: ""
    });
  }
  /**Method to hide Alert Message */
  setTimeOutForToasterMessages() {
    setTimeout(
      function () {
        this.setState({ showErrorMesage: false });
      }.bind(this),
      15000
    );
  }
  /*Method to handle error message */
  handleCloseErrorMessage() {
    this.setState({ showErrorMesage: false });
  }
  render() {
    const { validated } = this.state;
    const { hide, submitRequest, create } = this.props;
    return (
      <>
        <AlertBanner
          onClose={this.handleCloseErrorMessage.bind(this)}
          Message={this.state.errorMessage}
          visible={this.state.showErrorMesage}
          Type={this.state.errorMessageType}
        />
        <Modal
          show={this.state.show}
          onHide={this.ResetStateValues.bind(this)}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
                       <LoadingOverlay
          active={this.props.globalState.IsLoadingActive}
          spinner
          text="Loading Request..."
          styles={{
            overlay: {
              position: "absolute",
              height: "100%",
              width: "100%",
              top: "0px",
              left: "0px",
              display: "flex",
              textAlign: "center",
              fontSize: "1.2em",
              color: "#FFF",
              background: "rgba(0, 0, 0, 0.1)",
              zIndex: 800
            }
          }}
        >
          <Modal.Header closeButton className="pop-Header">
            <Modal.Title
              id="contained-modal-title-vcenter"
              style={{ width: "100%" }}
            >
              <div className="float-left d-inline ">
                {this.state.parentId === 0 || this.state.parentId === undefined
                  ? "Create Request"
                  : "Create Linked Request"}
                {/* {totalSizeInMB = 0} */}
              </div>
              <div className="float-right d-inline pt-2">
                <h6>
                  {" "}
                  {this.state.parentId === 0 ||
                    this.state.parentId === undefined
                    ? ""
                    : "Parent Request : REQ" + this.state.parentId}{" "}
                </h6>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body class="scrollbar create-request-modal">
            <form>
              <div class="row pl-3 pr-3 pt-0 pb-0">
                <div class="col-sm-12">
                  <div class="form-group">
                    <label
                      for="lblTitle"
                      className={
                        this.state.errorTitle === ""
                          ? "mandatory details-label"
                          : "error-label mandatory details-label"
                      }
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      className={
                        this.state.errorTitle === ""
                          ? "form-control border-top-0 border-right-0 border-left-0 rounded-0 "
                          : "error-textbox form-control border-top-0 border-right-0 border-left-0 rounded-0 "
                      }
                      id="txtTitle"
                      placeholder="Title"
                      name="Title"
                      onChange={this.handelchangetitel.bind(this)}
                    />
                    <div className="errorMsg">{this.state.errorTitle}</div>
                  </div>
                </div>
                <div class="col-sm-12">
                  <div class="form-group">
                    <label for="textAreaDescription1" className="details-label">Description</label>
                    <textarea
                      class="form-control"
                      id="textAreaDescription"
                      name="Description"
                      rows="2"
                      // ref={x => this.Description = x}
                      onChange={e =>
                        this.setState({ Description: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <b class="pl-3">Dates</b>
              <hr />
              <div class="row pl-3 pr-3 pt-0 pb-0">
                <div class="col-sm-6">
                  <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0 ">
                    <label className="details-label">Due Date</label>
                    <DateTime
                      viewMode="days"
                      viewDate={new Date()}
                      timeFormat="HH:mm"
                      dateFormat="MMMM Do YYYY"
                      isValidDate={current =>
                        current.isAfter(
                          DateTime.moment(new Date()).startOf("day") - 1
                        )
                      }
                      onChange={this.handleDate.bind(this)}
                      name="DueDateTime"
                      id="DueDateTime"

                      // timeConstraints={{
                      //   hours: { min: new Date().getHours(), max: 23, step: 1 },
                      //   minutes: {
                      //     min: new Date().getMinutes(),
                      //     max: 59,
                      //     step: 1
                      //   }
                      // }}

                      timeConstraints={this.getValidTimes(new Date().getHours())}
                      inputProps={{
                        readOnly: true,
                        style: {
                          color: "rgb(85, 86, 90)",
                          padding: "0px",
                          fontSize: "0.875rem"
                        }
                      }}
                    />
                  </div>
                </div>
                {this.state.StatusData.map((data, key) => {
                  if (data.type == 2)
                    return (
                      <div class="col-sm-6">
                        <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0 ">
                          <label for="exampleFormControlInput1" className="details-label">
                            {data.name}
                          </label>
                          <br />
                          <DateTime
                            viewMode="days"
                            timeFormat="HH:mm"
                            dateFormat="MMMM Do YYYY"
                            viewDate={new Date()}
                            isValidDate={current =>
                              current.isAfter(
                                DateTime.moment(new Date()).startOf("day") - 1
                              )
                            }
                            onChange={this.bindTimeline.bind(this, data.name)}
                            name={data.name}
                            id={"Datetime" + data.name.trim()}
                            // timeConstraints={{
                            //   hours: {
                            //     min: new Date().getHours(),
                            //     max: 23,
                            //     step: 1
                            //   },
                            //   minutes: {
                            //     min: new Date().getMinutes(),
                            //     max: 59,
                            //     step: 1
                            //   }
                            // }}

                            timeConstraints={this.getValidTimes(new Date().getHours())}
                            inputProps={{
                              readOnly: true,
                              style: {
                                color: "rgb(85, 86, 90)",
                                padding: "0px",
                                fontSize: "0.875rem"
                              }
                            }}
                          // value={data.value}
                          />
                        </div>
                      </div>
                    );
                })}
              </div>
              <b className={this.state.preferenceslist.filter(x => x.name === "Preferences" && x.forCreateRequest === true).length > 0 ? "pl-3" : "display-none"}>Product inputs</b>
              <hr className={this.state.preferenceslist.filter(x => x.name === "Preferences" && x.forCreateRequest === true).length > 0 ? "pl-3" : "display-none"} />
              <div class="row  pl-3 pr-3 pt-0 pb-0">
                {this.state.CurrentSelectedMastersData.map((data, key) => {
                  if (!data.id !== null)
                    return (
                      <div class="col-sm-6">
                        <div class="form-group border-top-0 border-right-0 border-left-0 rounded-0 ">
                          <label for="exampleFormControlSelect1" className="details-label">
                            {data.name}
                          </label>
                          {this.LoadOptions(data, key)}
                        </div>
                      </div>
                    );
                })}
              </div>
              <b className={this.state.preferenceslist.filter(x => x.name === "Custom Fields" && x.forCreateRequest === true).length > 0 ? "pl-3" : "display-none"}>Request inputs</b>
              <hr className={this.state.preferenceslist.filter(x => x.name === "Custom Fields" && x.forCreateRequest === true).length > 0 ? "pl-3" : "display-none"} />
              <div class="row pl-3 pr-3 pt-0 pb-0">
                {this.state.keyValueList.map((data, key) => {
                  if (!data.id !== null)
                    return (
                      <div class="col-sm-6">
                        <div>
                          <label
                            className={
                              this.state["err" + data.name] !== undefined &&
                                data.isRequired == true
                                ? "error-label form-group border-top-0 border-right-0 border-left-0 rounded-0 details-label"
                                : "form-group border-top-0 border-right-0 border-left-0 rounded-0 details-label"
                            }
                          >
                            {data.name}
                          </label>
                          <span
                            className={
                              data.isRequired == true ? "mandatory" : ""
                            }
                          />
                          <input
                            type="text"
                            className={
                              this.state["err" + data.name] !== undefined &&
                                data.isRequired == true
                                ? "error-textbox  form-control border-top-0 border-right-0 border-left-0 rounded-0 "
                                : "form-control border-top-0 border-right-0 border-left-0 rounded-0 "
                            }
                            id={"txt" + data.name.trim()}
                            maxLength="100"
                            placeholder={data.name}
                            name={data.name}
                            onChange={this.updateKeyValue.bind(this)}
                          />
                          <div className="errorMsg">
                            {this.state["err" + data.name]}
                          </div>
                        </div>
                      </div>
                    );
                })}
              </div>
            </form>
            {/* Attachments module */}

            {this.bindDocuments()}


          </Modal.Body>
          <Modal.Footer className="pop-footer">
            <ButtonToolbar>
              <Button variant="light" className="btn-light float-right default-button-secondary" onClick={this.ResetStateValues.bind(this)}>Cancel</Button>&nbsp;
         <Button name="btnSubmit" className="default-button  btn-dark float-right text-center p-0" disabled={this.state.IsSubmitDisable} closeButton onClick={this.create.bind(this)} >Submit</Button>
            </ButtonToolbar>
          </Modal.Footer>
          </LoadingOverlay>
        </Modal>
      </>
    );
  }
}
export default withGlobalState(CreateRequest);
