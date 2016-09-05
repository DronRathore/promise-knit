'use strict'
function feedPromise(param, output, trigger){
	if (typeof trigger != "function"){
		trigger = output
		output = {}
	}
	return new Promise((resolve, reject)=>{
		trigger(param, output).then((data)=>{
			return resolve(data)
		}).catch((err)=>{
			return reject(err)
		})
	})
}
var setupPromise = (params, triggers)=>{
	if (params instanceof Array){
		if (triggers instanceof Array){
			return {params: Array().concat([], params), triggers: triggers}
		} else if (triggers instanceof Function){
			return {params: Array().concat([], params), triggers: [triggers]}
		} else {
			throw new Error("Invalid consumers list")
		}
	} else {
		throw new Error("params passed must be an array")
	}
}
Promise.knit = 
	Promise.knit || ((params, consumers, outputStub, chain)=>{
		return new Promise((resolve, reject)=>{
			var config = setupPromise(params, consumers)
			var output = outputStub ? outputStub : {}
			var nextPromise = (_params, _consumers, _output)=>{
				var value = _params.shift()
				var trigger = _consumers[0]
				if (value == undefined){
					_consumers.shift()
					if (_consumers.length == 0){
						return resolve(_output)
					} else {
						if (!chain){
							_params = Array().concat([], config.params)
							return nextPromise(_params, _consumers, _output)
						} else {
							_params = output
							return nextPromise(_params, _consumers, [])
						}
					}
				}
				return feedPromise(value, _output, trigger).then((data)=>{
					output = data;
					return nextPromise(_params, _consumers, _output)
				}).catch((err)=>{
					return reject(err)
				})
			}
			return nextPromise(Array().concat([], config.params), Array().concat([], config.triggers), output)
		})
	})