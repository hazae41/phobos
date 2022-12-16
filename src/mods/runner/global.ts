import { Context, TestError } from "mods/runner/context.js";

const context = new Context()

function unwrap(error: TestError): never {
  let message = error.message

  while (error.cause instanceof TestError) {
    error = error.cause
    message = `${message} > ${error.message}`
  }

  throw new TestError(message, { cause: error.cause })
}

/**
 * Run a test block
 * @param message message to show
 * @param closure closure to run
 * @returns result of closure
 */
export async function test<T>(message: string, closure: (context: Context) => Promise<T>) {
  try {
    return await context.test(message, closure)
  } catch (error: unknown) {
    if (error instanceof TestError)
      return unwrap(error)
    throw error
  }
}