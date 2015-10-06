
app.factory('Todo', ['$http', function($http){

	return {
		create: function(todo){

		},
		read: function(){
			return $http.get('/api/todos').then(function(res){
				return res.data;
			});
		},
		readOne: function(id){

		},
		update: function(id){

		},
		del: function(id){

		}
	}
}]);