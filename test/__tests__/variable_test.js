const assert = require('assert');
module.exports = (eva) => {
	assert.strictEqual(eva.eval(['var','test','"true"']), 'true')
	assert.strictEqual(eva.eval(['var','test','true']), true)
}