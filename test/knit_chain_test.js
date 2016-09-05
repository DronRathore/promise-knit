require("../dist/index.min")
var chai = require("chai")
var model = require("./mongo_stub")
var assert = chai.assert;
var findUser = (user_id, output)=>{
	return new Promise((resolve, reject)=>{
		model.findUser({user_id: user_id}, (err, user)=>{
			if (err){
				reject(err)
			} else {
				output.push(user)
				resolve(output)
			}
		})
	})
}
var updateUser = (user, output)=>{
	return new Promise((resolve, reject)=>{
		user.timestamp = Date.now()
		user.save(user, (err, _user)=>{
			if (err){
				return reject(err)
			}
			output.push(_user)
			return resolve(output)
		})
	})
}
var input = [1, 2, 3, 4]
var output = []

describe('Promise.knit', ()=>{
	it("should update user timestamp", (done)=>{
		Promise.knit(input, [findUser, updateUser], output, true).then((data)=>{
			try{
				assert(data != null, "data is not null")
				assert(data.length == 4, "total 4 docs processed")
				data.map((user)=>{
					assert(user.timestamp != null, "timestamp updated")
				})
				done()
			} catch(err){
				done(err)
			}
		}).catch((err)=>{
			done(err)
		})
	})
})