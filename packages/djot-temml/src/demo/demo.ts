import { parse, renderHTML } from "@djot/djot";
import djMarkup from "./demo.dj?raw";
import { djotTemml } from "../main.js";
const html = renderHTML(parse(djMarkup), { overrides: djotTemml() });

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html;
