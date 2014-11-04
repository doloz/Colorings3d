var Ball = require('./ball.js');
var directions = require('./directions.js').directions;
var opposite = require('./directions.js').opposite;
var pairs = require('./directions.js').pairs;


function Scheme(n) {
	for (var i = 0; i < n; i++) {
		this[i] = new Ball(i);
	}
	this.count = n;
}

// ----- PROTOTYPE METHODS -----

Scheme.prototype.connect = function(ball1, dir, ball2) {
	ball1[dir] = ball2;
	ball2[opposite[dir]] = ball1;
}

Scheme.prototype.simpleRepresentation = function() {
	var result = {};
	for (var i = 0; i < this.count; i++) {
		var simpleBall = {};
		var ball = this[i];

		directions.forEach(function (dir) {
			if (ball[dir]) {
				simpleBall[dir] = ball[dir].self;	
			} else {
				simpleBall[dir] = "?";
			}
		});
		result[i] = simpleBall;
	}
	return result;
};

Scheme.prototype.toString = function() {
	var result = "";
	for (var i = 0; i < this.count; i++) {
		result += this[i].toString() + "\n\n";
	}
	return result;
}

Scheme.prototype.connectionsCount = function() {
	var result = 0;
	for (var i = 0; i < this.count; i++) {
		result += this[i].connectionsCount();
	}
	return result;
}

Scheme.prototype.copy = function() {
	var copied = new Scheme(this.count);
	for (var i = 0; i < this.count; i++) {
		for (var j = 0; j < directions.length; j++) {
			var dir = directions[j];
			if (!this[i][dir]) copied[i][dir] = null;
				else copied[i][dir] = copied[this[i][dir].self];
		}
	}
	return copied;
}


Scheme.prototype.setupEnumeration = function(ball) {
	var iterateBy = [];
	directions.forEach(function(dir) {
		if (!ball[dir]) iterateBy.push(dir);
	});
	ball.iterateBy = iterateBy;
	var copy = this.copy();
	// ball.iterateBy.forEach(function(dir) {
	// 	copy[ball.self][dir] = copy[0];
	// })
}

Scheme.prototype.schemeWithBallVariant = function(ball, variantNumber) {
	var iterateBy = [];
	directions.forEach(function(dir) {
		if (!ball[dir]) iterateBy.push(dir);
	});
	// console.log(iterateBy);
	var variantComponents = {};
	for (var i = iterateBy.length - 1; i >= 0; i--) {
		variantComponents[iterateBy[i]] = variantNumber % this.count;
		variantNumber = Math.floor(variantNumber / this.count);
	}
	// console.log(variantComponents);
	var copy = this.copy();
	var iteratedBall = copy[ball.self];
	Object.keys(variantComponents).forEach(function(dir) {
		iteratedBall[dir] = copy[variantComponents[dir]];
	});
	return copy;
}

Scheme.prototype.numberOfVariants = function(ball) {
	return Math.pow(this.count, 4 - ball.connectionsCount());
}


function autoFill(ball) {
	// A + x + -x = A
	for (var i = 0; i < directions.length; i++) {
		var dir = directions[i];
		var otherBall = ball[dir];
		if (otherBall) {
			if (otherBall[opposite[dir]] !== null) {
				if (otherBall[opposite[dir]] !== ball) {
					return false;
				}
			} else {
				// console.log("Connect(type 1)", otherBall.self, opposite[dir], ball.self);
				otherBall[opposite[dir]] = ball;
			}
		}
	}

	// A + x + y = A + y + x
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i];
		var ballX = ball[pair[0]];
		var ballY = ball[pair[1]];
		if (ballX === null || ballY === null) continue;
		var ballXY = ballX[pair[1]];
		var ballYX = ballY[pair[0]];
		if (ballXY === null && ballYX === null) continue;
		if (ballXY !== null && ballYX !== null) {
			if (ballXY !== ballYX) return false;
				else continue;
		} 
		if (ballXY !== null) ballY[pair[0]] = ballXY;
			else ballX[pair[1]] = ballYX;
	}

	return true;
}

function autoFillAll(scheme) {
	do {
		var lastConnectionsCount = scheme.connectionsCount();
		for (var i = 0; i < scheme.count; i++) {
			var result = autoFill(scheme[i]);
			if (!result) return false;
		}
	} while (lastConnectionsCount != scheme.connectionsCount());
	return true;
}

var foundSchemes = [];
var foundSchemesCount = 0;

function enumerateAllSchemes(startingScheme, startingBall) {
	for (var variantNumber = 0; variantNumber < startingScheme.numberOfVariants(startingBall); variantNumber++) {
		var newScheme = startingScheme.schemeWithBallVariant(startingBall, variantNumber);
		if (autoFillAll(newScheme)) {
			if (newScheme.connectionsCount() == 4 * newScheme.count) {
				console.log("New scheme found(" + foundSchemesCount++ + "): ");
				console.log(newScheme.toString());
				foundSchemes.push(newScheme);
				console.log("-----------");
				continue;
			} else {
				var maxConnections = 0;
				var nextBallIndex = 0;
				for (var i = 0; i < newScheme.count; i++) {
					var connections = newScheme[i].connectionsCount();
					if (connections < 4 && connections >= maxConnections) {
						nextBallIndex = i;
						maxConnections = connections;
					}
				}
				var nextBall = newScheme[nextBallIndex];
				enumerateAllSchemes(newScheme,nextBall);
			}
		} else {
			continue;
		}
	}
}


var x = new Scheme(6);
x[0].left = x[1];
autoFillAll(x);
enumerateAllSchemes(x, x[0])

