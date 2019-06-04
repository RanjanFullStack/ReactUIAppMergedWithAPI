import React, { Component } from "react";
import { withGlobalState } from "react-globally";
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import { DocumentService } from "../../configuration/services/DocumentService";
import moment from "moment";
import DefaultFileIcon from '../../assets/fonts/Filetype_icons/FILE.svg';
import PdfFileIcon from '../../assets/fonts/Filetype_icons/PDF.svg';
import ImageFileIcon from '../../assets/fonts/Filetype_icons/IMAGE.svg';
import PptFileIcon from '../../assets/fonts/Filetype_icons/PPT.svg';
import TextFileIcon from '../../assets/fonts/Filetype_icons/TEXT.svg';
import WordFileIcon from '../../assets/fonts/Filetype_icons/WORD.svg';
import XlsFileIcon from '../../assets/fonts/Filetype_icons/XLS.svg';
import ZippedFileIcon from '../../assets/fonts/Filetype_icons/ZIPPED_FILE.svg';
import LoadingOverlay from 'react-loading-overlay';


let searchText = "";
class DocumentRepository extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      documentsData: [],
      AlldocumentsData: []
    };
    this.GetDocumentsData = this.GetDocumentsData.bind(this);
    this.onDownload = this.onDownload.bind(this);
  }

  async componentDidMount() {
    this.GetDocumentsData();
  }

  async onDownload(file) {
    debugger;
    const attachment = await DocumentService.Get(file.path, file.name);
  }

  async GetDocumentsData() {
    debugger;
    const body = JSON.stringify({ title: "DocumentRepository" });
    const responseJson = await BFLOWDataService.post("Report", body);
    this.setState({ documentsData: responseJson.DocumentRepository.Results });
    this.setState({
      AlldocumentsData: responseJson.DocumentRepository.Results
    });
  }

  search(event) {
    debugger
    if (event.target.value !== undefined) {
      searchText = event.target.value.toLowerCase();
    }
    debugger;
    if (searchText !== "") {
      let updatedList = this.state.AlldocumentsData;
      let createdOn = null;
      updatedList = updatedList.filter(function(item) {
        if (item.name.toLowerCase().search(searchText.toLowerCase()) !== -1) {
          return (
            item.name.toLowerCase().search(searchText.toLowerCase()) !== -1
          );
        } else if (
          item.title.toLowerCase().search(searchText.toLowerCase()) !== -1
        ) {
          return (
            item.title.toLowerCase().search(searchText.toLowerCase()) !== -1
          );
        } else if (item.requestId.toString().search(searchText) !== -1) {
          return item.requestId.toString().search(searchText) !== -1;
        } else if (searchText.toLowerCase().includes("req")) {
          let id = "req" + item.requestId.toString();
          return id.search(searchText.toLowerCase()) !== -1;
        } else if (item.createdOn.toString().search(searchText) !== -1) {
          return item.createdOn.toString().search(searchText) !== -1;
        } else {
          var dateFormat = require("dateformat");
          createdOn = dateFormat(item.createdOn, "dddd, mmm d yyyy");
          let str = createdOn.toLowerCase();
          if ((str.search(searchText.toLowerCase()) !== -1) === false) {
            createdOn = dateFormat(item.createdOn, "dddd, d mmm yyyy");
            let str = createdOn.toLowerCase();
            return str.search(searchText.toLowerCase()) !== -1;
          }
          return str.search(searchText.toLowerCase()) !== -1;
        }
      });
      this.setState({ documentsData: updatedList });
    } else {
      this.setState({ documentsData: this.state.AlldocumentsData });
    }
  }

  render() {
    return (
      <div
      class="card-body list-card-document"
      style={{ backgroundColor: "#FAFAFB", padding:".05rem!important", margin:"30px" }}
    >
       <LoadingOverlay
active={this.props.globalState.IsLoadingActive}
spinner
text='Loading Documents...'
styles={{
  overlay: { position: 'absolute',
  height: '100%',
  width: '100%',
  top: '0px',
  left: '0px',
  display: 'flex',
  textAlign: 'center',
  fontSize: '1.2em',
  color: '#FFF',
  background: 'rgba(0, 0, 0, 0.2)',
  zIndex: 800,
},

}}  >
        <div className="w-100  mt-0">
          <div class="input-group Documentserch">
            <input
              placeholder="Search"
              onChange={this.search.bind(this)}
              aria-describedby="inputGroupPrepend"
              name="username"
              type="text"
              class="search-textbox form-control rounded-0  pt-1 bg-white"
            />
            <div class="input-group-prepend ">
              <span
                class="search-icon input-group-text bg-white border-left-0 border-right-0 border-top-0"
                id="inputGroupPrepend"
              >
                <i class="fa fa-search text-muted " aria-hidden="true" />
              </span>
            </div>
          </div>
          <div className="scrollbar list-card-document " >
          <table
            class="table  table-bordered bg-white"
            style={{ borderbottom: "1px solid #dee2e6" }}
          >
            <thead>
              <tr> 
                <th style={{width:"9%"}}>Request Id</th>
                <th style={{width:"35%"}}>Title</th>
                <th style={{width:"35%"}}>Document Name</th>
                {/* <th style={{width:"5%"}}>Type</th> */}
                <th style={{width:"11%"}}>Uploaded Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.documentsData.map((data, key) => {
                var scrname = "";
                debugger
                if (data.type === ".pdf") {
                  scrname = PdfFileIcon;
                } else if (data.type === ".xlsx") {
                  scrname = XlsFileIcon;
                } else if (data.type === ".doc") {
                  scrname = WordFileIcon;
                }else if (data.type === ".docx") {
                  scrname = WordFileIcon;
                } else if (data.type === ".xls") {
                  scrname = XlsFileIcon;
                } else if (data.type === ".txt") {
                  scrname = TextFileIcon;
                } else if (data.type === ".zip") {
                  scrname = ZippedFileIcon;
                } else if (data.type === ".rar") {
                  scrname = ZippedFileIcon;
                } else if (data.type === ".png") {
                  scrname = ImageFileIcon;
                } else if (data.type === ".jpeg") {
                  scrname = ImageFileIcon;
                }else if (data.type === ".jpg") {
                  scrname = ImageFileIcon;
                } else if (data.type === ".heif") {
                  scrname = ImageFileIcon;
                } else if (data.type === ".ppt") {
                  scrname = PptFileIcon;
                } else if (data.type === ".pptx") {
                  scrname = PptFileIcon;
                }
                else {
                  scrname = DefaultFileIcon;
                }
                return (
                  <tr> 
                    <td>
                      <label className="text-truncate">
                        REQ{data.requestId}
                      </label>
                    </td>
                    <td>
                      <label className="text-truncate">{data.title}</label>
                    </td>
                    <td onClick={this.onDownload.bind(this, data)}>
                      {" "}
                      <label className="text-truncate">
                        {" "}
                        <i>
                          {" "}
                         
                          <i className="text-muted cursor-pointer"  ><img style = {{width:"16px",textAlign:"center"}} src={scrname} /></i>
                        </i>
                        {/* {data.type} */}
                      </label>
                      <label className="text-truncate pl-2">
                        <a href="#">{data.name}</a>
                      </label>
                    </td>
                    {/* <td>
                      <label className="text-truncate">
                        {" "}
                        <i>
                          {" "}
                         
                          <i className="text-muted cursor-pointer"  ><img style = {{width:"20px",textAlign:"center"}} src={scrname} /></i>
                        </i>
                        {/* {data.type} 
                      </label>
                    </td> */}
                    <td>
                      <label className="text-truncate">
                        {moment(data.createdOn).format("Do MMM YYYY")}
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
        </LoadingOverlay>
      </div>
    );
  }
}
export default withGlobalState(DocumentRepository);
