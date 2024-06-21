import { HttpModelProvider } from "@generative-ts/core";
import type { HttpClient } from "@generative-ts/core";
import { createVertexAiModelProvider } from "./createVertexAiModelProvider";
import { getCustomClient } from "./getCustomClient";
import type { VertexAiAuthConfig } from "./VertexAiAuthConfig";

jest.mock("@generative-ts/core", () => ({
  GoogleGeminiApi: jest.fn(),
  HttpModelProvider: jest.fn(),
}));
jest.mock("./getCustomClient");

describe("createVertexAiModelProvider", () => {
  const mockAuthConfig: VertexAiAuthConfig = {
    GCLOUD_LOCATION: "us-central1",
    GCLOUD_PROJECT_ID: "test-project",
  };

  const mockModelId = "test-model";

  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterEach(() => {
    process.env = ORIGINAL_ENV;
  });

  it("should use auth config if provided", async () => {
    await createVertexAiModelProvider({
      modelId: mockModelId,
      auth: mockAuthConfig,
    });

    expect(HttpModelProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: `https://${mockAuthConfig.GCLOUD_LOCATION}-aiplatform.googleapis.com/v1/projects/${mockAuthConfig.GCLOUD_PROJECT_ID}/locations/${mockAuthConfig.GCLOUD_LOCATION}/publishers/google/models/${mockModelId}:generateContent`,
      }),
    );
  });

  it("should use environment variables if auth config is not provided", async () => {
    const mockEnv = {
      GCLOUD_LOCATION: "us-central1",
      GCLOUD_PROJECT_ID: "env-test-project",
    };
    process.env.GCLOUD_LOCATION = mockEnv.GCLOUD_LOCATION;
    process.env.GCLOUD_PROJECT_ID = mockEnv.GCLOUD_PROJECT_ID;

    await createVertexAiModelProvider({
      modelId: mockModelId,
    });

    expect(HttpModelProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: `https://${mockEnv.GCLOUD_LOCATION}-aiplatform.googleapis.com/v1/projects/${mockEnv.GCLOUD_PROJECT_ID}/locations/${mockEnv.GCLOUD_LOCATION}/publishers/google/models/${mockModelId}:generateContent`,
      }),
    );
  });

  it("should throw an error if GCLOUD_LOCATION and GCLOUD_PROJECT_ID are not provided in auth or environment", async () => {
    await expect(
      createVertexAiModelProvider({ modelId: mockModelId }),
    ).rejects.toThrow(
      "Error when creating VertexAI ModelProvider: Authorization not found. GCLOUD_LOCATION and GCLOUD_PROJECT_ID must be passed explicitly in `auth` or set in the environment.",
    );
  });

  it("should use the provided HttpClient if client is passed", async () => {
    const mockClient = {} as HttpClient;

    await createVertexAiModelProvider({
      modelId: mockModelId,
      client: mockClient,
      auth: mockAuthConfig,
    });

    expect(HttpModelProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
      }),
    );
  });

  it("should use custom client if client is not passed", async () => {
    const mockClient = {} as HttpClient;
    (getCustomClient as jest.Mock).mockResolvedValue(mockClient);

    await createVertexAiModelProvider({
      modelId: mockModelId,
      auth: mockAuthConfig,
    });

    expect(getCustomClient).toHaveBeenCalled();
    expect(HttpModelProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        client: mockClient,
      }),
    );
  });
});
