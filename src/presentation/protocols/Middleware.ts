import { Http } from "./Http";

export interface Middleware {
  handle(request: Http.Request): Promise<Http.Response>;
}
