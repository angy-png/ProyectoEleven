var ventanaControl;
(function (ventanaControl_1) {
    class ventanaControl {
        constructor(configuracion) {
            this.configuracion = configuracion;
            if (configuracion.modal) {
                // Crear overlay oculto inicialmente
                this._oscurecerCon = d3.select("body")
                    .append("div")
                    .style("position", "fixed")
                    .style("top", "0")
                    .style("left", "0")
                    .style("width", "100%")
                    .style("height", "100%")
                    .style("background-color", "rgba(0,0,0,0.6)") // negro con opacidad
                    .style("z-index", "1999") // debajo del modal
                    .style("display", "none");
            }
            this._contenedor = d3.select("body")
                .append("div")
                .attr("id", configuracion.id)
                .style("position", configuracion.modal ? "fixed" : "relative")
                .style("width", configuracion.ancho + "px")
                .style("height", configuracion.alto + "px")
                .style("padding", "10px")
                .style("background-color", configuracion.colorFondo)
                .style("border", "2px solid black")
                .style("overflow", "auto")
                .style("z-index", configuracion.modal ? "2000" : "auto")
                .style("top", configuracion.modal ? "50%" : "auto")
                .style("left", configuracion.modal ? "50%" : "auto")
                .style("transform", configuracion.modal ? "translate(-50%, -50%)" : "none")
                .style("display", "none");
            this._contenedor.append("h2")
                .attr("class", "titulo-modal")
                .style("text-align", "center")
                .text(configuracion.titulo);
            const botonCerrar = this._contenedor.append("svg")
                .attr("width", 20)
                .attr("height", 20)
                .style("position", "absolute")
                .style("top", "5px")
                .style("right", "10px")
                .style("cursor", "pointer")
                .style("overflow", "visible");
            botonCerrar.append("image")
                .attr("href", "images/icono_cerrar.svg")
                .attr("width", 30)
                .attr("height", 30)
                .on("click", () => {
                this.ocultar();
                if (configuracion.onClose) {
                    configuracion.onClose();
                }
            });
            this._contenido = this._contenedor.append("div");
        }
        mostrar() {
            this._contenedor.style("display", "block");
            if (this.configuracion.modal && this._oscurecerCon) {
                this._oscurecerCon.style("display", "block");
            }
        }
        ocultar() {
            this._contenedor.style("display", "none");
            if (this.configuracion.modal && this, this._oscurecerCon) {
                this._oscurecerCon.style("display", "none");
            }
        }
        limpiarContenido() {
            this._contenido.selectAll("*").remove();
        }
    }
    ventanaControl_1.ventanaControl = ventanaControl;
})(ventanaControl || (ventanaControl = {}));
//  private _conten: d3.Selection<
//             HTMLDivElement,//GElement, tipo del elemento seleccionado (ej. HTMLDivElement)
//             unknown, //Datum, tipo de los datos asociados (unknown si no se sabe)
//             HTMLElement, //PElement, tipo del padre de ese elemento (ej. HTMLElement)
//             any>;//PDatum, tipo de los datos del padre (any si no importa)
//         private _ventanaModal: ventanaControl.ventanaControl;
//# sourceMappingURL=VentanaControl.js.map