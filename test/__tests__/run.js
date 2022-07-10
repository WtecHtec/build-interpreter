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
const switchTest = require('./switch_test')
const incTest = require('./inc_test')
const decTest = require('./dec_test')
const forTest = require('./for_test')
const classTest = require('./class_test')
const eva = new Eva();
// selfTest(eva);
// mathTest(eva);
// variableTest(eva);
// blockTest(eva);
// ifTest(eva);
// whileTest(eva);
// eva.eval(['print', '"jjjj"', '"kk"']);
// parserTest();
// defFuncTest();
// lambdaFuncTest();
// switchTest();
// incTest();
// decTest();
// forTest();
classTest();
console.log('All pass')

