module.exports = class Transformer {
	/**
	 * 声明函数同时定义匿名函数
	 * @param {*} exp 
	 * @returns 
	 */
	transformDefToVarLambda(exp) {
		const [, name, params, body] = exp;
		const varExp = ['var', name, ['lambda', params, body]];
		return varExp;
	}
	/**
	 * 使用if 实现 switch
   * 示例： [if (== x 10)  10 11]
	 * @param {*} exp 
	 * @returns 
	 */
	transformSwitchToIf(exp) {
		const [, ...cases] = exp;
		const ifExp = [ 'if', null, null, null];
		let current = ifExp;
		for (let i = 0; i < cases.length - 1; i++) {
			const [currentCond, currentBlock] = cases[i];
			current[1] = currentCond;
			current[2] = currentBlock;
			const next = cases[i + 1];
			const [nextCond, nextBlock] = next;
			current[3] = nextCond === 'else' ? nextBlock : ['if'];
			current = current[3];
		}
		return ifExp;
	}
  /**
   * 自增 x++
   * 示例 [set x [+ x 10]]
   * @param {*} exp 
   */
  transformInc(exp) {
    const [, inxVal] = exp;
    const setExp = ['+=' , inxVal, 1];
    return setExp;
  }
  /**
   * 自减 x--
   * 示例 [set x [- x 10]]
   * @param {*} exp 
   */
  transformDec(exp) {
    const [, decVal] = exp;
    const dexExp =  ['-=' , decVal, 1];
    return dexExp;
  }

  /**
   * while 模拟for 循环体
   * 示例： [for (var) (cond) (opt) (block) ]
   * @param {*} exp 
   */
  transformForToWhile(exp) {
    const [, forVal, forCond, ...forBlock] = exp;
    const forExp = ['begin', forVal, ['while', forCond, ['begin', ...forBlock]]];
    console.log('forExp===', forExp)
    return forExp;
  }

  /**
   * 复合赋值 +=
   * 示例 [+= x 10]
   * @param {*} exp 
   */
  transformAssignAdd(exp) {
    const [, variable, value] = exp;
    const assAddExp = ['set', variable, null];
    assAddExp[2] = ['+' , variable, value];
    return assAddExp;
  }

    /**
   * 复合赋值 -=
   * 示例 [+= x 10]
   * @param {*} exp 
   */
  transformAssignDec(exp) {
    const [, variable, value] = exp;
    const assAddExp = ['set', variable, null];
    assAddExp[2] = ['-' , variable, value];
    return assAddExp;
  }

};