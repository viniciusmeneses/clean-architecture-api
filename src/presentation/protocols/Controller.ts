import { Http } from "./Http";

export interface Controller {
  handle(request: Http.Request): Promise<Http.Response>;
}
