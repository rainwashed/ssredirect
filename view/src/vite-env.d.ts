/// <reference types="vite/client" />

declare interface Array extends Array {
  sample(): any;
}

interface ImportMetaEnv {
  readonly VITE_CONNECTIONURL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
