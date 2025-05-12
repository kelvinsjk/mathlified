export declare interface Options {
  siteName?: string;
  disable?: ('layout' | 'autoNav')[];
}

export declare function mathlified(options?: Options): import('vite').Plugin;
