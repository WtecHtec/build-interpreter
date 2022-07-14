const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
  assert.strictEqual(
    run(`
			(import Math)
			(var abs (prop Math abs))
			(print (abs (- 10)))
      (print (prop Math MAX_VALUE) )
			(+ 3 3)
    `),
		6
  )
}
