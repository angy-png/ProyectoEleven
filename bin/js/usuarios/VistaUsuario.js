var usuarios;
(function (usuarios) {
    class VistaUsuarios {
        constructor(ventana) {
            this.ventana = ventana;
        }
        crearModalUsuario() {
            this.ventana = new ventanaControl.ventanaControl({
                id: "modal-usuario",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Usuario",
                modal: true,
                onClose: () => console.log("Modal usuario cerrado"),
            });
        }
        crearControles() {
            const contenedorInput = this.ventana._contenido
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");
            const select = contenedorInput.append("select").attr("id", "select-empresa");
            const inputTexto = contenedorInput.append("input").attr("type", "text").attr("placeholder", "Filtrar por nombre");
            const aplicarFiltro = () => {
                const textoBusqueda = inputTexto.property("value") || "";
                const valorusuario = Number(select.property("value") || 0);
                this.onFiltroCallback(textoBusqueda, valorusuario);
            };
            select.on("change", aplicarFiltro);
            inputTexto.on("input", aplicarFiltro);
            contenedorInput.append("img")
                .attr("src", "images/nuevo.svg")
                .attr("width", 30)
                .attr("height", 30)
                .style("cursor", "pointer")
                .style("margin-left", "auto")
                .on("click", () => this.abrirModalUsuario("agregar"));
        }
        crearTablaUser() {
            const tabla = this.ventana._contenido.append("table")
                .attr("id", "tabla-usuarios")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");
            const colUser = [
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
            trHead.selectAll("th")
                .data(colUser)
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
                    .style("justify-content", "space-between")
                    .style("align-items", "center");
                cont.append("span").text(d.titulo);
                const flechas = cont.append("span")
                    .style("display", "flex")
                    .style("flex-direction", "column")
                    .style("line-height", "8px");
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
                // d: datos de columna, indice arreglo de nodos 
                .each((d, i, nodes) => {
                if (!d.campo)
                    return;
                const th = d3.select(nodes[i]);
                const asc = th.select(".flecha-asc");
                const desc = th.select(".flecha-desc");
                asc.on("click", () => {
                    columnaActiva = d.campo; //no nulo 
                    direccionActiva = 'asc';
                    actualizarFlechas();
                });
                desc.on("click", () => {
                    columnaActiva = d.campo;
                    direccionActiva = 'desc';
                    actualizarFlechas();
                });
            });
            tabla.append("tbody").attr("id", "tabla-usuarios-body");
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
        onEliminar(callback) {
            this.onEliminarCallback = callback;
        }
        onGuardar(callback) {
            this.onGuardarCallback = callback;
        }
        onFiltro(callback) {
            this.onFiltroCallback = callback;
        }
        mostrarModalEliminar(nombreUsuario, onConfirm) {
            this.ventana.limpiarContenido();
            const modal = this.ventana._contenido;
            modal.append("h2").text("Confirmar eliminación");
            modal.append("p").text(`¿Estás seguro de que deseas eliminar a ${nombreUsuario}?`)
                .style("margin-bottom", "20px");
            const botones = modal.append("div").style("display", "flex").style("gap", "10px");
            botones.append("button")
                .text("Sí, eliminar")
                .on("click", () => {
                onConfirm(); // Aquí se llama al controlador
                this.ventana.ocultar();
            });
            this.ventana.mostrar();
        }
        abrirModalUsuario(modo, datosExistentes) {
            var _a;
            this.ventana.limpiarContenido();
            const modal = this.ventana._contenido;
            modal.append("h3").text(modo === "agregar" ? "Agregar" : "Editar");
            const campos = [
                { id: "nombre", label: "Nombre" },
                { id: "apellidoPaterno", label: "Apellido paterno" },
                { id: "apellidoMaterno", label: "Apellido materno" },
                { id: "usuario", label: "Usuario" },
                { id: "correo", label: "Correo" },
                { id: "telefono", label: "Teléfono" },
                { id: "id_empresa", label: "Empresa" }
            ];
            for (let i = 0; i < campos.length; i++) {
                const campo = campos[i];
                modal.append("p").text(campo.label);
                modal.append("input")
                    .attr("id", campo.id)
                    .style("margin-bottom", "10px")
                    .style("display", "block")
                    .property("value", (_a = datosExistentes === null || datosExistentes === void 0 ? void 0 : datosExistentes[campo.id]) !== null && _a !== void 0 ? _a : "");
            }
            modal.append("button")
                .text("Guardar")
                .on("click", () => {
                var _a;
                const usuario = {};
                for (let i = 0; i < campos.length; i++) {
                    const campo = campos[i];
                    const input = document.getElementById(campo.id);
                    let valor = input.value;
                    if (campo.id === "id_empresa" || campo.id === "telefono") {
                        valor = Number(valor);
                    }
                    usuario[campo.id] = valor;
                }
                // 👉 Ahora NO guarda en Map directamente
                (_a = this.onGuardarCallback) === null || _a === void 0 ? void 0 : _a.call(this, modo, datosExistentes ? Object.assign(Object.assign({}, datosExistentes), usuario) : usuario);
                console.log(modo);
                console.log(datosExistentes);
                console.log(usuario);
                this.ventana.ocultar();
            });
            this.ventana.mostrar();
        }
        renderizarUser(data) {
            const tbody = d3.select("#tabla-usuarios-body");
            const columnas = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'usuario', 'correo', 'telefono', 'id_empresa'];
            const filas = tbody.selectAll("tr")
                .data(data, d => d.id)
                .join(enter => {
                const tr = enter.append("tr");
                // Columna de acciones
                const acciones = tr.append("td")
                    .classed("acciones", true)
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
                    .on("click", (event, d) => {
                    this.abrirModalUsuario("editar", d);
                });
                acciones.append("img")
                    .attr("src", "images/eliminar.svg")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => {
                    var _a;
                    (_a = this.onEliminarCallback) === null || _a === void 0 ? void 0 : _a.call(this, d); // Llama solo si existe
                });
                for (let i = 0; i < columnas.length; i++) {
                    const clave = columnas[i];
                    tr.append("td")
                        .classed(`data-col-${i}`, true)
                        .style("border", "1px solid black")
                        .style("padding", "6px")
                        .text(d => { var _a; return (_a = d[clave]) !== null && _a !== void 0 ? _a : "—"; });
                }
                return tr;
            }, update => {
                for (let i = 0; i < columnas.length; i++) {
                    const clave = columnas[i];
                    update.select(`td.data-col-${i}`)
                        .text(d => { var _a; return (_a = d[clave]) !== null && _a !== void 0 ? _a : "—"; });
                }
                ;
                return update;
            }, exit => exit.remove());
        }
        renderSelectEmpresas(empresas) {
            const select = d3.select("select#select-empresa");
            select.selectAll("option").remove();
            select.append("option")
                .attr("selected", true)
                .text("Selecciona empresa");
            select.selectAll("option.empresa")
                .data(empresas)
                .enter()
                .append("option")
                .attr("class", "empresa")
                .attr("value", d => String(d))
                .text(d => `Empresa ${d}`);
        }
    }
    usuarios.VistaUsuarios = VistaUsuarios;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=VistaUsuario.js.map