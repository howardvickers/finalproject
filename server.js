var fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var user = {}

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

var LangUser = require('./db').LangUser
var LangVocab = require('./db').LangVocab
var LangPerform = require('./db').LangPerform

app.get('/', function(req, res){
    res.sendFile('./index.html', {root: './public'})
})

app.post('/lang-user', function(req, res, next){
    console.log('/lang-user req.body: ', req.body)
    var newUser = new LangUser('/lang-user req.body:', req.body)
    newUser.save(function(err){
        if (err){ next(err)}
        else {
            user = newUser
            res.send({success:'Saved a new user successfully!'})
        }
    })
})

app.post('/create-vocab', function(req, res, next){
    console.log('/create-vocab req.body:', req.body)
    var newVocab = new LangVocab(req.body)
    newVocab.save(function(err){
        if (err){next(err)}
        else {
            res.send({success:'Created new vocab successfully!'})
        }
    })
})

app.put('/incr-known', function(req, res, next){
    console.log('/incr-known req.body:', req.body)
    LangVocab.findOneAndUpdate({_id: req.body._id}, {$inc: {wordknown: 1}}, function(err, data){
        if (err){next(err)}
            console.log('/incr-known data: ', data)
            res.send({success:'Increased successfully!'})
    })
})

 app.put('/decr-known', function(req, res, next){
    console.log('/decr-known req.body:', req.body)
    LangVocab.findOneAndUpdate({_id: req.body._id}, {$inc: {wordknown: -1}}, function(err, data){
        if (err){next(err)}
            console.log('/decr-known data: ', data)
            res.send({success:'Decreased successfully!'})
    })
})

app.post('/create-perform', function(req, res, next){
    console.log('/create-perform req.body:', req.body)
    var newPerform = new LangPerform(req.body)
    newPerform.save(function(err){
        if (err){next(err)}
        else {
            res.send({success:'Created new performance successfully!'})
        }
    })
})

// app.put('/incr-tally', function(req, res, next){
//     console.log('#75 req.body:', req.body)
//     LangPerform.findOneAndUpdate({_id: req.body._id}, {$inc: {learningtally: 1}}, function(err, data){
//         if (err){next(err)}
//             console.log('#79 data: ', data)
//             res.send({success:'Learning Tally increased successfully!'})
//     })
// })

//  app.put('/decr-tally', function(req, res, next){
//     console.log('#87 req.body:', req.body)
//     LangPerform.findOneAndUpdate({_id: req.body._id}, {$inc: {learningtally: -1}}, function(err, data){
//         if (err){next(err)}
//             console.log('#91 data: ', data)
//             res.send({success:'Learning Tally decreased successfully!'})
//     })
// })

app.post('/signin-user', function(req, res, next){
    console.log('/signin-user req.body:', req.body)
    LangUser.findOne({username: req.body.username}, function(err, data){
        if (err){next(err)}
        else if (data){
            user=data
            console.log('User signed in: ', data)
            res.send({success: '200'})
        } else {
            res.send({failure: 'Failed to login'})
        }
    })
})

app.get('/all-vocab', function(req, res, next){
    console.log('/all-vocab req.body:', req.body)
    LangVocab.find(function(err, langvocab){
    if (err){
        return handleError(err)
    }
    console.log('this is langvocab: ', langvocab)
    res.send(langvocab)
    })
})

app.get('/me', function(req, res){
    res.send(user)
})

app.get('/me/vocabs', function(req, res, next){
    LangVocab.find({_languser: user._id}, function(err, data){
        if (err) { next(err) 
        } else {
            res.send(data)
            console.log('/me/vocabs data:', data)
        }
    })
})

app.get('/me/word', function(req, res, next){
    LangVocab.findOne({_languser: user._id}, function(err, data){
        if (err) { next(err) 
        } else {
            res.send(data)
            console.log('/me/word data:', data)
        }
    })
})

app.get('/read-data', function(req, res, next){
    console.log('/read-data data:', data)
    LangVocab.find({}, function(err, data){
        if (err) {next(err)}
        else {
            res.send(data)
        }
    })
})

app.use(function(err, req, res, next){
    console.log('something is wrong: ', err)
    res.send(err)
})

app.listen(80)