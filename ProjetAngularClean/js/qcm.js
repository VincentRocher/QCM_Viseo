angular.module('QCM',['ngResource','ngRoute'])
    .factory('sharedData', function ($rootScope) {
        var mem = {};

        return {
            store: function (key, value) {
                mem[key] = value;
            },
            get: function (key) {
                return mem[key];
            }
        };
    })
    .factory('QcmFactory',['$resource',function($resource){
        return $resource('/rest/QCMList/:qcmid',
            {qcmid:"@qcmid"}
        );

    }])
    .factory('QuesFactory', ['$resource', function($resource){
        return $resource('/rest/QCMList/:qcmid/QuesList/:quesid',
            {qcmid:"@qcmid", quesid:"@quesid"}
        );

    }])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/index',{
                templateUrl:'./view/titres.html',
                controller:'titresController as titreCtrl',
                resolve: {
                    loadedQcmList: ['$http','sharedData', function($http, sharedData){
                        return $http.get("./rest/QCMList").then(function(response){
                            sharedData.store('qcm_Table',response.data);
                            return sharedData.get('qcm_Table');

                        })
                    } ]
                    }
            })
            .when('/qcm/:qcmid/numq/:quesid',{
                templateUrl:'./view/questions.html',
                controller:'questionControleur as QuesCtrl',
                resolve: {
                    loadedQues: ['$http','sharedData','$route', function($http, sharedData, $route){
                        return $http.get("./rest/QCMList/"+$route.current.params.qcmid+"/QuesList/"+$route.current.params.quesid).then(function(response){
                            var question_Courante = response.data;
                            sharedData.store('question_Courante',question_Courante);
                            return sharedData.get('question_Courante');

                        })
                    } ]
                }

            })
            .when('/inscription/:qcmid',{
                templateUrl:'./view/inscription.html',
                controller:'inscriptionControleur as InsCtrl',
                resolve: {
                    loadedQcm: ['$http','sharedData','$route', function($http, sharedData, $route){

                        return $http.get("./rest/QCMList/"+$route.current.params.qcmid).then(function(response){
                            var qcm_Courant = response.data;
                            sharedData.store('qcm_Courant',qcm_Courant);
                            return sharedData.get('qcm_Courant');

                        })
                    } ]
                }

            })
            .when('/qcm/:qcmid/score',
            {
                templateUrl:'./view/scores.html',
                controller:'scoreControleur as scoreCtrl'

            })
            .otherwise({redirectTo:'/index'});
    }])
    .controller('indexControleur',    ['$scope',  '$http','QcmFactory','QuesFactory','sharedData', function($scope, $http, QcmFactory, QuesFactory,sharedData )
    {

        var self = this;
        self.qcm_Internal_Input=false;                  //edition
        self.ques_Internal_Input=false;                 //edition
        self.type_Edit="";                              //edition
        self.qcm_Edit=[];                               //edition
        self.ques_Edit=[];                              //edition
        self.rep_Edit=[];                               //edition
        self.repDel=[];                                 //edition
        self.select = function(qcm)                                             // Edition------------------------------
        {
            $http.get("./rest/QCMList/"+qcm.id).then(
                function(responseQCM) {
                    self.qcm_Courant=responseQCM.data
                    self.qcm_Input=true;
                    self.qcm_Internal_Input=false;
                    self.type_Edit="qcm";
                    delete(self.question_Courante);
                    delete(self.reponse_Courante);
                },
                function(errResponseQCM)
                {
                }
            );

        };
        self.selectQ = function(question)                                       // Edition------------------------------
        {
            $http.get("./rest/QCMList/"+self.qcm_Courant.id+"/QuesList/"+question.id).then(
                function(responseQues) {
                        self.question_Courante = responseQues.data; // QUES_ID/QUES_TITRE/REPONSES sans ISTRUE
                        $http.get("/rest/QCMList/" + self.qcm_Courant.id + "/QuesListComplete/" + question.id ).then(
                            function (responseTrue) {
                                for (var i = 0; i < responseTrue.data.reponses.length; i++) {
                                    if (responseTrue.data.reponses[i].isTrue)

                                        self.question_Courante.reponses[i].isTrue = true;

                                    else
                                        self.question_Courante.reponses[i].isTrue = false;

                                }
                                if(self.qcm[self.qcm_Courant.id]) {
                                    self.qcm.styleReponse = self.selection[self.qcm_Courant.id].questions;
                                }
                                self.type_Edit="question";
                                self.ques_Input = true;
                                self.ques_Internal_Input = false;


                            },
                            function (errResponseTrue) {

                            }
                        );


                },
                function(errResponseQues)
                {
                    console.log(errResponse.data);
                    console.error("error while fetching notes");
                }

            );

        };
        self.selectR= function(reponse)                                         // Edition------------------------------
        {
            self.reponse_Courante=reponse;
            self.type_Edit="reponse";
            self.rep_Input = true;

        };
        self.nouveau = function(item)                                           // Edition------------------------------
        {
            switch(item){
                case "qcm":
                    self.newQCM = new QcmFactory();
                    if(self.create_Qcm_Input)
                        self.newQCM.Titre = self.create_Qcm_Input;
                    else
                        self.newQCM.Titre = "";
                    self.newQCM.questions=["k"];
                    self.newQCM.$save();
                    self.refreshQcmList();
                    break;
                case "question":
                    self.newQues = new QuesFactory();
                    self.newQues.Titre = self.create_Question_Input;
                    self.newQues.reponses = [];
                    self.newQues.$save({qcmid:self.qcm_Courant.id});
                    self.refreshQcmCourant(self.qcm_Courant.id);
                    break;
                case "reponse":
                    self.question_Courante.reponses[self.question_Courante.reponses.length]=
                    {  id:self.question_Courante.reponses.length,
                        Titre:self.create_Reponse_Input,
                        isTrue:false
                    }

                    break;
                default:
                    break;
            }
        };
        self.supprimer = function(id, item)                                     // Edition------------------------------
        {

            switch(item){
                case "qcm":
                    if(self.qcm_Courant.id==id)
                    {
                        delete(self.qcm_Courant);
                    }
                    (QcmFactory.delete({qcmid:id}));
                    self.refreshQcmList();
                    self.qcm_Input=false;

                    break;
                case "question":

                    if(self.question_Courante.id==id)
                    {
                        delete(self.question_Courante);
                    }
                    QuesFactory.delete({qcmid:self.qcm_Courant.id,quesid:id});
                    self.refreshQcmCourant(self.qcm_Courant.id);
                    self.ques_Input=false;
                    break;
                default:
                    break;
            }

        };
        self.save=function( id, type)                                           // Edition------------------------------
        {
            switch(type)
            {
                case "qcm":

                    QcmFactory.get({qcmid: id})
                        .$promise.then(function (qcm) {


                            qcm.Titre = self.qcm_Edit[id].Titre;

                            qcm.$save({qcmid: id});
                            self.qcm_Edit[self.qcm_Courant.id].Titre="";
                            self.qcm_Input=false;
                            self.qcm_Internal_Input=false;
                            self.refreshQcmList();
                        }
                    );


                    break;

                case "question" :
                    var saveLength= self.question_Courante.reponses.length;
                    var recul = 0;
                    for(var i =0; i<saveLength;i++)
                    {
                        if(self.repDel[i]==true)
                        {
                            self.question_Courante.reponses.splice(i-recul,1);
                            recul++;
                            delete(self.repDel[i]);
                        }
                    }
                    for(var j =0; j<self.question_Courante.reponses.length;j++)
                    {
                        self.question_Courante.reponses[j].id= j;
                    }
                    QuesFactory.get({qcmid:1,quesid:0})
                        .$promise.then(function(ques){
                            if(self.ques_Edit[id]==undefined)
                            {
                                ques.reponses=self.question_Courante.reponses;
                                for(var i =0; i<self.question_Courante.reponses.length;i++)
                                {
                                    if(self.rep_Edit[i]) {
                                        ques.reponses[i].Titre = self.rep_Edit[i].Titre;
                                        self.rep_Edit[i].Titre = "";
                                    }
                                }
                                ques.$save({qcmid:self.qcm_Courant.id,quesid:self.question_Courante.id});
                                self.refreshQuestionCourante(self.qcm_Courant.id, self.question_Courante.id, "edit");
                            }
                            else
                            {
                                ques.Titre=self.ques_Edit[id].Titre;
                                ques.$save({qcmid:self.qcm_Courant.id,quesid:self.question_Courante.id});
                                self.ques_Edit[self.question_Courante.id]={Titre:""};
                                self.ques_Input=false;
                                self.ques_Internal_Input=false;
                                self.refreshQcmCourant(self.qcm_Courant.id);
                            }
                        });
                    break;
                default:
                    break;
            }
        };
        self.securiteEdition = function()                                       // Edition------------------------------
        {

            if(self.user.login=="admin" && self.user.pwd=="VISEO")
            {
                self.modeEdition=true;
                self.modeEditionSecurite = false;

            }

        };
        self.InternalEdit=function(type, item)                                  // Edition------------------------------
        {
            switch(type)
            {

                case 'qcm':
                    self.refreshQcmCourant(item.id);
                    self.qcm_Internal_Input=true;
                    break;
                case 'question':
                    self.refreshQuestionCourante(self.qcm_Courant.id,item.id, "edit");
                    self.ques_Internal_Input=true;
                    break;
                case 'reponse':
                    self.rep_Internal_Input=true;
                    break;
                default:
                    break;
            }


        };
        self.uncheckOther = function(reponse)                                   // Edition------------------------------
        {

            for(var i = 0;i<self.question_Courante.reponses.length;i++)
            {
                if(self.question_Courante.reponses[i].id!=reponse.id)
                {

                    self.question_Courante.reponses[i].isTrue=false;
                }

            }


        };
        self.selectN = function()                                               // Edition------------------------------
        {
            self.type_Edit="New";
        };
        self.cancel = function(window)                                          // Edition------------------------------
        {
            switch(window) {
                case "Edit_QCM":
                    if( self.qcm_Edit[self.qcm_Courant.id])
                        self.qcm_Edit[self.qcm_Courant.id].Titre="";
                    self.qcm_Internal_Input=false;
                    self.qcm_Input=false;
                    break;
                case "Edit_Ques":
                    if( self.ques_Edit[self.question_Courante.id])
                        self.ques_Edit[self.question_Courante.id].Titre="";
                    self.ques_Internal_Input=false;
                    self.ques_Input=false;
                    break;

                default:
                    break;

            }
        };
    }
    ])
    .controller('titresController',['$scope','$http','$routeParams','sharedData','$location',
        function($scope, $http,$routeParams,sharedData, $location )
        {
            var self=this;
            self.validate= function(QCM)                                            // titres||||||||||||||||||||||||||||||| 1
            {
                return  {finish : QCM.finish}
            }
            self.goQcm = function(id)
            {
                self.qcm = sharedData.get("qcm");
                console.log(self.qcm);
                if(self.qcm!=undefined && self.qcm[id]!=undefined)
                {
                    $location.path("/qcm/"+id+"/numq/0");
                }
                else
                {
                    $location.path("/inscription/"+id);

                }
             }

            $scope.qcm_Table=sharedData.get('qcm_Table');
            self.qcm=sharedData.get('qcm');
            for(var i = 0; i<$scope.qcm_Table.length;i++){
                if(self.qcm!=undefined && self.qcm[i]!=undefined && self.qcm[i].cleared == true)

                {
                    $scope.qcm_Table[i].finish=true;
                }
            }

        }])
    .controller('inscriptionControleur',['$scope',  '$http','QcmFactory','QuesFactory','$routeParams','$location','sharedData', function($scope, $http, QcmFactory, QuesFactory, $routeParams, $location, sharedData)
        {
            var self = this;
            self.selection = sharedData.get('selection');
            self.qcmIdToGo = $routeParams.qcmid;
            self.cancel = function(){
                $location.path("/index");
            }
            self.inscription = function()                                           // inscription
            {
                $http.post("./rest/User", self.utilisateurIns).then(
                    function(responseIns)
                    {
                        self.connectedUserId=responseIns.data;
                        sharedData.store('userId', self.connectedUserId);
                        sharedData.store('RepQuest', []);
                        if(!self.selection)
                        sharedData.store('selection', []);
                        sharedData.store('radio', []);
                        $location.path("/qcm/"+self.qcmIdToGo+"/numq/0");

                    },
                    function(errResponseIns)
                    {}


                );
            };



        }
    ])
    .controller('questionControleur',['$scope','$http','QcmFactory','QuesFactory','$routeParams','sharedData','$location',  function($scope, $http, QcmFactory, QuesFactory,$routeParams,sharedData, $location )
    {
        var self=this;

        $scope.qcm_Table=sharedData.get('qcm_table');
        self.affScore=false;
        self.QIndex = $routeParams.quesid;
        self.qcm_Courant = sharedData.get('qcm_Courant');
        self.RepQuest=sharedData.get('RepQuest');
        self.qcm=sharedData.get('qcm');
        self.selection = sharedData.get('selection');
        self.radio = sharedData.get('radio');
        self.nextQ = function(id_Rep, isReplay)                                 //questions
        {
            if(!self.qcm || !self.qcm[self.qcm_Courant.id]) {
                if(!self.question_Courante.Repondu) {
                    if (self.question_Courante.reponses[id_Rep]) {
                        self.RepQuest[self.question_Courante.id]=id_Rep;
                        sharedData.store('RepQuest', self.RepQuest);
                        var nbRep = 0;
                        for(var i = 0; i<self.qcm_Courant.questions.length;i++)
                        {
                            if(self.RepQuest[i] != undefined)
                                nbRep++;
                        }
                        if(nbRep==self.qcm_Courant.questions.length) {
                            self.qcmComplete = true;
                        }
                    }
                    if(self.selection[self.qcm_Courant.id] == undefined)
                    {
                        self.selection[self.qcm_Courant.id] = {};
                    }
                    if(self.selection[self.qcm_Courant.id].questions == undefined)
                    {
                        self.selection[self.qcm_Courant.id].questions = [];
                    }
                    if(self.selection[self.qcm_Courant.id].questions[self.question_Courante.id] == undefined)
                    {
                        self.selection[self.qcm_Courant.id].questions[self.question_Courante.id]={};
                    }
                    for(var i = 0;i<self.question_Courante.reponses.length;i++)
                    {
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
                    }
                    sharedData.store('selection', self.selection);
                    self.question_Courante.Repondu=true;
                }
            }
            if(self.qcmComplete)
            {
                if(self.qcm==undefined)
                self.qcm = [];
                self.qcm[self.qcm_Courant.id]={cleared:true};
                sharedData.store('qcm', self.qcm);
                sharedData.store('question_Courante', []);
                self.qcmComplete=false;
                $location.path("/qcm/"+self.qcm_Courant.id+"/score");
            }
            else {
                if (self.QIndex < self.qcm_Courant.questions.length - 1)
                    $location.path("/qcm/" + self.qcm_Courant.id + "/numq/" + (parseInt(self.QIndex) + 1));
            }
        };
        self.moveQ = function(direction)                                        //questions
        {
            $location.path("/qcm/"+self.qcm_Courant.id+"/numq/"+(parseInt(self.QIndex)+parseInt(direction)));
        };
        self.refreshQuestionCourante = function(qcmid, quesid, mode)            // reponses$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
        {
            $http.get("./rest/QCMList/"+self.qcm_Courant.id+"/QuesList/"+self.QIndex).then(
                function(responseQues){

                    self.question_Courante=responseQues.data; // QUES_ID/QUES_TITRE/REPONSES sans ISTRUE

                    if(mode=="normal") {
                        for (var i = 0; i < self.question_Courante.reponses.length; i++) {
                            if (self.RepQuest[self.question_Courante.id] == i && self.radio[i] != undefined)
                                self.radio[i] = true;
                            else
                                self.radio[i] = false;
                        }
                        if (self.qcm!= undefined && self.qcm[self.qcm_Courant.id]) {
                            self.qcm.styleReponse = self.selection[self.qcm_Courant.id].questions;
                        }
                        sharedData.store('question_Courante', self.question_Courante)
                    }
                    else
                    {
                        $http.get("/rest/QCMList/"+self.qcm_Courant.id+"/QuesListComplete/"+self.question_Courante.id).then(
                            function(responseTrue){
                                for(var i = 0; i<responseTrue.data.reponses.length; i++)
                                {
                                    if(responseTrue.data.reponses[i].isTrue)
                                        self.question_Courante.reponses[i].isTrue = true;
                                    else
                                        self.question_Courante.reponses[i].isTrue = false;
                                }
                            },
                            function(errResponseTrue)
                            {
                            }
                        );
                    }
                },
                function(errResponseQues)
                {

                    console.log(errResponseQues.data);
                    console.error("error while fetching notes");
                }

            );
        };

        self.qcm_Courant = sharedData.get("qcm_Courant");
        if(!self.qcm_Courant)
        {
            $location.path("/index");
        }
        else
        {
            self.question_Courante = sharedData.get("question_Courante");
            self.selection = sharedData.get('selection');
            if (self.question_Courante) {
                for (var i = 0; i < self.question_Courante.reponses.length; i++) {
                    if (self.RepQuest[self.question_Courante.id] == i && self.radio[i] != undefined)
                        self.radio[i] = true;
                    else
                        self.radio[i] = false;
                }
                if (self.qcm != undefined && self.qcm[self.qcm_Courant.id]) {
                    self.qcm.styleReponse = self.selection[self.qcm_Courant.id].questions;
                }
            }
            else
            {
                $location.path("/index");
            }
        }




    }])
    .controller('scoreControleur',['$scope','$http','QcmFactory','QuesFactory','$routeParams','sharedData','$location',  function($scope, $http, QcmFactory, QuesFactory,$routeParams,sharedData, $location, loaded ) {
        if(sharedData.get('userId')== undefined)
            $location.path("/index");
        var self = this;
        /* resultats */
        self.RepQuest=sharedData.get('RepQuest');
        self.re_get = '';
        self.connectedUserId=sharedData.get('userId');


        $http.post("./rest/QCMList/" + $routeParams.qcmid+ "/UserId/" + self.connectedUserId + "/ScoreQCM", {'answers':self.RepQuest}).then(
            function (response) {
                self.score = response.data;
            },
            function (errResponse) {
                console.log(errResponse.data);
                console.error("error while fetching score");
            })
    }

    ]);
