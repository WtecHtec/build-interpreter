const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
  assert.strictEqual(
    run(`
    (begin
      (def add (x)
        (+ x x)
      )
      (print (add 2) )
      (add 2)
    )
    `), 
    4
  )
}
