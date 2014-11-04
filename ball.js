module.exports = Ball;

var directions = require('./directions.js').directions;

function Ball(x) {
	directions.forEach(function(dir) {
		this[dir] = null;
	});
	this.self = x;
}

// ----- PROTOTYPE METHODS

Ball.prototype.ballWithPath = function() {
	var result = this;
	for (var i = 0; i < arguments.length; i++) {
		var next = arguments[i];
		if (result[next] === null) {
			return null;
		} else {
			result = result[next];
		}
	}
	return result;
};

Ball.prototype.toString = function() {
	var ball = this;
	var simpleBall = {};
	directions.forEach(function(dir) {
		if (ball[dir]) {
			simpleBall[dir] = ball[dir].self;
		} else {
			simpleBall[dir] = "?";
		}
	});

	return ("    " + simpleBall.top + "  " + simpleBall.front + "  \n" 
		+ "    | /  \n" 
		+ simpleBall.left + " - " + ball.self + " - " + simpleBall.right + "\n"
		+ "  / |    \n" 
		+ " " + simpleBall.back + "  " + simpleBall.bottom + "    \n");
}

Ball.prototype.connectionsCount = function() {
	var ball = this;
	var result = 0;
	directions.forEach(function(dir) {
		if (ball[dir]) result++;
	});
	return result;
}

