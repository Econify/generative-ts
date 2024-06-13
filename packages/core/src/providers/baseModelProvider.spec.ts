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
      expect(provider.dispatchRequest).toHaveBeenCalledWith(
        {
          modelId: "dummy-configured-model-id",
          prompt: "the ny mets are:",
        },
        undefined,
      );
    });

    it("calls dispatchRequest with passed modelId and meta", async () => {
      // arrange
      const provider = new MockBaseModelProvider({
        api: {
          responseGuard: jest.fn().mockReturnValue(true),
        } as unknown as ModelApi,
        config: mockConfig,
      });

      // act
      await provider.sendRequest(
        {
          modelId: "dummy-request-model-id",
          prompt: "the ny mets are:",
        },
        {
          metaProp: "dummy-meta",
        },
      );

      // assert
      expect(provider.dispatchRequest).toHaveBeenCalledWith(
        {
          modelId: "dummy-request-model-id",
          prompt: "the ny mets are:",
        },
        {
          metaProp: "dummy-meta",
        },
      );
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

    it("saves request, meta, and response in history if response is valid", async () => {
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
      await provider.sendRequest(
        {
          modelId: "dummy-request-model-id",
          prompt: "the ny mets are:",
        },
        {
          metaProp: "dummy-meta",
        },
      );

      // assert
      expect(provider.history).toHaveLength(1);
      expect(provider.history[0]).toEqual({
        options: {
          modelId: "dummy-request-model-id",
          prompt: "the ny mets are:",
        },
        response: { data: "some valid response" },
        meta: {
          metaProp: "dummy-meta",
        },
      });

      // act again
      await provider.sendRequest({
        modelId: "dummy-request-model-id-2",
        prompt: "the ny yankees are:",
      });

      // assert again
      expect(provider.history).toHaveLength(2);
      expect(provider.history[0]).toEqual({
        options: {
          modelId: "dummy-request-model-id",
          prompt: "the ny mets are:",
        },
        response: { data: "some valid response" },
        meta: {
          metaProp: "dummy-meta",
        },
      });
      expect(provider.history[1]).toEqual({
        options: {
          modelId: "dummy-request-model-id-2",
          prompt: "the ny yankees are:",
        },
        response: { data: "some valid response" },
        meta: undefined, // no meta in second call
      });
    });

    it("saves request, meta, and undefined response in history if response is invalid", async () => {
      // arrange
      const provider = new MockBaseModelProvider({
        api: {
          responseGuard: jest.fn().mockReturnValue(false),
        } as unknown as ModelApi,
        config: mockConfig,
      });

      // act & assert
      await expect(
        provider.sendRequest(
          {
            modelId: "dummy-request-model-id",
            prompt: "the ny mets are:",
          },
          {
            metaProp: "dummy-meta",
          },
        ),
      ).rejects.toThrow("Unexpected response from model provider");

      expect(provider.history).toHaveLength(1);
      expect(provider.history[0]).toEqual({
        options: {
          modelId: "dummy-request-model-id",
          prompt: "the ny mets are:",
        },
        response: undefined,
        meta: {
          metaProp: "dummy-meta",
        },
      });
    });
  });
});
