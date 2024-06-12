/**
 * @category Provider: GCloud VertexAI
 *
 * @property {string} GCLOUD_LOCATION - The GCloud location of your project. NOTE: As of writing, VertexAI is only available in certain regions.
 * @property {string} GCLOUD_PROJECT_ID - Your GCloud project ID
 */
export interface VertexAiAuthConfig {
  GCLOUD_LOCATION: string;
  GCLOUD_PROJECT_ID: string;
}
