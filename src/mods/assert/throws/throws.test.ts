import { assert, rejects, throws } from "mods/assert/index.js";
import { test } from "mods/runner/global/global.js";

function throwable() {
  throw new Error("lol")
}

function notThrowable() {
  ;
}

test("throws", async ({ test }) => {

  await test("should throw", async () => {
    assert(throws(() => throwable()) === true, "it should throw!!!")
  })

  await test("should not throw", async () => {
    assert(throws(() => notThrowable()) === false, "it should not throw!!!")
  })
})

async function rejectable() {
  throw new Error("lol")
}

async function notRejectable() {
  ;
}

test("rejects", async ({ test }) => {

  await test("should reject", async () => {
    assert(await rejects(() => rejectable()) === true, "it should reject!!!")
  })

  await test("should not reject", async () => {
    assert(await rejects(() => notRejectable()) === false, "it should reject!!!")
  })
})