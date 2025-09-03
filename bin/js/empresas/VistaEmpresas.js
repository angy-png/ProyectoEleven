var empresas;
(function (empresas) {
    class VistaEmpresas {
        constructor() {
            this.formatFecha = d3.timeFormat("%d/%m/%Y, %I:%M:%S %p");
            this.formatInputFecha = d3.timeFormat("%Y-%m-%dT%H:%M");
            this._ventana = new ventanaControl.ventanaControl({
                id: "VentanaEmpresas",
                ancho: 900, alto: 400,
                colorFondo: "white", titulo: "Empresas",
                onClose() {
                    console.log("ventana empresas fue cerrada");
                },
            });
            this._conten = this._ventana._contenedor;
            this.crearControles();
            this.crearTabla();
            this.crearModal();
            this.crearModalConfirmacion();
        }
        crearControles() {
            const contenedorInput = this._conten
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");
            const inputTexto = contenedorInput.append("input")
                .attr("type", "text")
                .attr("placeholder", "Filtrar por empresa");
            inputTexto.on("input", () => {
                var _a;
                const texto = inputTexto.property("value") || "";
                (_a = this.onFiltrar) === null || _a === void 0 ? void 0 : _a.call(this, texto);
            });
            contenedorInput.append("img")
                .attr("src", "images/nuevo.svg")
                .attr("width", 30)
                .attr("height", 30)
                .style("cursor", "pointer")
                .style("margin-left", "auto")
                .on("click", () => { var _a; return (_a = this.onAgregarEditar) === null || _a === void 0 ? void 0 : _a.call(this, "agregar"); });
        }
        crearTabla() {
            const tabla = this._conten.append("table")
                .attr("id", "tabla-empresas")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");
            const columnas = [
                { titulo: 'Acciones', campo: null },
                { titulo: 'Nombre', campo: 'nombre' },
                { titulo: 'Rfc', campo: 'rfc' },
                { titulo: 'Telefono', campo: 'telefono' },
                { titulo: 'Activo', campo: 'activo' },
                { titulo: 'Fecha registro', campo: 'fechaRegistro' }
            ];
            let columnaActiva = null;
            let direccionActiva = null;
            const thead = tabla.append("thead");
            const trHead = thead.append("tr");
            trHead.selectAll("th")
                .data(columnas)
                .enter()
                .append("th")
                .style("border", "1px solid black")
                .style("background-color", "#bde9c4ff")
                .style("padding", "4px")
                .each(function (d) {
                const th = d3.select(this);
                if (!d.campo) {
                    th.text(d.titulo);
                    return;
                }
                const cont = th.append("div")
                    .style("display", "flex")
                    .style("justify-content", "space-between");
                cont.append("span").text(d.titulo);
                const flechas = cont.append("span")
                    .style("display", "flex")
                    .style("flex-direction", "column");
                flechas.append("span")
                    .attr("class", "flecha-asc")
                    .style("cursor", "pointer")
                    .style("font-size", "10px")
                    .style("color", "gray")
                    .text("▲");
                flechas.append("span")
                    .attr("class", "flecha-desc")
                    .style("cursor", "pointer")
                    .style("font-size", "10px")
                    .style("color", "gray")
                    .text("▼");
            })
                .each((d, i, nodes) => {
                if (!d.campo)
                    return;
                const th = d3.select(nodes[i]);
                th.select(".flecha-asc").on("click", () => {
                    var _a;
                    (_a = this.onOrdenar) === null || _a === void 0 ? void 0 : _a.call(this, d.campo, true);
                    columnaActiva = d.campo;
                    direccionActiva = 'asc';
                    actualizarFlechas();
                });
                th.select(".flecha-desc").on("click", () => {
                    var _a;
                    (_a = this.onOrdenar) === null || _a === void 0 ? void 0 : _a.call(this, d.campo, false);
                    columnaActiva = d.campo;
                    direccionActiva = 'desc';
                    actualizarFlechas();
                });
            });
            tabla.append("tbody").attr("id", "tabla-empresas-body");
            const actualizarFlechas = () => {
                trHead.selectAll("th").each((d, i, nodes) => {
                    if (!d.campo)
                        return;
                    const th = d3.select(nodes[i]);
                    const asc = th.select(".flecha-asc");
                    const desc = th.select(".flecha-desc");
                    if (d.campo === columnaActiva) {
                        asc.style("color", direccionActiva === 'asc' ? "black" : "gray");
                        desc.style("color", direccionActiva === 'desc' ? "black" : "gray");
                    }
                    else {
                        asc.style("color", "gray");
                        desc.style("color", "gray");
                    }
                });
            };
        }
        crearModal() {
            this._ventanaModal = new ventanaControl.ventanaControl({
                id: "modal-empresa",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Empresa",
                modal: true,
                onClose: () => console.log("Modal empresa cerrado"),
            });
        }
        renderTabla(data) {
            const tbody = d3.select("#tabla-empresas-body");
            const columnas = ["nombre", "rfc", "telefono", "activo", "fechaRegistro"];
            const filas = tbody.selectAll("tr")
                .data(data, d => d.id)
                .join(enter => {
                const tr = enter.append("tr");
                const acciones = tr.append("td")
                    .style("border", "1px solid black")
                    .style("padding", "6px")
                    .append("div")
                    .style("display", "flex")
                    .style("gap", "10px");
                acciones.append("img")
                    .attr("src", "images/editar.svg")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => { var _a; return (_a = this.onAgregarEditar) === null || _a === void 0 ? void 0 : _a.call(this, "editar", d); });
                acciones.append("img")
                    .attr("src", "images/eliminar.svg")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => { var _a; return (_a = this.onEliminar) === null || _a === void 0 ? void 0 : _a.call(this, d); });
                columnas.forEach((clave, i) => {
                    tr.append("td")
                        .classed(`data-col-${i}`, true)
                        .style("border", "1px solid black")
                        .style("padding", "6px")
                        .text(d => {
                        const valor = d[clave];
                        if (clave === "activo") {
                            return valor ? "Sí" : "No";
                        }
                        return valor instanceof Date ? this.formatFecha(valor) : String(valor);
                    });
                });
                return tr;
            }, update => {
                columnas.forEach((clave, i) => {
                    update.select(`td.data-col-${i}`)
                        .text(d => {
                        const valor = d[clave];
                        if (clave === "activo") {
                            return valor ? "Sí" : "No";
                        }
                        return valor instanceof Date ? this.formatFecha(valor) : String(valor);
                    });
                });
                return update;
            }, exit => exit.remove());
        }
        mostrarModal(datos, guardarCb) {
            // Limpiar contenido previo
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;
            modal.append("h3").text(datos ? "Editar" : "Agregar");
            const campos = [
                { id: "nombre", label: "Nombre" },
                { id: "rfc", label: "RFC" },
                { id: "telefono", label: "Teléfono" },
                { id: "activo", label: "Activo" },
                { id: "fechaRegistro", label: "Fecha de Registro" }
            ];
            campos.forEach(campo => {
                var _a;
                modal.append("p").text(campo.label);
                if (campo.id === "activo") {
                    const select = modal.append("select")
                        .attr("data-campo", campo.id)
                        .style("margin-bottom", "10px")
                        .style("display", "block");
                    select.append("option").attr("value", "true").text("Sí");
                    select.append("option").attr("value", "false").text("No");
                    if (datos)
                        select.property("value", datos.activo ? "true" : "false");
                }
                else if (campo.id === "fechaRegistro") {
                    const fechaInput = modal.append("input")
                        .attr("type", "datetime-local")
                        .attr("data-campo", campo.id)
                        .style("margin-bottom", "10px")
                        .style("display", "block");
                    if (datos)
                        fechaInput.property("value", this.formatInputFecha(datos.fechaRegistro));
                }
                else {
                    modal.append("input")
                        .attr("type", "text")
                        .attr("data-campo", campo.id)
                        .style("margin-bottom", "10px")
                        .style("display", "block")
                        .property("value", (_a = datos === null || datos === void 0 ? void 0 : datos[campo.id]) !== null && _a !== void 0 ? _a : "");
                }
            });
            modal.append("button")
                .text("Guardar")
                .on("click", () => {
                const nuevaEmpresa = {};
                campos.forEach(campo => {
                    const input = modal.select(`[data-campo='${campo.id}']`).node();
                    let valor = input.value;
                    if (campo.id === "telefono")
                        valor = Number(valor);
                    else if (campo.id === "activo")
                        valor = valor.toLowerCase() === "true";
                    else if (campo.id === "fechaRegistro")
                        valor = new Date(valor);
                    nuevaEmpresa[campo.id] = valor;
                });
                guardarCb === null || guardarCb === void 0 ? void 0 : guardarCb(nuevaEmpresa);
                this._ventanaModal.ocultar();
            });
            this._ventanaModal.mostrar();
        }
        crearModalConfirmacion() {
            this._ventanaConfirmacion = new ventanaControl.ventanaControl({
                id: "modal-confirmacion",
                ancho: 300,
                alto: 150,
                colorFondo: "#f8d7da",
                titulo: "Confirmar Eliminación",
                modal: true,
                onClose: () => console.log("Modal de confirmación cerrado"),
            });
        }
        mostrarConfirmacion(mensaje, confirmarCb) {
            this._ventanaConfirmacion.limpiarContenido();
            const contenido = this._ventanaConfirmacion._contenido;
            contenido.append("p").text(mensaje);
            const botones = contenido.append("div")
                .style("margin-top", "10px")
                .style("text-align", "right");
            botones.append("button")
                .text("Cancelar")
                .style("margin-right", "5px")
                .on("click", () => this._ventanaConfirmacion.ocultar());
            botones.append("button")
                .text("Eliminar")
                .style("background-color", "#dc3545")
                .style("color", "white")
                .on("click", () => {
                confirmarCb();
                this._ventanaConfirmacion.ocultar();
            });
            this._ventanaConfirmacion.mostrar();
        }
        mostrar() {
            this._ventana.mostrar();
        }
        ocultar() {
            this._ventana.ocultar();
        }
    }
    empresas.VistaEmpresas = VistaEmpresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=VistaEmpresas.js.map