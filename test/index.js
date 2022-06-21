
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

			/** 比较运算符 */
			if (exp[0] === '<') {
				return this.eval(exp[1], env) < this.eval(exp[2], env);
			}
			if (exp[0] === '<=') {
				return this.eval(exp[1], env) <= this.eval(exp[2], env);
			}
			if (exp[0] === '==') {
				return this.eval(exp[1], env) == this.eval(exp[2], env);
			}
			if (exp[0] === '>') {
				return this.eval(exp[1], env) > this.eval(exp[2], env);
			}
			if (exp[0] === '>=') {
				return this.eval(exp[1], env) >= this.eval(exp[2], env);
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

			/** if 分支 */
			if (exp[0] === 'if') {
				/**
				 * condition 判断条件
				 * consequent true 操作
				 * alternate false 操作
				 */
				const [_, condition, consequent, alternate] = exp;
				if (this.eval(condition , env)) {
					return this.eval(consequent, env)
				}
				return this.eval(alternate, env)
			}

			/** while 循环体 */
			if (exp[0] === 'while') {
				const [_, condition, body] = exp;
				let result;
				while(this.eval(condition, env)) {
					result = this.eval(body, env);
				}
				return result;
			}
		}

		/** 获取声明变量的值 */
		if (isVariableName(exp)) {
			return env.lookup(exp)
		}

		throw `Unimplemented: ${JSON.stringify(exp)}`;
	}

	/**
	 * 块级处理
	 * @param {*} block 
	 * @param {*} env 
	 * @returns 
	 */
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

module.exports = Eva;