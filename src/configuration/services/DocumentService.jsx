const ApiURL = process.env.REACT_APP_DOCUMENT_URL + "Document/";
export const DocumentService = {
    POST,
    Upload,
    Get,
    GetAll
};


function POST(formData) {
     
    const URL = ApiURL
    const requestOptions = {
        method: 'POST',
        body: formData
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse);
}

function Get(fileUrl,filename) {
   
    const URL = ApiURL + "?fileName="+ fileUrl
  
    const requestOptions = {
        method: 'GET',
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
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
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
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: body
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse)
  
    
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