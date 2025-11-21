import type { Vitest } from 'vitest';

declare global {
    interface ImportMeta {
        readonly vitest?: Vitest;
    }
}

export {};
