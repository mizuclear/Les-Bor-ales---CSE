import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";

const port = process.env.PORT || 3000;
const publicDir = join(process.cwd(), "public");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  try {
    const url = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    const filePath = join(publicDir, url);
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");

    const data = await readFile(filePath);
    const contentType = mime[extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Ressource introuvable");
  }
});

server.listen(port, () => {
  console.log(`Pass Boréales disponible sur http://localhost:${port}`);
});
