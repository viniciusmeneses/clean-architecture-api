export namespace Http {
  export interface Request<Body = any, UrlParams = any, UrlQuery = any> {
    body?: Body;
    url?: {
      params: UrlParams;
      query: UrlQuery;
    };
  }

  export interface Response {
    status: number;
    body?: any;
  }
}
