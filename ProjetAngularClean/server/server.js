"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var qcm_Table =
    [
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

app.get('/rest/QCMTable', function(req, res)
{

    res.json(qcm_Table);
})

app.get('/rest/QCMList', function(req,res){
    var Titres= [];
    for( var i=0; i<qcm_Table.length; i++){
        Titres[i]={id:i,Titre:qcm_Table[i].Titre};
    }
    res.json(Titres);


});
app.get('/rest/QCMList/:QcmId', function(req,res){
    var Titres=
    {
        id:req.params.QcmId,
        Titre:qcm_Table[req.params.QcmId].Titre,
        questions:qcm_Table[req.params.QcmId].questions
    };
    for(var i =0;i<qcm_Table[req.params.id].questions.length;i++)
    {
        delete(Titres.questions[i].reponses);

    }
    res.json(Titres);

});
app.get('/rest/QCMList/:QcmId/QuesList/:quesId', function(req,res)
{
    var Question=
    {
        id:req.params.quesId,
        Titre:qcm_Table[req.params.QcmId].questions[req.params.quesId].Titre,
        reponses:qcm_Table[req.params.QcmId].questions[req.params.quesId].reponses
    };
    for(var i =0;i<qcm_Table[req.params.QcmId].questions[req.params.quesId].reponses.length;i++)
    {
        delete(Question.reponses[i].isTrue);

    }
    console.log(Question);
    res.json(Question);

})
app.post('/rest/answer', function(req, res){
	res.json({
		successes:1,
		errors:1
		});
	});
	
	