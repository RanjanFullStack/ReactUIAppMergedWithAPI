/**
 * Generic Service to perform all the operations with APIs
 */

export const GenericRepository = {
    get,
    post,
    Delete,
    put


};
/**
 * header method
 */
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

/**
 * get method
 */
function get(url, isAuthRequired = true) {

    const requestOptions = {
        method: 'GET',
        headers: header()
    };
    return fetch(`${url}`, requestOptions).then(handleResponse);
}

/**
 * post method
 */
function post(url, body, isAuthRequired = true) {
    const requestOptions = {
        method: "POST",
        headers: header(),
        body: body
    };
    return fetch(`${url}`, requestOptions).then(handleResponse);
}

/**
 * delete method
 */
function Delete(url, isAuthRequired = true) {
    const requestOptions = {
        method: "DELETE",
        headers: header(),

    };
    return fetch(`${url}`, requestOptions).then(handleResponse);
}

/**
 * put method
 */
function put(url, body, isAuthRequired = true) {
    const requestOptions = {
        method: "PUT",
        headers: header(),
        body: body
    };
    return fetch(`${url}`, requestOptions).then(handleResponse);
}

/**
 * handle method
 */
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

