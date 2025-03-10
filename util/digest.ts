import { Sha256, single } from "../deps.ts";

export async function sha256stream(byteStream: ReadableStream<Uint8Array>) {
  // Until subtle crypto has streaming digesting, this will have to do
  let digest: Sha256;

  const hashStream = new TransformStream<Uint8Array, string>(
    {
      start() {
        digest = new Sha256();
      },
      transform(chunk) {
        // @ts-ignore-error Types on Sha256 broken starting Deno 2.2 - https://github.com/microsoft/TypeScript/pull/59417
        digest.update(chunk);
      },
      flush(controller) {
        controller.enqueue(digest.toString());
      },
    },
    { highWaterMark: 1 },
    { highWaterMark: 0 },
  );

  return await single(byteStream.pipeThrough(hashStream));
}

export async function sha256string(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(hash);
}

export async function sha256bytesToHex(message: Uint8Array) {
  const hash = await crypto.subtle.digest('SHA-256', message);
  return bytesToHex(hash);
}

function bytesToHex(data: ArrayBuffer) {
  return [...new Uint8Array(data)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}
