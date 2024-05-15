import type { ModelApi, ModelRequestOptions } from "../typeDefs";

import { BaseModelProvider } from "./baseModelProvider";

jest.mock("../utils/httpClient");

describe("BaseModelProvider", () => {
  const mockApi = {
    responseGuard: jest.fn().mockReturnValue(true),
  };

  const mockConfig = {
    modelId: "dummy-configured-model-id",
  };

  class MockBaseModelProvider extends BaseModelProvider<ModelRequestOptions> {
    dispatchRequest = jest.fn();
  }

  describe("sendRequest", () => {
    it("calls dispatchRequest with modelId from configuration if no modelId is passed", async () => {
      // arrange
      const provider = new MockBaseModelProvider({
        api: mockApi as unknown as ModelApi,
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
        api: mockApi as unknown as ModelApi,
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
        api: mockApi as unknown as ModelApi,
        config: mockConfig,
      });

      provider.dispatchRequest.mockResolvedValue("some response");
      mockApi.responseGuard.mockReturnValue(false);

      // act & assert
      await expect(
        provider.sendRequest({ prompt: "the ny mets are:" }),
      ).rejects.toThrow("Unexpected response from model provider");
    });
  });
});
