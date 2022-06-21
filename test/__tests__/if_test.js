const assert = require('assert');
module.exports = (eva) => {
	assert.strictEqual(eva.eval([
		'begin',
			['var', 'x', 3],
			['if', ['==', 'x' , 2],
				['set', 'x', 4],
				['set', 'x', 6],
			],
			'x'
	]), 6)
}