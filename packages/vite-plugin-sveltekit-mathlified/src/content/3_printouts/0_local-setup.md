# Local setup

On the main page we introduced StackBlitz as a quick way to get started. But if we want the pdf
generation feature of Mathlified, or for a more slick developer experience, we will have to do a
one-time setup on our local machine.

## TeX and Pandoc

If you want to generate pdfs with Mathlified, you will need LaTeX and Pandoc installed on your
system.

### TeX

If you do not already have it on your system, I recommend [TeX Live](https://www.tug.org/texlive/).
It is a huge 3GB download/install and took 3.5 hours when I last tried it, but it's one of those
things that I find is better off taking the hit up front than have to debug errors due to missing
packages in the future. If the size and time is a huge issue, you may want to consider
[MiKTeX](https://miktex.org/), which has a basic installation and install required packages in the
future on the fly.

### Pandoc

[Pandoc](https://pandoc.org/) is the next program to install, which Mathlified will use in the
background to convert Djot markup into pdfs.

## Git

We have seen Git in the getting started post, so we will also need it on our system. Get
[Git here](https://git-scm.com/).

## Node, npm

We will also need Node, which lets us run JavaScript on our system (vs just in the browser), and
npm, which lets us install packages. We recommend using [nvm](https://github.com/nvm-sh/nvm) to get
both. There is a nice article on
[freecodecamp](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) on
installing nvm for your system.

With nvm installed, run the command `nvm install node` in your terminal to install the latest
available version.

## Test that they work

Now that you have everything installed, start a new terminal and run the following commands to check
that we have successfully installed them.

```sh
lualatex -v
pandoc -v
git --version
node -v
npm -v
```

Each command should print the version installed, with no error messages.

## Nice-to-have: VS Code, pnpm

[VS Code](https://code.visualstudio.com/) is a good program to edit our code and content. It has an
integrated terminal, and many extensions that can help make your workflow more productive.

[pnpm](https://pnpm.io/) is my more performant choice to use instead of npm.

## Clone your project from GitHub

In the getting started post we went through forking the Mathlified starter repository into your own
GitHub account. You should now clone your repository onto your local machine, either through
`git clone [url]` on the command line (url found on GitHub). Alternative,
[GitHub Desktop](https://github.com/apps/desktop) can be used as well.

## It's pdf time

With all this setup out of the way, we are now ready to generate pdfs with Mathlified.
