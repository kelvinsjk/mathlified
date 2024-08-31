import { outputFileSync, remove } from 'fs-extra/esm';
import { readFileSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import commandExists from 'command-exists';
import { parse, toPandoc } from '@djot/djot';
import { extractFrontmatter, fileToName, info, warning } from './utils';
import { type ViteDevServer } from 'vite';
import colors from 'picocolors';
export interface CustomTex {
  documentclass?: string;
  classoption?: string;
  'header-includes'?: string;
  content: string;
}

export async function possiblyGeneratePdfFromMd(filePath: string): Promise<void> {
  const file = readFileSync(filePath, 'utf-8');
  const { metadata, body } = extractFrontmatter(file);
  if (metadata.pdf) {
    if (metadata.title) {
      generatePdf(`# ${metadata.title}\n\n${body}`, filePath);
    } else {
      generatePdf(body, filePath);
    }
  }
}

export async function generatePdfFromTs(
  filePath: string,
  module: Record<string, unknown>,
  server: ViteDevServer
): Promise<void> {
  // get collection to see if custom behavior needed
  const paths = path.normalize(filePath).split(path.sep);
  // TODO: handle for edge case: multiple content or src/content
  const index = paths.indexOf('content');
  const collection = paths.at(index + 1);
  if (!collection) throw new Error('collection not found');
  const collectionName = fileToName(collection);
  const preprocessorPath = path.join('src/lib/server', collectionName + '.ts');
  const preprocessorExists = existsSync(preprocessorPath);
  if (preprocessorExists) {
    // possible custom behavior
    const preprocessor = await server.ssrLoadModule(preprocessorPath);
    const toTex = preprocessor['toTex'];
    if (typeof toTex === 'function') {
      // custom pdf
      const tex = toTex(module);
      generatePdfFromTex(tex, filePath);
      return;
    }
  }
  // default behavior
  const content = module['content'];
  if (typeof content === 'string') {
    let body = content;
    if (typeof module['title'] === 'string') {
      body = `# ${module['title']}\n\n${content}`;
    }
    return generatePdf(body, filePath);
  }
  warning(
    `${colors.red('PDF generation failed.')} ts file must export a content of type string for pdf generation.`
  );
  return;
}

async function generatePdf(body: string, filePath: string): Promise<void> {
  if (!commandExists.sync('pandoc')) warning('pandoc not installed on system to generate pdf');
  if (!commandExists.sync('lualatex')) warning('lualatex not installed on system to generate pdf');
  // 1,2: convert math to djot math
  // 3: prettier-md table to djot table alignment
  // 4: &dollar; for code
  // 5: change images url to absolute paths in static folder
  // 6: amsmath environment in display mode becomes raw latex block
  const json = toPandoc(
    parse(
      body
        .replace(/(?<!\\)\$\$(?!`)([^]+?)\$\$/g, (_, match) => `$$\`${match}\``)
        .replace(/(?<!\\)\$(?!`)(.+?)(?<!\\)\$/g, (_, match) => `$\`${match}\``)
        .replace(/ ?(\|) (-+|:-+|-+:|:-+:) (\|) ?/g, '$1$2$3')
        .replaceAll('&dollar;', '$')
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, (_, alt, url) => {
          const resolvedPath = path.resolve(path.join('./static', url));
          return `![${alt}](${resolvedPath})`;
        })
        .replace(
          /\$\$`\s*\\(begin\{(align\*?|gather\*?|equation\*?|alignat\*?)\}[^]+?\\end\{\2\})\s*`/g,
          '``` =latex\n\\$1\n```'
        )
    )
  );
  const mathlifiedPath = filePath.replace(path.join('src/content'), 'mathlified');
  const jsonPath = mathlifiedPath.slice(0, -2) + 'json';
  outputFileSync(jsonPath, JSON.stringify(json));
  const pdfPath = mathlifiedPath.slice(0, -2) + 'pdf';
  const pandoc = spawn('pandoc', [
    jsonPath,
    '-f',
    'json',
    '-t',
    'pdf',
    '--pdf-engine',
    'lualatex',
    '-o',
    pdfPath
  ]);
  let error = '';
  pandoc.stderr.on('data', (data) => {
    error += data;
  });
  pandoc.on('close', (code) => {
    if (code === 0) {
      info(`${colors.green('PDF generated at')} ${pdfPath}`);
    } else {
      warning(
        `${colors.red('We encountered an error.')} exit code ${code}, error log: ${error}\n${colors.red('End of error log.')}`
      );
    }
    remove(jsonPath);
  });
}

async function generatePdfFromTex(customTex: CustomTex, filePath: string): Promise<void> {
  if (!commandExists.sync('lualatex')) warning('lualatex not installed on system to generate pdf');
  // 1: change images url to absolute paths in static folder
  // 2: amsmath environment in display mode becomes raw latex block
  const texBody = customTex.content
    .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, (_, alt, url) => {
      const resolvedPath = path.resolve(path.join('./static', url));
      return `![${alt}](${resolvedPath})`;
    })
    .replace(
      /\$\$`\s*\\(begin\{(align\*?|gather\*?|equation\*?|alignat\*?)\}[^]+?\\end\{\2\})\s*`/g,
      '``` =latex\n\\$1\n```'
    );
  const tex = `\\documentclass[${customTex.classoption ?? ''}]{${customTex.documentclass ?? 'article'}}
${customTex['header-includes'] ?? ''}

\\begin{document}
${texBody}
\\end{document}`;
  const mathlifiedPath = filePath.replace(path.join('src/content'), 'mathlified');
  const texPath = mathlifiedPath.slice(0, -2) + 'tex';
  outputFileSync(texPath, tex);
  const folder = path.dirname(texPath);
  const pdfPath = mathlifiedPath.slice(0, -2) + 'pdf';
  const latex = spawn('lualatex', [
    '-halt-on-error',
    '-interaction=nonstopmode',
    '-output-directory=' + folder,
    texPath
  ]);
  let error = '';
  latex.stderr.on('data', (data) => {
    error += data;
  });
  latex.stdout.on('data', (data) => {
    error += data;
  });
  latex.on('close', (code) => {
    if (code === 0) {
      info(`${colors.green('PDF generated at')} ${pdfPath}`);
    } else {
      warning(
        `${colors.red('We encountered an error.')} exit code ${code}, error log: ${error}\n${colors.red('End of error log.')}`
      );
    }
    const auxPath = mathlifiedPath.slice(0, -2) + 'aux';
    const logPath = mathlifiedPath.slice(0, -2) + 'log';
    remove(auxPath);
    remove(logPath);
  });
}
