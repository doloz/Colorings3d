var directions = ["left", "right", "top", "bottom", "back", "front"];
exports.directions = directions;


exports.opposite = {
	"left": "right",
	"right": "left",
	"top": "bottom",
	"bottom": "top",
	"back": "front",
	"front": "back"
};

exports.pairs = [];
for (var i = 0; i < directions.length; i++) {
	for (var j = i + 1; j < directions.length; j++) {
		exports.pairs.push([directions[i], directions[j]]);
	}
}

