const base64 =
export const semaphoreCode = new Uint8Array(
  Buffer.from(base64, "base64").buffer
);