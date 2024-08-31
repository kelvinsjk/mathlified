export type QuizExports = {
  generateState: () => Record<string, number>;
  topic: string;
};

export type Data = {
  state: Record<string, number>;
  title: string;
};

import { z } from 'zod';
const quizSchema = z.object({
  generateState: z.function().returns(z.record(z.string(), z.number())),
  title: z.string()
});

export const preprocess: {
  md?: (file: string) => Data;
  module: (module: unknown) => Data;
} = {
  module: (module: unknown) => {
    const mod = quizSchema.parse(module);
    return {
      state: mod.generateState(),
      title: mod.title
    };
  }
};
