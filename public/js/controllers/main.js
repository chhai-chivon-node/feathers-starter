
app.controller('MainCtrl', ['$scope','Todo',function($scope, Todo){
	Todo.read().then(function(todos){
		$scope.todos = todos;
	});
}]);