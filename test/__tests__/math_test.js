const assert = require('assert');
module.exports = (eva) => {
	assert.strictEqual(eva.eval(['+',['*', 2, 2],1]), 5)
	assert.strictEqual(eva.eval(['-',1,1]), 0)
	assert.strictEqual(eva.eval(['/',1,1]), 1)
	assert.strictEqual(eva.eval(['*',1,1]), 1)
}