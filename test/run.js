const Eva = require('./index')
const Ast = require('./parser/index')
module.exports = (code) => {
	const eva = new Eva();
	const ast = Ast(`(begin ${code})`);
	return eva.evalGlobal(ast)
}
