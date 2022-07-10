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
			
						)
						(def calc (this)
							
						)
					)
				)
				(var p (new Point 10 20))
				((prop p calc) p)
			)
    `), 
    10
  )
}
