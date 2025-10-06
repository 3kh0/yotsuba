import { createCanvas, loadImage } from 'canvas';
import * as jdenticon from "jdenticon";

export async function genIcon(hash) {
  const size = 128;
  const svg = jdenticon.toSvg(hash, size);

  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  const img = await loadImage('data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'));
  ctx.drawImage(img, 0, 0);

  return canvas.toBuffer('image/png');
}
//this was used before, but ig im stupid and dont know how to actually make it work with slack urls