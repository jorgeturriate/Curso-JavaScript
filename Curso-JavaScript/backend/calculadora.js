'use strict'

var params= process.argv.slice(2);

var numero1= params[0];
var numero2= params[1];

var plantilla= `
La suma es ${numero1 + numero2}
La restas es ${numero1 - numero2}
La multiplicacion ${numero1 * numero2}
La division es ${numero1 / numero2}
`;
console.log(plantilla);

console.log("Hola mundo desde de NodeJS");