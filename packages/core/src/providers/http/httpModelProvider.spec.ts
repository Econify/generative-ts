import { ModelApi } from "../../typeDefs";

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

  const mockModelId = "test-model-id";
  const mockEndpoint = "https://api.example.com";
  const mockHeaders = { "Content-Type": "application/json" };
  const mockBody = '{"prompt":"Hello, world!"}';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("sendRequest", () => {
    it("should correctly process the request with endpoint, headers, and body", async () => {
      // arrange
      const endpointStrategy = new StaticEndpointStrategy(mockEndpoint);
      const headersStrategy = new StaticHeadersStrategy(mockHeaders);
      const authStrategy = new BearerTokenAuthStrategy("token123");

      jest.spyOn(endpointStrategy, "getEndpoint").mockReturnValue(mockEndpoint);
      jest.spyOn(headersStrategy, "getHeaders").mockReturnValue(mockHeaders);
      jest.spyOn(authStrategy, "applyAuth").mockReturnValue({
        endpoint: mockEndpoint,
        body: '{"prompt":"Hello, world!"}',
        headers: { ...mockHeaders, Authorization: "Bearer mock-bearer-token" },
      });

      const provider = new HttpModelProvider({
        api: mockApi as unknown as ModelApi,
        modelId: mockModelId,
        client: mockClient,
        endpoint: endpointStrategy,
        headers: headersStrategy,
        auth: authStrategy,
      });

      mockApi.requestTemplate.render.mockReturnValue(mockBody);

      // act
      await provider.sendRequest({ prompt: "Hello, world!" });

      // assert
      expect(endpointStrategy.getEndpoint).toHaveBeenCalled();
      expect(headersStrategy.getHeaders).toHaveBeenCalled();
      expect(authStrategy.applyAuth).toHaveBeenCalledWith({
        endpoint: mockEndpoint,
        body: mockBody,
        headers: mockHeaders,
        options: { modelId: mockModelId, prompt: "Hello, world!" },
        config: { modelId: mockModelId },
      });

      expect(mockClient.post).toHaveBeenCalledWith(mockEndpoint, mockBody, {
        ...mockHeaders,
        Authorization: "Bearer mock-bearer-token",
      });
    });

    it("should handle errors in HTTP request execution", async () => {
      // arrange
      const endpointStrategy = new StaticEndpointStrategy(mockEndpoint);
      const headersStrategy = new StaticHeadersStrategy(mockHeaders);
      const authStrategy = new BearerTokenAuthStrategy("token123");

      const provider = new HttpModelProvider({
        api: mockApi as unknown as ModelApi,
        modelId: mockModelId,
        client: mockClient,
        endpoint: endpointStrategy,
        headers: headersStrategy,
        auth: authStrategy,
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
