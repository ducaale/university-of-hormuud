(function() {
  'use strict';

  angular
    .module('studentScore')
    .controller('studentScoreController', studentScoreController)

  studentScoreController.$inject = ['StudentScore', 'StudentSemester'];

  function studentScoreController(StudentScore, StudentSemester) {
    var vm = this;


    vm.scores = [];
    var examTypes = [];
    vm.semesters = [];
    var courses = [];
    vm.details = {
      semester: '',
    };

    StudentSemester.query().$promise.then(function(result) {
      result = toArray(result);
      vm.semesters = getSemesters(result);
    })

    vm.query = function() {
      StudentScore.query(vm.details).$promise.then(function(result) {
        result = toArray(result)
        examTypes = getUnique(getExamTypes(result));
        courses = getUnique(getCourses(result));
        vm.examTypes = examTypes;
        vm.scores = arrangeArray(result);
      }, function(error) {
        console.log(error);
      })
    }

    function getTotalMark(course){
      var total = 0
        for(var i in course){
          if(typeof course[i] == "number" && (i <= examTypes.length) ){
            total += course[i]
          }
        }
        return total
    }

    vm.getAverage = function() {
      var average = 0;
      var total = 0;
      var numCourses = examTypes.length;

      for(var i in vm.scores){
        total += getTotalMark(vm.scores[i])
      }
      average = total / numCourses;
      return average;
    }

    function toArray(json) {
      var data = json.map(function(obj) {
        return Object.keys(obj).sort().map(function(key) {
          return obj[key];
        });
      });
      return data
    }

    function arrangeArray(array) {
      var data = [];
      for (var i in courses) {
        data.push([]);
        for (var j in array) {
          if (array[j][0] == courses[i]) {

            var examIndex = getExamIndex(array[j][1]);
            data[i][0] = array[j][0];
            data[i][examIndex] = array[j][2];
          }
        }
      }
      return appendTotal(data);
    }

    function appendTotal(courses) {
      for(var i in courses){
        var totalIndex = examTypes.length + 1;
        var totalMark = getTotalMark(courses[i]);

        courses[i][totalIndex] = totalMark;

      }
      return courses
    }

    function getExamIndex(exam) {
      var index;
      for (var i in examTypes) {
        if (examTypes[i] == exam) {
          index = parseInt(i) + 1
        }
      }
      return index;
    }

    function getExamTypes(array) {
      var examTypes = [];
      for (var i in array) {
        examTypes.push(array[i][1]);
      }
      return examTypes;
    }

    function getCourses(array) {
      var courses = [];
      for (var i in array) {
        courses.push(array[i][0]);
      }
      return courses;
    }

    function getSemesters(array) {
      var semesters = [];
      for (var i in array) {
        semesters.push(array[i][0])
      }
      return semesters
    }

    function getUnique(array) {
      var newArray = [];
      for (var i in array) {
        if (newArray.indexOf(array[i]) == -1) {
          newArray.push(array[i]);
        }
      }
      return newArray;
    }

  }

})();
