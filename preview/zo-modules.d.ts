/**
 * The routes import three from esm.sh so Zo Space can load it without a bundler.
 * Locally, vite aliases that specifier to the installed `three` package; this tells
 * TypeScript to do the same.
 */
declare module "https://esm.sh/three@0.170.0" {
  export * from "three";
}
