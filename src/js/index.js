import { setupCounter } from "./counter.js";

document.querySelector("#app").innerHTML = `
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Source code:
      <a href="https://github.com/cdn77/frontkon-workshop-cachovani">https://github.com/cdn77/frontkon-workshop-cachovani</a>
    </p>
`;

setupCounter(document.querySelector("#counter"));
