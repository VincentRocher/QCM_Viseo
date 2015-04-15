angular.module('QCM',['ngResource','ngRoute'])
    .factory('QcmFactory',['$resource',function($resource){
        return $resource('/rest/QCMList/:id',
            {id:"@id"}
        );

    }])
    .factory('QuesFactory', ['$resource', function($resource){
        return $resource('/rest/QCMList/:qcmid/QuesList/:quesid',
            {qcmid:"@qcmid", quesid:"@quesid"}
        );

    }])

    .controller('QCM_courant', ['$scope',  '$http','QcmFactory','QuesFactory', function($scope, $http, QcmFactory, QuesFactory )
    {
        var self = this;
        self.affScore = false;
        self.formulaireInscription=false;
        self.qcm_Internal_Input=false;
        self.ques_Internal_Input=false;
        self.type_Edit="";
        self.qcm="";
        self.qcmComplete=false;
        self.connectedUserId="";
        self.RepQuest = [
                   ];
        self.radio = [];
        console.log("PLOP");
        /*self.newQues = new QuesFactory();
        console.log("PLOP2");
        alert(JSON.stringify(self.newQues));
        self.newQues.Titre = "UAZHEIAZGEIAZGEIAZEIAZGEAIZGEI";
        self.newQues.$save();*/

        console.log("PLOP3");
        QuesFactory.get({qcmid:1,quesid:0})
            .$promise.then(function(ques){
                console.log(JSON.stringify(ques));
                console.log("PROMESSE");
                ques.Titre="UAZHEIAZGEIAZGEIAZEIAZGEAIZGEI";
                ques.$save({qcmid:0,quesid:0});


            });
        QuesFactory.delete({qcmid:0,quesid:0});
        $http.get("./rest/QCMList").then
        (
            function(response)
            {
                $scope.qcm_Table= response.data;
            },
            function(errResponse)
            {
                console.log(errResponse.data);
                console.error("error while fetching notes");
            }
        );

        /*{
            self.qcms = QcmFactory.query();
            QcmFactory.get({id: 0})
                .$promise.then(function (qcm) {
                    alert(qcm.Titre);
                    qcm.Titre = "NOUVEAU";
                    //qcm.Titre="Edited";
                    alert(JSON.stringify(qcm.questions));
                    qcm.$save();


                }
            );
            self.newQCM = new QcmFactory();
            alert(JSON.stringify(self.newQCM));
            self.newQCM.Titre = "New";
            self.newQCM.$save();
        }*/


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
            $http.post("./rest/User", self.utilisateurIns).then(
                function(responseIns)
                {
                    self.connectedUserId=responseIns.data;
                $http.get("./rest/QCMList/"+self.qcmTemp.id).then(
                    function(responseQCM){

                        self.qcm_Courant= responseQCM.data;  // QCM_ID/QCM_TITRE/QUESTIONS sans REPONSE
                        self.RepQuest=[];
                        self.QIndex=0;
                        self.score=0;
                        self.affScore=false;
                        $http.get("./rest/QCMList/"+self.qcmTemp.id+"/QuesList/"+self.QIndex).then(
                            function(responseQues){

                                self.question_Courante=responseQues.data; // QUES_ID/QUES_TITRE/REPONSES sans ISTRUE
                                for(var i = 0; i<self.question_Courante.reponses.length;i++)
                                {
                                    if(self.RepQuest[self.question_Courante.id]==i && self.radio[i] != undefined)
                                        self.radio[i]=true;
                                    else
                                        self.radio[i]=false;
                                }
                                //  alert(JSON.stringify(self.question_Courante));
                                if(self.qcm[self.qcm_Courant.id]) {
                                    self.qcm.styleReponse = self.selection[self.qcm_Courant.id].questions;
                                }

                            },
                            function(errResponseQues)
                            {
                                //alert("PAS COOL");
                                console.log(errResponse.data);
                                console.error("error while fetching notes");
                            }

                        );


                        //alert("Select"+JSON.stringify(self.selection[self.qcm_Courant.id].questions));
                        //alert("Select"+JSON.stringify(self.question_Courante.styleReponse));
                        self.formulaireInscription=false;
                    },
                    function(errResponseQCM)
                    {
                        console.log(errResponse.data);
                        console.error("error while fetching notes");
                    }
                );

            },
                function(errResponseIns)
                {}


            );




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
            //alert(self.reponse_Courante);
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
                    //alert(self.question_Courante.reponses)

                    if (self.question_Courante.reponses[id_Rep]) {
                        self.RepQuest[self.question_Courante.id]=id_Rep;
                        var nbRep = 0;
                        for(var i = 0; i<self.qcm_Courant.questions.length;i++)
                        {

                            if(self.RepQuest[i] != undefined)
                                nbRep++;
                        }
                        if(nbRep==self.qcm_Courant.questions.length) {

                            self.qcmComplete = true;
                            alert(self.qcmComplete);
                        }
                        alert(nbRep);
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
                    for(var i = 0;i<self.question_Courante.reponses.length;i++)
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
            if(self.QIndex<self.qcm_Courant.questions.length-1)
                self.QIndex++;



            alert(self.qcmComplete);
            if(self.qcmComplete)
            {
                self.re_get='';
                //alert(JSON.stringify(self.RepQuest));
                for(var l=0;l<self.RepQuest.length;l++)
                {
                    //alert(JSON.stringify(self.re_get));
                    self.re_get+=''+self.RepQuest[l]+'x';

                }
                alert(self.connectedUserId);
                alert("./rest/QCMList/"+self.qcm_Courant.id+"/UserId/"+self.connectedUserId+"/ScoreQCM/"+self.re_get);
                $http.get("./rest/QCMList/"+self.qcm_Courant.id+"/UserId/"+self.connectedUserId+"/ScoreQCM/"+self.re_get).then(
                    function(response){
                        alert(JSON.stringify(response));
                        self.score=response.data;
                    },
                    function(errResponse)
                    {
                        //alert("self.score: "+JSON.stringify(self.score));

                        //alert("PAS COOL imen");
                        console.log(errResponse.data);
                        console.error("error while fetching score");
                    })
                self.qcm[self.qcm_Courant.id]={cleared:true};
                delete(self.QIndex);
                delete(self.question_Courante);
                self.affScore=true;
            }
            else if(self.QIndex<self.qcm_Courant.questions.length)
            {
                $http.get("./rest/QCMList/"+self.qcm_Courant.id+"/QuesList/"+self.QIndex).then(
                    function(response){

                        self.question_Courante=response.data; // QUES_ID/QUES_TITRE/REPONSES sans ISTRUE
                        for(var i = 0; i<self.question_Courante.reponses.length;i++)
                        {
                            if(self.RepQuest[self.question_Courante.id]==i && self.radio[i] != undefined)
                                self.radio[i]=true;
                            else
                                self.radio[i]=false;
                        }
                        //alert(JSON.stringify(self.question_Courante));
                        //if(self.qcm[self.qcm_Courant.id]) {
                        //self.qcm.styleReponse = self.selection[self.qcm_Courant.id].questions;
                        // }

                    },
                    function(errResponse)
                    {
                        //alert("question_Courante: "+JSON.stringify(self.question_Courante));

                        //alert("PAS COOL imen");
                        console.log(errResponse.data);
                        console.error("error while fetching notes");
                    })
            }
        }
        self.moveQ = function(direction)
        {
            self.QIndex+=direction;

            $http.get("./rest/QCMList/"+self.qcm_Courant.id+"/QuesList/"+self.QIndex).then(
                function(response){

                    self.question_Courante=response.data; // QUES_ID/QUES_TITRE/REPONSES sans ISTRUE

                    for(var i = 0; i<self.question_Courante.reponses.length;i++)
                    {
                        if(self.RepQuest[self.question_Courante.id]==i && self.radio[i] != undefined)
                        self.radio[i]=true;
                        else
                        self.radio[i]=false;
                    }
                    //alert(JSON.stringify(self.question_Courante));
                    //if(self.qcm[self.qcm_Courant.id]) {
                    //self.qcm.styleReponse = self.selection[self.qcm_Courant.id].questions;
                    // }

                },
                function(errResponse)
                {
                    //alert("question_Courante: "+JSON.stringify(self.question_Courante));

                    //alert("PAS COOL imen");
                    console.log(errResponse.data);
                    console.error("error while fetching notes");
                })
            //self.question_Courante = self.qcm_Courant[self.qcm_Courant.id].questions[self.QIndex];
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
