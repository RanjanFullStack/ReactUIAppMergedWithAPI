/**
 * Data Service to perform all the operations with APIs for BEATFLOW DATA
 */

/**import start */

import { BFLOWDataService } from './BFLOWDataService'

/**import end */

/**constant start */
export const RequestDataService = {
    getMasterMapping,
    getLinkedRequestById,
    getRequestList

};
/**constant end */

/**Transaction Method start */
//Get: Master  to Master Mapping with Attribute
async function getMasterMapping(id) {
    const method = "Request/GetMasterMapping/"+id
    return await BFLOWDataService.get(method);
}

//Get: Master  to Master Mapping with Attribute
async function getRequestList() {
    const method = "Request/GetRequestList"
    return await BFLOWDataService.get(method);
}

//Get: Linked Request By Id
async function getLinkedRequestById(id) {
    const method = "Request/GetLinkedRequestById/"+id
    return await BFLOWDataService.get(method);
}
/**Transaction Method end */