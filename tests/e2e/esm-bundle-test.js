import { createLmStudioModelProvider } from "../../packages/generative-ts/dist/index.mjs";

async function send_message() {
  const prompt = document.getElementById("prompt").value;
  document.getElementById("status").innerText = "Sending request...";
  document.getElementById("output").innerText = "";

  const model = createLmStudioModelProvider({
    modelId: "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
  });
  
  const response = await model.sendRequest({
    prompt: prompt,
    generation_config: {
      max_output_tokens: 50,
      temperature: 0
    }
  });

  document.getElementById("status").innerText = "Response:";
  document.getElementById("output").innerText = response.choices[0].message.content;
}

window.send_message = send_message;