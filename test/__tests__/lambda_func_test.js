const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
  assert.strictEqual(
    run(`
    (begin
      (def add (x y)
				(begin 
					(print (+ x y))
					(+ x y)
				)
      )
			(def cal (callback)
				(
					begin 
					(var x 10)
					(var y 20)
					(callback x y)
				)
			)
			(cal add)
    )
    `), 
    30
  )
}
