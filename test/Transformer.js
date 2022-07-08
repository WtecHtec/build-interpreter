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
	 * @param {*} exp 
	 * @returns 
	 */
	transformSwitchToIf(exp) {
		const [, ...cases] = exp;
		const ifExp = [ 'if', null, null, null];
		let current = ifExp;
		for (let i = 0; i < cases.length - 1; i++) {
			const  [currentCond, currentBlock] = cases[i];
			current[1] = currentCond;
			current[2] = currentBlock;
			const next = cases[i + 1];
			const [nextCond, nextBlock] = next;
			current[3] = nextCond === 'else' ? nextBlock : ['if'];
			current = current[3];
		}
		return ifExp;
	}
};