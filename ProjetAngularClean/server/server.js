"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();


app.use('/', express.static(__dirname+'../..'));
app.use('/rest', bodyParser.json());
app.use('/rest',bodyParser.urlencoded({extended: true}));     // to support URL-encoded bodies
app.listen(9000);
console.log("Server Lancé sur localhost:9000/");


var userTable = [] ;
var qcmTable =[
        {   id:0,
            Titre: "javascript",
            questions:
                [
                    {
                        id:0,
                        Titre:"Comment selectionner une div en javascript?",
                        reponses:
                            [
                                {
                                    id:0,
                                    Titre:"GetElementById(#id);",
                                    isTrue:true
                                },
                                {
                                    id:1,
                                    Titre:"</br>",
                                    isTrue:false
                                },
                                {
                                    id:2,
                                    Titre:"$(#id)",
                                    isTrue:false
                                }

                            ]
                    },
                    {
                        id: 1,
                        Titre: "Comment faire apparaitre un message d'alerte?",
                        reponses:
                            [
                                {
                                    id:0,
                                    Titre: "OnStart()",
                                    isTrue:false
                                },
                                {
                                    id:1,
                                    Titre: "messageAlerte()",
                                    isTrue:false
                                },
                                {
                                    id:2,
                                    Titre: "alert()",
                                    isTrue:true
                                }

                            ]
                    },
                    {
                        id: 2,
                        Titre: "3?",
                        reponses:
                            [
                                {
                                    id:0,
                                    Titre: "OnStart()",
                                    isTrue:false
                                },
                                {
                                    id:1,
                                    Titre: "messageAlerte()",
                                    isTrue:false
                                },
                                {
                                    id:2,
                                    Titre: "alert()",
                                    isTrue:true
                                }
                            ]
                    }
                ]
        },
        {   id:1,
            Titre: "HTML5",
            questions:
                [
                    {
                        id:0,
                        Titre:"quelle balise pour faire un header?",
                        Repondu:false,
                        reponses:
                            [
                                {
                                    id:0,
                                    Titre:"<header/>",
                                    isTrue:false
                                },
                                {
                                    id:1,
                                    Titre:"<header></header>",
                                    isTrue:true
                                },
                                {
                                    id:2,
                                    Titre:"::header::",
                                    isTrue:false
                                }

                            ]
                    },
                    {
                        id: 1,
                        Titre: "comment aller a la ligne?",
                        reponses:
                            [
                                {
                                    id:0,
                                    Titre: "<br/>",
                                    isTrue:true
                                },
                                {
                                    id:1,
                                    Titre: "/n",
                                    isTrue:false
                                },
                                {
                                    id:2,
                                    Titre: "entrée",
                                    isTrue:false
                                }

                            ]
                    }
                ]

        },
        {   id:2,
            Titre: "Angular",
            questions:
                [
                    {
                        id:0,
                        Titre:"Comment cacher un element?",
                        Repondu:false,
                        reponses:
                            [
                                {
                                    id:0,
                                    Titre:"ng-hide:true",
                                    isTrue:true
                                },
                                {
                                    id:1,
                                    Titre:"ng-show:true",
                                    isTrue:false
                                },
                                {
                                    id:2,
                                    Titre:"ng-cacher:oui",
                                    isTrue:false
                                }
                            ]
                    },
                    {
                        id: 1,
                        Titre: "qu'utiliser pour faire des ng-model dynamiques?",
                        Repondu:false,
                        reponses:
                            [
                                {
                                    id:0,
                                    Titre: "$scoop",
                                    isTrue:false
                                },
                                {
                                    id:1,
                                    Titre: "360 noscope",
                                    isTrue:false
                                },
                                {
                                    id:2,
                                    Titre: "$scope",
                                    isTrue:true
                                }
                            ]
                    },
                ]
        },
        {
            id: 3,
            Titre: "Autre",
            questions: []
        }

    ];
function checkToken(id)
{
    var now = Date.now();
    var tokenValid= now-userTable[id].token.created;
    if(tokenValid<(30*60*1000) && !userTable[id].token.disqualified)
    {
        tokenValid=(tokenValid-tokenValid%1000)/1000
        var minutes=(tokenValid-tokenValid%60)/60;
        var secondes=tokenValid-minutes*60;


        //return("Token Encore Valide, temps restant:"+(29-minutes)+" minutes et "+(60-secondes)+" secondes");
        return true;

    }
    else
    {
        return false;
    }


};
function Utilisateur(name, surname, birth, gender, postal, town, nat, token)
{
    this.name=name;
    this.surname=surname;
    this.birth=birth;
    this.gender=gender;
    this.postal=postal;
    this.town=town;
    this.nationality=nat;
    this.token=token;
};
app.get('/rest/myResource/:resourceId', function(req,res)
{
	res.json({
		id:1,
		name:'javascript'
	});
});
app.get('/rest/QCMTable', function(req, res)
{
    res.json(qcmTable);
});
app.get('/rest/QCMList', function(req,res)
{                 // GET ALL QCM TITRE
    var Titres= [];
    for( var i=0; i<qcmTable.length; i++){
        Titres[i]={id:i,Titre:qcmTable[i].Titre};
    }
    res.json(Titres);
});
app.post('/rest/QCMList', function(req, res)
{
    qcmTable[qcmTable.length]= {id: qcmTable.length, Titre:req.body.Titre}
    res.end("QCM Cree");
});
app.post('/rest/User', function(req,res)
{
    var Now =  Date.now();
    var token=
    {
        value:Math.floor(Math.random()*9999999+1),
        created: Now,
        disqualified:false
    };
    var util = new Utilisateur(req.body.Name, req.body.Surname, req.body.Birth, req.body.Gender, req.body.Postal, req.body.Town, req.body.Nat, token);
    userTable[userTable.length]=util;

    var returnValue = userTable.length-1
    res.end(returnValue.toString());
});
app.get('/rest/QCMList/:qcmId', function(req,res)           // GET QCM avec QUESTIONS
{
    var QCM=
    {
        id:req.params.qcmId,
        Titre:qcmTable[req.params.qcmId].Titre,
        questions: _.cloneDeep(qcmTable[req.params.qcmId].questions)
    };
    if(qcmTable[req.params.qcmId].questions)
    for(var i =0;i<qcmTable[req.params.qcmId].questions.length;i++)
    {
        delete QCM.questions[i].reponses;
    }
    res.json(QCM);
});
app.post('/rest/QCMList/:qcmId', function(req, res)         // POST QCM avec QUESTIONS
{
    if(qcmTable[req.body.id]) {
        qcmTable[req.body.id].Titre = req.body.Titre;
        for (var i = 0; i < req.body.questions.length; i++) {
            qcmTable[req.body.id].questions[i].Titre = req.body.questions[i].Titre;

        }

        res.end("QCM Mis a Jour");
    }
    else
    {
        res.end("QCM Inexistant");
    }
});
app.delete('/rest/QCMList/:qcmId', function(req, res)
{
    qcmTable.splice(req.body.qcmId,1);
    for(var i =0; i<qcmTable.length;i++)
    {
        qcmTable[i].id = i;
    }
    res.end("QCM Supprimé");
});
app.post('/rest/QCMList/:qcmId/UserId/:userId/ScoreQCM', function (req, res)
{

    var userId = req.params.userId;

    if(userTable[userId] != undefined)
    {

        if(checkToken(userId))
        {
            var reponseSheet=req.body.answers;
            console.log(reponseSheet);
            var qcmId= req.params.qcmId;
            var resultatFinal=0;
            for(var j=0; j<qcmTable[qcmId].questions.length; j++)
            {
                if((qcmTable[qcmId].questions[j].reponses[reponseSheet[j]].isTrue))
                {
                    resultatFinal++;
                }
            }
            res.json({resultat: resultatFinal});
        }
        else
        {
            res.json({resultat:"Token Invalide"})
        }
    }

});
app.get('/rest/QCMList/:qcmId/QuesList',function(req, res)
{
    res.json( qcmTable[req.params.qcmId].questions);
});
app.get('/rest/QCMList/:qcmId/QuesListComplete/:questionId', function(req, res)
{
    var Question=
    {
        id:req.params.questionId,
        Titre:qcmTable[req.params.qcmId].questions[req.params.questionId].Titre,
        reponses:qcmTable[req.params.qcmId].questions[req.params.questionId].reponses
    };
    res.json(Question);
});
app.get('/rest/QCMList/:qcmId/QuesList/:questionId', function(req,res)
{
    if(qcmTable[req.params.qcmId].questions[req.params.questionId]) {
        var Question =
        {
            id: req.params.questionId,
            Titre: qcmTable[req.params.qcmId].questions[req.params.questionId].Titre,
            reponses: _.cloneDeep(qcmTable[req.params.qcmId].questions[req.params.questionId].reponses)
        };
        for (var i = 0; i < qcmTable[req.params.qcmId].questions[req.params.questionId].reponses.length; i++) {
            delete(Question.reponses[i].isTrue);
        }
        res.json(Question);
    }
    else
    {
        res.json(null);
    }

});
app.post('/rest/QCMList/:qcmId/QuesList/:questionId', function(req,res)
{
    qcmTable[req.params.qcmId].questions[req.params.questionId].Titre=req.body.Titre;
    qcmTable[req.params.qcmId].questions[req.params.questionId].reponses=req.body.reponses;
    res.end("Question Mise a jour");
});
app.delete('/rest/QCMList/:qcmId/QuesList/:questionId',function(req,res)
{
    qcmTable[req.params.qcmId].questions.splice(req.params.questionId, 1);
    for(var i =0; i<qcmTable[req.params.qcmId].questions.length;i++)
    {
        qcmTable[req.params.qcmId].questions[i].id = i;
    }
    res.end("Question Supprimée");

});
app.post('/rest/QCMList/:qcmId/QuesList', function(req,res)
{

    if(qcmTable[req.params.qcmId].questions)
    var newId=qcmTable[req.params.qcmId].questions.length;
    else {
        var newId = 0;
        qcmTable[req.params.qcmId].questions=[];
    }
    qcmTable[req.params.qcmId].questions[newId]={id:newId,Titre: req.body.Titre, reponses:req.body.reponses};
    res.end("Question Cree");
});
app.post('/rest/answer', function(req, res)
{
	res.json({
		successes:1,
		errors:1
		});
	});
	
	