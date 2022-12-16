<div align="center">
<img width="500" src="https://user-images.githubusercontent.com/4405263/208164108-5be58f53-a29b-46b3-be90-3886f4afc32d.png" />
<h3 align="center">Modern and minimalist testing library</h3>
</div>

```bash
npm i @hazae41/phobos
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/phobos)

## Philosophy

Phobos aims to be minimalist and to always work no matter the:
- runtime (Node, Deno, browser)
- module resolution (ESM, CommonJS)
- language (TypeScript, JavaScript)
- bundler (Rollup, Vite)

It's just a library you can import everywhere! That's it, no CLI, no configuration file, just JavaScript.

## Current features
- 100% TypeScript and ESM
- No external dependency
- Unit tested (by itself)
- Runnable in the browser
- Run test blocks in test blocks
- Run code before and after each test
- Assertion helpers

## Usage

```typescript
import { assert, test } from "@hazae41/phobos"

test("it should work", async () => {
  assert(false, "oh no")
})
```

## Running

### Setup

Most setups will just need a custom entry point that imports all your tests, that you either run as-is using `ts-node`, or that you transpile using your favorite bundler.

For example, the entry point `index.test.ts` imports:
  - `some-module/index.test.ts`, which imports:
    - `some-module/some-file.test.ts`
    - `some-module/some-other-file.test.ts`
  - `some-other-module/index.test.ts`, which imports:
    - `some-other-module/some-file.test.ts`
    - `some-other-module/some-other-file.test.ts`

You can see an example on this repository, all tests are imported in `src/index.test.ts`, then we use Rollup to transpile it into `dist/test/index.test.cjs`, which we then run using Node with `node ./dist/test/index.test.cjs`.

### Examples

#### Using a bundler

```bash
node ./dist/test/index.test.cjs
```

#### Using ts-node with ESM

```bash
ts-node --esm src/index.test.ts
```

#### Using ts-node with ESM and ttypescript

```bash
ts-node --esm --compiler ttypescript src/index.test.ts
```

#### Using dynamic import

```typescript
await import("index.test.ts")
```
