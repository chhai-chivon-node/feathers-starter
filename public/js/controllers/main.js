
app.controller('MainCtrl', ['$scope','Todo',function($scope, Todo){
	Todo.read().then(function(todos){
		console.log(todos);
		$scope.todos = todos;
	});
}]);