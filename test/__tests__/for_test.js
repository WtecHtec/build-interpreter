const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
  assert.strictEqual(
    run(`
    (begin
      (var y 10)
      (var n 0)
			(for
				(var x 0)
				(< x 10)
				(++ x)
        (-= y 10)
        (+= n 1)
			)
      (print y)
      n
    )
    `), 
    10
  )
}
