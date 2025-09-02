import type { Awaitable } from "@/libs/awaitable/mod.ts";
import { Context } from "@/mods/runner/context/mod.ts";
import { TestError } from "@/mods/runner/error/mod.ts";

/**
 * Run a test block
 * @param message message to show
 * @param closure closure to run
 * @returns result of closure
 */
export async function test(message: string, closure: (context: Context) => Awaitable<void>) {
  try {
    const context = new Context(message)
    await closure(context)
    await context.wait()
  } catch (cause: unknown) {
    throw TestError.unroll(new TestError(message, { cause }))
  }
}