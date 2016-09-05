var models = {
  1: {
    "name": "Disselva",
    "city": "New York"
  },
  2: {
    "name": "Rogue",
    "city": "Prague"
  },
  3: {
    "name": "Nigel",
    "city": "Italy"
  },
  4: {
    "name": "Kumar",
    "city": "Mumbai"
  },
}
var model = {
  findUser: (query, callback)=>{
    var user = models[query.user_id]
    user.save = model.save
    process.nextTick(()=>{
      callback(null, user)
    })
  },
  save: (user, callback)=>{
    process.nextTick(()=>{
      callback(null, user)
    })
  }
}
module.exports = model