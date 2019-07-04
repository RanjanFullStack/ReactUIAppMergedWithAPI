import React, { Component } from "react";
import { withGlobalState } from "react-globally";
import { BFLOWDataService } from "../../configuration/services/BFLOWDataService";
import { DocumentService } from "../../configuration/services/DocumentService";
import moment from "moment";
import DefaultFileIcon from "../../assets/fonts/Filetype_icons/FILE.svg";
import PdfFileIcon from "../../assets/fonts/Filetype_icons/PDF.svg";
import ImageFileIcon from "../../assets/fonts/Filetype_icons/IMAGE.svg";
import PptFileIcon from "../../assets/fonts/Filetype_icons/PPT.svg";
import TextFileIcon from "../../assets/fonts/Filetype_icons/TEXT.svg";
import WordFileIcon from "../../assets/fonts/Filetype_icons/WORD.svg";
import XlsFileIcon from "../../assets/fonts/Filetype_icons/XLS.svg";
import ZippedFileIcon from "../../assets/fonts/Filetype_icons/ZIPPED_FILE.svg";
import Filter from "../../assets/fonts/filter.svg";
import LoadingOverlay from "react-loading-overlay";
import ContentLoader, { Facebook } from "react-content-loader";
import InfiniteScroll from "react-infinite-scroll-component";

let searchText = "";
let updatedSearchList = [];
let offSetIncreementer = 0;
let pageFeedIncremeneter = 1;

class DocumentRepository extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      documentsData: [],
      AlldocumentsData: [],
      documentSearchData: [],
      _documentsDatafidder:[],
      hasnext:true,
    };
    this.GetDocumentsData = this.GetDocumentsData.bind(this);
    this.onDownload = this.onDownload.bind(this);
    this.search = this.search.bind(this);
  }

  async componentDidMount() {
    this.GetDocumentsData();
     offSetIncreementer = 0;
 pageFeedIncremeneter = 1;
  }
  componentWillReceiveProps(nextProps) {
    offSetIncreementer = 0;
    pageFeedIncremeneter = 1;
  }

  async onDownload(file) {
    ;
    const attachment = await DocumentService.Get(file.path, file.name);
  }

  skipandNext(a, n) {
    var current = 0,
        l = a.length;
    return function() {
      var  end = current + n;
        var part = a.slice(current,end);
        current =  end < l ? end : 0;
        return part;
    };
};

  fetchMoreData = () => {
    debugger
    var fidderdata=[];
    let offset = 15;
    let page = 15;
    offset = offset * offSetIncreementer;
    page = page * pageFeedIncremeneter;
    
    offSetIncreementer++;
    pageFeedIncremeneter++;
    for (let index = offset; index < this.state.AlldocumentsData.length; index++) {
     
      if(page >= index+1){
        fidderdata=fidderdata.concat(this.state.AlldocumentsData[index]);
      }
      
    }

   
    setTimeout(() => {
      this.setState({
        documentsData: this.state.documentsData.concat(fidderdata)
      });
    }, 1500);
   
    setTimeout(() => {
      debugger
    var AlldocumentsData=this.state.AlldocumentsData.length;
    var documentsData=this.state.documentsData.length;
    if(AlldocumentsData===documentsData){
this.setState({hasnext:false})
    }
 
}, 2000);
  };



  async GetDocumentsData() {
    debugger
    let offset = 15;
    let page = 15;
    const body = JSON.stringify({ title: "DocumentRepository" });
    const responseJson = await BFLOWDataService.post("Report", body);
  
    this.setState({
      AlldocumentsData: responseJson.DocumentRepository.Results,
      _documentsDatafidder:responseJson.DocumentRepository.Results,
    });
    offset = offset * offSetIncreementer;
    page = page * pageFeedIncremeneter;
    debugger
    offSetIncreementer++;
    pageFeedIncremeneter++;
    debugger
    var fidderdata= [];

    for (let index = offset; index < responseJson.DocumentRepository.Results.length; index++) {
     
      if(page >= index+1){
        fidderdata=fidderdata.concat(responseJson.DocumentRepository.Results[index]);
      }
      
    }
    debugger
    this.setState({ documentsData: fidderdata });

    if(this.state.AlldocumentsData.length===this.state.documentsData.length){
      this.setState({hasnext:false})
          }
  }

  getSearchText(event){
    if (event.target.value !== undefined) {
      searchText = event.target.value.toLowerCase();
    }
  }

  search() {
   debugger
    if (searchText !== "") {
      updatedSearchList = this.state._documentsDatafidder;
      let createdOn = null;
      updatedSearchList = updatedSearchList.filter(function(item) {
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
      //this.setState({ documentsData: updatedList });
    } else {
      this.setState({ documentsData: this.state._documentsDatafidder });
    }
  }    

  async lucenesearch(event) {
    debugger
    offSetIncreementer=0;
    pageFeedIncremeneter=1;
    let offset = 15;
    let page = 15;
    offset = offset * offSetIncreementer;
    page = page * pageFeedIncremeneter;

    offSetIncreementer++;
    pageFeedIncremeneter++;
    this.search()
    // if (event.target.value !== undefined) {
    //   searchText = event.target.value.toLowerCase();
    // }
    if (searchText !== "") {

      if (searchText.length < 3) {
        this.setState({ documentsData: this.state.AlldocumentsData });
      }

      if (searchText.length > 2) {
        const attachment = await DocumentService.DocumentSearch(searchText);
        ;

        if (attachment < 1) {
          this.setState({ documentsData: [] });
        }

        if (attachment !== null) {
          {
            attachment.map(data => {
              debugger
              var test=this.state._documentsDatafidder;
              var filename;
              var value = test.filter(
                item => item.path.replace(/^.*[\\\/]/, '') === data[0].fileName
              );
              debugger
              value.forEach(element => {
                if (element !== null) {
                  var data = {
                    createdOn: element.createdOn,
                    name: element.name,
                    path: element.path,
                    requestId: element.requestId,
                    title: element.title,
                    type: element.type
                  };
                  updatedSearchList.push(data);
                }
              });
            });
          }
          debugger
          if (updatedSearchList.length > 0) {
            var fidderdata= [];

            for (let index = offset; index < updatedSearchList.length; index++) {
             
              if(page >= index+1){
                fidderdata=fidderdata.concat(updatedSearchList[index]);
              }
              
            }
            setTimeout(
              function() {
                debugger
                this.setState({ documentsData: fidderdata ,AlldocumentsData:updatedSearchList});
                if(updatedSearchList.length===this.state.documentsData.length){
                  this.setState({hasnext:false})
                      }
              }.bind(this),
              200
            );
          }
          else{
            this.setState({ documentsData: updatedSearchList ,AlldocumentsData:updatedSearchList,hasnext:false});
          }
        }
      }
    } else {

      
      debugger

      var fidderdata= [];
      this.setState({ documentsData: []})

      for (let i = offset; i < this.state._documentsDatafidder.length; i++) {
       
        if(page >= i+1){
          fidderdata=fidderdata.concat(this.state._documentsDatafidder[i]);
        }
        
      }
      debugger
      this.setState({ documentsData: fidderdata,AlldocumentsData: this.state._documentsDatafidder  });
  
      if(this.state._documentsDatafidder.length===fidderdata.length){
        this.setState({hasnext:false})
            }
            else{
              this.setState({hasnext:true})
            }
   
    }
  }

  
  _handleKeyDown = e => {
    ;
    if (e.key === "Enter") {
      this.lucenesearch(e);
    }
  };

  render() {
    const Loader = () => (
      <ContentLoader 
      height={400}
      width={600}
      speed={1}
      primaryColor="#f3f3f3"
      secondaryColor="#ecebeb"
    >
      <rect x="5" y="10" rx="4" ry="4" width="117" height="14" /> 
      <rect x="156" y="10" rx="4" ry="4" width="117" height="14" /> 
      <rect x="310" y="10" rx="4" ry="4" width="143" height="14" /> 
      <rect x="478" y="10" rx="4" ry="4" width="117" height="14" /> 
      <rect x="5" y="50" rx="4" ry="4" width="117" height="10" /> 
      <rect x="310" y="50" rx="4" ry="4" width="143" height="10" /> 
      <rect x="478" y="50" rx="4" ry="4" width="117" height="10" /> 
      <rect x="156" y="50" rx="4" ry="4" width="117" height="10" /> 
      <rect x="5" y="80" rx="4" ry="4" width="117" height="10" /> 
      <rect x="310" y="80" rx="4" ry="4" width="143" height="10" /> 
      <rect x="478" y="80" rx="4" ry="4" width="117" height="10" /> 
      <rect x="156" y="80" rx="4" ry="4" width="117" height="10" />
    </ContentLoader>
    );

    const DocumentLoader = () => (
      <div class="list-card-Loading">
        <div class="p-2">
          <Loader />
        </div>
       
      </div>
    );
    
    let DocRepo;
    if (this.state.documentsData.length > 0) {
      DocRepo = ( <tr>
        <th
          style={{
            width: "9%",
            paddingTop: "18px",
            height: "20px",
            fontWeight: "700",
            color: "#55565A",
            borderTop: "0px",
            borderBottom: "1px solid #dee2e6 "
          }}
        >
          Request Id
        </th>
        <th
          style={{
            width: "9%",
            paddingTop: "18px",
            fontWeight: "700",
            color: "#55565A",
            borderTop: "0px",
            borderBottom: "1px solid #dee2e6 "
          }}
        >
          Title
        </th>
        <th
          style={{
            width: "9%",
            paddingTop: "18px",
            fontWeight: "700",
            color: "#55565A",
            borderTop: "0px",
            borderBottom: "1px solid #dee2e6 "
          }}
        >
          Document Name
        </th>
        <th
          style={{
            width: "9%",
            paddingTop: "18px",
            fontWeight: "700",
            color: "#55565A",
            borderTop: "0px",
            borderBottom: "1px solid #dee2e6 "
          }}
        >
          Uploaded Date
        </th>
      </tr>);
    } else {
      DocRepo = <tr         
       style={{
        width: "9%",
        paddingTop: "18px",
        fontWeight: "700",
        color: "#55565A",
        borderTop: "0px",
        borderBottom: "1px solid #dee2e6 "
      }}><center>No Records Found</center></tr>;
    }
    return (
      <div
        class="card-body list-card-document"
        style={{
          backgroundColor: "#FAFAFB",
          padding: ".05rem!important",
          margin: "30px"
        }}
      >
  
          <div className="w-100  mt-0 Documentserch">
            {/* <div class="input-group Documentserch border-0 shadow-sm">
            {/* <input
              placeholder="Search"
              onChange={this.search.bind(this)}
              aria-describedby="inputGroupPrepend"
              name="username"
              type="text"
              class="search-textbox rounded-3  pt-1 bg-white search-icon-border border-right-0"
           style={{width:"96.67%",borderTop:"1px solid #dee2e6",borderLeft:"0px solid #dee2e6",borderBottom:"1px solid #dee2e6" ,borderRadius:"30px"}}
            />
               <i class="fa fa-search text-muted " aria-hidden="true" /> */}
            {/* <div class="input-group-prepend ">
              <span
                class="search-icon input-group-text bg-white border-left-0 border-right-0"
                id="inputGroupPrepend"
              >
                <i class="fa fa-search text-muted " aria-hidden="true" />
              </span>
            </div> 

            
          </div> */}

<div class="input-group search-outline">

<input
                type="text"
                placeholder="Start typing to search (min 3 characters)"
                onKeyDown={this._handleKeyDown.bind(this)}
                onChange={this.getSearchText.bind(this)}
                class="rounded-3 pt-1 bg-white  border-right-0"
                style={{
                  width: "92%",
                  height: "48px",
                  borderTop: "1px solid rgb(222, 226, 230)",
                  borderLeft: "1px solid rgb(222, 226, 230)",
                  borderBottom: "1px solid rgb(222, 226, 230)",
                  borderRadius: "30px",
                  paddingLeft: "20px",
                  paddingRight: "50px",
                  borderRight: "0px!important"
                }}
                ref={node => {
                  if (node) {
                    node.style.setProperty(
                      "border-Bottom-Right-Radius",
                      "0px ",
                      "important"
                    );
                    node.style.setProperty(
                      "border-top-Right-Radius",
                      "0px ",
                      "important"
                    );
                    node.style.setProperty("outline", "0 ", "important");
                  }
                }}
              />
<span
                class="search-icon input-group-text bg-white border-right-0 border-left-0 border-bottom-0 border-top-0 cursor-pointer"
                id="inputGroupPrepend"
                onClick={this.lucenesearch.bind(this)}
                style={{ borderRadius: "30px" }}
                ref={node => {
                  if (node) {
                    node.style.setProperty(
                      "border-Bottom-Left-Radius",
                      "0px ",
                      "important"
                    );
                    node.style.setProperty(
                      "border-top-Left-Radius",
                      "0px ",
                      "important"
                    );
                    node.style.setProperty(
                      "border",
                      "1px solid rgb(222, 226, 230)",
                      "important"
                    );
                    node.style.setProperty(
                      "border-Left",
                      "0px solid rgb(222, 226, 230)",
                      "important"
                    );
                  }
                }}
              >
<i
     class="fa fa-search "
     style={{
       // position: "absolute",
       // zindex: "5",
       float:"right!important",
       // left: "1130px",
       // marginTop: "13px"
     }}
   />
</span>

{/* <div class="input-group-append">
 <span>
   <i
     class="fa fa-search "
     style={{
       position: "absolute",
       zindex: "5",
       left: "1130px",
       marginTop: "13px"
     }}
   />
 </span>
</div> */}
<div style={{ paddingLeft: "20px" }} />
<div
 style={{
   backgroundColor: "#dedfe0",
   width: "1px",
   height: "40px"
 }}
/>
<i
 className="text-muted cursor-pointer "
 style={{
   color: "#012b54",
   width: "12px",
   height: "16px",
   paddingLeft: "20px",
   paddingTop: "8px"
 }}
>
 <img src={Filter} />
</i>

</div>           
            <div >         {this.props.globalState.IsLoadingActive ? (
                <DocumentLoader />
              ) : (
                <div  id="scrollableDiv"  className="scrollbar list-card-document border-0 shadow-sm mt-4">
                   <InfiniteScroll
            dataLength={this.state.AlldocumentsData.length}
            next={this.fetchMoreData}
            hasMore={this.state.hasnext}
            loader={ <ContentLoader 
              height={50}
              width={600}
              speed={1}
              primaryColor="#f3f3f3"
              secondaryColor="#ecebeb"
            >
              <rect x="5" y="10" rx="4" ry="4" width="117" height="14" /> 
              <rect x="156" y="10" rx="4" ry="4" width="117" height="14" /> 
              <rect x="310" y="10" rx="4" ry="4" width="143" height="14" /> 
              <rect x="478" y="10" rx="4" ry="4" width="117" height="14" /> 
              <rect x="5" y="50" rx="4" ry="4" width="117" height="10" /> 
              <rect x="310" y="50" rx="4" ry="4" width="143" height="10" /> 
              <rect x="478" y="50" rx="4" ry="4" width="117" height="10" /> 
              <rect x="156" y="50" rx="4" ry="4" width="117" height="10" /> 
             
            </ContentLoader>}
            scrollableTarget="scrollableDiv"
          >
              <table
                class="table bg-white table-sm pt-3"
                style={{ borderTop: "0px" }}
              >  
                <thead>
                  {DocRepo}
                </thead>
           <tbody>
          
                  {this.state.documentsData.map((data, key) => {
                    var scrname = "";
                    if (data.type === ".pdf") {
                      scrname = PdfFileIcon;
                    } else if (data.type === ".xlsx") {
                      scrname = XlsFileIcon;
                    } else if (data.type === ".csv") {
                      scrname = XlsFileIcon;
                    } else if (data.type === ".doc") {
                      scrname = WordFileIcon;
                    } else if (data.type === ".docx") {
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
                    } else if (data.type === ".jpg") {
                      scrname = ImageFileIcon;
                    } else if (data.type === ".heif") {
                      scrname = ImageFileIcon;
                    } else if (data.type === ".ppt") {
                      scrname = PptFileIcon;
                    } else if (data.type === ".pptx") {
                      scrname = PptFileIcon;
                    } else {
                      scrname = DefaultFileIcon;
                    }
                    return (
                      
                      <tr>
           
                        <td className="pt-1 pl-2">
                          <label className="text-truncate">
                            REQ{data.requestId}
                          </label>
                        </td>
                        <td className="pt-1 pl-2">
                          <label className="text-truncate">{data.title}</label>
                        </td>
                        <td
                          className="pt-1 pl-2"
                          onClick={this.onDownload.bind(this, data)}
                        >
                          {" "}
                          <label className="text-truncate">
                            {" "}
                            <i>
                              {" "}
                              <i className="text-muted cursor-pointer">
                                <img
                                  style={{ width: "16px", textAlign: "center" }}
                                  src={scrname}
                                />
                              </i>
                            </i>
                            {/* {data.type} */}
                          </label>
                          <label className="text-truncate pl-2 ">
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
                        <td className="pt-1 pl-2">
                          <label className="text-truncate">
                            {moment(data.createdOn).format("Do MMM YYYY")}
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table></InfiniteScroll> </div>)}
            </div>
          </div>
        
      </div>
    );
  }
}
export default withGlobalState(DocumentRepository);
