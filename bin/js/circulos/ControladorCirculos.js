var circulos;
(function (circulos) {
    // onecta modelo y vista.
    class ControladorCirculos {
        constructor() {
            this.radio = 20;
            this.width = 400;
            this.height = 300;
            this.ventana = new ventanaControl.ventanaControl({
                id: "ventana-circulos",
                ancho: 450,
                alto: 450,
                colorFondo: "white",
                titulo: "Pantalla Círculos",
                onClose: () => console.log("Ventana de círculos cerrada")
            });
            this.modelo = new circulos.ModeloCirculos();
            this.vista = new circulos.VistaCirculos(this.ventana, this.width, this.height);
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
        abrirPantallaCirculos() {
            this.ventana.mostrar();
        }
        cerrarPantallaCirculos() {
            this.ventana.ocultar();
        }
        agregarCirculo() {
            this.modelo.agregar(this.radio, this.width, this.height);
            this.actualizarVista();
        }
        eliminarCirculo() {
            const id = this.vista.getSeleccionado();
            if (id !== null) {
                this.modelo.eliminar(id);
                this.actualizarVista();
            }
            else {
                alert("Selecciona un círculo primero :)");
            }
        }
        actualizarVista() {
            const datos = this.modelo.getAll();
            this.vista.renderizar(datos, (id) => {
                console.log("Seleccionaste círculo:", id);
            });
        }
    }
    circulos.ControladorCirculos = ControladorCirculos;
})(circulos || (circulos = {}));
//# sourceMappingURL=ControladorCirculos.js.map