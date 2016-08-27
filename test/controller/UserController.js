
    //TESTED CODE FOR TEST CONTROLLER
// describe('Test Controller Testing',function(){
//     var scope,ctrl,controller,$httpBackend;
//     beforeEach(function(){
//         module('MeanApp');

//         inject(function($controller,$rootScope,_$httpBackend_){
//           scope=$rootScope.$new();
//           controller=$controller;
//           ctrl=controller('TestController',{$scope:scope});
//           $httpBackend=_$httpBackend_;
//            $httpBackend.when('GET', '/testdata')
//                             .respond(true);
//         })
//     });

//     it('Length should be 2',function(){
//         expect(scope.pname.length).toBe(2);
        
//     });
//     it('Length should be 3',function(){
//         scope.pushEle('reenu');
//         scope.pushEle('bharat');
//         expect(scope.pname.length).toBe(4);
//     });

//     it('Length should be 4',function(){
//         scope.pushEle('reenu');
//         scope.pushEle('bharat');
//         expect(scope.pname).toEqual(['rakesh','ranjan','reenu','bharat']);
//     });
//      it('Length should be 4',function(){
//         scope.pushEle('reenu');
//         scope.pushEle('bharat');
//         expect(scope.pname).toEqual(['rakesh','ranjan','reenu','bharat']);
//     });

//      it('Length should be 1',function(){
//         scope.popEle('ranjan');
//         expect(scope.pname).toEqual(['rakesh']);
//     });

//      it('Length should be 1',function(){
//         scope.popEle('rakesh');
//         expect(scope.pname).toEqual(['ranjan']);
//     });

//     it('2+2 is 4',function(){
//         expect(scope.addNumber(3,2)).toEqual(5);
//     });

//     it('2-2 is 0',function(){
//         expect(scope.substractNumber(5,7)).toEqual(-2);
//     });

//     it('Call api',function(){
//       console.log($httpBackend.expectGET('/testdata').respond());
//          expect($httpBackend.expectGET('/testdata')).toBeTruthy();
//         //$httpBackend.flush();
//     });
//     it('Call api',function(){
//       expect(scope.productList()).toEqual([{name:'mango'},{name:'banana'},{name:'apple'}]);
//     });

// });


// describe('Test Login Method',function(){
//     var $scope,$httpBackend,$controller,$mdDialog,$state,store,$mdToast;
//     beforeEach(function(){
//         module('UserController');

//         inject(function(_$controller_,_$rootScope_,_$httpBackend_){
//           $httpBackend=_$httpBackend_;
//           $scope=_$rootScope_.$new();
//           $controller=_$controller_('UserController',{$scope:$scope,$mdDialog:$mdDialog,$state:$state,store:store,$mdToast:$mdToast});
          
//         });
//     });

//     it('should set Login function', function() {
//        expect($scope.UserLogin).toBeDefined();
//      });

//     it('should be login for correct authentication',function(){
//       $scope.UserLogin();
//       $httpBackend.expect('POST', '/UserLogin', {email: 'rakesh.pandey@misport.com', password: 'sonukumar'}, { withCredentials: true})
//         .respond(function(method, url, data, headers, params){
//             console.log(method);
//         });
//         $httpBackend.flush();
//         //$httpBackend.when('GET', '/testdata').respond([{id: 1, name: 'Bob'}, {id:2, name: 'Jane'}]);
//     })
// });

describe('Testing main module',function(){
    var $scope,UsersController,$httpBackend,$mdDialog,$state,store,$mdToast;
    beforeEach(function(){
        module('MeanApp');

        inject(function($rootScope,$controller){
          $scope=$rootScope.$new();
          UsersController=$controller('UserController',{$scope:$scope,$mdDialog:$mdDialog,$state:$state,store:store,$mdToast:$mdToast});
        });
    });

    it('UserController should be Registered',function(){
        expect(UsersController).toBeDefined();
    });

    it('All Method should be Registered',function(){
        expect($scope.UserLogin).toBeDefined();
        expect($scope.showTermAndCondition).toBeDefined();
        expect($scope.createNewUser).toBeDefined();
        expect($scope.UpdateProfile).toBeDefined();
        expect($scope.ChangePassword).toBeDefined();
    });
});

describe('Service Testing',function(){
    var testSevices;
    beforeEach(function(){
        module('MeanApp');
        inject(function(testSevice) {
          testSevices = testSevice;
        });
    });


    it('Should be hi',function(){
        expect(testSevices.GetData()).toBe('hi');
    });
});

// describe('Routes Testing',function(){
//     var $state, $rootScope;
//     beforeEach(function(){
//         module('MeanApp');
//         inject(function($state, $rootScope) {
//           $state = $state;
//           $rootScope=$rootScope;
//         });
//     });


//     it('Should be ok',function(){
//         $state.transitionTo('Profile');
//         $rootScope.$apply();
//         expect($state.get('Profile').templateUrl).toBe('view/profile.html');
//     });
// });