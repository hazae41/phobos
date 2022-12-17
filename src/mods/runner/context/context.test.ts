import { assert } from "mods/assert/assert.js";
import { test } from "mods/runner/global/global.js";

test("before and after", async ({ test, before, after }) => {
  let check = false

  before(async () => {
    assert(check === false, `failed before check`)

    check = true
  })

  after(async () => {
    assert(check === true, `failed after check`)

    check = false
  })

  await test("just a test", async () => {
    assert(check === true, `failed inner check`)
  })

  assert(check === false, `failed inner check`)
})

class MyError extends Error { }

test("catcher can rethrow", async ({ test, catcher }) => {
  catcher(async (e) => {
    assert(e.cause instanceof MyError, `failed to catch`)
  })

  await test("just a test that throws", async () => {
    throw new MyError()
  })
})

test("catcher can just count", async ({ test, catcher }) => {
  let counter = 0

  catcher(async () => { counter++ })

  await test("just a test that throws", async () => {
    throw new MyError()
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
  } catch (e: unknown) {
    catched = true
  }

  assert(catched === true, `should have catched`)
})

test("parallel error vs inner error", async ({ test, catcher }) => {
  let count = 0
  let cause: unknown = "none"

  catcher(async (e) => {
    count++
    cause = e.cause
  })

  await test("our inner test", async ({ test }) => {
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