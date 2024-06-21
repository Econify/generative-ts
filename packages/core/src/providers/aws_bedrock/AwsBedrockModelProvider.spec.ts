import aws4 from "aws4";

import { AwsBedrockModelProvider } from "./AwsBedrockModelProvider";

jest.mock("aws4");
jest.mock("../../utils/httpClient");

describe("AwsBedrockModelProvider", () => {
  const mockApi = {
    requestTemplate: {
      render: jest.fn().mockReturnValue("dummy-request-template-output"),
    },
    responseGuard: jest.fn().mockReturnValue(true),
  } as unknown as any;

  const mockAuthConfig = {
    AWS_ACCESS_KEY_ID: "dummy-access-key-id",
    AWS_SECRET_ACCESS_KEY: "dummy-secret-access-key",
    AWS_REGION: "mock-aws-region",
  };

  const mockClient = {
    fetch: jest.fn().mockResolvedValue({
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
      const result = await provider.sendRequest({
        modelId: "dummy-request-model-id",
        $prompt: "explain aws bedrock:",
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

      expect(mockClient.fetch).toHaveBeenCalledWith(
        `https://bedrock-runtime.mock-aws-region.amazonaws.com/model/dummy-request-model-id/invoke`,
        {
          method: "POST",
          body: "dummy-request-template-output",
          headers: {
            Authorization: "signedAuth",
            "X-Amz-Date": "signedDate",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
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
        auth: {
          AWS_REGION: "mock-aws-region",
        },
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
      const result = await provider.sendRequest({
        modelId: "dummy-request-model-id",
        $prompt: "explain aws bedrock:",
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

      expect(mockClient.fetch).toHaveBeenCalledWith(
        `https://bedrock-runtime.mock-aws-region.amazonaws.com/model/dummy-request-model-id/invoke`,
        {
          method: "POST",
          body: "dummy-request-template-output",
          headers: {
            Authorization: "signedAuth",
            "X-Amz-Date": "signedDate",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      expect(result).toEqual({
        dummyClientResponseKey: "dummy-client-response-value",
      });
    });

    it("throws error when signing fails", async () => {
      // arrange
      const badMockClient = {
        fetch: jest.fn().mockRejectedValue(new Error("Signing failed")),
      };

      const provider = new AwsBedrockModelProvider({
        api: mockApi,
        modelId: "dummy-configured-model-id",
        client: badMockClient,
        auth: mockAuthConfig,
      });

      (aws4.sign as jest.Mock).mockImplementation(() => {
        throw new Error("Signing failed");
      });

      // act & assert
      await expect(
        provider.sendRequest({
          modelId: "dummy-request-model-id",
          $prompt: "explain aws bedrock:",
        }),
      ).rejects.toThrow("Signing failed");
    });
  });
});
