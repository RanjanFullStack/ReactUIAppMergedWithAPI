
const ApiURL = process.env.REACT_APP_AUTH_URL;
export const AuthService = {
    get,
    post,
    Delete,
    put,
    getbyid

};

function authHeader() {
    return ({
        "Content-Type": "application/json; charset=utf-8",
    });
}
function get(Method) {
    const URL = ApiURL + Method
    const requestOptions = {
        method: 'GET',
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse);
}

function getbyid(Method, Id) {


    const URL = ApiURL + Method + "/" + Id
    const requestOptions = {
        method: 'GET',
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse);
}
function post(body) {
    const URL = ApiURL + "Authentication"
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: body
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse);
}




function Delete(Method, Id) {


    const URL = ApiURL + Method + "/" + Id
    const requestOptions = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },

    };
    return fetch(`${URL}`, requestOptions).then(handleResponse);
}


function put(Method, Id, body) {


    const URL = ApiURL + Method + "/" + Id
    const requestOptions = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: body
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse);
}



function handleResponse(response) {

    let error = {};
    return response.text().then(text => {
        

        const data = text && JSON.parse(text);
        if (data.access_token === null || data.access_token === undefined) {

            return null
        }
        if (!response.ok) {
            error.Code = false;
            error.Message = data;
            return error;

        }

        return data;
    });
}