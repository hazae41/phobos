export class TestError extends Error {
  readonly #class = TestError

  override readonly name: string = this.#class.name

}

// deno-lint-ignore no-namespace
export namespace TestError {

  export function unroll(error: TestError): TestError {
    let message = error.message

    while (error.cause instanceof TestError) {
      error = error.cause
      message = `${message} > ${error.message}`
    }

    return new TestError(message, { cause: error.cause })
  }

}