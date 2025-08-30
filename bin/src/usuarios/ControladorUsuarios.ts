namespace usuarios{

    export class ControladorUsuarios{
        private modelo: ModeloUsuarios; 
        private vista: VistaUsuarios;
        private ventana: ventanaControl.ventanaControl; 

        constructor(){
            this.ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 200,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose(){
                    console.log("La ventana de usuario fue cerrada")
                }
            });

            this.modelo= new ModeloUsuarios();
            this.vista = new VistaUsuarios(this.ventana); 
        }



        public abrirPantallaUusuarios():void{
            this.ventana.mostrar(); 
        }

        public cerrarPantallaUsuarios(): void{
            this.ventana.ocultar(); 
        }

    }
}