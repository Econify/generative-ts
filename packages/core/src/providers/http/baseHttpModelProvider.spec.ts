import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { getClient } from "../../utils/httpClient";
import { BaseHttpModelProvider } from "./baseHttpModelProvider";

jest.mock("../../utils/httpClient");

describe("BaseHttpModelProvider", () => {
  const mockApi = {
    responseGuard: jest.fn().mockReturnValue(true),
  } as unknown as ModelApi;

  const mockConfig = {
    modelId: "configured-model-id",
  };

  const mockClient = {
    fetch: jest.fn(),
  };

  class MockHttpModelProvider extends BaseHttpModelProvider<ModelRequestOptions> {
    dispatchRequest = jest.fn();
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it("uses the provided client", () => {
      // act
      const provider = new MockHttpModelProvider({
        api: mockApi,
        config: mockConfig,
        client: mockClient,
      });

      // assert
      expect(provider.client).toBe(mockClient);
    });

    it("falls back to the default client when no client is provided", () => {
      // arrange
      (getClient as jest.Mock).mockReturnValue(mockClient);

      // act
      const provider = new MockHttpModelProvider({
        api: mockApi,
        config: mockConfig,
      });

      // assert
      expect(getClient).toHaveBeenCalled();
      expect(provider.client).toBe(mockClient);
    });

    it("rethrows error with wrapped message when client creation fails", () => {
      // arrange
      const error = new Error("Client creation failed");
      (getClient as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // act & assert
      expect(
        () =>
          new MockHttpModelProvider({
            api: mockApi as unknown as ModelApi,
            config: mockConfig,
          }),
      ).toThrow(
        `Error during ModelProvider initialization when attempting to load built-in HttpClient: ${error.message}. To avoid loading the built-in HttpClient, pass a custom HttpClient implementation as \`client\` to the ModelProvider constructor.`,
      );
    });
  });
});
