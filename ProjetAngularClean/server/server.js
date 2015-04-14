"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();


app.use('/', express.static(__dirname+'../..'));
app.use('/rest', bodyParser.json());
app.use('/rest',bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.listen(9000);
console.log("Server Lancé sur localhost:9000/");


var userTable = [] ;
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

function Utilisateur(name, surname, birth, gender, postal, town, nat, token){
    this.name=name;
    this.surname=surname;
    this.birth=birth;
    this.gender=gender;
    this.postal=postal;
    this.town=town;
    this.nationality=nat;
    this.token=token;
}


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
    console.log(JSON.stringify(userTable));
    var returnValue = userTable.length-1
    res.end(returnValue.toString());
}
)
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


}
app.get('/rest/QCMList/:QcmId', function(req,res){
    var QCM=
    {
        id:req.params.QcmId,
        Titre:qcm_Table[req.params.QcmId].Titre,
        questions: _.cloneDeep(qcm_Table[req.params.QcmId].questions)
    };
    for(var i =0;i<qcm_Table[req.params.QcmId].questions.length;i++)
    {
        delete QCM.questions[i].reponses;
    }
    res.json(QCM);

});
app.get('/rest/QCMList/:id_QCM/UserId/:userId/ScoreQCM/:rep', function (req, res) {
    var id_Us = req.params.userId;
    console.log(id_Us);
    console.log(userTable[id_Us]);
    if(userTable[id_Us] != undefined)
    {
        console.log("1");
        console.log(checkToken(id_Us));
        if(checkToken(id_Us))
        {
            console.log("2");
            var reponseSheet=req.params.rep.split('x');
            var tab= reponseSheet.splice(reponseSheet.length-1,1);
            var id_qcm= req.params.id_QCM;
            // console.log(id_req);

            //reponseSheet.pop();

            var resultatFinal=0;


            for(var j=0; j<qcm_Table[id_qcm].questions.length; j++)
            {

                // console.log(req.body.questions[j].reponses);
                // console.log(mylist[i].questions[j].reponses[k].resp);
                //delete mylist[i].questions[j].reponses[k].vrais;


                if((qcm_Table[id_qcm].questions[j].reponses[reponseSheet[j]].isTrue))
                {
                    resultatFinal++;
                }


            }

            console.log(resultatFinal);
            userTable[id_Us].token.disqualified=true;
            res.json({resultat: resultatFinal});

        }
        else
        {
            res.json({resultat:-1})
        }
    }

});
app.get('/rest/QCMList/:QcmId/QuesList/:quesId', function(req,res)
{
    var Question=
    {
        id:req.params.quesId,
        Titre:qcm_Table[req.params.QcmId].questions[req.params.quesId].Titre,
        reponses:_.cloneDeep(qcm_Table[req.params.QcmId].questions[req.params.quesId].reponses)
    };
    for(var i =0;i<qcm_Table[req.params.QcmId].questions[req.params.quesId].reponses.length;i++)
    {
        delete(Question.reponses[i].isTrue);

    }
    res.json(Question);

})


app.post('/rest/answer', function(req, res){
	res.json({
		successes:1,
		errors:1
		});
	});
	
	