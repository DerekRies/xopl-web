'use strict';

/* Controllers */


function HomeCtrl($scope) {
    $("#main-header").fitText(3.5);
    $scope.stars = 630;
    $scope.planets = 813;
}
// HomeCtrl.$inject = [];


function LearnCtrl($scope) {
}
// LearnCtrl.$inject = [];

function DemoCtrl($scope,Systems) {


    $scope.init = function(){
        $scope.systems = [];
        $scope.activeSystem = null;
        $scope.icon = false;
        $scope.pauseIcon = 'icon-pause';
        $scope.paused = false;
        $scope.speeds = [-32,-16,-8,-4,-2,-1,-.5,-.25,-.125,.125,.25,.5,1,2,4,8,16,32];
        $scope.speedslen = $scope.speeds.length;
        $scope.speedInd = 12;
        $scope.speed = $scope.speeds[$scope.speedInd];
        $scope.cameraMode = 'Target';
        $scope.playingText = "Playing";

        $('#freeflybtn').popover({trigger:"hover",placement:"bottom",delay:{"show":1000}});
        $('#camtargetbtn').popover({trigger:"hover",placement:"bottom",delay:{"show":1000}});
        $('#cinematicbtn').popover({trigger:"hover",placement:"bottom",delay:{"show":1000}});
        
        $scope.currentPage = 0;
        $scope.pageSize = 17;

        Systems.get(function(json){
            $scope.systems = json;
            console.log('finished loading');
            $scope.$digest();
            $scope.openSystemPanel();
            Sim.init();
        },0);

    }

    $scope.determinePageSize = function(){

    }

    $scope.numberOfPages = function(){
        return Math.ceil($scope.systems.length/$scope.pageSize);
    }

    $scope.setPage = function(n){
        $scope.currentPage = n;
        console.log($scope.currentPage);
    }

    $scope.isTarget = function(system){
        return system == $scope.activeSystem;
    }

    $scope.report = function(system){
        console.log(system);
    }

    $scope.getCurrentPage = function(){
        return $scope.currentPage + 1;
    }

    $scope.setActiveSystem = function(target, close){
        // console.log(target);
        if($scope.activeSystem !== target){
            $scope.activeSystem = target
            if(close){
                // $scope.closeSystemPanel();
            }
            Sim.loadSystem(target);
        }
    }

    $scope.setRandomSystem = function(){
        var random = Math.floor(Math.random()*$scope.systems.length);
        $scope.currentPage = Math.floor(random / $scope.pageSize);
        $scope.setActiveSystem($scope.systems[random], false);
    }

    $scope.closeSystemPanel = function(){
        $('#side-panel').removeClass('open');
    };

    $scope.openSystemPanel = function(){
        $('#side-panel').addClass('open');
    };

    $scope.closeOptionsPanel = function(){
        $('#side-right-panel').removeClass('open');
    };

    $scope.openOptionsPanel = function(){
        $('#side-right-panel').addClass('open');
    };

    $scope.toggleDisplaySettings = function(){
        $('#options-settings').slideToggle();
        $scope.icon = !$scope.icon;
        if($scope.icon){
            $('#options-header').find('i').attr('class','icon-minus');
        }
        else{
            $('#options-header').find('i').attr('class','icon-plus');
        }
    };

    $scope.setCameraMode = function(mode){
        $scope.cameraMode = mode;
    };

    $scope.setSpeed = function(modifier){
        switch(modifier){
            case "toggle":
                $scope.paused = !$scope.paused;
                $scope.playingText = ($scope.paused ? 'Paused' : 'Playing');
                $scope.pauseIcon = ($scope.paused ? 'icon-play' : 'icon-pause');
                Sim.paused = $scope.paused;
                break;
            case "forward":
                if($scope.speedInd < $scope.speedslen - 1){
                    $scope.speedInd += 1;
                    $scope.speed = $scope.speeds[$scope.speedInd];
                }
                break;
            case "backward":
                if($scope.speedInd > 0){
                    $scope.speedInd -= 1;
                    $scope.speed = $scope.speeds[$scope.speedInd];
                }
                break;
        }
        Sim.speed = $scope.speed;
    };

    $scope.init();
    
}
// DemoCtrl.$inject = [];
