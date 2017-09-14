var fs = require('fs')

var express = require('express')
var bodyParser = require('body-parser')
var app = express()


app.use(express.static('./public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())



var LangUser = require('./db').LangUser
var LangVocab = require('./db').LangVocab

var user = {}

app.get('/', function(req, res){
    res.sendFile('./index.html', {root: './public'})
})

app.post('/lang-user', function(req, res, next){
    console.log('#24 req.body: ', req.body)

    var newUser = new LangUser('#26 req.body:', req.body)
    newUser.save(function(err){
        if (err){ next(err)}
        else {
            user = newUser
            res.send({success:'Saved a new user successfully!'})
        }
    })
})

// HOW TO CHANGE LINE 40???
app.post('/create-vocab', function(req, res, next){
    console.log('#38 req.body:', req.body)

    var newVocab = new LangVocab(req.body)
    newVocab.save(function(err){
        if (err){next(err)}
        else {
            res.send({success:'Created new vocab successfully!'})
        }
    })
})

app.put('/incr-known', function(req, res, next){
    console.log('#50 req.body:', req.body)
    LangVocab.findOneAndUpdate({_id: req.body._id}, {$inc: {wordknown: 1}}, function(err, data){
        if (err){next(err)}

            console.log('#56 data: ', data)
            res.send({success:'Increased successfully!'})
        

    })
})

 app.put('/decr-known', function(req, res, next){
    console.log('#61 req.body:', req.body)
    LangVocab.findOneAndUpdate({_id: req.body._id}, {$inc: {wordknown: -1}}, function(err, data){
        if (err){next(err)}

            console.log('#66 data: ', data)
            res.send({success:'Decreased successfully!'})
        

    })

})

app.post('/signin-user', function(req, res, next){
    console.log('#72 req.body:', req.body)

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
    console.log('#87 req.body:', req.body)

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
            console.log('#108 data:', data)
        }
    })
})

app.get('/me/word', function(req, res, next){
    LangVocab.findOne({_languser: user._id}, function(err, data){
        if (err) { next(err) 
        } else {
            res.send(data)
            console.log('#118 data:', data)
        }
    })
})

app.get('/read-data', function(req, res, next){
    console.log('#124 data:', data)
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
