import type { General } from "./General";

 export type GetAGeneralByNamePathParams = {
    /**
     * @type string
    */
    name: string;
};

 export type GetAGeneralByNameQueryParams = {
    /**
     * @description return verbose results
     * @type boolean | undefined
    */
    verbose?: boolean;
    /**
     * @description set the level of the general you want information about
     * @type integer | undefined
    */
    level?: number;
};

 /**
 * @description OK - Successful request with response body
*/
export type GetAGeneralByName200 = {
    /**
     * @type object
    */
    data: General;
};

 /**
 * @description The server could not understand the request due to invalid syntax. The client should modify the request and try again.
*/
export type GetAGeneralByName400 = {
    /**
     * @type array | undefined
    */
    errors?: {
        /**
         * @type string
        */
        message: string;
    }[];
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description The server cannot find the requested resource. The endpoint may be invalid or the resource may no longer exist.
*/
export type GetAGeneralByName404 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description The server encountered an unexpected condition that prevented it from fulfilling the request. Report the issue to the support team if it persists.
*/
export type GetAGeneralByName500 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description OK - Successful request with response body
*/
export type GetAGeneralByNameQueryResponse = {
    /**
     * @type object
    */
    data: General;
};

 export type GetAGeneralByNameQuery = {
    Response: GetAGeneralByNameQueryResponse;
    PathParams: GetAGeneralByNamePathParams;
    QueryParams: GetAGeneralByNameQueryParams;
    Errors: GetAGeneralByName400 | GetAGeneralByName404 | GetAGeneralByName500;
};