const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
  assert.strictEqual(
    run(`
    (begin
			(for
				(var x 0)
				(> x 10)
				(++ x)
				(print x)
			)
    )
    `), 
    100
  )
}
