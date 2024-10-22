import type { GetAGeneralByNamePathParams, GetAGeneralByNameQueryParams, GetAGeneralByName200, GetAGeneralByName400, GetAGeneralByName404, GetAGeneralByName500, GetAGeneralByNameQueryResponse } from "../../../../types/GetAGeneralByName";
import { generalSchema } from "./generalSchema";
import { z } from "zod";

 export const getAGeneralByNamePathParamsSchema = z.object({ "name": z.string() }) as z.ZodType<GetAGeneralByNamePathParams>;

 export type GetAGeneralByNamePathParamsSchema = z.infer<typeof getAGeneralByNamePathParamsSchema>;

 export const getAGeneralByNameQueryParamsSchema = z.object({ "verbose": z.boolean().describe("return verbose results").optional(), "level": z.number().int().describe("set the level of the general you want information about").optional() }).optional() as z.ZodType<GetAGeneralByNameQueryParams>;

 export type GetAGeneralByNameQueryParamsSchema = z.infer<typeof getAGeneralByNameQueryParamsSchema>;

 /**
 * @description OK - Successful request with response body
 */
export const getAGeneralByName200Schema = z.object({ "data": z.lazy(() => generalSchema) }) as z.ZodType<GetAGeneralByName200>;

 export type GetAGeneralByName200Schema = z.infer<typeof getAGeneralByName200Schema>;

 /**
 * @description The server could not understand the request due to invalid syntax. The client should modify the request and try again.
 */
export const getAGeneralByName400Schema = z.object({ "errors": z.array(z.object({ "message": z.string() })).optional(), "message": z.string() }) as z.ZodType<GetAGeneralByName400>;

 export type GetAGeneralByName400Schema = z.infer<typeof getAGeneralByName400Schema>;

 /**
 * @description The server cannot find the requested resource. The endpoint may be invalid or the resource may no longer exist.
 */
export const getAGeneralByName404Schema = z.object({ "message": z.string() }) as z.ZodType<GetAGeneralByName404>;

 export type GetAGeneralByName404Schema = z.infer<typeof getAGeneralByName404Schema>;

 /**
 * @description The server encountered an unexpected condition that prevented it from fulfilling the request. Report the issue to the support team if it persists.
 */
export const getAGeneralByName500Schema = z.object({ "message": z.string() }) as z.ZodType<GetAGeneralByName500>;

 export type GetAGeneralByName500Schema = z.infer<typeof getAGeneralByName500Schema>;

 /**
 * @description OK - Successful request with response body
 */
export const getAGeneralByNameQueryResponseSchema = z.object({ "data": z.lazy(() => generalSchema) }) as z.ZodType<GetAGeneralByNameQueryResponse>;

 export type GetAGeneralByNameQueryResponseSchema = z.infer<typeof getAGeneralByNameQueryResponseSchema>;