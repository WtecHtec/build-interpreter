const JSONParser = require('../parser/evaParser');

let value = JSONParser.parse(`
	(begin 
		(+ x x)
	)
`);

console.log(value); // JS object: {x: 10, y: [1, 2]}