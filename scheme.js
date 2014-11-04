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

Scheme.prototype.schemeWithBallVariant = function(ball, variantNumber) {
	var iterateBy = [];
	directions.forEach(function(dir) {
		if (!ball[dir]) iterateBy.push(dir);
	});
	var variantComponents = {};
	for (var i = iterateBy.length - 1; i >= 0; i--) {
		variantComponents[iterateBy[i]] = variantNumber % this.count;
		variantNumber = Math.floor(variantNumber / this.count);
	}
	var copy = this.copy();
	var iteratedBall = copy[ball.self];
	Object.keys(variantComponents).forEach(function(dir) {
		iteratedBall[dir] = copy[variantComponents[dir]];
	});
	return copy;
}

Scheme.prototype.numberOfVariants = function(ball) {
	return Math.pow(this.count, directions.length - ball.connectionsCount());
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

Scheme.prototype.autoFillAll = function() {
	do {
		var lastConnectionsCount = this.connectionsCount();
		for (var i = 0; i < this.count; i++) {
			var result = autoFill(this[i]);
			if (!result) return false;
		}
	} while (lastConnectionsCount != this.connectionsCount());
	return true;
};

function enumerateAllSchemes(startingScheme, startingBall, callback) {
	for (var variantNumber = 0; variantNumber < startingScheme.numberOfVariants(startingBall); variantNumber++) {
		var newScheme = startingScheme.schemeWithBallVariant(startingBall, variantNumber);
		if (newScheme.autoFillAll()) {
			if (newScheme.connectionsCount() == directions.length * newScheme.count) { // found
				callback(newScheme);
				continue;
			} else {
				var maxConnections = 0;
				var nextBallIndex = 0;
				for (var i = 0; i < newScheme.count; i++) {
					var connections = newScheme[i].connectionsCount();
					if (connections < directions.length && connections >= maxConnections) {
						nextBallIndex = i;
						maxConnections = connections;
					}
				}
				var nextBall = newScheme[nextBallIndex];
				enumerateAllSchemes(newScheme,nextBall, callback);
			}
		} else {
			continue;
		}
	}
}

Scheme.prototype.enumerateAllSchemes = function(callback) {
	this.foundSchemes = [];
	var foundSchemes = this.foundSchemes;
	enumerateAllSchemes(this, this[0], function(scheme) {
		foundSchemes.push(scheme);
		callback(scheme);
	});
}

// Saving 

Scheme.prototype.toJSON = function() {
	var json = {
		count: this.count
	};

	var scheme = this;
	directions.forEach(function(dir) {
		json[dir] = [];
		for (var i = 0; i < scheme.count; i++) {
			json[dir][i] = scheme[i][dir].self;
		}
	})
	return json;
};

Scheme.fromJSON = function(json) {
	var scheme = new Scheme(json.count);
	directions.forEach(function(dir) {
		var connections = json[dir];
		for (var i = 0; i < connections; i++) {
			scheme[i][dir] = scheme[connections[i]];
		}
	});
	return scheme;
};

module.exports = Scheme;

