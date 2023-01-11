import { Context } from "mods/runner/context/context.js";
import { TestError } from "mods/runner/error.js";

export function unwrap(error: TestError) {
  let message = error.message

  while (error.cause instanceof TestError) {
    error = error.cause
    message = `${message} > ${error.message}`
  }

  return new TestError(message, { cause: error.cause })
}

/**
 * Run a test block
 * @param message message to show
 * @param closure closure to run
 * @returns result of closure
 */
export async function test(message: string, closure: (context: Context) => Promise<void>) {
  try {
    const context = new Context(message)
    await closure(context)
    await context.wait()
  } catch (cause: unknown) {
    if (cause instanceof TestError)
      throw unwrap(new TestError(message, { cause }))
    throw new TestError(message, { cause })
  }
}