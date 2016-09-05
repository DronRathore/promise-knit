'use strict';

function feedPromise(param, output, trigger) {
  if (typeof trigger != "function") {
    trigger = output;
    output = {};
  }
  return new Promise(function (resolve, reject) {
    trigger(param, output).then(function (data) {
      return resolve(data);
    }).catch(function (err) {
      return reject(err);
    });
  });
}
var setupPromise = function setupPromise(params, triggers) {
  if (params instanceof Array) {
    if (triggers instanceof Array) {
      return { params: Array().concat([], params), triggers: triggers };
    } else if (triggers instanceof Function) {
      return { params: Array().concat([], params), triggers: [triggers] };
    } else {
      throw new Error("Invalid consumers list");
    }
  } else {
    throw new Error("params passed must be an array");
  }
};
Promise.knit = Promise.knit || function (params, consumers, outputStub, chain) {
  return new Promise(function (resolve, reject) {
    var config = setupPromise(params, consumers);
    var output = outputStub ? outputStub : {};
    var nextPromise = function nextPromise(_params, _consumers, _output) {
      var value = _params.shift();
      var trigger = _consumers[0];
      if (value == undefined) {
        _consumers.shift();
        if (_consumers.length == 0) {
          return resolve(_output);
        } else {
          if (!chain) {
            _params = Array().concat([], config.params);
            return nextPromise(_params, _consumers, _output);
          } else {
            _params = output;
            return nextPromise(_params, _consumers, []);
          }
        }
      }
      return feedPromise(value, _output, trigger).then(function (data) {
        output = data;
        return nextPromise(_params, _consumers, _output);
      }).catch(function (err) {
        return reject(err);
      });
    };
    return nextPromise(Array().concat([], config.params), Array().concat([], config.triggers), output);
  });
};
