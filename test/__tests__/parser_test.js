const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
	assert.strictEqual(
		run(`
		(begin
			(+ 3 3)
			)
		`), 
		6
	)
}
