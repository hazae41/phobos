
import { assert, rejects, test, throws } from "@/mod.ts";
import { relative, resolve } from "node:path";

const directory = resolve("./dist/test/")
const { pathname } = new URL(import.meta.url)
console.log(relative(directory, pathname.replace(".mjs", ".ts")))

function throwable() {
  throw new Error("lol")
}

function notThrowable() {
  ;
}

test("throws", async ({ test }) => {

  await test("should throw", () => {
    assert(throws(() => throwable()) === true, "it should throw!!!")
  })

  await test("should not throw", () => {
    assert(throws(() => notThrowable()) === false, "it should not throw!!!")
  })
})

// deno-lint-ignore require-await
async function rejectable() {
  throw new Error("lol")
}

// deno-lint-ignore require-await
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