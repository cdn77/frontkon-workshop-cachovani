/**
 * Caching headers reference:
 *
 * MDN web docs on the Cache-Control headers:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
 *
 * Common usage:
 *    - public, max-age=3153600, immutable  - ideal for immutable assets, such as hashed files created by a bundler - app.as45d6efr.js, something.as54d564sa.css etc
 *    - public, max-age=0, must-revalidate  - mutable public assets, that might change over time - you can increase the max-age, if you are comfortable with users seeing old content for some time
 *    - private, max-age=0                  - for user-specific responses - server side rendered HTML, form responses, etc - anything that should not ever be cached
 *
 * Important directives (explanations are simplified):
 *    - max-age=N               - response remains fresh (= cached in the browser) for N seconds
 *    - no-cache                - treat response as stale (= refetch on next request)
 *    - must-revalidate         - response must be refetched when stale (= do not use stale response even offline)
 *    - public                  - this response looks the same for all visitors
 *    - private                 - this response is private to this specific visitor
 *    - immutable               - the content will not change while fresh
 *    - stale-while-revalidate  - server stale content and refetch in the background - the next load will serve the newly fetched content from the updated cache
 */

/**
 * Returns HTTP headers based on the requested path
 *
 * @param {string} path
 * @returns {Object.<string, string>}
 */
export const getHeaders = (path) => {
  const twoYears = 2 * 365 * 24 * 60 * 60;
  const fiveMinutes = 5 * 60;

  if (path.startsWith("/assets/")) {
    // cache immutable assets for 2 years
    return {
      "Cache-Control": `public, max-age=${twoYears}, immutable`,
    };
  } else if (/\.(svg|png)$/.test(path)) {
    // cache mutable images for 5 minutes (this means that users might see old images for 5 minutes before the cache expires)
    return {
      "Cache-Control": `public, max-age=${fiveMinutes}`,
    };
  } else if (path.startsWith("/fonts/")) {
    // fonts rarely change, we can cache them for a long time even though they are mutable
    // if we really need to update the font, we can give the new version a different name
    return {
      "Cache-Control": `public, max-age=${twoYears}`,
    };
  }

  // Since this is a public, static site, we can mark other files as public.
  // This is not always the case. Be aware of customized or otherwise user-specific content like
  // pages with forms, pages that require logout, or websites that render stuff differently based on the request
  return { "Cache-Control": "public, max-age=0, must-revalidate" };
};
