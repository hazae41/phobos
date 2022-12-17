<div align="center">
<img width="500" src="https://user-images.githubusercontent.com/4405263/208164108-5be58f53-a29b-46b3-be90-3886f4afc32d.png" />
</div>
<h3 align="center">
Modern and minimalist testing library
</h3>

```bash
npm i @hazae41/phobos
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/phobos)

## Philosophy 🧠

Phobos aims to be minimalist and to always work no matter the:
- runtime (Node, Deno, browser)
- module resolution (ESM, CommonJS)
- language (TypeScript, JavaScript)
- bundler (Rollup, Vite)

It's just a library you can import everywhere! That's it, no CLI, no configuration file, just JavaScript.

## Features 🔥

### Current features

- 100% TypeScript and ESM
- No external dependency
- Unit tested (by itself)
- Runnable in the browser
- Minimalist assertion helpers
- Asynchronous fork-join parallelism
- Function calls spying

## Usage 🚀

```typescript
import { assert, test } from "@hazae41/phobos"

test("it should work", async () => {
  assert(false, "oh no")
})
```

```bash
ts-node --esm ./test.ts
```

### Concurrent tests

Test blocks are always executed concurrently, unless you `await` them

```typescript
import { assert, test } from "@hazae41/phobos"

test("it should work", async ({ test }) => {
  
  // run in sequence
  await test("first test", async () => {
    assert(true, "should be true")
  })
  
  // or in parallel
  test("second test", async () => {
    assert(true, "should be true")
  })
})
```

You can also use `await wait()` to forcefully join

```typescript
import { assert, test } from "@hazae41/phobos"

test("it should work", async ({ test, wait }) => {
  
  test("first test", async () => {
    assert(true, "should be true")
  })
  
  test("second test", async () => {
    assert(true, "should be true")
  })

  // wait first and second tests
  await wait()

  test("third test", async () => {
    assert(true, "should be true")
  })
})
```

### Spying function calls

You can spy on function calls using `spy(function)`

You can then `.call()` it and get a list of all its `.calls`

```typescript
import { assert, test, spy } from "@hazae41/phobos"

test("it should work", async () => {
  const f = spy((param: boolean) => !param)

  const result = f.call(true)
  assert(result === false, `result should be false`)

  assert(f.calls.length === 1, `should have been called 1 time`)
  assert(f.calls[0].params[0] === true, `should have been called with true`)
  assert(f.calls[0].result === false, `should have resulted in false`)
})
```

## Setting up 🔧

Most setups will just need a custom entry point that imports all your tests, that you either run as-is using `ts-node`, or that you transpile using your favorite bundler.

For example, the entry point `index.test.ts` imports:
  - `some-module/index.test.ts`, which imports:
    - `some-module/some-file.test.ts`
    - `some-module/some-other-file.test.ts`
  - `some-other-module/index.test.ts`, which imports:
    - `some-other-module/some-file.test.ts`
    - `some-other-module/some-other-file.test.ts`

You can see an example on this repository, all tests are imported in `src/index.test.ts`, then we use Rollup to transpile it into `dist/test/index.test.cjs`, which we then run using Node with `node ./dist/test/index.test.cjs`.

## Running 🏎️

#### Using a bundler

```bash
node ./dist/test/index.test.cjs
```

#### Using ts-node with ESM

```bash
ts-node --esm ./src/index.test.ts
```

#### Using ts-node with ESM and ttypescript

```bash
ts-node --esm --compiler ttypescript ./src/index.test.ts
```

#### Using dynamic import

```typescript
await import("index.test.ts")
```
