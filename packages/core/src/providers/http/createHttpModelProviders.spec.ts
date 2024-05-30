import { ModelApi } from "@typeDefs";

import { getClient } from "../../utils/httpClient";

import {
  BearerTokenAuthStrategy,
  StaticEndpointStrategy,
  StaticHeadersStrategy,
} from "./strategies";

import { createHttpModelProvider } from "./createHttpModelProvider";

jest.mock("../../utils/httpClient");

describe("createHttpModelProvider", () => {
  const mockApi = {
    requestTemplate: {
      render: jest.fn(),
    },
    responseGuard: jest.fn().mockReturnValue(true),
  } as unknown as ModelApi;

  const mockClient = {
    post: jest.fn(),
  };

  const mockModelId = "mock-model-id";
  const defaultEndpoint = "https://api.default.com";
  const defaultHeaders = { "x-mock-header": "mock-header-value" };

  beforeEach(() => {
    jest.clearAllMocks();
    (getClient as jest.Mock).mockReturnValue(mockClient);
  });

  it("creates an HttpModelProvider using defaults", async () => {
    // arrange
    const params = {
      api: mockApi,
      modelId: mockModelId,
      endpoint: defaultEndpoint,
    };

    // act
    const provider = createHttpModelProvider(params);

    (mockApi.requestTemplate.render as jest.Mock).mockReturnValue(
      '{"prompt":"What is AI?"}',
    );

    await provider.sendRequest({ prompt: "What is AI?" });

    // assert
    expect(mockApi.requestTemplate.render).toHaveBeenCalledWith({
      modelId: mockModelId,
      prompt: "What is AI?",
    });

    expect(mockClient.post).toHaveBeenCalledWith(
      defaultEndpoint,
      '{"prompt":"What is AI?"}',
      {
        "Content-Type": "application/json",
      },
    );
  });

  it("creates an HttpModelProvider using values", async () => {
    // arrange
    const params = {
      api: mockApi,
      modelId: mockModelId,
      endpoint: defaultEndpoint,
      headers: defaultHeaders,
    };

    // act
    const provider = createHttpModelProvider(params);

    (mockApi.requestTemplate.render as jest.Mock).mockReturnValue(
      '{"prompt":"What is AI?"}',
    );

    await provider.sendRequest({ prompt: "What is AI?" });

    // assert
    expect(mockApi.requestTemplate.render).toHaveBeenCalledWith({
      modelId: mockModelId,
      prompt: "What is AI?",
    });

    expect(mockClient.post).toHaveBeenCalledWith(
      defaultEndpoint,
      '{"prompt":"What is AI?"}',
      {
        "x-mock-header": "mock-header-value",
      },
    );
  });

  it("creates an HttpModelProvider using strategies", async () => {
    // Arrange
    const params = {
      api: mockApi,
      modelId: mockModelId,
      client: mockClient,
      endpoint: new StaticEndpointStrategy(defaultEndpoint), // use mockEndpointStrategy
      headers: new StaticHeadersStrategy(defaultHeaders), // use mockHeadersStrategy
      auth: new BearerTokenAuthStrategy("secret-token"), // use mockAuthStrategy
    };

    // Act
    const provider = createHttpModelProvider(params);
    (mockApi.requestTemplate.render as jest.Mock).mockReturnValue(
      '{"prompt":"How do you make coffee?"}',
    );

    await provider.sendRequest({ prompt: "How do you make coffee?" });

    // Assert
    expect(mockApi.requestTemplate.render).toHaveBeenCalledWith({
      modelId: mockModelId,
      prompt: "How do you make coffee?",
    });
    expect(mockClient.post).toHaveBeenCalledWith(
      defaultEndpoint,
      '{"prompt":"How do you make coffee?"}',
      {
        "x-mock-header": "mock-header-value",
        Authorization: "Bearer secret-token",
      },
    );
  });
});
