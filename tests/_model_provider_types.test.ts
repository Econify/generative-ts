// import type { HttpClient } from "@typeDefs";

// import {
//   CohereChatApi,
//   CohereGenerateApi,
//   createCohereModelProvider,
// } from "@packages/core";

// interface CustomOptions {
//   custom: number;
// }

// const customClient: HttpClient<CustomOptions> = {
//   fetch(endpoint: string, request: CustomOptions) {
//     return Promise.resolve({
//       endpoint,
//       request,
//     });
//   },
// };

// test("Type Stuff", async () => {
//   const cohereGen = createCohereModelProvider({
//     api: CohereGenerateApi,
//     modelId: "command",
//   });

//   // WORKS: correct api, correct default http client options:
//   await cohereGen.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       return_likelihoods: "ALL",
//     },
//     {
//       timeout: 123,
//     },
//   );

//   // BROKEN: wrong api
//   await cohereGen.sendRequest({
//     prompt: "Brief History of NY Mets:",
//     preamble: "ALL",
//   });

//   // BROKEN: wrong default http client options
//   await cohereGen.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       return_likelihoods: "ALL",
//     },
//     {
//       foo: 123,
//     },
//   );

//   const cohereChat = createCohereModelProvider({
//     api: CohereChatApi,
//     modelId: "command-r-plus",
//   });

//   // WORKS: correct api, correct default http client options:
//   await cohereChat.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       preamble: "Talk like Jafar from Aladdin",
//     },
//     {
//       timeout: 123,
//     },
//   );

//   // BROKEN: wrong api
//   await cohereChat.sendRequest({
//     prompt: "Brief History of NY Mets:",
//     return_likelihoods: "ALL",
//   });

//   // BROKEN: wrong default http client options
//   await cohereChat.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       preamble: "Talk like Jafar from Aladdin",
//     },
//     {
//       foo: 123,
//     },
//   );

//   const cohereChatDefault = createCohereModelProvider({
//     modelId: "command-r-plus",
//   });

//   // WORKS: correct api, correct default http client options:
//   await cohereChatDefault.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       preamble: "Talk like Jafar from Aladdin",
//     },
//     {
//       timeout: 123,
//     },
//   );

//   // BROKEN: wrong api
//   await cohereChatDefault.sendRequest({
//     prompt: "Brief History of NY Mets:",
//     return_likelihoods: "ALL",
//   });

//   // BROKEN: wrong default http client options
//   await cohereChatDefault.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       preamble: "Talk like Jafar from Aladdin",
//     },
//     {
//       foo: 123,
//     },
//   );

//   const cohereGenWithClient = createCohereModelProvider({
//     api: CohereGenerateApi,
//     modelId: "command",
//     client: customClient,
//   });

//   // WORKS: correct api, correct custom http client options:
//   await cohereGenWithClient.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       return_likelihoods: "ALL",
//     },
//     {
//       custom: 123,
//     },
//   );

//   // BROKEN: wrong api
//   await cohereGenWithClient.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       preamble: "ALL",
//     },
//     {
//       custom: 123,
//     },
//   );

//   // BROKEN: wrong custom http client options
//   await cohereGenWithClient.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       return_likelihoods: "ALL",
//     },
//     {
//       custom: "bad",
//     },
//   );

//   const cohereChatWithClient = createCohereModelProvider({
//     api: CohereChatApi,
//     modelId: "command-r-plus",
//     client: customClient,
//   });

//   // WORKS: correct api, correct custom http client options:
//   await cohereChatWithClient.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       preamble: "Talk like Jafar from Aladdin",
//     },
//     {
//       custom: 123,
//     },
//   );

//   // BROKEN: wrong api
//   await cohereChatWithClient.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       return_likelihoods: "ALL",
//     },
//     {
//       custom: 123,
//     },
//   );

//   // BROKEN: wrong custom http client options
//   await cohereChatWithClient.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       preamble: "Talk like Jafar from Aladdin",
//     },
//     {
//       custom: "bad",
//     },
//   );

//   const cohereChatDefaultWithClient = createCohereModelProvider({
//     modelId: "command-r-plus",
//     client: customClient,
//   });

//   // WORKS: correct api, correct custom http client options:
//   await cohereChatDefaultWithClient.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       preamble: "Talk like Jafar from Aladdin",
//     },
//     {
//       custom: 123,
//     },
//   );

//   // BROKEN: wrong api
//   await cohereChatDefaultWithClient.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       return_likelihoods: "ALL",
//     },
//     {
//       custom: 123,
//     },
//   );

//   // BROKEN: wrong custom http client options
//   await cohereChatDefaultWithClient.sendRequest(
//     {
//       prompt: "Brief History of NY Mets:",
//       preamble: "Talk like Jafar from Aladdin",
//     },
//     {
//       custom: "bad",
//     },
//   );
// });
