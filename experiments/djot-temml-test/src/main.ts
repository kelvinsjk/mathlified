import { parse, renderHTML } from "@djot/djot";
import { djotTemml } from "djot-temml";
const html = renderHTML(
  parse(`
# Render math from djot using Temml

## Inline math

Inline math $\`x = \\frac{-b \\pm b^2 - 4ac}{2a}\`

## Display math

The roots to the equation $\`ax^2 + bx + c = 0\` are
$$\`x = \\frac{-b \\pm b^2 - 4ac}{2a}\`
`),
  { overrides: djotTemml() }
);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = html;
