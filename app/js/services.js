'use strict';

/* Services */


angular.module('myApp.services', []).
  factory('Systems',function(){
    return {
        get: function(func, delay){
            $.getJSON("/app/newexoplanets.json", function(json){
                if(delay !== 0){
                    setTimeout(function(){
                        func(json)
                    },delay);
                }
                else{
                    func(json);
                }
               
            });
        },
        update:function(){
            console.log("doing another thing");
        }
    }
  });
