/**
 * Data Service to perform all the operations with APIs for BEATFLOW DATA
 */

/**import start */

import { BFLOWDataService } from './BFLOWDataService'
/**import end */

/**constant start */
export const RoleBFLOWDataService = {
    mapUserWithRoles,
    getUserRoles,
    getUserAccessibility
};
/**constant end */

/**Transaction Method start */

//Post: Map Users with Roles
async function mapUserWithRoles(body) {
    const method = "Role/MapUsers"
    return await BFLOWDataService.post(method, body);
}

//get: get  Users with Roles
async function getUserRoles() {
    const method = "Users/UserRoles"
    return await BFLOWDataService.get(method);
}

//get: get the user accessbality based on user mapping
function getUserAccessibility(availabelFeatures, featureGroupName, feature)
{
   if(availabelFeatures.length > 0 && availabelFeatures.filter(x=> x.featureGroupName === featureGroupName && x.feature === feature).length > 0)
   {
       return true;
   }
   return false;

}



/**Transaction Method end */