# Changelog

## Version 0.0.1

The first release of Mathlified, ships with the following

- Components:

  - `Content.svelte`
  - `Header.svelte`
  - `MobileNav.svelte`
  - `Nav.svelte`
  - `SequentialNav.svelte`
  - `ToC.svelte`

- `nav.ts` supporting the Nav and MobileNav components
- SvelteKit `+page.server.ts` and `+page.svelte` file injection

  - For the home page corresponding to `index.md` in `src/content`
  - For each content collection (top level folder) in `src/content`
  - Generic and custom versions depending on if custom component and server module detected

- Pdf generation via pandoc and lualatex
