'use strict'

//JSON: Son las siglas de Javascript Object Notation

var pelicula={
	titulo:"Avengers Infinity War",
	year:2018,
	pais:"Estados Unidos"
};

var pelis=[{titulo:"Lego Batman",year:2017,pais:"Canada"},pelicula];
var texto= document.querySelector("#peliculas");

for(let pel of pelis){
	var p= document.createElement("p");
	p.append(pel.titulo+"-"+pel.year);
	texto.append(p);
}
console.log(pelis);