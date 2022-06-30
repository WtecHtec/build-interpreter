const Environment = require('./Environment')
/**
 * 全局变量
 * 内置函数
 * 内置常量
 */
module.exports = new Environment({
	true: true,
	false: false,
	null: null,
	version: '0.1',
	print(...arg) {
		console.log(...arg)
	},
	'+'(op1, op2) {
		return op1 + op2;
	},
	'-'(op1, op2) {
		if(op2 === null) return -op1;
		return op1 - op2;
	},
	'/'(op1, op2) {
		return op1/op2;
	},
	'*'(op1, op2) {
		return op1 * op2;
	},
	'<'(op1, op2) {
		return op1 < op2;
	},
	'>'(op1, op2) {
		return op1 > op2;
	},
	'<='(op1, op2) {
		return op1 <= op2;
	},
	'>='(op1, op2) {
		return op1 >= op2;
	},
	'=='(op1, op2) {
		return op1 == op2;
	},
})