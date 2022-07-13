const run = require('../run')
const assert = require('assert');
module.exports = (eva) => {
  assert.strictEqual(
    run(`
				(class Point null
					(begin
						(var a 10)
						(def constructor (this x y)
							(
								begin
								(set (prop this x) x)
								(set (prop this y) y)
							)
						)
						(def calc (this)
							(print "parent" (prop this x))
						)
					)
				)
				(var p (new Point 10 40))
				((prop p calc) p)
				(class Point3D Point
					(begin
						(var a 10)
						(def constructor (this x y z)
							(
								begin
								((prop (super Point3D) constructor) this x y)
								(set (prop this z) z)
							)
						)
						(def calc (this)
							(begin
								( (prop (super Point3D) calc) this)
								(print (prop this y))
							)
						)
					)
				)
				(var p1 (new Point3D 11 20 89))
				((prop p1 calc) p1)
				(+ 3 3)
    `),
		6
  )
}
