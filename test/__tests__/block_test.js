const assert = require('assert');
module.exports = (eva) => {
	assert.strictEqual(eva.eval([
		'begin',
		['var', 'x', 2],
		[ 'begin',
			['set', 'x', 4],
			['var', 'y', 2]
		],
		'x'
	]), 4)
}