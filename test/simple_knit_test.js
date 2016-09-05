require("../dist/index.min")
var chai = require("chai")
var assert = chai.assert;
var attachAProp = (param, output)=>{
	return new Promise((resolve, reject)=>{
		if (param == 2){
			++output.two
		}
		return resolve(output)
	})
}
var attachAnotherProp = (param, output)=>{
	return new Promise((resolve, reject)=>{
		if (param != 2){
			++output.notTwo
		}
		return resolve(output)
	})
}
var input = [2, 1, 2, 4, 2, 6, 2, 8, 2]
var output = {two: 0, notTwo: 0}

describe('Promise.knit', ()=>{
	it("should have the correct number of 2s and non-2s", (done)=>{
		Promise.knit(input, [attachAProp, attachAnotherProp], output).then((data)=>{
			try{
				assert(data != null, "data is not null")
				assert(data.two != null, "data.two is not null")
				assert(data.notTwo != null, "data.notTwo is not null")
				assert(data.notTwo == 4, "number of non-2 is 4")
				assert(data.two == 5, "number of 2 is 5")
				done()
			} catch(err){
				done(err)
			}
		}).catch((err)=>{
			done(err)
		})
	})
})