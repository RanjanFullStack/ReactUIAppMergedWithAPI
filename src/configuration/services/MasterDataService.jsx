/**
 * Data Service to perform all the operations with APIs for BEATFLOW DATA
 */

/**import start */

import { BFLOWDataService } from './BFLOWDataService'

/**import end */


/**constant start */
export const MasterBFLOWDataService = {
    getByMasterId,
    getByAttributesId,
    getMasters,
    mapUserWithAttributes,
    getMasterMapMaster,
    mapMasterWithMaster,
    mapAttributesWithAttributes
};

/**constant end */

/**Transaction Method start */

//Get: Attributes Values Based On Master Id
async function getByMasterId(masterId) {
    const method = "Attributes/GetByMasterId/" + masterId
    return await BFLOWDataService.get(method);
}

//Get: Attributes Values Based On Master Id
async function getMasters() {
    const method = "masters/GetMaster"
    return await BFLOWDataService.get(method);
}

//Post: Map Users with Attributes
async function mapUserWithAttributes(body) {
    const method = "Attributes/MapUsers"
    return await BFLOWDataService.post(method, body);
}

//Get: Get KeyValue based on AttributeId
async function getByAttributesId(attributeId) {
    const method = "MasterKeyValue/GetByAttributesId/" + attributeId
    return await BFLOWDataService.get(method);
}

//Get: Get Masters with Masters mapping
async function getMasterMapMaster(masterId) {
    const method = "Masters/GetMapMaster/" + masterId
    return await BFLOWDataService.get(method);
}

//Post: Map Masters with Masters
async function mapMasterWithMaster(id, body) {
    const method = "Masters/MapMaster/" + id
    return await BFLOWDataService.post(method, body);
}

//Post: Map Attribute with Attribute
async function mapAttributesWithAttributes(body) {
    const method = "Attributes/MapAttribute/"
    return await BFLOWDataService.post(method, body);
}

/**Transaction Method end */