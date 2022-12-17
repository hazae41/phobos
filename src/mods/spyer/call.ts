export class Call<P extends Array<unknown>, R> {
  constructor(
    readonly params: P,
    readonly result: R,
    readonly time = new Date()
  ) { }
}