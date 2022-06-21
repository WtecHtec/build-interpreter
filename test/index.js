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
				return this.eval(exp[1], env) + this.eval(exp[2], env);
			}

			if (exp[0] === '-') {
				return this.eval(exp[1], env) - this.eval(exp[2], env);
			}

			if (exp[0] === '*') {
				return this.eval(exp[1], env) * this.eval(exp[2], env);
			}

			if (exp[0] === '/') {
				return this.eval(exp[1], env) / this.eval(exp[2], env);
			}

			/** 变量声明 */
			if (exp[0] === 'var') {
				const [_, name, value] = exp;
				return env.define(name,  this.eval(value, env));
			}

      /** 块区域 */
      if (exp[0] === 'begin') {
        // 创建新的作用域环境，当前env环境作为父级
        const blockEnv = new  Environment({}, env);
        return this._evalBlock(exp, blockEnv)
      }

      /** 重新赋值变量 */
      if (exp[0] === 'set') {
        const [_, name, value] = exp;
        return env.assign(name, this.eval(value, env));
      }
		}

		/** 获取声明变量的值 */
		if (isVariableName(exp)) {
			return env.lookup(exp)
		}

		throw `Unimplemented: ${JSON.stringify(exp)}`;
	}
  _evalBlock(block, env) {
    let result;
    const [_, ...expressions] = block;
    expressions.forEach(exp => {
      result = this.eval(exp, env)
    })
    return result;
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
assert.strictEqual(eva.eval(['begin',
  ['+', 2, 2]
]), 4)
assert.strictEqual(eva.eval([
  'begin',
  ['var', 'x', 2],
  [ 'begin',
    ['set', 'x', 4],
    ['var', 'y', 2]
  ],
  'x'
]), 4)
console.log('All pass')