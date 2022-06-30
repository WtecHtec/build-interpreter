const ASTParser = require('./evaParser')
module.exports = (code) => {
	return ASTParser.parse(code);
}