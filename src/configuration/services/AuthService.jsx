
const ApiURL = process.env.REACT_APP_AUTH_URL;
export const AuthService = {
    get,
    post,
    Delete,
    put,
    getbyid,
    changePassword,
    resetPassword,
    forgotPassword
};

function header() {

    const token = localStorage.getItem("Token");
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
function changePassword(body) {
    const URL = ApiURL + "User/ChangePassword"
    const requestOptions = {
        method: "POST",
        headers: header(),
        body: body
    };
    return fetch(`${URL}`, requestOptions).then(handleResponse);
}
function resetPassword(body) {
    const URL = ApiURL + "User/ResetPassword"
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
function forgotPassword(body) {
    const URL = ApiURL + "User/ForgotPassword"
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
        if (!response.ok) {
            error.Code = false;
            error.Message = data;
            return error;

        }

        return data;
    });
}