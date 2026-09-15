import fs from 'node:fs'; import { PNG } from 'pngjs';
const [src, out, y0, h] = process.argv.slice(2); const png = PNG.sync.read(fs.readFileSync(src));
const y = +y0, hh = Math.min(+h, png.height - y); const o = new PNG({ width: png.width, height: hh });
PNG.bitblt(png, o, 0, y, png.width, hh, 0, 0); fs.writeFileSync(out, PNG.sync.write(o)); console.log(out, png.width, hh);
