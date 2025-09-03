namespace empresas{
    export class ControladorEmpresa{
        private modelo: Modelompresas;
        private vista: VistaEmpresa;
            private ventana: ventanaControl.ventanaControl;
            
        constructor() {
            this.ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada")
                }
            });
            this.modelo = new Modelompresas();
            this.vista = new VistaEmpresa(this.ventana);

            this.vista.crearControles(); 

            this.mostrarTabla(); 


    }  
    
        public abrirPantallaEmpresa(): void {
            this.ventana.mostrar();
        }

        public cerrarPantallaEmpresa(): void {
            this.ventana.ocultar();
        }
        public async mostrarTabla(): Promise<void> {
            this.vista.crearTablaUser();
            await this.modelo.cargar(); 
            this.actVistaUser(); 
          
        }


           private actVistaUser(): void {
            const datosUser = this.modelo.obtenerTodosEm();
            this.vista.renderizarUser(datosUser); 

           

        }


}  }
