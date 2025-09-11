type ID = number;         
type Nombre = string;   

let usuarioID: ID = 123;
let usuarioNombre: Nombre = "Luis Pérez";

console.log(usuarioID); 
console.log(usuarioNombre); 


type Resultado = string | number; 

let aliasunios: Resultado = "hols"; 
let ajsbfjk:  Resultado = 23;



    // ---------------------------------------
type Respuestas<T>={
    nombre: string;
    conversacion: T;
    edad: number; 
}

const respuesta1: Respuestas<String>={
    nombre: "angy",
    conversacion: "232",
    edad: 34,
}

    // -------------------
type TipoTexto<T>= T extends String ? "es string" : "no es string"; 

type resultis = TipoTexto<String>; 
type resulttt = TipoTexto<number>; 

const numeroa: number = 2
console.log(Number.MAX_VALUE); 


let cadena: string ="45";

let entero: number = parseInt(cadena); 
let flotante: number = parseFloat("234"); 
let numero: number = +cadena; 

let num: number =3;
let numeroastring: string = num.toString(); 




let mensajs: string = "Angy"
let mensajecon: string= `hola ${mensajs}` //template strings 



let multilienas: string = "holis \n soy otra linea"; 
console.log(multilienas); 

