import { forEach, ProgressBar } from "../deps.ts";

export function showStreamProgress(totalSize: number) {
  const progressBar = new ProgressBar({
    total: totalSize,
  });

  let bytesSoFar = 0;
  return forEach<Uint8Array>(buffer => {
    bytesSoFar += buffer.byteLength;
    progressBar.render(bytesSoFar);
  });
}
