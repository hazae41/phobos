import type { Closure } from "../closure/mod.ts";

export class Context implements Context {

  constructor(
    readonly inner: Deno.TestContext
  ) {
    this.test = this.test.bind(this)
  }

  /**
   * Run a test block
   * @param message message to show
   * @param closure closure to run
   * @returns result of closure
   */
  test(name: string, closure: Closure): Promise<boolean> {
    return this.inner.step(name, inner => Promise.try(() => closure(new Context(inner))))
  }

}