export * from "@circuits/circom/semaphore/ICircomSemaphoreInputs.js";
export * from "@circuits/circom/semaphore/semaphore.wasm.js";
export * from "@circuits/circom/semaphore/semaphore.zkey.js";

import semaphoreVerificationKeyJSON from "@circuits/circom/semaphore/semaphore.verificationkey.json";
export const semaphoreVerificationKey = semaphoreVerificationKeyJSON;
