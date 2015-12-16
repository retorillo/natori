const natori = require('./');
var testDate = new Date('2015-12-16');
var nameGen = new natori.Expander('{year:2}{month:2}{day:2}', testDate);
var passGen = new natori.Expander('{rcase:{rand:12}}');
console.log(nameGen.expand());
console.log(passGen.expand());




