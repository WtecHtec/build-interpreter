const Eva = require('../index')
const Environment = require('../Environment')
const blockTest = require('./block_test')
const mathTest = require('./math_test')
const selfTest = require('./self_test')
const variableTest = require('./variable_test')
const ifTest = require('./if_test')
const whileTest = require('./while_test')
const parserTest = require('./parser_test')
const defFuncTest = require('./def_func_test')
const lambdaFuncTest = require('./lambda_func_test')
const eva = new Eva();
selfTest(eva);
mathTest(eva);
variableTest(eva);
blockTest(eva);
ifTest(eva);
whileTest(eva);
eva.eval(['print', '"jjjj"', '"kk"']);
parserTest();
defFuncTest();
lambdaFuncTest();
console.log('All pass')

