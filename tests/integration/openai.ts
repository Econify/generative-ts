import {
  createGroqModelProvider,
  createLmStudioModelProvider,
  createOpenAiChatModelProvider,
} from "@packages/core";

async function testOpenAi() {
  const gpt4 = createOpenAiChatModelProvider({
    modelId: "gpt-4-turbo",
  });

  await gpt4.sendRequest({
    prompt: "Brief History of NY Mets:",
  });

  console.log("OpenAI test pass");
}

async function testGroq() {
  const groq = createGroqModelProvider({
    modelId: "llama3-70b-8192",
  });

  await groq.sendRequest({
    prompt: "Brief History of NY Mets:",
  });

  console.log("Groq test pass");
}

async function testLmStudio() {
  const lmStudio = createLmStudioModelProvider({
    modelId: "lmstudio-community/Meta-Llama-3-70B-Instruct-GGUF",
  });

  await lmStudio.sendRequest({
    prompt: "Brief History of NY Mets:",
  });

  console.log("LmStudio test pass");
}

async function main() {
  await Promise.all(
    [testOpenAi, testGroq, testLmStudio].map(async (fn) => {
      await fn();
    }),
  );

  console.log("All tests pass");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);

  console.log("Test fail");
  process.exit(1);
});
