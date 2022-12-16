const { test, assert } = require("@hazae41/phobos");
const math = require("./math")

test('sum', async () => {
  assert(typeof math.sum === 'function');
  assert(math.sum(1, 2) === 3);
  assert(math.sum(-1, -2) === -3);
  assert(math.sum(-1, 1) === 0);
});

test('div', async () => {
  assert(typeof math.div === 'function');
  assert(math.div(1, 2) === 0.5);
  assert(math.div(-1, -2) === 0.5);
  assert(math.div(-1, 1) === -1);
});

test('mod', async () => {
  assert(typeof math.mod === 'function');
  assert(math.mod(1, 2) === 1);
  assert(math.mod(-3, -2) === -1);
  assert(math.mod(7, 4) === 3);
});