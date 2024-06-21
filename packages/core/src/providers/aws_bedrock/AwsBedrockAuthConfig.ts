/**
 * @category Provider: AWS Bedrock
 *
 * @property {string} AWS_ACCESS_KEY_ID - The AWS Access Key ID
 * @property {string} AWS_SECRET_ACCESS_KEY - The AWS Secret Access Key
 */
export interface AwsBedrockAuthConfig {
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  AWS_REGION: string;
}
