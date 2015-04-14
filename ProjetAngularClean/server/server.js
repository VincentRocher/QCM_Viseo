"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var app = express();

console.log("Server Lancé sur localhost:9000/");

app.use('/', express.static(__dirname+'../..'));
app.use('/rest', bodyParser.json());
app.listen(9000);

app.get('/rest/myResource/:resourceId', function(req,res){
	res.json({
		id:1,
		name:'javascript'
	});
});
app.post('/rest/answer', function(req, res){
	res.json({
		successes:1,
		errors:1
		});
	});
	
	