import { Promisable } from "libs/promisable.js";

export class TestError extends Error { }

export class Context {

  constructor(
    readonly message: string
  ) {
    this.test = this.test.bind(this)
    this.before = this.before.bind(this)
    this.after = this.after.bind(this)
  }

  private befores = new Array<() => Promisable<void>>()
  private afters = new Array<() => Promisable<void>>()

  /**
   * Run something before each test block
   * @param closure closure
   */
  before(closure: () => Promise<void>) {
    this.befores.push(closure)
  }

  /**
   * Run something before each test block
   * @param closure closure
   */
  after(closure: () => Promise<void>) {
    this.afters.push(closure)
  }

  /**
   * Run a test block
   * @param message message to show
   * @param closure closure to run
   * @returns result of closure
   */
  async test<T>(message: string, closure: (context: Context) => Promise<T>) {
    try {
      await Promise.all(this.befores.map(it => it()))
      const result = await closure(new Context(message))
      await Promise.all(this.afters.map(it => it()))
      return result
    } catch (cause: unknown) {
      throw new TestError(message, { cause })
    }
  }
}