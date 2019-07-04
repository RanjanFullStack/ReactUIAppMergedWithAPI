/**
 * Data Service to perform all the operations with APIs for BEATFLOW DATA
 */

/**import start */

import { GenericRepository } from './GenericRepository'

/**import end */


/**constant start */

const ApiURL = process.env.REACT_APP_API_URL;

export const BFLOWDataService = {
    get,
    post,
    Delete,
    put,
    getbyid,
    logout,
    login

};
/**constant end */


/**Transaction Method start */

async function get(method) {
   
    const url = ApiURL + method
  
    return await GenericRepository.get(url);
}

async function getbyid(method, Id) {
   
    const url = ApiURL + method + "/" + Id
  
    return await GenericRepository.get(url);
}

async function post(method, body) {
    const url = ApiURL + method
    return await GenericRepository.post(url, body);

}

async function Delete(method, Id) {
    const url = ApiURL + method + "/" + Id
    return await GenericRepository.Delete(url);
}

async function put(method, Id, body) {
    const url = ApiURL + method + "/" + Id
    return await GenericRepository.put(url, body);
}
async function logout() {
    const url = ApiURL + "Users/Logout"
    return await GenericRepository.put(url,"");
}
async function login() {
    const url = ApiURL + "Users/Login"
    return await GenericRepository.put(url,"");
}

/**Transaction Method end */