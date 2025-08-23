"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// // acceder a un array
// let arrar: number = numeros[0];
// numeros.push(11); 
// console.log(numeros);
// numeros.pop()
// console.log(numeros);
// numeros.slice(1, 2);
// console.log(numeros);
// numeros.forEach((numero) =>{
//     console.log(numero)
// })
// const nombres = ['Ana', 'Beatriz', 'Carlos'];
// const nuevoArreglo = [];
// nombres.forEach((numero)=>{
//     nuevoArreglo.push(numero.length) 
// }); 
// console.log(nuevoArreglo); 
// For
// console.log("for")
// let i: number;
// for(i=0; i < 10; i++)
// {
// 	console.log(i + " ");
// }
// console.log("\n");
// while 
// console.log("while")
// let w: number = 0
// while (w <= 10) {
//     console.log(w)
//     w++;
// }
// Usando un bucle while escribir un script que pida un valor entero y cree una lista con los números
//  desde el 0 al valor tecleado. Luego deberá sacar esa lista con un alert. Los números se separarán por comas.  
// let num: number = 20;
// let contador: number = 0;
// let lista: string = ""
// while(contador<= num){
//     lista += contador + ", ";
//     contador++; 
// }
//   console.log(lista)
// Determinar si el número que teclea el usuario es primo o no. 
// Recordar que un número primo es el que solo puede dividirse por si mismo y por la unidad.
// let nume: number = 3;
// let div: number= 0; 
// let conta: number =2; 
//     console.log(div)
//     if((nume % nume) == 0){
//         console.log("El valor"+ nume +" es primo.")
//     }else{
//         console.log("El valor"+ conta +" aunmenta porque no es primo.")
// }
// do white
// console.log("do-while")
// let u : number =20;
// do{
//     console.log(u);
//     u++;
// }while(u<10); 
// let contadr: number = 1
// do{
//     console.log(contadr)
//     contadr++; 
// }while(contadr<= 5)
// let arreglo: number[]= [4, 7, 2, 9, 1]
// let suma: number = 0;
// let i = 0;
// do {
//     suma += arreglo[i]
//     i++;
// } while (i < arreglo.length)
// console.log(suma)
let arreglito = [12, 25, 33, 58, 72, 40];
let r = 0;
do {
    if (arreglito[r] > 50) {
        console.log("valor mayor a 50 es: " + arreglito[r]);
        break;
    }
    r++;
} while (r < arreglito.length);
let energia = 10;
let resta = 2;
do {
    console.log(energia);
    energia -= resta;
} while (energia > 0);
let palabra = "hola";
let h = 0;
do {
    console.log(palabra.charAt(h));
    h++;
} while (h <= palabra.length);
let multi = [2, 3, 4, 5];
let d = 0;
let multipli = 1;
;
do {
    multipli *= multi[d];
    console.log(multipli);
    d++;
} while (d < multi.length);
console.log(multipli);
let parono = [3, 6, 8, 11, 14];
let x = 0;
do {
    if ((parono[x] % 2) == 0) {
        console.log("el numero" + parono[x] + " es par");
    }
    x++;
} while (x < parono.length);
let arregloalreves = [10, 20, 30, 40];
let atras = arregloalreves.length - 1;
do {
    console.log(arregloalreves[atras]);
    atras--;
} while (atras > -1);
let mas100 = [15, 25, 10, 30, 20, 40];
let j = 0;
let mult = 0;
do {
    mult += mas100[j];
    if (mult >= 100) {
        console.log("la suma ya llegp a 100: " + mult + "en la posicion: " + j);
        break;
    }
    j++;
} while (j < mas100.length);
let prom = ["programacion avanzada"];
//# sourceMappingURL=arreglos.js.map