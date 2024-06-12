import { GoogleAuth } from "google-auth-library";

import type { HttpClient } from "@generative-ts/core";

export async function getCustomClient(): Promise<HttpClient> {
  const googleAuthClient = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/cloud-platform", // TODO is this correct?
    // TODO project_id ?
  });

  // client with GCloud Application Default Credentials (ADC):
  const adcClient = await googleAuthClient.getClient();

  return {
    async post(
      url: string,
      body: string,
      headers: Record<string, string | ReadonlyArray<string>>,
    ) {
      return adcClient.request({
        method: "POST",
        url,
        body,
        headers,
      });
    },
  };
}
