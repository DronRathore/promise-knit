'use strict'
/*
  @desc: This function triggers the callback with value passed to it
  @params:
    param: An atomic value
    output: A buffer end-state
    trigger:  consumer function
*/
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
/*
  @desc: Initialise the promise config
  @params:
    params: Array
    triggers: Function or [Function...]
*/
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
/*
  @desc: Main Promise.knit function
  @param:
    params: []
      > An array list of values to be consumed
    consumers: [Function..] or Function
      > An array of Promise Consumer(s)
    outputStub: Array or Object
      > Initial Output Stub value to be used by consumers
    chain: Boolean
      > Use the output object filled by the first consumer as input
        for the next consumer
*/
Promise.knit = 
  Promise.knit || ((params, consumers, outputStub, chain)=>{
    return new Promise((resolve, reject)=>{
      var config = setupPromise(params, consumers)
      var output = outputStub ? outputStub : {}
      var nextPromise = (_params, _consumers, _output)=>{
        var value = _params.shift()
        var trigger = _consumers[0]
        // are we done processing for first consumer?
        if (value == undefined){
          _consumers.shift()
          // are there any more consumers left
          if (_consumers.length == 0){
            // no? then resolve the last output state
            return resolve(_output)
          } else {
            // are we chaining outputs?
            if (!chain){
              // use single state output and inital params as input
              _params = Array().concat([], config.params)
              return nextPromise(_params, _consumers, _output)
            } else {
              // use output from last state as input for the next
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
      // initialise the whole process via copy of arguments
      return nextPromise(Array().concat([], config.params), Array().concat([], config.triggers), output)
    })
  })