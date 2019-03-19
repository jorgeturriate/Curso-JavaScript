'use strict'
var peliculas= new Array("Mike torino", "Avengers", "Warcraft");

//peliculas.reverse();
console.log(peliculas);
document.write(`
<h1>Lista de peliculas</h1>
<ol>`);
//peliculas.forEach((valor,indice,array)=>{document.write(`<li>${valor}</li>`)});
for(let indice in peliculas){
	document.write("<li>"+peliculas[indice]+"</li>");
}
document.write("</ol>");

var busqueda= peliculas.find(peli => peli=="Avengers");
console.log(busqueda);