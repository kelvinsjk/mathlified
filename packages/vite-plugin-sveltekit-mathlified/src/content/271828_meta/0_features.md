# Features

Thanks for making it so far in this tutorial/demo! This section will mainly house meta information
about Mathlified. This page, in particular, will describe the current features of Mathlified. Future
us can use this as a baseline comparison during bug fixing and future development.

## Dev mode only

Mathlified currently only does its work during dev mode. This means we get the chance to preview our
work during development, and there are no surprises when converting it to production.

## Components

Mathlify ships with the following components, which will be generated in your project's
`lib/components` folder if it does not detect its existence.

- **Content.svelte**: The wrapper container housing the content text and the table of contents. On
  smaller screen sizes the TOC will be stacked on top of the content, while the TOC will be a
  sidebar on the right for large screen sizes. Also transforms Djot markup to HTML for the content
  portion.

  - **ToC.svelte**: Table of contents generated from your content heading structure.
  - **SequentialNav.svelte**: Used to sequentially navigate through the pages at the bottom of our
    content.

- **Header.svelte**: The header at the top of every page, with a mobile hamburger menu for
  navigation at small screen sizes

  - **MobileNav.svelte**: Said mobile hamburger menu

- **Nav.svelte**: The navigation component, which either lives in `MobileNav` for small screen
  sizes, or on the left sidebar otherwise.

## autoNav

Mathlified regenerates the `nav.ts` file in the `lib/components` when any file is created, deleted,
or renamed. Used by the `MobileNav` and `Nav` component.

## Index and layout

If Mathlified detects an `index.md` file in the `src/content` folder, it will attempt to generate a
`+layout.svelte`, `+page.server.ts`, and `+page.svelte` file in the `src/routes` folder.

`+layout.svelte` implements a two-column layout, with the `Nav` component on the left sidebar for
larger screen sizes.

## Content collection

Mathlified generates a `+page.server.ts`, and `+page.svelte` in the routes folder for each content
collection (top level directory within the `src/content` folder).

### Custom page

The above two files will use a "custom" version when the following two files are detected in your
project, for a "collection" (top level folder in `src/content`).

- `%Component%.svelte` in `src/lib/components`
- `%component%.ts` in `src/lib/server`

## Pdf generation

Pdfs will be generated upon receiving `pdf: true` in a md front matter or an
`export const pdf = true` in a ts file. Pandoc and lualatex will be needed on your system.

When `%component%.ts` in `src/lib/server` exports a `toTex` function, we will use that to parse
modules to Tex and generate pdf from there.

The pdfs will be generated in the `mathlified` folder.

## Authoring comforts

We do the following markup transformations for authoring comfort (outside of what djot will do):

- Convert `&dollar;x&dollar;` and `&dollar;&dollar;x&dollar;&dollar;` notation to djot syntax.
- Move punctuation (commas, fullstops, question mark and exclamation marks) into inline math to
  prevent awkward line breaks.
- Change whitespace around table alignment `| :--: |` to get it to register in Djot (Prettier's
  markdown compliant output isn't Djot compatible).
- Changes `& dollar ;` (without the spaces) to `$` to differentiate actual math markup and code
  examples.

## Options

- `siteName`: The name of your site.
- `disable`: An array of features to disable.

  - `autoNav`: Disable the `autoNav` feature, leaving the `nav.ts` file untouched.
  - `layout`: Disable generation of the `+layout.svelte` file.

The disable features are chosen

- autoNav causes the only\* file system overwrite so disabling can enable custom navigation
  structure.
- a root `+layout.svelte` file can cause massive changes to how your site looks, especially if
  you're adding Mathlified incrementally to an existing project (eg to make use of its pdf
  generation feature).

## Directory

To support our file and folder naming convention with respect to underscores, we generate a
`directory.ts` file in each routes collection. Like the autoNav feature, these files are also
constantly being overwritten. However, we feel users will not require disabling of this feature.
