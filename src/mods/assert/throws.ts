/**
 * Check if a closure throws
 * @param closure closure to check
 * @returns true if the closure throwed
 */
export function throws(closure: () => unknown) {
  try {
    closure()
    return false
  } catch (e: unknown) {
    return true
  }
}

/**
 * Check if an async closure rejects (throws)
 * @param closure async closure to check
 * @returns a promise that returns true if the closure rejected
 */
export async function rejects(closure: () => Promise<unknown>) {
  try {
    await closure()
    return false
  } catch (e: unknown) {
    return true
  }
}