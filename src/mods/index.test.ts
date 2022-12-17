import { assert, rejects, throws } from "mods/assert/index.js";
import { test } from "mods/runner/global.js";

function throwable() {
  throw new Error("lol")
}

function notThrowable() {
  ;
}

async function rejectable() {
  throw new Error("lol")
}

async function notRejectable() {
  ;
}

test("it should test", async ({ test, before, after }) => {

  before(async () => {
    console.log("this is shown before each test")
  })

  after(async () => {
    console.log("this is shown after each test")
  })

  await test("it should throw", async ({ message }) => {
    assert(throws(() => throwable()) === true, "it should throw!!!")
    console.log(message, "succeeded")
  })

  await test("it should not throw", async ({ message }) => {
    assert(throws(() => notThrowable()) === false, "it should not throw!!!")
    console.log(message, "succeeded")
  })

  await test("it should reject", async ({ message }) => {
    assert(await rejects(() => rejectable()) === true, "it should reject!!!")
    console.log(message, "succeeded")
  })

  await test("it should not reject", async ({ message }) => {
    assert(await rejects(() => notRejectable()) === false, "it should reject!!!")
    console.log(message, "succeeded")
  })
})