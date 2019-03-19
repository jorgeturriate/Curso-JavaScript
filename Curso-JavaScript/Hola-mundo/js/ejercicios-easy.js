'use strict'
/*Ejer1
var num1=parseInt(prompt("Digite numero 1"));
var num2=parseInt(prompt("Digite numero 2"));
while ((num1<0 || num2<0)|| isNaN(num1)||isNaN(num2)){
	console.log("Introduce numeros validos");
	num1=parseInt(prompt("Digite numero 1"));
	num2=parseInt(prompt("Digite numero 2"));
}

if (num1==num2){
	console.log("Son iguales");
} else if(num1>num2){
	console.log("El numero: "+num1+" es mayor y el numero: "+num2+" es menor");
} else{
	console.log("El numero: "+num2+" es mayor y el numero: "+num1+" es menor");
} 
*/
/*Ejer2
var num=0;
var i=0;
var sum=0;
while(num>=0){
	num=Number(prompt("Digite un numero"));
	if(num>=0 && !(isNaN(num))){
		sum+=num;
		i++;
		console.log(num);
		console.log(i);
	}else if(isNaN(num)){
		num=0;
	}
}
console.log("La suma de los numeros es "+sum);
console.log("El promedio de los numeros es "+(sum/i));
*/
/*Ejer3y4
var num1=Number(prompt("Digite su numero 1"));
var num2=Number(prompt("Digite su numero 2"));
while(isNaN(num1)||isNaN(num2)){
	if(isNaN(num1)){
		num1=Number(prompt("Digite su numero 1"));
	} 
	if(isNaN(num2)){
		num2=Number(prompt("Digite su numero 2"));
	}
}
if(num1==num2){
	console.log("Los numeros son iguales");
} else if(num1>num2){
	for(num2;num2<=num1;num2++){
		if(num2%2==1){
			console.log(num2);
		}
	}
} else {
	for(num1;num1<=num2;num1++){
		if(num1%2==1){
			console.log(num1);
		}
	}
}
*/
/*Ejercicio5
var num1=Number(prompt("Digite un numero para hallarle sus divisores"));
while(isNaN(num1)){
	num1=Number(prompt("Digite un numero para hallarle sus divisores"));
}
document.write("<h1>Estos son los numeros divisores de "+num1+" </h1>");
for(var i=1;i<=num1;i++){
	if(num1%i==0){
		document.write(i+"<br/>");
	}
}*/
var num1=Number(prompt("Digite un numero para hallarle su tabla de multiplicar"));
while(isNaN(num1)){
	num1=Number(prompt("Digite un numero para hallarle su tabla de multiplicar"));
}
document.write('<table border="1">');
document.write('<tr> <th>Multiplicacion</th> <th>Producto</th> </tr>');
for(var i=1;i<10;i++){
	document.write("<tr> <td>"+num1+" x "+ i+"</td> <td>"+(num1*i)+"</td></tr>");
}
document.write('</table>');