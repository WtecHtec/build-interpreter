const assert = require('assert');
const Environment = require('./Environment')
class Eva {
	/**
	 * 创建全局变量环境
	 * @param {*} global 
	 */
	constructor(global = new Environment()) {
		this.global = global
	}
	/**
	 *  创建eva解释器
	 *  全局变量环境
	 * @param {*} exp 
	 * @param {*} env 
	 * @returns 
	 */
	eval(exp, env = this.global) {

		if (isNumber(exp)) {
			return exp;
		}

		if (isString(exp)) {
			return exp.slice(1, -1);
		}

		if (Array.isArray(exp)) {
			/** 数学运算 */
			if (exp[0] === '+') {
				return this.eval(exp[1]) + this.eval(exp[2]);
			}

			if (exp[0] === '-') {
				return this.eval(exp[1]) - this.eval(exp[2]);
			}

			if (exp[0] === '*') {
				return this.eval(exp[1]) * this.eval(exp[2]);
			}

			if (exp[0] === '/') {
				return this.eval(exp[1]) / this.eval(exp[2]);
			}

			/** 变量声明 */
			if (exp[0] === 'var') {
				const [_, name, value] = exp;
				return env.define(name,  this.eval(value));
			}
		}

		/** 获取声明变量值 */
		if (isVariableName(exp)) {
			return env.lookup(exp)
		}

		throw `Unimplemented: ${JSON.stringify(exp)}`;
	}
}
/**
 * 判断是否是一个数字
 * @param {*} exp 
 */
function isNumber(exp) {
	return typeof exp === 'number';
}

/**
 * 判断是否是一个字符串
 * @param {*} exp 
 */
function isString(exp) {
	return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

/**
 * 判断是否是一个变量
 * @param {*} exp 
 * @returns 
 */
function isVariableName(exp) {
	return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

const eva = new Eva(new Environment({
	true: true,
	false: false,
	null: null,
	version: '0.1'
}));
assert.strictEqual(eva.eval(1), 1)
assert.strictEqual(eva.eval('"hello word"'), 'hello word')
assert.strictEqual(eva.eval(['+',['*', 2, 2],1]), 5)
assert.strictEqual(eva.eval(['-',1,1]), 0)
assert.strictEqual(eva.eval(['/',1,1]), 1)
assert.strictEqual(eva.eval(['*',1,1]), 1)
assert.strictEqual(eva.eval(['var','test','"true"']), 'true')
assert.strictEqual(eva.eval(['var','test','true']), true)
console.log('All pass')