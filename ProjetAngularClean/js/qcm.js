angular.module('QCM',['ngResource','ngRoute'])

    .controller('QCM_courant', ['$scope', '$http', function($scope, $http )
    {
        var self = this;
        self.affScore = false;
        self.formulaireInscription=false;
        self.qcm_Internal_Input=false;
        self.ques_Internal_Input=false;
        self.type_Edit="";
        self.qcm="";



        $scope.qcm_Table= [
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
        self.selection = [
            {
                questions :
                    [

                        {reponses:
                        [
                            {


                            }
                        ]
                         }

                    ]
            }
        ];
        self.qcm=[];

        self.setCourant = function(qcm)
        {
            self.qcmTemp=qcm;
            self.formulaireInscription=true;


        }
        self.inscription = function()
        {
            self.qcm_Courant = self.qcmTemp;
            self.QIndex=0;
            self.score=0;
            self.affScore=false;
            self.question_Courante=$scope.qcm_Table[self.qcm_Courant.id].questions[0];
            if(self.qcm[self.qcm_Courant.id]) {
                self.qcm.styleReponse = self.selection[self.qcm_Courant.id].questions;




            }

            //alert("Select"+JSON.stringify(self.selection[self.qcm_Courant.id].questions));
            //alert("Select"+JSON.stringify(self.question_Courante.styleReponse));
            self.formulaireInscription=false;

        }
        self.select = function(qcm)
        {
            self.qcm_Courant=qcm;
            self.qcm_Input=true;
            self.qcm_Internal_Input=false;
            self.type_Edit="qcm";
            delete(self.question_Courante);
        }
        self.selectQ = function(question)
        {
            self.question_Courante=question;
            if(self.qcm[self.qcm_Courant.id]) {
                self.qcm.styleReponse = self.selection[self.qcm_Courant.id].questions;
            }
            self.type_Edit="question";
            self.ques_Input = true;
            self.ques_Internal_Input = false;
            //alert(JSON.stringify(self.qcm.styleReponse));
        }
        self.selectR= function(reponse)
        {
            self.reponse_Courante=reponse;
            self.type_Edit="reponse";
            self.rep_Input = true;

        }
        self.selectN = function()
        {
            self.type_Edit="New";
        }
        self.nextQ = function(id_Rep, isReplay)
        {



            if(!isReplay) {
                if(!self.question_Courante.Repondu) {
                    if ($scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[id_Rep].isTrue) {
                        self.score++;
                        //serveur ^

                    }

                    if(self.selection[self.qcm_Courant.id] == undefined)
                    {
                        self.selection[self.qcm_Courant.id] = {};
                        //alert("INIT A1:"+JSON.stringify(self.selection));
                        //alert("definition selecttion {}");

                    }

                    if(self.selection[self.qcm_Courant.id].questions == undefined)
                    {
                    self.selection[self.qcm_Courant.id].questions = [];
                        //alert("INIT A2:"+JSON.stringify(self.selection));
                        //alert(JSON.stringify(self.selection[self.qcm_Courant.id].questions));
                        //alert("definition question []");

                    }

                    if(self.selection[self.qcm_Courant.id].questions[self.question_Courante.id] == undefined)
                    {
                        //alert("INIT A3:"+JSON.stringify(self.selection));
                        self.selection[self.qcm_Courant.id].questions[self.question_Courante.id]={};
                        //alert("INIT B:"+JSON.stringify(self.selection));
                        //alert("definition question {}");

                    }
                    //alert("AVANT:"+JSON.stringify(self.selection[self.qcm_Courant.id]));
                    for(var i = 0;i<$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses.length;i++)
                    {
                        //alert(i);

                        if(i==id_Rep)
                        {
                            if(self.selection[self.qcm_Courant.id].questions[self.question_Courante.id].reponses == undefined)
                            self.selection[self.qcm_Courant.id].questions[self.question_Courante.id].reponses=[];
                            self.selection[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[i]={selected:true};


                        }
                        else
                        {
                            if(self.selection[self.qcm_Courant.id].questions[self.question_Courante.id].reponses == undefined)
                            self.selection[self.qcm_Courant.id].questions[self.question_Courante.id].reponses=[];
                            self.selection[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[i]={selected:false};
                        }
                        //alert(JSON.stringify(self.selection[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[i]));

                    }
                    //alert("END:"+JSON.stringify(self.selection));

                    self.question_Courante.Repondu=true;


                }
            }


            self.QIndex++;
            self.question_Courante = $scope.qcm_Table[self.qcm_Courant.id].questions[self.QIndex];


            if(self.QIndex==$scope.qcm_Table[self.qcm_Courant.id].questions.length)
            {
                self.qcm[self.qcm_Courant.id]={cleared:true};
                delete(self.QIndex);
                delete(self.question_Courante);
                self.affScore=true;
            }
        }
        self.moveQ = function(direction)
        {
            self.QIndex+=direction;
            self.question_Courante = $scope.qcm_Table[self.qcm_Courant.id].questions[self.QIndex];
        }
        self.switchEdition = function()
        {
            delete(self.qcm_Courant);
            delete(self.question_Courante);
            delete(self.QIndex);
            if(self.modeEdition)
            {
                self.modeEdition=false;
                self.QIndex=0;
            }
            else
            {
                // self.modeEditionSecurite=true
                self.modeEdition=true;
            }


        }
        self.nouveau = function(item)
        {
            self.CRUD = {type: "create", item: item}
            self.inputDone();
        }
        self.editer = function(id, item)
        {

            switch(item){
                case "question":
                    self.question_Courante=$scope.qcm_Table[self.qcm_Courant.id].questions[id];
                    self.CRUD = {type: "edit", item: item}
                    self.globalInputText = true;
                    break;
                case "reponse":
                    self.reponse_Courante=$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[id];
                    self.CRUD = {type: "edit", item: item}
                    self.globalInputText = true;

                    break;
                default:
                    break;
            }
        }
        self.supprimer = function(id, item)
        {

            switch(item){
                case "qcm":
                    if(self.qcm_Courant==$scope.qcm_Table[id])
                    {
                        delete(self.qcm_Courant);
                    }
                    $scope.qcm_Table.splice(id,1);
                    for(var i=0; i<$scope.qcm_Table.length;i++){
                        $scope.qcm_Table[i].id=i;
                    }

                    break;
                case "question":

                    if(self.question_Courante==$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id])
                    {
                        delete(self.question_Courante);
                    }
                    $scope.qcm_Table[self.qcm_Courant.id].questions.splice(id,1);
                    for(var i=0; i<$scope.qcm_Table[self.qcm_Courant].questions.length;i++){
                        $scope.qcm_Table[self.qcm_Courant].questions[i].id=i;
                    }
                    break;
                case "reponse":

                    $scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses.splice(id,1);
                    for(var i=0; i<$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses.length;i++){
                        $scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[i].id=i;
                    }

                    break;
                default:
                    break;
            }

        }
        self.save=function( id, type)
        {
            switch(type)
            {
                case "qcm":

                    $scope.qcm_Table[id].Titre=self.qcm_Edit[id].Titre;
                    self.qcm_Edit[self.qcm_Courant.id].Titre="";
                    self.qcm_Input=false;
                    self.qcm_Internal_Input=false;
                    break;

                case "question" :

                    $scope.qcm_Table[self.qcm_Courant.id].questions[id].Titre=self.ques_Edit[id].Titre;
                    self.ques_Edit[self.question_Courante.id].Titre="";
                    self.ques_Input=false;
                    self.ques_Internal_Input=false;

                    break;
                case "reponse":
                    alert(JSON.stringify(self.rep_Edit));
                    $scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[id].Titre=self.rep_Edit[id].Titre;
                    self.rep_Edit[self.reponse_Courante.id].Titre="";
                    self.rep_Input=false;
                    break;

                default:
                    break;

            }

        }
        self.inputDone = function()
        {
            switch(self.CRUD.type) {
                case "create" :
                    switch(self.CRUD.item){
                        case "qcm":
                            $scope.qcm_Table[$scope.qcm_Table.length]={id:$scope.qcm_Table.length, Titre:self.create_Qcm_Input, questions:[]};
                            self.qcm_Courant=$scope.qcm_Table[$scope.qcm_Table.length];
                            break;
                        case "question":
                            alert(self.create_Question_Input);
                            $scope.qcm_Table[self.qcm_Courant.id].questions[$scope.qcm_Table[self.qcm_Courant.id].questions.length]=
                            {   id:$scope.qcm_Table[self.qcm_Courant.id].questions.length,
                                Titre:self.create_Question_Input,
                                reponses:   []
                            }
                            break;
                        case "reponse":
                            $scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses.length]=
                            {  id:$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses.length,
                                Titre:self.create_Reponse_Input,
                                isTrue:false
                            }

                            break;
                        default:
                            break;
                    }
                    break;
                case "edit" :
                    switch(self.CRUD.item){
                        case "question":
                            $scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id]=
                            {  id:$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id],
                                Titre:self.inputGlobal,
                                reponses:$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses
                            }
                            break;
                        case "reponse":
                            $scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[self.reponse_Courante.id]=
                            {  id:$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[self.reponse_Courante.id].id,
                                Titre:self.inputGlobal,
                                isTrue:$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[self.reponse_Courante.id].isTrue
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            self.globalInputText=false;

        }
        self.securiteEdition = function()
        {
            //alert("ok");
            if(self.user.login=="admin" && self.user.pwd=="VISEO")
            {
                self.modeEdition=true;
                self.modeEditionSecurite = false;

            }

        }
        self.cancel = function(window)
        {
            switch(window) {
                case "securite":
                    self.modeEditionSecurite = false;
                    break;
                case "globalInput":
                    self.globalInputText=false;
                    break;
                case "inscription":
                    self.formulaireInscription=false;
                    break;
                case "Edit_QCM":
                    if( self.qcm_Edit)
                    self.qcm_Edit[self.qcm_Courant.id].Titre="";
                    self.qcm_Internal_Input=false;
                    self.qcm_Input=false;
                    break;
                case "Edit_Ques":
                    if( self.ques_Edit)
                        self.ques_Edit[self.question_Courante.id].Titre="";
                        self.ques_Internal_Input=false;
                        self.ques_Input=false;
                    break;
                case "Edit_Rep":
                    if( self.rep_Edit)
                        self.rep_Edit[self.reponse_Courante.id].Titre="";
                    self.rep_Input=false;


                    break;

                default:
                    break;

            }
        }
        self.uncheckOther = function(reponse)
        {
            for(var i = 0;i<$scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses.length;i++)
            {
                if($scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[i]!=reponse)
                {
                    $scope.qcm_Table[self.qcm_Courant.id].questions[self.question_Courante.id].reponses[i].isTrue=false;
                }

            }


        }
        self.InternalEdit=function(type)
        {
            switch(type)
            {

                case 'qcm':
                    self.qcm_Internal_Input=true;
                    break;
                case 'question':
                    self.ques_Internal_Input=true;
                    break;
                case 'reponse':
                    self.rep_Internal_Input=true;
                    break;
                default:
                    break;
            }


        }

    }]);
