var usuarios;
(function (usuarios_1) {
    class VistaUsuarios {
        constructor() {
            this.empresas = [];
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada");
                }
            });
            this._conten = this._ventana._contenedor;
            this.crearControles();
            this.crearTabla();
            this.crearModal();
            this.crearModalConfirmacion();
        }
        crearControles() {
            const contenedorInput = this._conten.append("div")
                .style("display", "flex")
                .style("gap", "10px");
            const select = contenedorInput.append("select").attr("id", "select-empresa");
            const inputTexto = contenedorInput.append("input")
                .attr("type", "text")
                .attr("placeholder", "Filtrar por nombre");
            const aplicarFiltro = () => {
                var _a;
                const textoBusqueda = inputTexto.property("value") || "";
                const valorEmpresa = Number(select.property("value") || 0);
                (_a = this.onFiltrar) === null || _a === void 0 ? void 0 : _a.call(this, textoBusqueda, valorEmpresa);
            };
            select.on("change", aplicarFiltro);
            inputTexto.on("input", aplicarFiltro);
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
                .attr("id", "tabla-usuarios")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");
            const columnas = [
                { titulo: 'Acciones', campo: null },
                { titulo: 'Nombre', campo: 'nombre' },
                { titulo: 'Apellido paterno', campo: 'apellidoPaterno' },
                { titulo: 'Apellido materno', campo: 'apellidoMaterno' },
                { titulo: 'Usuario', campo: 'usuario' },
                { titulo: 'Correo', campo: 'correo' },
                { titulo: 'Teléfono', campo: 'telefono' },
                { titulo: 'Empresa', campo: 'id_empresa' }
            ];
            let columnaActiva = null;
            let direccionActiva = null;
            const thead = tabla.append("thead");
            const trHead = thead.append("tr");
            const ths = trHead.selectAll("th")
                .data(columnas)
                .enter()
                .append("th")
                .style("border", "1px solid black")
                .style("background-color", "#bde9c4ff")
                .style("padding", "4px");
            // Recorremos los th generados con for
            const thNodes = ths.nodes();
            for (let i = 0; i < columnas.length; i++) {
                const columna = columnas[i];
                const th = d3.select(thNodes[i]);
                if (!columna.campo) {
                    th.text(columna.titulo);
                    continue;
                }
                const cont = th.append("div")
                    .style("display", "flex")
                    .style("justify-content", "space-between");
                cont.append("span").text(columna.titulo);
                const flechas = cont.append("span")
                    .style("display", "flex")
                    .style("flex-direction", "column");
                const asc = flechas.append("span")
                    .attr("class", "flecha-asc")
                    .style("cursor", "pointer")
                    .style("font-size", "10px")
                    .style("color", "gray")
                    .text("▲");
                const desc = flechas.append("span")
                    .attr("class", "flecha-desc")
                    .style("cursor", "pointer")
                    .style("font-size", "10px")
                    .style("color", "gray")
                    .text("▼");
                // Asignamos eventos usando for y closures
                asc.on("click", () => {
                    var _a;
                    (_a = this.onOrdenar) === null || _a === void 0 ? void 0 : _a.call(this, columna.campo, true);
                    columnaActiva = columna.campo;
                    direccionActiva = 'asc';
                    actualizarFlechas();
                });
                desc.on("click", () => {
                    var _a;
                    (_a = this.onOrdenar) === null || _a === void 0 ? void 0 : _a.call(this, columna.campo, false);
                    columnaActiva = columna.campo;
                    direccionActiva = 'desc';
                    actualizarFlechas();
                });
            }
            tabla.append("tbody").attr("id", "tabla-usuario-body");
            const actualizarFlechas = () => {
                const thsActual = trHead.selectAll("th").nodes();
                for (let i = 0; i < columnas.length; i++) {
                    const columna = columnas[i];
                    if (!columna.campo)
                        continue;
                    const th = d3.select(thsActual[i]);
                    const asc = th.select(".flecha-asc");
                    const desc = th.select(".flecha-desc");
                    if (columna.campo === columnaActiva) {
                        asc.style("color", direccionActiva === 'asc' ? "black" : "gray");
                        desc.style("color", direccionActiva === 'desc' ? "black" : "gray");
                    }
                    else {
                        asc.style("color", "gray");
                        desc.style("color", "gray");
                    }
                }
            };
        }
        actualizarEmpresas(nuevasEmpresas, usuarios) {
            this.empresas = nuevasEmpresas; // actualiza la lista interna de empresas
            this.renderTabla(usuarios); // refresca la tabla de usuarios con nombres de empresa actualizados
        }
        renderTabla(data) {
            const tbody = d3.select("#tabla-usuario-body");
            const columnas = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'usuario', 'correo', 'telefono', 'id_empresa'];
            const filas = tbody.selectAll("tr")
                .data(data, d => d.id)
                .join(enter => {
                const tr = enter.append("tr");
                const acciones = tr.append("td").style("border", "1px solid black").style("padding", "6px");
                const contAcc = acciones.append("div").style("display", "flex").style("gap", "10px");
                contAcc.append("img")
                    .attr("src", "images/editar.svg")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => { var _a; return (_a = this.onAgregarEditar) === null || _a === void 0 ? void 0 : _a.call(this, "editar", d); });
                contAcc.append("img")
                    .attr("src", "images/eliminar.svg")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => { var _a; return (_a = this.onEliminar) === null || _a === void 0 ? void 0 : _a.call(this, d); });
                for (let i = 0; i < columnas.length; i++) {
                    const clave = columnas[i];
                    const td = tr.append("td")
                        .classed(`data-col-${i}`, true)
                        .style("border", "1px solid black")
                        .style("padding", "6px");
                    td.text(d => {
                        var _a;
                        if (clave === 'id_empresa') {
                            const empresa = this.empresas.find(e => e.id === d.id_empresa);
                            return empresa ? empresa.nombre : "—";
                        }
                        return (_a = d[clave]) !== null && _a !== void 0 ? _a : "—";
                    });
                }
                return tr;
            }, update => {
                for (let i = 0; i < columnas.length; i++) {
                    const clave = columnas[i];
                    update.select(`td.data-col-${i}`).text(d => {
                        var _a;
                        if (clave === 'id_empresa') {
                            const empresa = this.empresas.find(e => e.id === d.id_empresa);
                            return empresa ? empresa.nombre : "—";
                        }
                        return (_a = d[clave]) !== null && _a !== void 0 ? _a : "—";
                    });
                }
                return update;
            }, exit => exit.remove());
        }
        crearModal() {
            this._ventanaModal = new ventanaControl.ventanaControl({
                id: "modal-usuario",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Usuario",
                modal: true,
                onClose: () => console.log("Modal usuario cerrado"),
            });
        }
        crearModalConfirmacion() {
            this._ventanaConfirmacion = new ventanaControl.ventanaControl({
                id: "modal-confirmacion-usuario",
                ancho: 300,
                alto: 150,
                colorFondo: "#f8d7da",
                titulo: "Confirmar Eliminación",
                modal: true,
                onClose: () => console.log("Modal usuario cerrado"),
            });
        }
        mostrarModal(datos, guardarCb) {
            const modal = this._ventanaModal._contenido;
            this._ventanaModal.limpiarContenido();
            modal.append("h3").text(datos ? "Editar" : "Agregar");
            const campos = ["nombre", "apellidoPaterno", "apellidoMaterno", "usuario", "correo", "telefono", "id_empresa"];
            campos.forEach(campo => {
                var _a;
                modal.append("p").text(campo);
                modal.append("input")
                    .attr("id", campo)
                    .style("margin-bottom", "10px")
                    .style("display", "block")
                    .property("value", (_a = datos === null || datos === void 0 ? void 0 : datos[campo]) !== null && _a !== void 0 ? _a : "");
            });
            modal.append("button")
                .text("Guardar")
                .on("click", () => {
                const nuevoUsuario = {};
                campos.forEach(campo => {
                    const input = document.getElementById(campo);
                    let valor = input.value;
                    if (campo === "telefono" || campo === "id_empresa")
                        valor = Number(valor);
                    nuevoUsuario[campo] = valor;
                });
                guardarCb === null || guardarCb === void 0 ? void 0 : guardarCb(nuevoUsuario);
                this._ventanaModal.ocultar();
            });
            this._ventanaModal.mostrar();
        }
        mostrarConfirmacion(mensaje, confirmarCb) {
            const modal = this._ventanaConfirmacion._contenido;
            this._ventanaConfirmacion.limpiarContenido();
            modal.append("p").text(mensaje);
            const botones = modal.append("div").style("margin-top", "10px").style("text-align", "right");
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
        mostrar() { this._ventana.mostrar(); }
        ocultar() { this._ventana.ocultar(); }
    }
    usuarios_1.VistaUsuarios = VistaUsuarios;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=VistaUsuario.js.map