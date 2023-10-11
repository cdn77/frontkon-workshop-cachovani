# Intro to caching

This project contains a simple web site bundled with Vite and a custom web server, which intentionally introduces horrible latencies. The goal of this workshop is to configure caching headers to prevent unnecessary refetches.

## Requirements

- <a href="https://nodejs.org/en">Node.js</a> with `npm`, version 16 or above

## Getting started

```sh
# Install dependencies
npm i

# Build the bundle and start a local webserver
npm run build-and-run
```

## Important files

- `./dist` - bundle of the application created by Vite
  - `./dist/assets` - immutable assets
  - `./dist/fonts` - fonts
- `./server/getHeaders.js` - we will work primarily in this file
- `./src/js/articles.js` - source code for, whose client-side bundle takes a painfully long time to load
