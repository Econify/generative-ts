import { Template } from "../../utils/template";
import type { ModelApi, ModelRequestOptions } from "../../typeDefs";

const templateSource = "{{ prompt }}";

export const PassthruTemplate = new Template<ModelRequestOptions>(
  templateSource,
);

function passthruCheck(_: unknown): _ is unknown {
  return true;
}

export const PassthruModelApi: ModelApi<ModelRequestOptions> = {
  requestTemplate: PassthruTemplate,
  responseGuard: passthruCheck,
};
