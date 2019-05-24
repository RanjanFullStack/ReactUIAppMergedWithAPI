/**
 * Data Service to perform all the operations with APIs for BEATFLOW DATA
 */

/**import start */

import { BFLOWDataService } from './BFLOWDataService'

/**import end */

/**constant start */

export const NotificationsBFLOWDataService = {
    getEventType,
    mapEmailNotifications
};

/**constant end */

/**Transaction Method start */

//Post: Map User with events


async function getEventType() {
    const method = "Notifications/GetEventType" 
    return await BFLOWDataService.get(method);
}

async function mapEmailNotifications(body) {
    const method = "Notifications/MapEmailNotifications"
    return await BFLOWDataService.post(method, body);
}