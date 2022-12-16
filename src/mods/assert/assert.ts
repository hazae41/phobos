/**
 * Just an assert function
 * @param condition 
 * @param message 
 */
export function assert(condition: boolean, message = "Expected condition to be true") {
  if (!condition) throw new Error(message)
}