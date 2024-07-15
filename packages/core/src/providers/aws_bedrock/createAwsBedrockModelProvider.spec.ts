import { HttpModelProvider } from "../http";

import { createAwsBedrockModelProvider } from "./createAwsBedrockModelProvider";

import type { AwsBedrockAuthConfig } from "./AwsBedrockAuthConfig";

jest.mock("../http", () => ({
  HttpModelProvider: jest.fn(),
}));

describe("createAwsBedrockModelProvider", () => {
  const mockApi = {
    requestTemplate: {
      render: jest.fn().mockReturnValue("dummy-request-template-output"),
    },
    responseGuard: jest.fn().mockReturnValue(true),
  } as unknown as any;

  const mockAuthConfig: AwsBedrockAuthConfig = {
    AWS_ACCESS_KEY_ID: "test-access-key-id",
    AWS_SECRET_ACCESS_KEY: "test-secret-access-key",
    AWS_REGION: "us-east-1",
  };

  const mockModelId = "test-model";

  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("should use auth config if provided", () => {
    createAwsBedrockModelProvider({
      api: mockApi,
      modelId: mockModelId,
      auth: mockAuthConfig,
    });

    expect(HttpModelProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        config: {
          modelId: mockModelId,
          auth: mockAuthConfig,
        },
      }),
    );
  });

  it("should use environment variables if auth config is not provided", () => {
    process.env.AWS_REGION = "mock-region";

    createAwsBedrockModelProvider({
      api: mockApi,
      modelId: mockModelId,
    });

    expect(HttpModelProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        config: {
          modelId: mockModelId,
          auth: {
            AWS_REGION: "mock-region",
          },
        },
      }),
    );
  });

  it("should throw an error if AWS_REGION is not provided in auth or environment", () => {
    expect(() => {
      createAwsBedrockModelProvider({
        api: mockApi,
        modelId: mockModelId,
      });
    }).toThrow(
      "Error in createAwsBedrockModelProvider: AWS_REGION must either be passed in the `auth` object or set in the local process.env",
    );
  });
});
