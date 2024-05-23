export interface AuthConfig {
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
}

// this isnt used because auth isnt loaded automatically by the AwsBedrockModelProvider
// TODO either add param to AwsBedrockModelProvider to control auto loading auth, or delete this
export function loadAuthConfig(): AuthConfig {
  const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

  if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    const undefinedVars = [
      AWS_ACCESS_KEY_ID ? "" : "AWS_ACCESS_KEY_ID",
      AWS_SECRET_ACCESS_KEY ? "" : "AWS_SECRET_ACCESS_KEY",
    ]
      .filter((v) => v)
      .join(", ");

    throw new Error(
      `AWS credentials not found in env vars (Missing: ${undefinedVars})`,
    );
  }

  return { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY };
}
