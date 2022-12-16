/**
 * Check if a closure throws
 * @param closure 
 * @returns true if the function throwed
 */
export function throws(closure: () => unknown) {
  try {
    closure()
    return false
  } catch (e: unknown) {
    return true
  }
}