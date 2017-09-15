var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/lang')

var userSchema = new mongoose.Schema({
    username: {type:String, required: true, unique: true},
    password: {type:String, required: true},
})

var LangUser = mongoose.model('languser', userSchema)

var vocabSchema = new mongoose.Schema({
    _languser : {type: mongoose.Schema.Types.ObjectId},
    kyrgyzword: {type: String, required: true},
    englishword: {type: String, required: true},
    wordknown: {type: Number, required: true},
})

var LangVocab = mongoose.model('langvocab', vocabSchema)

var performSchema = new mongoose.Schema({
    _languser : {type: mongoose.Schema.Types.ObjectId},
    _langvocab : {type: mongoose.Schema.Types.ObjectId},
    testtype: {type: Number, required: true},
    wordlevel: {type: Number, required: true},
    testdate: {type: Date, required: true},
})

var LangPerform = mongoose.model('langperform', vocabSchema)

LangVocab.find(function (err, langvocab) {
  if (err) {
      return handleError(err);
  }
    console.log('This is the "langvocab" from the db.js: ', langvocab)
})

LangPerform.find(function (err, langperform) {
  if (err) {
      return handleError(err);
  }
    console.log('This is the "langperform" from the db.js: ', langperform)
})

module.exports = {LangUser: LangUser, LangVocab: LangVocab, LangPerform: LangPerform}