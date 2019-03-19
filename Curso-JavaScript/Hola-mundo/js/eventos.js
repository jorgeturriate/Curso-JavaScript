'use strict'

window.addEventListener("load",()=>{
	function cambiarColor(){
		console.log("Me diste click");
		if(boton.style.background=="green"){
			boton.style.background="red";
		} else {
			boton.style.background="green";
		}
		boton.style.padding="20px";
		boton.style.border="1px solid #ccc";

		return true;
	}

	var boton=document.querySelector("#boton");
	//Doble click
	boton.addEventListener("dblclick",()=>{cambiarColor()});
	//Click
	boton.addEventListener("click",()=>{cambiarColor()});
	//MouseOver
	boton.addEventListener("mouseover",()=>{
		boton.style.background="#ccc";
	});

	//MouseOut
	boton.addEventListener("mouseout",()=>{
		boton.style.background="purple";
	})

	var input=document.querySelector("#nombre-input");
	//Focus
	input.addEventListener("focus",()=>{
		console.log("Estas dentro del input");
	});

	//Blur
	input.addEventListener("blur",()=>{
		console.log("Estas fuera del input");
	});

	//KeyDown
	input.addEventListener("keydown",(tecla)=>{
		console.log("[keydown] Pulsando tecla: ",tecla.key);
	});
	//Keypress
	input.addEventListener("keypress",(tecla)=>{
		console.log("[keypress] Presionando tecla: ",tecla.key);
	});
	//KeyUp
	input.addEventListener("keyup",(tecla)=>{
		console.log("[keyup] Tecla presionada: ",tecla.key);
	});

}); //Final de la carga del documento
