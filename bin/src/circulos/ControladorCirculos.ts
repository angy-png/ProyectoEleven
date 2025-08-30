namespace circulos {
    // onecta modelo y vista.
    export class ControladorCirculos {
        private modelo: ModeloCirculos;
        private vista: VistaCirculos;
        private ventana: ventanaControl.ventanaControl;
        private radio = 20;
        private width = 400;
        private height = 300;

        constructor() {
            this.ventana = new ventanaControl.ventanaControl({
                id: "ventana-circulos",
                ancho: 450,
                alto: 450,
                colorFondo: "white",
                titulo: "Pantalla Círculos",
                onClose: () => console.log("Ventana de círculos cerrada")
            });

            this.modelo = new ModeloCirculos();
            this.vista = new VistaCirculos(this.ventana, this.width, this.height);

            const botones = this.ventana._contenedor.append("div")
                .style("margin-top", "30px")
                .style("text-align", "center");

            botones.append("button")
                .text("Dibujar círculo")
                .on("click", () => this.agregarCirculo());

            botones.append("button")
                .text("Eliminar círculo")
                .on("click", () => this.eliminarCirculo());
        }

        public abrirPantallaCirculos(): void {
            this.ventana.mostrar();
        } 

        public cerrarPantallaCirculos(): void {
            this.ventana.ocultar();
        }

        private agregarCirculo(): void {
            this.modelo.agregar(this.radio, this.width, this.height);
            this.actualizarVista();
        }

        private eliminarCirculo(): void {
            const id = this.vista.getSeleccionado();
            if (id !== null) {
                this.modelo.eliminar(id);
                this.actualizarVista();
            } else {
                alert("Selecciona un círculo primero :)");
            }
        }

        private actualizarVista(): void {
            const datos = this.modelo.getAll();
            this.vista.renderizar(datos, (id) => {
                console.log("Seleccionaste círculo:", id);
            });
        }
    }
}
