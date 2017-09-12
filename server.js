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
    console.log(req.body)

    var newUser = new LangUser(req.body)
    newUser.save(function(err){
        if (err){ next(err)}
        else {
            user = newUser
            res.send({success:'Saved a new user successfully!'})
        }
    })
})

app.post('/create-vocab', function(req, res, next){
    console.log(req.body)

    var newVocab = new LangVocab(req.body)
    newVocab.save(function(err){
        if (err){next(err)}
        else {
            res.send({success:'Created new vocab successfully!'})
        }
    })
})

app.post('/signin-user', function(req, res, next){
    console.log(req.body)

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
    console.log(req.body)

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
            console.log(data)
        }
    })
})

app.get('/me/word', function(req, res, next){
    LangVocab.findOne({_languser: user._id}, function(err, data){
        if (err) { next(err) 
        } else {
            res.send(data)
            console.log(data)
        }
    })
})

app.get('/read-data', function(req, res, next){
    console.log(data)
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
