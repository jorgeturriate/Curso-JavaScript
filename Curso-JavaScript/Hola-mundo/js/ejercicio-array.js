'use strict'
 
 var numeros=[];
 for(let x=0;x<6;x++){
 	let val=Number(prompt("Digite su numero"+(x+1)+" :"));
 	numeros.push(val);
 }

 function imprimirnum(arr,mensaje="Lista de numeros ingresados"){
	 document.write(`<hr/><h1>${mensaje}</h1><ul>`)
	 for(let x of arr){
	 	document.write("<li>"+x+"</li>");
	 }
	 document.write("</ul>");
	 console.log(arr);
}

imprimirnum(numeros);

numeros.sort();

imprimirnum(numeros,"Lista de numeros ordenados");

document.write("<h4>El array tiene "+numeros.length+" elementos</h4>");

var busqueda= Number(prompt("Busque un numero: "));
var enc=numeros.findIndex(bu=> bu==busqueda);

if(enc & enc!=-1){
	document.write("<h4>EL numero fue encontrado en la posicion: "+enc+" </h4>");
} else {
	document.write("<h4>No se encontro el numero</h4>");
}