var Scheme = require('./scheme.js');
var fs = require('fs');

var colorsNumber = process.argv[2];
if (colorsNumber === undefined) {
	throw new Error('Нужно указать число цветов');
}

var filename = 'colorings' + colorsNumber + '.json';
fs.writeFileSync(filename, '');

var x = new Scheme(colorsNumber);
x[0].left = x[1];
x.autoFillAll();

var startTime = new Date().getTime();
x.enumerateAllSchemes(function(scheme) {
	console.log("Найдено: ");
	console.log(scheme.toString());
	console.log(matrixToString(scheme.matrix()));
	// console.log(scheme.isConnected());
	console.log('-----------------');
});

var jsonString = JSON.stringify(x.foundSchemes.filter(function(scheme){
	return scheme.isConnected();
}).map(function(scheme){
	return scheme.toJSON()
}));

fs.appendFile(filename, jsonString, function (err) {
	if (err) throw err;
});

console.log("Сохранено в файл", filename);
console.log("Всего " + x.foundSchemes.length);

var endTime = new Date().getTime();
console.log("Время выполнения(мс): ",  endTime - startTime);

function matrixToString(matrix) {
	var c = matrix.length;
	// console.log(matrix);
	var result = "";
	for (var i = 0; i < c; i++) {
		result += "|";
		for (var j = 0; j < c; j++) {
			result += " " + matrix[i][j] + " ";
		}
		result += "|\n";
	}
	return result;
}