/**
 * Data Service to perform all the operations with APIs for BEATFLOW DATA
 */

/**import start */

import { BFLOWDataService } from './BFLOWDataService'

/**import end */

/**constant start */

export const EventBFLOWDataService = {
    mapUserWithEvents,
    mapUserWithEventsById,
    getEventWorkFlowForRequest
};

/**constant end */

/**Transaction Method start */

//Post: Map User with events
async function mapUserWithEvents(body) {
    const method = "Event/MapEventWorkFlow"
    return await BFLOWDataService.post(method, body);
}

//Get: Map User with event by Id
async function mapUserWithEventsById(id) {
    const method = "Event/GetEventWorkFlow/" + id
    return await BFLOWDataService.get(method);
}

//Get: Map User with event by Id
async function getEventWorkFlowForRequest(id) {
    const method = "Event/GetEventWorkFlowForRequest/" + id
    return await BFLOWDataService.get(method);
}

/**Transaction Method end */