var circu;
(function (circu) {
    class CirculoView {
        constructor() {
            this.svgWidth = 400;
            this.svgHeight = 300;
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventana-circulos",
                ancho: 450,
                alto: 450,
                colorFondo: "white",
                titulo: "pantalla circulos",
                onClose: () => console.log("La ventana fue cerrada")
            });
            this._contenedor = this._ventana._contenedor;
            this.svg = this._contenedor.append("svg")
                .attr("width", this.svgWidth)
                .attr("height", this.svgHeight)
                .style("border", "1px solid black")
                .style("display", "block");
        }
        getSVG() {
            return this.svg;
        }
        addBoton(label, onClick) {
            this._contenedor.append("button")
                .text(label)
                .style("padding", "10px 20px")
                .style("cursor", "pointer")
                .on("click", onClick);
        }
        mostrar() {
            this._ventana.mostrar();
        }
        ocultar() {
            this._ventana.ocultar();
        }
    }
    circu.CirculoView = CirculoView;
})(circu || (circu = {}));
//# sourceMappingURL=VistaCirculos.js.map