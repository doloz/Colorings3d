var Scheme = require('./scheme.js');

var x = new Scheme(process.argv[2]);
x[0].left = x[1];
x.autoFillAll();
x.enumerateAllSchemes(function(scheme) {
	console.log("Найдено: ");
	console.log(scheme.toString());
	console.log('-----------------');
});
console.log("Всего " + x.foundSchemes.length);