import type { Closure } from "../closure/mod.ts";
import { TestError } from "../error/mod.ts";

export interface Context {

  readonly name: string

  test(name: string, closure: Closure): Promise<boolean>

}

export namespace Context {

  export function test(name: string, closure: Closure): void {
    if ("Deno" in globalThis)
      return DenoContext.test(name, closure)
    if ("process" in globalThis)
      return Standalone.test(name, closure)
    return Standalone.test(name, closure)
  }

  export class Standalone implements Context {

    constructor(
      readonly name: string
    ) {
      this.test = this.test.bind(this)
    }

    static test(name: string, closure: Closure) {
      Promise.try(async () => {
        try {
          await closure(new Standalone(name))
        } catch (cause: unknown) {
          throw new TestError(name, { cause })
        }
      }).catch(console.error)
    }

    async test(name: string, closure: Closure): Promise<boolean> {
      try {
        const subcontext = new Standalone(name)

        await closure(subcontext)

        return true
      } catch (cause: unknown) {
        throw new TestError(name, { cause })
      }
    }

  }

  export class DenoContext implements Context {

    constructor(
      readonly inner: Deno.TestContext
    ) {
      this.test = this.test.bind(this)
    }

    static test(name: string, closure: Closure) {
      Deno.test(name, c => Promise.try(() => closure(new DenoContext(c))))
    }

    get name(): string {
      return this.inner.name
    }

    /**
     * Run a test block
     * @param message message to show
     * @param closure closure to run
     * @returns result of closure
     */
    test(name: string, closure: Closure): Promise<boolean> {
      return this.inner.step(name, c => Promise.try(() => closure(new DenoContext(c))))
    }

  }

}