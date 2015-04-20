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
        return $resource('/rest/QCMList/:qcmId',
            {qcmId:"@qcmId"}
        );

    }])
    .factory('QuesFactory', ['$resource', function($resource){
        return $resource('/rest/QCMList/:qcmId/QuesList/:questionId',
            {qcmId:"@qcmId", questionId:"@questionId"}
        );

    }])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/index',{
                templateUrl:'./view/titres.html',
                controller:'titlesController as titreCtrl',
                resolve: {
                    loadedQcmList: ['$http','sharedData', function($http, sharedData){
                        return $http.get("./rest/QCMList").then(function(response){
                            sharedData.store('qcmTable',response.data);
                            return sharedData.get('qcmTable');

                        })
                    } ]
                    }
            })
            .when('/qcm/:qcmId/numq/:questionId',{
                templateUrl:'./view/questions.html',
                controller:'questionController as QuesCtrl',
                resolve: {
                    loadedQues: ['$http','sharedData','$route', function($http, sharedData, $route){
                        return $http.get("./rest/QCMList/"+$route.current.params.qcmId+"/QuesList/"+$route.current.params.questionId).then(function(response){
                            var actualQuestion = response.data;
                            sharedData.store('actualQuestion',actualQuestion);
                            return sharedData.get('actualQuestion');

                        })
                    } ]
                }

            })
            .when('/inscription/:qcmId',{
                templateUrl:'./view/inscription.html',
                controller:'inscriptionController as InsCtrl',
                resolve: {
                    loadedQcm: ['$http','sharedData','$route', function($http, sharedData, $route){

                        return $http.get("./rest/QCMList/"+$route.current.params.qcmId).then(function(response){
                            var actualQcm = response.data;
                            sharedData.store('actualQcm',actualQcm);
                            return sharedData.get('actualQcm');

                        })
                    } ]
                }

            })
            .when('/qcm/:qcmId/score',{
                templateUrl:'./view/scores.html',
                controller:'scoreController as scoreCtrl'

            })
            .when('/login',{
                templateUrl:'./view/login.html',
                controller:'loginController as logCtrl'

            })
            .when('/edit/index',{
                templateUrl:'./view/titresEdit.html',
                controller:'titlesEditController as titleEditCtrl',
                resolve: {
                    loadedQcmList: ['$http','sharedData', function($http, sharedData){
                        return $http.get("./rest/QCMList").then(function(response){
                            sharedData.store('qcmTable',response.data);
                            return sharedData.get('qcmTable');

                        })
                    } ]
                }
            })
            .when('/edit/qcm/:qcmId',{
                templateUrl:'./view/questionsEdit.html',
                controller: 'questionsEditController as questionEditCtrl',
                resolve: {
                    loadedQcm: ['$http','sharedData','$route', function($http, sharedData, $route){

                        return $http.get("./rest/QCMList/"+$route.current.params.qcmId).then(function(response){
                            var actualQcm = response.data;
                            sharedData.store('actualQcm',actualQcm);
                            return sharedData.get('actualQcm');

                        })
                    } ]
                }
            })
            .when('/edit/qcm/:qcmId/question/:questionId',{
                templateUrl : './view/answersEdit.html',
                controller : "answersEditController as answerEditCtrl",
                resolve: {
                    loadedQues: ['$http','sharedData','$route', function($http, sharedData, $route){
                        return $http.get("./rest/QCMList/"+$route.current.params.qcmId+"/QuesListComplete/"+$route.current.params.questionId).then(function(response){
                            var actualQuestion = response.data;
                            sharedData.store('actualQuestion',actualQuestion);
                            return sharedData.get('actualQuestion');

                        })
                    } ]
                }
            })
            .otherwise({redirectTo:'/index'});
    }])
    .controller('inscriptionController',['$scope',  '$http','$routeParams','$location','sharedData', function($scope, $http, $routeParams, $location, sharedData)
    {
        var self = this;
        self.selection = sharedData.get('selection');
        self.qcmIdToGo = $routeParams.qcmId;
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
    .controller('titlesController',['$scope','$http','$routeParams','sharedData','$location',
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
            $scope.qcmTable=sharedData.get('qcmTable');
            self.qcm=sharedData.get('qcm');
            for(var i = 0; i<$scope.qcmTable.length;i++){
                if(self.qcm!=undefined && self.qcm[i]!=undefined && self.qcm[i].cleared == true)
                {
                    $scope.qcmTable[i].finish=true;
                }
            }

        }])
    .controller('questionController',['$scope','$http','$routeParams','sharedData','$location',  function($scope, $http,$routeParams,sharedData, $location )
    {
        var self=this;
        $scope.qcmTable=sharedData.get('qcmTable');
        self.styleAnswer=[];
        self.QIndex = $routeParams.questionId;
        self.actualQcm = sharedData.get('actualQcm');
        self.RepQuest=sharedData.get('RepQuest');
        self.qcm=sharedData.get('qcm');
        self.selection = sharedData.get('selection');
        self.radio = sharedData.get('radio');
        self.nextQ = function(idAns, isReplay)                                 //questions
        {
            if(!self.qcm || !self.qcm[self.actualQcm.id]) {
                if(!self.actualQuestion.Repondu) {
                    if (self.actualQuestion.reponses[idAns]) {
                        self.RepQuest[self.actualQuestion.id]=idAns;
                        sharedData.store('RepQuest', self.RepQuest);
                        var nbRep = 0;
                        for(var i = 0; i<self.actualQcm.questions.length;i++)
                        {
                            if(self.RepQuest[i] != undefined)
                                nbRep++;
                        }
                        if(nbRep==self.actualQcm.questions.length) {
                            self.qcmComplete = true;
                        }
                    }
                    if(self.selection[self.actualQcm.id] == undefined)
                    {
                        self.selection[self.actualQcm.id] = {};
                    }
                    if(self.selection[self.actualQcm.id].questions == undefined)
                    {
                        self.selection[self.actualQcm.id].questions = [];
                    }
                    if(self.selection[self.actualQcm.id].questions[self.actualQuestion.id] == undefined)
                    {
                        self.selection[self.actualQcm.id].questions[self.actualQuestion.id]={};
                    }
                    for(var i = 0;i<self.actualQuestion.reponses.length;i++)
                    {
                        if(i==idAns)
                        {
                            if(self.selection[self.actualQcm.id].questions[self.actualQuestion.id].reponses == undefined)
                                self.selection[self.actualQcm.id].questions[self.actualQuestion.id].reponses=[];
                            self.selection[self.actualQcm.id].questions[self.actualQuestion.id].reponses[i]={selected:true};

                        }
                        else
                        {
                            if(self.selection[self.actualQcm.id].questions[self.actualQuestion.id].reponses == undefined)
                                self.selection[self.actualQcm.id].questions[self.actualQuestion.id].reponses=[];
                            self.selection[self.actualQcm.id].questions[self.actualQuestion.id].reponses[i]={selected:false};
                        }
                    }
                    sharedData.store('selection', self.selection);
                    self.actualQuestion.Repondu=true;
                }
            }
            if(self.qcmComplete)
            {
                if(self.qcm==undefined)
                self.qcm = [];
                self.qcm[self.actualQcm.id]={cleared:true};
                sharedData.store('qcm', self.qcm);
                sharedData.store('actualQuestion', []);
                self.qcmComplete=false;
                $location.path("/qcm/"+self.actualQcm.id+"/score");
            }
            else {
                if (self.QIndex < self.actualQcm.questions.length - 1)
                    $location.path("/qcm/" + self.actualQcm.id + "/numq/" + (parseInt(self.QIndex) + 1));
            }
        };
        self.moveQ = function(direction)                                        //questions
        {
            $location.path("/qcm/"+self.actualQcm.id+"/numq/"+(parseInt(self.QIndex)+parseInt(direction)));
        };

        self.actualQcm = sharedData.get("actualQcm");

        if(!self.actualQcm)
        {
            $location.path("/index");
        }
        else
        {
            self.actualQuestion = sharedData.get("actualQuestion");
            self.selection = sharedData.get('selection');
            if (self.qcm != undefined && self.qcm[self.actualQcm.id]) {
                $http.get("./rest/QCMList/" + self.actualQcm.id+ "/QuesListComplete/" + self.actualQuestion.id).then(
                    function(response)
                    {

                        self.styleAnswer[self.RepQuest[self.actualQuestion.id]]={selected: true};
                        for(var i =0;i<self.actualQuestion.reponses.length;i++){
                            if(response.data.reponses[i].isTrue)
                                self.styleAnswer[i]={isTrue:true};
                        }
                    }
                    ,
                    function(errResponse)
                    {

                    }
                );
            }
            else {
                if (self.actualQuestion) {
                    for (var i = 0; i < self.actualQuestion.reponses.length; i++) {
                        if (self.RepQuest[self.actualQuestion.id] == i && self.radio[i] != undefined)
                            self.radio[i] = true;
                        else
                            self.radio[i] = false;
                    }

                }
                else {
                    $location.path("/index");
                }
            }
        }




    }])
    .controller('scoreController',['$scope','$http','$routeParams','sharedData','$location',  function($scope, $http,$routeParams,sharedData, $location, loaded ) {
        if(sharedData.get('userId')== undefined)
            $location.path("/index");
        var self = this;
        /* resultats */
        self.RepQuest=sharedData.get('RepQuest');
        self.connectedUserId=sharedData.get('userId');


        $http.post("./rest/QCMList/" + $routeParams.qcmId+ "/UserId/" + self.connectedUserId + "/ScoreQCM", {'answers':self.RepQuest}).then(
            function (response) {
                self.score = response.data;
            },
            function (errResponse) {
                console.log(errResponse.data);
                console.error("error while fetching score");
            })
    }

    ])
    .controller('loginController',['$scope','$http','$routeParams','sharedData','$location',  function($scope, $http,$routeParams,sharedData, $location, loaded ) {
        var self=this;
        self.checkLogs = function()
        {

            if(self.user.login=="admin" && self.user.pwd=="VISEO")
            {
                $location.path("/edit/index");
            }
            else
            {
                $location.path("/index");
            }

        }
    }])
    .controller('titlesEditController', ['$scope','$http','QcmFactory','$routeParams','sharedData','$location','$route',  function($scope, $http,QcmFactory,$routeParams,sharedData, $location,$route, loaded  ) {
        var self = this;
        $scope.qcmTable=sharedData.get('qcmTable');
        sharedData.store('qcmTable', $scope.qcmTable);
        self.new = function()                                           // Edition------------------------------
        {
            self.newQCM = new QcmFactory();
            if(self.createQcmInput)
                self.newQCM.Titre = self.createQcmInput;
            else
                self.newQCM.Titre = "";
            self.newQCM.questions=["k"];
            self.newQCM.$save();
            delete(self.editedQcm);
            $route.reload();

        };
        self.delete = function(id, item)                                     // Edition------------------------------
        {
            if(self.actualQcm && self.actualQcm.id==id)
            {
                delete(self.actualQcm);
            }
            QcmFactory.delete({qcmId:id});
            self.qcmInput=false;
            delete(self.editedQcm);
            $route.reload();

        };
        self.save=function( id, type)                                           // Edition------------------------------
        {
            QcmFactory.get({qcmId: id})
                .$promise.then(function (qcm) {
                    if(self.qcmEdit && self.qcmEdit[id]) {
                        qcm.Titre = self.qcmEdit[id].Titre;
                        qcm.$save({qcmId: id});
                        self.qcmEdit[id].Titre = "";
                    }
                    delete(self.editedQcm);
                    $route.reload();
                }
            );
        };
        self.select = function(qcm)                                             // Edition------------------------------
        {
            self.editedQcm = qcm.id;

        };
        self.cancel= function(id)
        {
            self.qcmEdit[id].Titre="";
            delete(self.editedQcm);


        }
        self.goToQcm = function(id)
        {
            $location.path("/edit/qcm/"+id);

        }

    }])
    .controller('questionsEditController',['$scope','$http','QuesFactory','$routeParams','sharedData','$location','$route',  function($scope, $http,QuesFactory,$routeParams,sharedData, $location,$route, loadedQues  ) {
    var self = this;
        $scope.qcmTable=sharedData.get('qcmTable');
        self.actualQcm = sharedData.get('actualQcm');

        self.back= function(){

            $location.path('/edit/index');
        }
        self.select = function(ques)                                             // Edition------------------------------
        {
            self.editedQuestion = ques.id;

        };
        self.new = function()
        {
            self.newQues = new QuesFactory();
            if(self.newQues) {
                self.newQues = new QuesFactory();
                self.newQues.Titre = self.createQuestionInput.Titre;
                self.newQues.reponses = [];
                self.newQues.$save({qcmId: self.actualQcm.id});
            }
            delete(self.editedQuestion);
            $route.reload();
        }
        self.cancel = function(id)
        {
            if(self.questionEdit)
            self.questionEdit[id]="";
            delete(self.editedQuestion);
        }
        self.delete = function(id)
        {
            if(self.actualQuestion && self.actualQuestion.id==id)
            {
                delete(self.actualQuestion);
            }
            QuesFactory.delete({qcmId:self.actualQcm.id,questionId:id});
            delete(self.editedQuestion);
            $route.reload();

        }
        self.save = function(id)
        {
                QuesFactory.get({qcmId: self.actualQcm.id, questionId: id})
                    .$promise.then(function (ques) {
                        if(self.questionEdit && self.questionEdit[id]) {
                            ques.Titre = self.questionEdit[id].Titre;
                            ques.$save({qcmId: self.actualQcm.id , questionId: id});
                            self.questionEdit[id].Titre = "";
                        }
                        delete(self.editedQuestion);
                        $route.reload();
                    }
                );


        }
        self.goToQuestion = function(id)
        {
         $location.path('/edit/qcm/'+$routeParams.qcmId+"/question/"+id);

        }

    }])
    .controller('answersEditController',['$scope','$http','QuesFactory','$routeParams','sharedData','$location','$route',  function($scope, $http,QuesFactory,$routeParams,sharedData, $location,$route, loadedQues)
    {
        var self=this;
        self.actualQcm = sharedData.get('actualQcm');
        self.actualQuestion = sharedData.get('actualQuestion');
        self.back = function()
        {
            $location.path("/edit/qcm/"+$routeParams.qcmId);


        }
        self.cancel = function(){
            $route.reload();
        }
        self.new = function()
        {
            if(self.createAnswerEdit)
            self.actualQuestion.reponses[self.actualQuestion.reponses.length]=
            {  id:self.actualQuestion.reponses.length,
                Titre:self.createAnswerEdit,
                isTrue:false
            }
        }
        self.save = function(){
                var saveLength = self.actualQuestion.reponses.length;
                var recul = 0;
                for (var i = 0; i < saveLength; i++) {
                    if ( self.repDel && self.repDel[i] == true) {
                        self.actualQuestion.reponses.splice(i - recul, 1);
                        recul++;
                        delete(self.repDel[i]);
                    }
                    else
                    {
                        if(self.repEdit && self.repEdit[i])
                        self.actualQuestion.reponses[i-recul].Titre=self.repEdit[i].Titre;

                    }
                }
                for (var j = 0; j < self.actualQuestion.reponses.length; j++) {
                    self.actualQuestion.reponses[j].id = j;
                }

                QuesFactory.get({qcmId: $routeParams.qcmId, questionId: $routeParams.questionId})
                    .$promise.then(function (ques) {
                            ques.reponses = self.actualQuestion.reponses;
                            ques.$save({qcmId: $routeParams.qcmId, questionId: $routeParams.questionId});
                            $route.reload();

                    });

        }
        self.uncheckOther = function(reponse)                                   // Edition------------------------------
        {

            for(var i = 0;i<self.actualQuestion.reponses.length;i++)
            {
                if(self.actualQuestion.reponses[i].id!=reponse.id)
                {

                    self.actualQuestion.reponses[i].isTrue=false;
                }

            }


        };
    }
    ])
;
