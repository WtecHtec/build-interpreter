const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
	assert.strictEqual(
		run(`
		(begin
      (var x 3)
			(++ x)
      x
			)
		`), 
		4
	)
}
