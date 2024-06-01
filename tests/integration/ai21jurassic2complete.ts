import {
  Ai21Jurassic2Api,
  createAwsBedrockModelProvider,
} from "@packages/core";

async function main() {
  const j2 = createAwsBedrockModelProvider({
    api: Ai21Jurassic2Api,
    modelId: "ai21.j2-mid-v1",
  });

  await j2.sendRequest({
    prompt: "Brief history of NY Mets:",
    numResults: 1,
    maxTokens: 50,
    minTokens: 0,
    temperature: 0.5,
    topP: 1,
    topKReturn: 1,
    stopSequences: ["."],
  });

  // console.log(JSON.stringify(r, null, 2));

  console.log("All tests pass");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);

  console.log("Test fail");
  process.exit(1);
});
