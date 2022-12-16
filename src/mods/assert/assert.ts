import { AssertError } from "mods/assert/error.js";

/**
 * Just an assert function
 * @param condition should be true
 * @param message message to throw if condition is false
 */
export function assert(condition: boolean, message = "Expected condition to be true") {
  if (!condition) throw new AssertError(message)
}