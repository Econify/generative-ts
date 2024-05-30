import type { Body, Endpoint, Headers } from "@typeDefs";

import { AuthStrategy, EndpointStrategy, HeadersStrategy } from "./typeDefs";

export class StaticEndpointStrategy implements EndpointStrategy {
  // eslint-disable-next-line no-empty-function, no-useless-constructor
  constructor(private endpoint: Endpoint) {}

  getEndpoint() {
    return this.endpoint;
  }
}

export class StaticHeadersStrategy implements HeadersStrategy {
  // eslint-disable-next-line no-empty-function, no-useless-constructor
  constructor(private headers: Headers) {}

  getHeaders() {
    return this.headers;
  }
}

export class NoAuthStrategy implements AuthStrategy {
  // eslint-disable-next-line class-methods-use-this
  applyAuth({
    endpoint,
    body,
    headers,
  }: {
    endpoint: Endpoint;
    body: Body;
    headers: Headers;
  }) {
    return { endpoint, body, headers };
  }
}

export class BearerTokenAuthStrategy implements AuthStrategy {
  // eslint-disable-next-line no-empty-function, no-useless-constructor
  constructor(private token: string) {}

  applyAuth({
    endpoint,
    body,
    headers,
  }: {
    endpoint: Endpoint;
    body: Body;
    headers: Headers;
  }) {
    return {
      endpoint,
      body,
      headers: {
        ...headers,
        Authorization: `Bearer ${this.token}`,
      },
    };
  }
}
