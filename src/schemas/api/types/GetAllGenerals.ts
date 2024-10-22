import type { GeneralSummary } from "./GeneralSummary";

 /**
 * @description OK - Successful request with response body
*/
export type GetAllGenerals200 = {
    /**
     * @type array
    */
    data: GeneralSummary[];
};

 /**
 * @description The request was successful, but there is no content to return in the response.
*/
export type GetAllGenerals204 = null;

 /**
 * @description The server could not understand the request due to invalid syntax. The client should modify the request and try again.
*/
export type GetAllGenerals400 = {
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
 * @description The server encountered an unexpected condition that prevented it from fulfilling the request. Report the issue to the support team if it persists.
*/
export type GetAllGenerals500 = {
    /**
     * @type string
    */
    message: string;
};

 /**
 * @description OK - Successful request with response body
*/
export type GetAllGeneralsQueryResponse = {
    /**
     * @type array
    */
    data: GeneralSummary[];
};

 export type GetAllGeneralsQuery = {
    Response: GetAllGeneralsQueryResponse;
    Errors: GetAllGenerals400 | GetAllGenerals500;
};