/**
 * 变量声明环境
 */
class Environment {
	/**
	 * 构造默认变量
	 * @param {*} record 
   * @param {*} parent 父级作用域链
	 */
	constructor(record = {}, parent = null) {
		this.record = record;
    this.parent = parent;
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
  /**
   * 获取声明变量的值
   * @param {*} name 
   * @returns 
   */
	lookup(name) {
		return this.resolve(name).record[name];
	}
  /**
   * 更新变量值
   * @param {*} name 
   * @param {*} value 
   * @returns 
   */
  assign(name, value) {
    // 作用域更新值
    this.resolve(name).record[name] = value;
    return value;
  }
  /**
   * 递归遍历整个作用域链，查找变量
   * @param {*} name 
   * @returns 
   */
  resolve(name) {
    // 当前作用域如果存在变量，返回当前作用域
    if (this.record.hasOwnProperty(name)) {
      return this;
    }
    // 遍历整个作用域链，没有变量，说明变量没有声明
    if (this.parent === null) {
      return new ReferenceError(`变量${name}未声明`);
    }
    return this.parent.resolve(name);
  }
}
module.exports = Environment;