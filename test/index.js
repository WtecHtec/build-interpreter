
const Environment = require('./Environment');
const globalEnv = require('./GlobalEnvironment');
const Transformer = require('./Transformer');
const Ast = require('./parser/index')
const fs = require('fs');
class Eva {
	/**
	 * 创建全局变量环境
	 * @param {*} global 
	 */
	constructor(global = globalEnv) {
		this.global = global
		this._transformer = new Transformer();
	}
	/**
	 * 全局环境 运行环境
	 * @param {*} expressions
	 * @returns 
	 */
	evalGlobal(expressions) {
		return this._evalBody(
			expressions,
			this.global
		)
	}
	/**
	 *  创建eva解释器
	 *  全局变量环境
	 * @param {*} exp 
	 * @param {*} env 
	 * @returns 
	 */
	eval(exp, env = this.global) {

		if (this._isNumber(exp)) {
			return exp;
		}

		if (this._isString(exp)) {
			return exp.slice(1, -1);
		}

		if (Array.isArray(exp)) {
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
        const [_, ref, value] = exp;
				if(Array.isArray(ref) && ref[0] === 'prop') {
					const [, instance, propName] = ref;
					const instanceEnv = this.eval(instance, env);
					return instanceEnv.define(
						propName,
						this.eval(value, env),
					);
				}
        return env.assign(ref, this.eval(value, env));
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

			/** switch 分支 */
			if (exp[0] === 'switch') {
				const switchExp = this._transformer.transformSwitchToIf(exp);
				return this.eval(switchExp, env);
			}

      /**
       * 自增
       */
      if (exp[0] === '++') {
				const incExp = this._transformer.transformInc(exp);
				return this.eval(incExp, env);
			}

      /**
       * 自减
       */
      if (exp[0] === '--') {
				const decExp = this._transformer.transformDec(exp);
				return this.eval(decExp, env);
			}

      /**
       * 复合赋值
       */
      if (exp[0] === '+=') {
				const incExp = this._transformer.transformAssignAdd(exp);
				return this.eval(incExp, env);
			}

      /**
       * 自减
       */
      if (exp[0] === '-=') {
				const decExp = this._transformer.transformAssignDec(exp);
				return this.eval(decExp, env);
			}

      /** for 循环体 */
			if (exp[0] === 'for') {
				const forExp = this._transformer.transformForToWhile(exp);
				return this.eval(forExp, env);
			}


			/**
			 * 定义一个函数 同时 声明一个匿名函数
			 */
			if (exp[0] === 'def') {

				// 声明普通函数
				// const [, name, params, body] = exp;
				// const fn = {
				// 	params,
				// 	body,
				// 	env,
				// }
				// return env.define(name, fn)

				// 声明一个匿名函数
				// const varExp = ['var', name, ['lambda', params, body]]
				// return this.eval(varExp, env);
				
				const varExp = this._transformer.transformDefToVarLambda(exp);
				return this.eval(varExp, env);
			}
      
			/**
			 * 声明一个匿名函数
			 */
			if (exp[0] === 'lambda') {
				const [, params, body] = exp;
				return {
					params,
					body,
					env,
				}
			}

			/**
			 * class注册
			 */
			if (exp[0] === 'class') {
				const [, name, parent, body] = exp;
				const parentEnv = this.eval(parent, env) || env;
				const classEnv = new Environment({}, parentEnv);
				this._evalBody(body, classEnv);
				return env.define(name, classEnv);
			}
			/**
			 * 执行父级运行环境
			 */
			if (exp[0] === 'super') {
				const [, className] = exp;
				return this.eval(className, env).parent;
			}

			/**
			 * new
			 */
			if (exp[0] === 'new') {
				const classEnv = this.eval(exp[1], env);
				const instanceEnv = new Environment({}, classEnv);
				const args = exp.slice(2).map(arg => this.eval(arg, env))
				this._callUserDefinedFunction(
					classEnv.lookup('constructor'),
					[instanceEnv, ...args]
				);
				return instanceEnv;
			}
      
			if (exp[0] === 'prop') {
				const [, instance, name] = exp;
				const instanceEnv = this.eval(instance, env);
				return instanceEnv.lookup(name);
			}

			/**
			 * 注册模块
			 */
			if (exp[0] === 'module') {
				const [, name, body] = exp;
				const moduleEnv = new Environment({}, env);
				this._evalBody(body, moduleEnv);
				return env.define(name, moduleEnv);
			}

      /**
       * 引用模块
       */
			if (exp[0] === 'import') {
				const [, name] = exp;
				const moduleSrc = fs.readFileSync(
					`${__dirname}/modules/${name}.eva`,
					'utf-8',
				);
				const body = Ast(`(begin ${moduleSrc})`);
				const moduleExp = ['module', name, body];
				return this.eval(moduleExp, this.global);
			}
			/**
			 * 执行内置函数
			 */
			const fn = this.eval(exp[0], env);
			const args = exp.slice(1).map(item => this.eval(item, env));
			if (typeof fn === 'function') {
				return fn(...args);
			}

			/**
			 * 执行自定义函数
			 * 
			 */
			return this._callUserDefinedFunction(fn, args);
		}

		/** 获取声明变量的值 */
		if (this._isVariableName(exp)) {
			return env.lookup(exp)
		}

		throw `Unimplemented: ${JSON.stringify(exp)}`;
	}

	/**
	 * 执行自定义函数
	 */
	_callUserDefinedFunction(fn, args) {
		const activationRecord = {};
		fn.params.forEach((param, index) => {
			activationRecord[param] = args[index];
		})
		// 创建闭包概念
		const activationEnv = new Environment(
			activationRecord,
			fn.env
		)
		return this._evalBody(fn.body, activationEnv);
	}

	/**
	 * 执行函数体
	 * @param {*} body 
	 * @param {*} env 
	 * @returns 
	 */
	_evalBody(body, env) {
		if (body[0] === 'begin') {
			return this._evalBlock(body, env);
		}
		return this.eval(body, env);
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
		let runExp = [];
		/**
		 * import (exp1 exp2) math
		 * 转换
		 */
		expressions.forEach(item => {
			if (Array.isArray(item) && item[0] === 'import') {
				const [, arg1] = item;
				if (Array.isArray(arg1)) {
					const moduleExp = this._transformer.transformImports(item);
					runExp = [...runExp, ...moduleExp];
					return;
				}
				runExp.push(item);
			}
			runExp.push(item);
		})
    runExp.forEach(exp => {
      result = this.eval(exp, env)
    })
    return result;
  }
	/**
	 * 判断是否是一个数字
	 * @param {*} exp 
	 */
	_isNumber(exp) {
		return typeof exp === 'number';
	}
	/**
	 * 判断是否是一个字符串
	 * @param {*} exp 
	 */
	_isString(exp) {
		return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
	}
	/**
	 * 判断是否是一个变量
	 * @param {*} exp 
	 * @returns 
	 */
	_isVariableName(exp) {
		return typeof exp === 'string' && /^[+\-*/<>=a-zA-Za-zA-Z0-9_]*$/.test(exp);
	}
}

module.exports = Eva;