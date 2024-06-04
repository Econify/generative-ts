import type { ModelApi, ModelRequestOptions } from "@typeDefs";

import { BaseModelProvider } from "./baseModelProvider";

jest.mock("../utils/httpClient");

describe("BaseModelProvider", () => {
  const mockConfig = {
    modelId: "dummy-configured-model-id",
  };

  class MockBaseModelProvider extends BaseModelProvider<ModelRequestOptions> {
    dispatchRequest = jest.fn();
  }

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("sendRequest", () => {
    it("calls dispatchRequest with modelId from configuration if no modelId is passed", async () => {
      // arrange
      const provider = new MockBaseModelProvider({
        api: {
          responseGuard: jest.fn().mockReturnValue(true),
        } as unknown as ModelApi,
        config: mockConfig,
      });

      // act
      await provider.sendRequest({ prompt: "the ny mets are:" });

      // assert
      expect(provider.dispatchRequest).toHaveBeenCalledWith({
        modelId: "dummy-configured-model-id",
        prompt: "the ny mets are:",
      });
    });

    it("calls dispatchRequest with passed modelId", async () => {
      // arrange
      const provider = new MockBaseModelProvider({
        api: {
          responseGuard: jest.fn().mockReturnValue(true),
        } as unknown as ModelApi,
        config: mockConfig,
      });

      // act
      await provider.sendRequest({
        modelId: "dummy-request-model-id",
        prompt: "the ny mets are:",
      });

      // assert
      expect(provider.dispatchRequest).toHaveBeenCalledWith({
        modelId: "dummy-request-model-id",
        prompt: "the ny mets are:",
      });
    });

    it("throws an error if responseGuard returns false", async () => {
      // arrange
      const provider = new MockBaseModelProvider({
        api: {
          responseGuard: jest.fn().mockReturnValue(false),
        } as unknown as ModelApi,
        config: mockConfig,
      });

      provider.dispatchRequest.mockResolvedValue("some response");

      // act & assert
      await expect(
        provider.sendRequest({ prompt: "the ny mets are:" }),
      ).rejects.toThrow("Unexpected response from model provider");
    });

    it("saves request and response in history if response is valid", async () => {
      // arrange
      const provider = new MockBaseModelProvider({
        api: {
          responseGuard: jest.fn().mockReturnValue(true),
        } as unknown as ModelApi,
        config: mockConfig,
      });

      provider.dispatchRequest.mockResolvedValue({
        data: "some valid response",
      });

      // act
      await provider.sendRequest({
        modelId: "dummy-request-model-id",
        prompt: "the ny mets are:",
      });

      // assert
      expect(provider.history).toHaveLength(1);
      expect(provider.history[0]).toEqual({
        request: {
          modelId: "dummy-request-model-id",
          prompt: "the ny mets are:",
        },
        response: { data: "some valid response" },
      });

      // act again
      await provider.sendRequest({
        modelId: "dummy-request-model-id-2",
        prompt: "the ny yankees are:",
      });

      // assert again
      expect(provider.history).toHaveLength(2);
      expect(provider.history[0]).toEqual({
        request: {
          modelId: "dummy-request-model-id",
          prompt: "the ny mets are:",
        },
        response: { data: "some valid response" },
      });
      expect(provider.history[1]).toEqual({
        request: {
          modelId: "dummy-request-model-id-2",
          prompt: "the ny yankees are:",
        },
        response: { data: "some valid response" },
      });
    });

    it("saves request and undefined response in history if response is invalid", async () => {
      // arrange
      const provider = new MockBaseModelProvider({
        api: {
          responseGuard: jest.fn().mockReturnValue(false),
        } as unknown as ModelApi,
        config: mockConfig,
      });

      // act & assert
      await expect(
        provider.sendRequest({
          modelId: "dummy-request-model-id",
          prompt: "the ny mets are:",
        }),
      ).rejects.toThrow("Unexpected response from model provider");

      expect(provider.history).toHaveLength(1);
      expect(provider.history[0]).toEqual({
        request: {
          modelId: "dummy-request-model-id",
          prompt: "the ny mets are:",
        },
        response: undefined,
      });
    });
  });
});
