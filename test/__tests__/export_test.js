const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
  assert.strictEqual(
    run(`
			(import (MAX_VALUE abs) Math)
			(print (abs (- 22)) "k")
			(+ 3 3)
    `),
		6
  )
}

/**
 * 
 *  (exports abs square)
 * 
 *	(import (export1 export2) Math)
 * 
 *   (improt Math)
 *  （var export1 (porp Math export1)）
 * 	（var export2 (porp Math export2)）
 * */