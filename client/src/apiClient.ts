import {createHttpClient} from "http-schemas/client";
import {pollsApiSchema} from "api-schema";

const host = window.location.host;
const isLocal = host.includes('localhost');

const baseURL = isLocal ? `http://${host}/api` : `/api`;

export const apiClient = createHttpClient(pollsApiSchema, { baseURL });

// for some reason the CRA compiler is complaining about this
// export const isPollResponse = (p: Poll | ErrorBody): p is Poll => {
//   return !!(p as Poll).id;
// }
