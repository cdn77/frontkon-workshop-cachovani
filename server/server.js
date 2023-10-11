/**
 * ======================================
 * | DO NOT USE THIS CODE IN PRODUCTION |
 * ======================================
 *
 * This is a modified Node.js server example from MDN: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
 * It serves just as a simple scaffolding for the caching workshop, with artificially added latency, absolutely not intended for production use.
 */

import { promises as fs, createReadStream } from "node:fs";
import { IncomingMessage, ServerResponse, createServer } from "node:http";
import * as path from "node:path";

/** We will do all the workshop stuff in the getHeaders.js file. */
import { getHeaders } from "./getHeaders.js";
import { getArticlesHtml } from "./articles/getArticles.js";

const PORT = process.env.PORT ?? 8000;

const MIME_TYPES = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpg",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

const STATIC_PATH = path.join(process.cwd(), "./dist");

/**
 * Artificial delay in seconds.
 * @param {number} seconds
 * @param {number} variance
 * @returns {Promise}
 */
const sleep = async (seconds, variance = 0) =>
  new Promise((r) =>
    setTimeout(
      r,
      Math.max(
        0,
        Math.round((seconds + (Math.random() * variance - variance / 2)) * 1000)
      )
    )
  );

/**
 * Create file stream to be used in the response
 * @param {string} url
 * @returns {Promise<{stream: ReadStream, ext: string}>}
 */
const prepareFile = async (url) => {
  const paths = [STATIC_PATH, url];
  if (url.endsWith("/")) paths.push("index.html");
  const filePath = path.join(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.access(filePath).then(
    () => true,
    () => false
  );
  const found = !pathTraversal && exists;
  if (!found) {
    throw new Error("not found");
  }
  const streamPath = filePath;
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = createReadStream(streamPath);
  return { ext, stream };
};

/**
 * Logs request info to console
 * @param {ServerResponse<IncomingMessage>}
 */
const logResponse = (response) => {
  console.log(
    `[${new Date().toISOString()}] ${response.req.method} ${
      response.req.url
    } (${response.statusCode} ${response.statusMessage})`
  );
};

createServer(async (req, res) => {
  try {
    // special case for "/articles"
    if (req.url === "/articles") {
      await sleep(0.5);

      res.writeHead(200, {
        "Content-Type": "text/html",
        ...getHeaders(req.url),
      });

      res.write(await getArticlesHtml(STATIC_PATH));
      res.end();
      logResponse(res);
      return;
    }

    // serve appropriate file if it exists
    const file = await prepareFile(req.url);
    if (/articles.*\.js$/.test(req.url)) {
      // make the articles chunk frustratingly slow
      await sleep(4);
    } else if (req.url && !req.url.endsWith("/") && !/\.$/.test(req.url)) {
      await sleep(2, 2);
    } else {
      await sleep(0.5);
    }
    const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
    res.writeHead(200, {
      "Content-Type": mimeType,
      ...getHeaders(req.url),
    });
    file.stream.pipe(res);
    logResponse(res);
  } catch (e) {
    let statusCode = 500;
    let message = "internal error";
    if (e.message === "not found") {
      statusCode = 404;
      message = "not found";
    } else {
      console.error(e);
    }

    res.writeHead(statusCode, { "Content-Type": "text/plain" });
    res.write(message);
    res.end();
    logResponse(res);
  }
}).listen(PORT);

console.log(
  `Server running at:\n\t- http://127.0.0.1:${PORT}/\n\t- http://localhost:${PORT}/\n`
);
