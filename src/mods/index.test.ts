import { assert, throws } from "mods/assert/index.js";
import { test } from "mods/runner/global.js";

function throwable() {
  throw new Error("lol")
}

function notThrowable() {
  ;
}

test("it should test", async ({ test, before, after }) => {

  before(async () => {
    console.log("this is shown before each test")
  })

  after(async () => {
    console.log("this is shown after each test")
  })

  await test("it should not throw", async () => {
    assert(throws(() => notThrowable()) === false, "it should not throw!!!")
  })

  await test("it should throw", async () => {
    assert(throws(() => throwable()) === true, "it should throw!!!")
  })
})