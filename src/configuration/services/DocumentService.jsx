const ApiURL = process.env.REACT_APP_DOCUMENT_URL + "Document/";
let token = "";
export const DocumentService = {
    POST,
    Upload,
    Get,
    GetAll,
    DocumentSearch,
    Delete
};

/**
 * header method
 */
function headerWithPlaintext() {
    token = localStorage.getItem("Token");
    const TokenExpiry = localStorage.getItem("TokenExpiry");
    const CurrentDateTime = new Date();
    if (token === null || token === undefined || TokenExpiry ===undefined || CurrentDateTime >= Date.parse(TokenExpiry)) {
        
        let url =process.env.REACT_APP_Logout_Url;
        window.location.href = (url);
    }
    return ({

        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token
    });

}

function headerToken() {
    
        token = localStorage.getItem("Token");
        const TokenExpiry = localStorage.getItem("TokenExpiry");
        const CurrentDateTime = new Date();
        if (token === null || token === undefined || TokenExpiry ===undefined || CurrentDateTime >= Date.parse(TokenExpiry)) {
            
            let url =process.env.REACT_APP_Logout_Url;
            window.location.href = (url);
        }
        return ({
            'Authorization': token
        });
    
    }
    

function POST(formData) {
    

    const URL = ApiURL
    const requestOptions = {
        method: 'POST',
        headers: headerToken(),
        body: formData
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse);
}

function Get(fileUrl,filename) {
   
    const URL = ApiURL + "?fileName="+ fileUrl
  
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': token
        }
    };
    return fetch(`${URL}`, requestOptions)
    .then(response => {
  
        return response.blob();
    }).then(res => {

                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                const fileURL = window.URL.createObjectURL(res);
                //window.open(fileURL);
                a.href = fileURL;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(fileURL);
      
            }); 
    
}


function GetAll(files) {
   
   
    const URL = ApiURL+"DownloadAll"
    
    const requestOptions = {
        method: 'POST',
        headers: headerWithPlaintext(),
        body: JSON.stringify(files),
    };
    return fetch(`${URL}`, requestOptions)
    .then(response => {
    
        return response.blob();
    }).then(res => {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        const fileURL = window.URL.createObjectURL(res);
        //window.open(fileURL);
        a.href = fileURL;
        a.download = "RecentFiles"
        a.click();
        window.URL.revokeObjectURL(fileURL);
    });

    
}

function Upload(body) {
    
    const URL = ApiURL+"Upload" 
    const requestOptions = {
        method: 'POST',
        headers: headerWithPlaintext(),
        body: body
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse)
  
    
}

function DocumentSearch(keyWord) {
    const URL = ApiURL + "DocumentSearch/" + keyWord
    const requestOptions = {
        method: 'POST',
        headers: headerToken()
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse);
}

function Delete(body) {
    
    const URL = ApiURL + "DeleteDoc"
    const requestOptions = {
        method: 'POST',
        headers: headerWithPlaintext(),
        body: body 
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
   
    let error = {};
    return response.text().then(text => {
        const data = text && JSON.parse(text);

        if (!response.ok) {
            error.Code = false;
            error.Message = data;
            return error;

        }
  
        return data;
    });
}