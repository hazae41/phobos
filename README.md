<div align="center">
<img width="500" src="https://user-images.githubusercontent.com/4405263/208164108-5be58f53-a29b-46b3-be90-3886f4afc32d.png" />
</div>
<h3 align="center">
Modern and minimalist testing library
</h3>

```bash
deno install @hazae41/phobos
```

[**JSR Package 📦**](https://www.npmjs.com/package/@hazae41/phobos)

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

test("it should work", () => {
  assert(false, "oh no")
})
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

You can also use `await Promise.all(...)` to forcefully join

```typescript
import { assert, test } from "@hazae41/phobos"

test("it should work", async ({ test }) => {
  const tests = []
  
  tests.push(test("first test", async () => {
    assert(true, "should be true")
  }))
  
  tests.push(test("second test", async () => {
    assert(true, "should be true")
  }))

  // wait first and second tests
  await Promise.all(tests)

  tests.push(test("third test", async () => {
    assert(true, "should be true")
  }))

  // wait last test
  await Promise.all(tests)
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

## Running 🏎️

#### Node

```bash
node ./src/**/**.test.ts
```

#### Deno

```bash
deno test
```

#### Other

```typescript
await import("./mymodule.test.ts")
```
