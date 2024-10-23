import type { GetAllGenerals200, GetAllGenerals204, GetAllGenerals400, GetAllGenerals500, GetAllGeneralsQueryResponse } from "../types/GetAllGenerals";
import { generalSummarySchema } from "./generalSummarySchema";
import { z } from "zod";

 /**
 * @description OK - Successful request with response body
 */
export const getAllGenerals200Schema = z.object({ "data": z.array(z.lazy(() => generalSummarySchema)) }) as z.ZodType<GetAllGenerals200>;

 export type GetAllGenerals200Schema = z.infer<typeof getAllGenerals200Schema>;

 /**
 * @description The request was successful, but there is no content to return in the response.
 */
export const getAllGenerals204Schema = z.null() as z.ZodType<GetAllGenerals204>;

 export type GetAllGenerals204Schema = z.infer<typeof getAllGenerals204Schema>;

 /**
 * @description The server could not understand the request due to invalid syntax. The client should modify the request and try again.
 */
export const getAllGenerals400Schema = z.object({ "errors": z.array(z.object({ "message": z.string() })).optional(), "message": z.string() }) as z.ZodType<GetAllGenerals400>;

 export type GetAllGenerals400Schema = z.infer<typeof getAllGenerals400Schema>;

 /**
 * @description The server encountered an unexpected condition that prevented it from fulfilling the request. Report the issue to the support team if it persists.
 */
export const getAllGenerals500Schema = z.object({ "message": z.string() }) as z.ZodType<GetAllGenerals500>;

 export type GetAllGenerals500Schema = z.infer<typeof getAllGenerals500Schema>;

 /**
 * @description OK - Successful request with response body
 */
export const getAllGeneralsQueryResponseSchema = z.object({ "data": z.array(z.lazy(() => generalSummarySchema)) }) as z.ZodType<GetAllGeneralsQueryResponse>;

 export type GetAllGeneralsQueryResponseSchema = z.infer<typeof getAllGeneralsQueryResponseSchema>;