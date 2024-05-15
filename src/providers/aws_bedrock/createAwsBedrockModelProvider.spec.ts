import aws4 from "aws4";

import type { ModelApi } from "../../typeDefs";

import {
  AwsBedrockModelProvider,
  createAwsBedrockModelProvider,
} from "./createAwsBedrockModelProvider";

jest.mock("aws4");
jest.mock("../../utils/httpClient");

describe("AwsBedrockModelProvider", () => {
  const mockApi = {
    requestTemplate: {
      render: jest.fn().mockReturnValue("dummy-request-template-output"),
    },
    responseGuard: jest.fn().mockReturnValue(true),
  } as unknown as ModelApi;

  const mockAuthConfig = {
    AWS_ACCESS_KEY_ID: "dummy-access-key-id",
    AWS_SECRET_ACCESS_KEY: "dummy-secret-access-key",
  };

  const mockClient = {
    post: jest.fn().mockResolvedValue({
      dummyClientResponseKey: "dummy-client-response-value",
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("dispatchRequest", () => {
    it("signs the request using explicit credentials and calls the client correctly", async () => {
      // arrange
      const provider = new AwsBedrockModelProvider({
        api: mockApi,
        modelId: "dummy-configured-model-id",
        client: mockClient,
        auth: mockAuthConfig,
        region: "mock-aws-region",
      });

      (aws4.sign as jest.Mock).mockReturnValue({
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "signedAuth",
          "X-Amz-Date": "signedDate",
        },
      });

      // act
      const result = await provider.dispatchRequest({
        modelId: "dummy-request-model-id",
        prompt: "explain aws bedrock:",
      });

      // assert
      expect(aws4.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          region: "mock-aws-region",
          service: "bedrock",
        }),
        expect.objectContaining({
          accessKeyId: mockAuthConfig.AWS_ACCESS_KEY_ID,
          secretAccessKey: mockAuthConfig.AWS_SECRET_ACCESS_KEY,
        }),
      );

      expect(mockClient.post).toHaveBeenCalledWith(
        `https://bedrock-runtime.mock-aws-region.amazonaws.com/model/dummy-request-model-id/invoke`,
        "dummy-request-template-output",
        expect.objectContaining({
          Authorization: "signedAuth",
          "X-Amz-Date": "signedDate",
        }),
      );

      expect(result).toEqual({
        dummyClientResponseKey: "dummy-client-response-value",
      });
    });

    it("omits credentials when signing the request when credentials are not provided", async () => {
      // arrange
      const provider = new AwsBedrockModelProvider({
        api: mockApi,
        modelId: "dummy-configured-model-id",
        client: mockClient,
        region: "mock-aws-region",
      });

      (aws4.sign as jest.Mock).mockReturnValue({
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "signedAuth",
          "X-Amz-Date": "signedDate",
        },
      });

      // act
      const result = await provider.dispatchRequest({
        modelId: "dummy-request-model-id",
        prompt: "explain aws bedrock:",
      });

      // assert
      expect(aws4.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "POST",
          region: "mock-aws-region",
          service: "bedrock",
        }),
        undefined, // credentials omitted
      );

      expect(mockClient.post).toHaveBeenCalledWith(
        `https://bedrock-runtime.mock-aws-region.amazonaws.com/model/dummy-request-model-id/invoke`,
        "dummy-request-template-output",
        expect.objectContaining({
          Authorization: "signedAuth",
          "X-Amz-Date": "signedDate",
        }),
      );

      expect(result).toEqual({
        dummyClientResponseKey: "dummy-client-response-value",
      });
    });

    it("throws error when signing fails", async () => {
      // arrange
      const badMockClient = {
        post: jest.fn().mockRejectedValue(new Error("Signing failed")),
      };

      const provider = new AwsBedrockModelProvider({
        api: mockApi,
        modelId: "dummy-configured-model-id",
        client: badMockClient,
        auth: mockAuthConfig,
        region: "mock-aws-region",
      });

      (aws4.sign as jest.Mock).mockImplementation(() => {
        throw new Error("Signing failed");
      });

      // act & assert
      await expect(
        provider.dispatchRequest({
          modelId: "dummy-request-model-id",
          prompt: "explain aws bedrock:",
        }),
      ).rejects.toThrow("Signing failed");
    });
  });

  describe("createAwsBedrockModelProvider", () => {
    it("creates a new AwsBedrockModelProvider instance and defaults the region if not provided", () => {
      // arrange
      const defaultRegionProvider = createAwsBedrockModelProvider({
        api: mockApi,
        modelId: "test-model",
        auth: mockAuthConfig,
        client: mockClient,
      });

      // assert
      expect(defaultRegionProvider.config.region).toBe("us-east-1");
      expect(defaultRegionProvider).toBeInstanceOf(AwsBedrockModelProvider);
    });
  });
});
