import { TestError } from "mods/runner/error.js";

export class Context {
  private _befores = new Array<(context: Context) => Promise<void>>()
  private _afters = new Array<(context: Context) => Promise<void>>()

  private _catcher?: (error: TestError, context: Context) => Promise<void>

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
  before(closure: (context: Context) => Promise<void>) {
    this._befores.push(closure)
  }

  /**
   * Run something after each test block
   * @param closure closure
   */
  after(closure: (context: Context) => Promise<void>) {
    this._afters.push(closure)
  }

  /**
   * Run something when an error is thrown
   * @param closure 
   */
  catcher(closure: (error: TestError, context: Context) => Promise<void>) {
    this._catcher = closure
  }

  private _tests = new Array<Promise<void>>()

  /**
   * Run a test block
   * @param message message to show
   * @param closure closure to run
   * @returns result of closure
   */
  async test(message: string, closure: (context: Context) => Promise<void>) {
    const promise = this._test(message, closure)
    this._tests.push(promise)
    return promise.catch(() => { })
  }

  private async _test(message: string, closure: (context: Context) => Promise<void>) {
    const context = new Context(message)

    for (const before of this._befores)
      await before(context)

    try {
      await closure(context)
      await context.wait()
    } catch (cause: unknown) {
      const error = new TestError(message, { cause })
      if (!this._catcher) throw error

      try {
        await this._catcher?.(error, context)
      } catch (cause: unknown) {
        throw new TestError(message, { cause })
      }
    } finally {
      for (const after of this._afters)
        await after(context)
    }
  }

  /**
   * Wait for all tests to finish (called by default at the end of each test block)
   * @why You want to forcefully wait in the midst of a test block
   */
  async wait() {
    try {
      await Promise.all(this._tests)
    } finally {
      this._tests = new Array()
    }
  }
}