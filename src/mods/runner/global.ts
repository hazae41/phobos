import { Context, TestError } from "mods/runner/context.js";

function unwrap(error: TestError) {
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
export async function test<T>(message: string, closure: (context: Context) => Promise<T>) {
  try {
    return await closure(new Context(message))
  } catch (cause: unknown) {
    if (cause instanceof TestError)
      throw unwrap(new TestError(message, { cause }))
    throw new TestError(message, { cause })
  }
}