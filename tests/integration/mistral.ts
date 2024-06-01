import { createMistralModelProvider } from "@packages/core";

async function main() {
  const mistralLarge = createMistralModelProvider({
    modelId: "mistral-large-latest",
  });

  const response = await mistralLarge.sendRequest({
    prompt: "Brief History of NY Mets:",
  });

  console.log(response.choices[0]?.message.content);

  console.log("Mistral Test pass");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);

  console.log("Mistral Test fail");
  process.exit(1);
});
