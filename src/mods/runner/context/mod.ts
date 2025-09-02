import type { Awaitable } from "@/libs/awaitable/mod.ts";
import { TestError } from "@/mods/runner/error/mod.ts";

export class Context {

  #befores = new Array<(context: Context) => Awaitable<void>>()
  #afters = new Array<(context: Context) => Awaitable<void>>()

  #catcher?: (error: TestError, context: Context) => Awaitable<void>

  #tests = new Array<Promise<void>>()

  constructor(
    readonly message: string
  ) {
    this.test = this.test.bind(this)
    this.before = this.before.bind(this)
    this.after = this.after.bind(this)
    this.catcher = this.catcher.bind(this)
    this.wait = this.wait.bind(this)
  }

  /**
   * Run something before each test block
   * @param closure closure
   */
  before(closure: (context: Context) => Awaitable<void>) {
    this.#befores.push(closure)
  }

  /**
   * Run something after each test block
   * @param closure closure
   */
  after(closure: (context: Context) => Awaitable<void>) {
    this.#afters.push(closure)
  }

  /**
   * Run something when an error is thrown
   * @param closure 
   */
  catcher(closure: (error: TestError, context: Context) => Awaitable<void>) {
    this.#catcher = closure
  }

  /**
   * Run a test block
   * @param message message to show
   * @param closure closure to run
   * @returns result of closure
   */
  test(message: string, closure: (context: Context) => Awaitable<void>): Promise<void> {
    const promise = this.#test(message, closure)
    this.#tests.push(promise)
    return promise.catch(() => { })
  }

  async #test(message: string, closure: (context: Context) => Awaitable<void>) {
    const context = new Context(message)

    for (const before of this.#befores)
      await before(context)

    try {
      await closure(context)
      await context.wait()
    } catch (cause: unknown) {
      const error = new TestError(message, { cause })
      if (!this.#catcher) throw error

      try {
        await this.#catcher?.(error, context)
      } catch (cause: unknown) {
        throw new TestError(message, { cause })
      }
    } finally {
      for (const after of this.#afters)
        await after(context)
    }
  }

  /**
   * Wait for all tests to finish (called by default at the end of each test block)
   * @why You want to forcefully wait in the midst of a test block
   */
  async wait() {
    try {
      await Promise.all(this.#tests)
    } finally {
      this.#tests = []
    }
  }
}