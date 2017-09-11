var fs = require('fs')

var express = require('express')
var app = express()


app.use(express.static('./public'))


app.listen(80)
