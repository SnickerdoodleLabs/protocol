const base64 =
export const semaphoreZKey = new Uint8Array(
  Buffer.from(base64, "base64").buffer
);