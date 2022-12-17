import { Call } from "mods/spyer/call.js"

export function spy<P extends Array<unknown>, R>(
  closure: (...p: P) => R
) {
  return new Spyer(closure)
}

export class Spyer<P extends Array<unknown>, R> {
  constructor(
    readonly closure: (...p: P) => R
  ) { }

  readonly calls = new Array<Call<P, R>>()

  call(...params: P): R {
    const result = this.closure(...params)
    this.calls.push(new Call(params, result))
    return result
  }
}