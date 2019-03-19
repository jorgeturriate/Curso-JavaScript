'use strict'
 
 window.addEventListener("load",()=>{

 	function iniciarIntervalo(){
 		var tiempo=setInterval(()=>{
 			console.log("Se ejecuto el intervalo");
 			var header=document.querySelector("h1");
 			if(header.style.fontSize=="50px"){
 				header.style.fontSize="30px"
 			} else{
 				header.style.fontSize="50px";
 			}
 		},1000);

 		return tiempo;
 	}
 	var tiempo=iniciarIntervalo();

 	var stop= document.querySelector("#stop")
 	stop.addEventListener("click",()=>{
 		clearInterval(tiempo);
 		alert("Se detuvo el intervalo");
 	});

 	var iniciar=document.querySelector("#iniciar");
 	iniciar.addEventListener("click",()=>{
 		var tiempo=iniciarIntervalo();
 		alert("Se inicio el intervalo nuevamente");
 	});

 });