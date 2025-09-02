import { assert } from "@/mods/assert/mod.ts";
import { test } from "@/mods/runner/global/mod.ts";
import { relative, resolve } from "node:path";

const directory = resolve("./dist/test/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

test("before and after", async ({ test, before, after }) => {
  let check = false

  before(() => {
    assert(check === false, `failed before check`)

    check = true
  })

  after(() => {
    assert(check === true, `failed after check`)

    check = false
  })

  await test("just a test", () => {
    assert(check === true, `failed inner check`)
  })

  assert(check === false, `failed inner check`)
})

test("catcher can rethrow", async ({ test, catcher }) => {
  catcher((e) => {
    assert(e.cause === "yes", `failed to catch`)
  })

  await test("just a test that throws", () => {
    throw "yes"
  })
})

test("catcher can just count", async ({ test, catcher }) => {
  let counter = 0

  catcher(() => { counter++ })

  await test("just a test that throws", () => {
    throw "yes"
  })

  assert(counter === 1, `counter should be 1`)
})

test("wait", async ({ test, wait }) => {
  test("just a test that runs parallelized and throws", async () => {
    await new Promise(ok => setTimeout(ok, 200))
    throw "parallel"
  })

  test("just another test that also runs parallelized but doesn't throw", async () => {
    await new Promise(ok => setTimeout(ok, 100))
  })

  let catched = false

  try {
    await wait()
  } catch (_: unknown) {
    catched = true
  }

  assert(catched === true, `should have catched`)
})

test("parallel error vs inner error", async ({ test, catcher }) => {
  let count = 0
  let cause: unknown = "none"

  catcher((e) => {
    count++
    cause = e.cause
  })

  await test("our inner test", ({ test }) => {
    test("just a test that runs parallelized and throws", async () => {
      await new Promise(ok => setTimeout(ok, 200))
      throw "parallel"
    })

    test("just another test that also runs parallelized but doesn't throw", async () => {
      await new Promise(ok => setTimeout(ok, 100))
    })

    throw "inner"
  })

  assert(count === 1, `should have catched 1 time`)
  assert(cause === "inner", `cause should be inner`)
})