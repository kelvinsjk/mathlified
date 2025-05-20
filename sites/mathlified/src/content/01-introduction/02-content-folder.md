# Content folder

The content folder is where we will do the bulk of our work in.

```
| my-project/
| ├ src/
| | ├ content/
| | | ├ 01-introduction/
| | | | └ 01-getting-started.md
| | | | └ 02-content-folder.md
| | | | (... other content files)
| | | └ index.md
```

If you look inside the `src/content` folder in this project, the
`01-introduction/02-content-folder.md` file is what generates the current page.

As you work through a new page on this tutorial, we recommend that you look at each of the "source" file in the content folder.

## Exercise

While in `dev` mode, change some of the writeup in this source file and see it reflected on the page.

## File based routing

The folders and files in the `src/content` folder are used to generate the navigation structure for
the website. Observe how our source file `01-introduction/02-content-folder.md` corresponds to the
page `/introduction/project-structure`.

### Naming convention

We omit leading numbers (and possibly a letter) in front of a `-` to get the page title. Hence files
with name `02-content-folder.md` and `03a-next.md` will correspond to pages at `/content-folder` and
`/next`.

These leading numbers can help you organize your content folder.

> Make sure not to have two files ending up with the same page title!

Customizing the page title is covered in a
[later section](/markdown/generating-pdf#More-about-Mathlified:-page-titles).
