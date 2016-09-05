# promise-knit
When you have a fix set of input and fix set of consumer functions for that input you end up in nesting functions, handling the state of the output. I created Knit to make my code look much readable and manageable.

##Usage
```javascript
/*
  input = Array
  consumers = Function or Array of Functions
  outputStub (optional) = An initial Output value
  chain = Boolean, chain output of a consumer as input for the next consumer
*/
Promise.knit(input, consumers, outputStub, chain)
```

##Example
###Simple consumer

```javascript
var input = [1, 2, 1, 2, 1, 4, 1, 2, 6]
var outputStub = {numberOfOne: 0, numberOfTwo: 0}

function checkForOne(val, output){
  return new Promise((resolve, reject)=>{
    if (val === 1){
      ++output.numberOfOne;
    }
    return resolve(output)
  })
}

function checkForTwo(val, output){
  return new Promise((resolve, reject)=>{
    if (val === 2){
      ++output.numberOfTwo;
    }
    return resolve(output)
  })
}

Promise.knit(input, [checkForOne, checkForTwo], outputStub)
.then((output)=>{
  console.log("Number of One's", output.numberofOne)
  console.log("Number of Two's", output.numberofTwo)
})
```
------------------------------------------
### Chain Outputs

```javascript
var Users = mongoose.model('user')

function findUser(user_id, output){
  return new Promise((resolve, reject)=>{
    Users.findOne({user_id: user_id}, (err, user)=>{
      if (err || user == null){
        reject(err)
      }
      output.push(user)
      resolve(output)
    })
  })
}

function setAttribs(user, output){
  return new Promise((resolve, reject)=>{
    Users.update({user_id: user.user_id}, {$set: {disabled: true}}, (err, user)=>{
      if (err){
        reject(err)
      }
      output.push(user)
      resolve(output)
    })
  })
}

app.put('/updateAttribs', (req, res, next)=>{
  Promise.knit(req.body.user_ids, [findUser, setAttribs], [], true)
  .then((users)=>{
    return res.json({
      status: 'ok',
      users: users
    })
  })
  .catch((err)=>{
    return next(err)
  })
})
```
