import { createOpenAiChatModelProvider } from "../src";

async function main() {
  const prompt = "Brief History of NY Mets:";

  const gptProvider = createOpenAiChatModelProvider({
    modelId: "gpt-4-turbo",
  });

  try {
    const r = await gptProvider.sendRequest({
      prompt,
      system: "talk like jafar from aladdin",
      max_tokens: 50,
      temperature: 1.0,
    });

    console.log(r);
  } catch (error) {
    console.error(error);
    console.error("Error in gptProvider.sendRequest");
    process.exit(1);
  }
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
