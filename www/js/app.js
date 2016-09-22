
angular.module('starter', ['ionic', 'starter.itemscontrol'])


.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
    .state('login', {
                url:'/login',
                controller: 'LoginCtrl',
                templateUrl:'templates/login.html'
            })
    .state('menu', {
                url:'/menu',
                abstract: true,         
                controller: 'MenuCtrl',
                templateUrl:'templates/menu.html'
            })
    .state('menu.home', {
                url:'/home',
                views: {
                    'menuContent': {
                        templateUrl:'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }               
            })
    .state('cart', {
                url:'/cart',
                controller: 'CartCtrl',
                templateUrl:'templates/cart.html'
            })
    .state('about', {
                url:'/about',
                controller: 'AboutCtrl',
                templateUrl:'templates/about.html'
            })
        $urlRouterProvider.otherwise('/login');
})


.controller('LoginCtrl', function($scope, $state, loginData){
    $scope.login = {username:'', password:''};
        var form = document.getElementById("myForm");
        form.onsubmit = function(){
        form.reset();
      }
    $scope.verificar =  function(login){
        loginData.updateLogin(login);
        $state.go('menu.home');        
    };   
})

.controller('MenuCtrl', function($scope, $state, loginData){
   $scope.login = loginData.getLogin();
    $scope.logOut = function(){        
        $state.go('login');
        window.location.reload()
    };
})

.controller('HomeCtrl', function($scope, ItemsControl, $http, $ionicScrollDelegate) {
   //$scope.items = ItemsControl.list($http, $scope);
    
    //$scope.items = [];
    //ItemsControl.update($http);
    var ip = "http://webserviceepatec.azurewebsites.net/EPATEC.asmx/Parsear?frase=";
                    var peticion = "listar,productos"
                    var request = "";
                    request = request.concat(ip, peticion);
                    console.log("Request es:", request);
                $http.get(request)
                            .then(function (response) {
                            console.log('Get Post', response);
                            console.log("Get Post status", response.data);
                            var data = response.data;
                            var result = data.substring(70, data.length - 9);
                            console.log("Get Post status", result);
                            var result2 = angular.fromJson(result);
                            console.log("Get Post status 2", result2);                            
                            for(var i in result2) {
                                $scope.items.push(result2[i]);
                            }
                            var result3 = $scope.items
                            console.log("Result3 ", result3);
                    });
    
   $scope.update = function() {
       itemsFinal = $scope.itemsFinal = [];
       addDelay();
       ItemsControl.update($http);
   }
   
   
   
   
       
    var letters = $scope.letters = [];
    var itemsFinal = $scope.itemsFinal = [];
    var currentCharCode = ' '.charCodeAt(0) - 1;
    var letterHasMatch = {};  
    
    //console.log("Antes", items);
    
    //window.setTimeout(addDelay, 3000);

    function addDelay() {
        $scope.items
        .sort(function(a, b) {
      return a._description.toUpperCase().charCodeAt(0) > b._description.toUpperCase().charCodeAt(0) ? 1 : -1;
    })
    .forEach(function(item) {
      //Get the first letter of the last name, and if the last name changes
      //put the letter in the array
        
      var itemCharCode = item._description.toUpperCase().charCodeAt(0);
        
        
        
      if (itemCharCode < 65) {
         itemCharCode = 35; 
      }
   
      //We may jump two letters, be sure to put both in
      //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
      var difference = itemCharCode - currentCharCode;
      for (var i = 1; i <= difference; i++) {
        /*console.log(String.fromCharCode(currentCharCode));*/
        addLetter(currentCharCode + i);;
        
      }
      currentCharCode = itemCharCode;
        console.log(item);
      itemsFinal.push(item);
    });
    }
    
    
    $scope.getItems = function(search) {
    $scope.items = ItemsControl.list();
    $scope.search = search;
    letterHasMatch = {};
        
    //Filter contacts by $scope.search.
    //Additionally, filter letters so that they only show if there
    //is one or more matching contact
    return itemsFinal.filter(function(item) {
      var itemDoesMatch = !$scope.search || item.isLetter ||
        item._description.toLowerCase().indexOf($scope.search.toLowerCase()) > -1
      //console.log(item.last_name.toString().charAt(0));
      
      //Mark this person's last name letter as 'has a match'
      if (!item.isLetter && itemDoesMatch) {

        var letter = item._description.charAt(0).toUpperCase();
        if ( item._description.charCodeAt(0) < 65 ){
          letter = "#";
        }
        letterHasMatch[letter] = true;
      }

      return itemDoesMatch;
    }).filter(function(item) {
      //Finally, re-filter all of the letters and take out ones that don't
      //have a match
      if (item.isLetter && !letterHasMatch[item.letter]) {
        return false;
      }
      return true;
    });
  };
    
    /*for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
    addLetter(i);
  }*/
    
    function addLetter(code) {
    var letter = String.fromCharCode(code);

    itemsFinal.push({
      isLetter: true,
      letter: letter
    });
   
    letters.push(letter);
  }
    
    
   $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };
  
  $scope.scrollBottom = function() {
    $ionicScrollDelegate.scrollBottom();
  };
    
   
    
  $scope.addItemCart = function(id) {
      var item = ItemsControl.get(id);
      ItemsControl.addCart(item);
      
  };  
    
})

.controller('AboutCtrl', function($scope, $state){
    $scope.goBack = function(){ 
        $state.go('menu.home');
    };
})

.controller('CartCtrl', function($scope, $state, ItemsControl, $ionicScrollDelegate) {
   $scope.items = ItemsControl.listCart();;
    $scope.goBack = function(){ 
        $state.go('menu.home');
    };
    var letters = $scope.letters = [];
    var itemsFinal = $scope.itemsFinal = [];
    var currentCharCode = ' '.charCodeAt(0) - 1;
    var letterHasMatch = {};  
    $scope.items
        .sort(function(a, b) {
      return a._description.toUpperCase().charCodeAt(0) > b._description.toUpperCase().charCodeAt(0) ? 1 : -1;
    })
    .forEach(function(item) {
      //Get the first letter of the last name, and if the last name changes
      //put the letter in the array
      var itemCharCode = item._description.toUpperCase().charCodeAt(0);
      if (itemCharCode < 65) {
         itemCharCode = 35; 
      }
   
      //We may jump two letters, be sure to put both in
      //(eg if we jump from Adam Bradley to Bob Doe, add both C and D)
      var difference = itemCharCode - currentCharCode;

      for (var i = 1; i <= difference; i++) {
        /*console.log(String.fromCharCode(currentCharCode));*/
        addLetter(currentCharCode + i);
      }
      currentCharCode = itemCharCode;
      itemsFinal.push(item);
    });
    
    $scope.getItems = function(search) {
    $scope.search = search;
    letterHasMatch = {};
    //Filter contacts by $scope.search.
    //Additionally, filter letters so that they only show if there
    //is one or more matching contact
    return itemsFinal.filter(function(item) {
      var itemDoesMatch = !$scope.search || item.isLetter ||
        item._description.toLowerCase().indexOf($scope.search.toLowerCase()) > -1

      //console.log(item.last_name.toString().charAt(0));
      
      //Mark this person's last name letter as 'has a match'
      if (!item.isLetter && itemDoesMatch) {

        var letter = item._description.charAt(0).toUpperCase();
        if ( item._description.charCodeAt(0) < 65 ){
          letter = "#";
        }
        letterHasMatch[letter] = true;
      }

      return itemDoesMatch;
    }).filter(function(item) {
      //Finally, re-filter all of the letters and take out ones that don't
      //have a match
      if (item.isLetter && !letterHasMatch[item.letter]) {
        return false;
      }
      
      return true;
    });
  };
    
    for (var i = currentCharCode + 1; i <= 'Z'.charCodeAt(0); i++) {
    addLetter(i);
  }
    
    function addLetter(code) {
    var letter = String.fromCharCode(code);

    itemsFinal.push({
      isLetter: true,
      letter: letter
    });
   
    letters.push(letter);
  }
    
    
   $scope.scrollTop = function() {
    $ionicScrollDelegate.scrollTop();
  };
  
  $scope.scrollBottom = function() {
    $ionicScrollDelegate.scrollBottom();
  };
    
   

    $scope.eliminateItemCart = function(id) {
      var item = ItemsControl.getCart(id);
      ItemsControl.elimCart(item); 
      
  };
      
    
})


.service('loginData', function() {
 return {
   login: {},
   getLogin: function() {
     return this.login;
   },
   updateLogin: function(login) {
     this.login = login;
   }
 }
})



.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);


      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
