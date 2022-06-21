const Eva = require('../index')
const Environment = require('../Environment')
const blockTest = require('./block_test')
const mathTest = require('./math_test')
const selfTest = require('./self_test')
const variableTest = require('./variable_test')
const ifTest = require('./if_test')
const whileTest = require('./while_test')
const eva = new Eva(new Environment({
	true: true,
	false: false,
	null: null,
	version: '0.1'
}));
selfTest(eva);
mathTest(eva);
variableTest(eva);
blockTest(eva);
ifTest(eva);
whileTest(eva);
console.log('All pass')