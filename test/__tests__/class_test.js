const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
  assert.strictEqual(
    run(`
    	(begin
				(class Point null
					(begin
						(var a 10)
						(def constructor (this x y)
							(
								begin
								(set (prop this x) x)
								(set (prop this y) y)
							)
						)
						(def calc (this)
							(print (prop this x))
						)
					)
				)
				(var p (new Point 10 20))
				((prop p calc) p)
				(+ 3 3)
			)
    `),
		6
  )
}
