(function() {
  'use strict';

  angular.module('admission')
    .controller('studentsController', studentController)
    .controller('Dialog1Controller', Dialog1Controller)

  function studentController($resource, $state, $stateParams, $mdDialog, $mdMedia, Student, Guardian, Batch, Gender, VerifyDelete, Toast) {
    var vm = this;

    vm.show = false;
    vm.search = [];
    vm.students = [];
    vm.guardians = [];
    vm.batches = [];
    vm.gender = [];
    vm.error;

    vm.registerForm = {
      id_no: '',
      name: '',
      tel: '',
      batch_id: '',
      date_of_birth: '',
      enrollment_date: new Date(),
      guardians_id: '',
      gender_type_id: '1'
    };

    vm.selected = [];

    vm.query = {
      limit: 10,
      page: 1
    };

    vm.promise = Student.query().$promise.then(function(data) {
      vm.students = data;
    }, function(error) {
      vm.error = error
    })

    Guardian.query().$promise.then(function(result) {
      vm.guardians = result;
    }, function(error) {
      console.log(error);
    })

    Batch.query().$promise.then(function(result) {
      vm.batches = result;
    }, function(error) {
      console.log(error);
    })

    Gender.query().$promise.then(function(result) {
      vm.gender = result;
    }, function(error) {
      console.log(error);
    })

    vm.delete = function(user, index) {
      VerifyDelete(user).then(function() {
        user.active = 0;
        console.log(user);
        Student.update(user).$promise.then(function(data) {
          vm.students.splice(index, 1);
          console.log('deleted successfully');
        })
      })
    }

    vm.register = function(data) {
      Student.save(data).$promise.then(function(success) {
        Toast('success');
          vm.students.push(data);
      }, function(error) {
        Toast('error')
      })
    }

    vm.moreInfo = function(studentId) {
      $state.go('home.student', ({id: studentId}));
    }


    vm.openDialog = function($event) {
      $mdDialog.show({
        controller: 'Dialog1Controller',

        templateUrl: 'admission/partials/dialog.register.html',
        parent: angular.element(document.body),
        targetEvent: $event,
        clickOutsideToClose: true,
        locals: {
          register: vm.register,
          data: vm.registerForm,
          guardians: vm.guardians,
          batches: vm.batches,
          gender: vm.gender
        }

      })

    }


  }

  function Dialog1Controller($scope, $mdDialog, register, data, guardians, batches, gender) {
    $scope.data = data;
    $scope.guardians = guardians;
    $scope.batches = batches;
    $scope.gender = gender;

    $scope.searchGuardian = '';
    $scope.selectedGuardian = '';

    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.register = function() {
      //insert guardians_id before data being sent
      $scope.data.guardians_id = $scope.selectedGuardian.id
      console.log($scope.data);
      register($scope.data);

      $mdDialog.hide();
    };
  }


})();
