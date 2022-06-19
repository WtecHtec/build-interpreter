/**
 * 变量声明环境
 */
class Environment {
	/**
	 * 构造默认变量
	 * @param {*} record 
	 */
	constructor(record = {}) {
		this.record = record;
	}
	/**
	 * 创建变量、初始值
	 * @param {*} name 
	 * @param {*} value 
	 * @returns 
	 */
	define(name, value) {
		this.record[name] = value;
		return value;
	}

	lookup(name) {
		if (!this.record.hasOwnProperty(name)) {
			return new ReferenceError(`变量${name}未声明`);
		}
		return this.record[name];
	}
}
module.exports = Environment;