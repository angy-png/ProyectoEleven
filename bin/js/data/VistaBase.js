var vistas;
(function (vistas) {
    class VistaBase {
        constructor(config) {
            this.columnas = config.columnas;
            this.camposFormulario = config.camposFormulario;
            this._ventana = new ventanaControl.ventanaControl({
                id: config.idVentana,
                ancho: 900,
                alto: 400,
                colorFondo: "white",
                titulo: config.titulo,
                onClose() { console.log(`Ventana ${config.titulo} cerrada`); }
            });
            this._conten = this._ventana._contenedor;
            this.crearTabla();
            this.crearModal();
            this.crearModalConfirmacion();
        }
        crearTabla() {
            const tabla = this._conten.append("table")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");
            tabla.append("thead").append("tr")
                .selectAll("th")
                .data(this.columnas)
                .enter()
                .append("th")
                .style("border", "1px solid black")
                .style("background-color", "#bde9c4")
                .style("padding", "4px")
                .text(d => d.titulo);
            tabla.append("tbody").attr("id", `tbody-${this._ventana.id}`);
        }
        renderTabla(data) {
            const tbody = d3.select(`#tbody-${this._ventana.id}`);
            const filas = tbody.selectAll("tr")
                .data(data, (d) => d.id)
                .join(enter => {
                const tr = enter.append("tr");
                this.columnas.forEach((col, i) => {
                    if (col.campo === null) {
                        const acciones = tr.append("td")
                            .style("border", "1px solid black")
                            .style("padding", "6px");
                        const cont = acciones.append("div")
                            .style("display", "flex")
                            .style("gap", "10px");
                        cont.append("img")
                            .attr("src", "images/editar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (_, d) => { var _a; return (_a = this.onAgregarEditar) === null || _a === void 0 ? void 0 : _a.call(this, "editar", d); });
                        cont.append("img")
                            .attr("src", "images/eliminar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (_, d) => { var _a; return (_a = this.onEliminar) === null || _a === void 0 ? void 0 : _a.call(this, d); });
                    }
                    else {
                        tr.append("td")
                            .classed(`data-col-${i}`, true)
                            .style("border", "1px solid black")
                            .style("padding", "6px")
                            .text(d => {
                            var _a;
                            return col.formatear
                                ? col.formatear(d[col.campo], d)
                                : String((_a = d[col.campo]) !== null && _a !== void 0 ? _a : "—");
                        });
                    }
                });
                return tr;
            }, update => {
                this.columnas.forEach((col, i) => {
                    if (col.campo !== null) {
                        update.select(`td.data-col-${i}`)
                            .text(d => {
                            var _a;
                            return col.formatear
                                ? col.formatear(d[col.campo], d)
                                : String((_a = d[col.campo]) !== null && _a !== void 0 ? _a : "—");
                        });
                    }
                });
                return update;
            }, exit => exit.remove());
        }
        mostrarModal(datos, guardarCb) {
            const modal = this._ventanaModal._contenido;
            this._ventanaModal.limpiarContenido();
            modal.append("h3").text(datos ? "Editar" : "Agregar");
            // Prefijo único para los ids de inputs
            const modalIdPrefix = "modal-campo-" + (datos && datos.id ? datos.id : "nuevo");
            this.camposFormulario.forEach((campo) => {
                const uniqueId = `${modalIdPrefix}-${this.camposFormulario}`;
                modal.append("p").text(String(campo));
                const valorInicial = datos === null || datos === void 0 ? void 0 : datos[campo];
                // Booleano -> select Sí/No
                if (typeof valorInicial === "boolean") {
                    const select = modal.append("select")
                        .attr("id", uniqueId)
                        .style("display", "block")
                        .style("margin-bottom", "10px");
                    select.append("option").attr("value", "true").text("Sí");
                    select.append("option").attr("value", "false").text("No");
                    if (valorInicial !== undefined) {
                        select.property("value", valorInicial ? "true" : "false");
                    }
                }
                // Date -> input datetime-local
                else if (valorInicial instanceof Date) {
                    const input = modal.append("input")
                        .attr("type", "datetime-local")
                        .attr("id", uniqueId)
                        .style("display", "block")
                        .style("margin-bottom", "10px");
                    if (valorInicial) {
                        const fechaStr = d3.timeFormat("%Y-%m-%dT%H:%M")(valorInicial);
                        input.property("value", fechaStr);
                    }
                }
                // Otros -> input tipo text
                else {
                    modal.append("input")
                        .attr("id", uniqueId)
                        .style("display", "block")
                        .style("margin-bottom", "10px")
                        .property("value", valorInicial !== null && valorInicial !== void 0 ? valorInicial : "");
                }
            });
            // Botón guardar
            modal.append("button")
                .text("Guardar")
                .on("click", () => {
                const nuevo = {};
                this.camposFormulario.forEach((campo) => {
                    const campoStr = String(campo); // convertir a string
                    const uniqueId = `${modalIdPrefix}-${campoStr}`;
                    const input = document.getElementById(uniqueId);
                    let valor = input.value;
                    const valorInicial = datos === null || datos === void 0 ? void 0 : datos[campo];
                    if (typeof valorInicial === "number")
                        valor = Number(valor);
                    else if (typeof valorInicial === "boolean")
                        valor = valor.toLowerCase() === "true";
                    else if (valorInicial instanceof Date)
                        valor = new Date(valor);
                    nuevo[campo] = valor;
                });
                guardarCb === null || guardarCb === void 0 ? void 0 : guardarCb(nuevo);
                this._ventanaModal.ocultar();
            });
            this._ventanaModal.mostrar();
        }
        mostrarConfirmacion(mensaje, confirmarCb) {
            const modal = this._ventanaConfirmacion._contenido;
            this._ventanaConfirmacion.limpiarContenido();
            modal.append("p").text(mensaje);
            modal.append("button")
                .text("Cancelar")
                .on("click", () => this._ventanaConfirmacion.ocultar());
            modal.append("button")
                .text("Eliminar")
                .style("background-color", "#dc3545")
                .style("color", "white")
                .on("click", () => {
                confirmarCb();
                this._ventanaConfirmacion.ocultar();
            });
            this._ventanaConfirmacion.mostrar();
        }
        crearModal() {
            this._ventanaModal = new ventanaControl.ventanaControl({
                id: `modal-${this._ventana.id}`,
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Edición",
                modal: true,
                onClose: () => console.log("Modal cerrado"),
            });
        }
        crearModalConfirmacion() {
            this._ventanaConfirmacion = new ventanaControl.ventanaControl({
                id: `confirm-${this._ventana.id}`,
                ancho: 300,
                alto: 150,
                colorFondo: "#f8d7da",
                titulo: "Confirmar",
                modal: true,
                onClose: () => console.log("Confirmación cerrada"),
            });
        }
        mostrar() { this._ventana.mostrar(); }
        ocultar() { this._ventana.ocultar(); }
    }
    vistas.VistaBase = VistaBase;
})(vistas || (vistas = {}));
//# sourceMappingURL=VistaBase.js.map