const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
  assert.strictEqual(
    run(`
			(
				module Math (
					begin 
					(def abs (value)
						(if (< value 0)
							(begin 
								(print value "o")
								(- value)
							)
							(print value 0)
						)
					)
				)
			)
			 (print ((prop Math abs) (- 10)))
			(+ 3 3)
    `),
		6
  )
}

/**
 * 
 *  (exports abs square)
 *	(import (export1 export2) name)
 *
 * 
 * */