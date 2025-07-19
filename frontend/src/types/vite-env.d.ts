/* eslint-disable unicorn/prevent-abbreviations */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PRO: 'false' | 'true'
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
