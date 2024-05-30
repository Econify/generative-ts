import type { ModelApi } from "@typeDefs";

import {
  BearerTokenAuthStrategy,
  StaticEndpointStrategy,
  StaticHeadersStrategy,
} from "./strategies";

import { HttpModelProvider } from "./httpModelProvider";

jest.mock("../../utils/httpClient");

describe("HttpModelProvider", () => {
  const mockApi = {
    requestTemplate: {
      render: jest.fn(),
    },
    responseGuard: jest.fn().mockReturnValue(true),
  };

  const mockClient = {
    post: jest.fn(),
  };

  const mockModelId = "mock-model-id";
  const mockEndpoint = "https://api.example.com";
  const mockHeaders = { "x-mock-header": "mock-header-value" };
  const mockBody = "mock-request-body";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendRequest", () => {
    it("should correctly process the request with defaults", async () => {
      // arrange
      const provider = new HttpModelProvider({
        api: mockApi as unknown as ModelApi,
        config: {
          modelId: mockModelId,
        },
        client: mockClient,
        endpoint: mockEndpoint,
      });

      mockApi.requestTemplate.render.mockReturnValue(mockBody);

      // act
      await provider.sendRequest({ prompt: "Hello, world!" });

      // assert
      expect(mockClient.post).toHaveBeenCalledWith(mockEndpoint, mockBody, {
        "Content-Type": "application/json",
      });
    });

    it("should correctly process the request with explicit values", async () => {
      // arrange
      const provider = new HttpModelProvider({
        api: mockApi as unknown as ModelApi,
        config: {
          modelId: mockModelId,
        },
        client: mockClient,
        endpoint: mockEndpoint,
        headers: mockHeaders,
      });

      mockApi.requestTemplate.render.mockReturnValue(mockBody);

      // act
      await provider.sendRequest({ prompt: "Hello, world!" });

      // assert
      expect(mockClient.post).toHaveBeenCalledWith(
        mockEndpoint,
        mockBody,
        mockHeaders,
      );
    });

    it("should correctly process the request with strategies", async () => {
      // TODO should use mock strategies here and test individual strategies elsewhere
      // arrange
      const endpointStrategy = new StaticEndpointStrategy(mockEndpoint);
      const headersStrategy = new StaticHeadersStrategy(mockHeaders);
      const authStrategy = new BearerTokenAuthStrategy("mock-bearer-token");

      const provider = new HttpModelProvider({
        api: mockApi as unknown as ModelApi,
        config: {
          modelId: mockModelId,
        },
        client: mockClient,
        endpoint: endpointStrategy,
        headers: headersStrategy,
        auth: authStrategy,
      });

      mockApi.requestTemplate.render.mockReturnValue(mockBody);

      // act
      await provider.sendRequest({ prompt: "Hello, world!" });

      // assert
      expect(mockClient.post).toHaveBeenCalledWith(mockEndpoint, mockBody, {
        ...mockHeaders,
        Authorization: "Bearer mock-bearer-token",
      });
    });

    it("should handle errors in HTTP request execution", async () => {
      // arrange
      const provider = new HttpModelProvider({
        api: mockApi as unknown as ModelApi,
        config: {
          modelId: mockModelId,
        },
        client: mockClient,
        endpoint: mockEndpoint,
      });

      mockApi.requestTemplate.render.mockReturnValue(mockBody);
      mockClient.post.mockRejectedValue(new Error("Network error"));

      // act & assert
      await expect(
        provider.sendRequest({ prompt: "Hello, world!" }),
      ).rejects.toThrow("Network error");
    });
  });
});
