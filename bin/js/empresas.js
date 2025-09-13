var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var empresas;
(function (empresas) {
    class C_empresas {
        constructor() {
            this.empresas = new Map();
            this.formatFecha = d3.timeFormat("%d/%m/%Y, %I:%M:%S %p");
            this.formatInputFecha = d3.timeFormat("%Y-%m-%dT%H:%M");
            this.pantPrincipal();
            this.crearControles();
            this.crearModalUsuario();
            this.crearTabla();
            this.cargar();
        }
        //ciclos de comunicacion
        pantPrincipal() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "VentanaEmpresas",
                ancho: 900, alto: 400,
                colorFondo: "white", titulo: "Empresas",
                onClose() {
                    console.log("ventana empresas fue cerrada");
                },
            });
            this._conten = this._ventana._contenedor;
        }
        ;
        cargar() {
            return __awaiter(this, arguments, void 0, function* (recargarJson = true) {
                if (recargarJson) {
                    const response = yield fetch("./empresas.json");
                    const data = yield response.json();
                    this.empresas.clear();
                    for (let i = 0; i < data.length; i++) {
                        const item = data[i];
                        const empreNueva = {
                            id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                            nombre: item.nombre ? String(item.nombre) : "",
                            rfc: item.rfc ? String(item.rfc) : "",
                            telefono: item.telefono !== undefined && item.telefono !== null ? Number(item.telefono) : 0,
                            activo: item.activo !== undefined && item.activo !== null ? item.activo == true || item.activo === "true" : false,
                            fechaRegistro: item.fechaRegistro ? new Date(item.fechaRegistro) : new Date()
                        };
                        this.empresas.set(empreNueva.id, empreNueva);
                        console.log(empreNueva);
                    }
                }
                this.renderTabla(Array.from(this.empresas.values()));
            });
        }
        ;
        filtrar(nombre) {
            const filtrados = Array.from(this.empresas.values())
                .filter(u => {
                const coindiceNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                return coindiceNombre;
            });
            this.renderTabla(filtrados);
        }
        crearControles() {
            const contenedorInput = this._conten
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");
            const inputTexto = contenedorInput.append("input").attr("type", "text").attr("placeholder", "Filtrar por empresa");
            const aplicarFiltro = () => {
                const textoBusqueda = inputTexto.property("value") || "";
                this.filtrar(textoBusqueda);
            };
            inputTexto.on("input", aplicarFiltro);
            contenedorInput.append("img")
                .attr("src", "images/nuevo.svg")
                .attr("width", 30)
                .attr("height", 30)
                .style("cursor", "pointer")
                .style("margin-left", "auto")
                .on("click", () => this.abrirModalUsuario("agregar"));
        }
        renderTabla(data) {
            const tbody = d3.select("#tabla-empresas-body");
            const columnas = ["nombre", "rfc", "telefono", "activo", "fechaRegistro"];
            const filas = tbody.selectAll("tr")
                .data(data, d => d.id)
                .join(enter => {
                const tr = enter.append("tr");
                const acciones = tr.append("td")
                    .classed("acciones", true)
                    .style("border", "1px solid black")
                    .style("padding", "6px")
                    .append("div")
                    .style("display", "flex")
                    .style("gap", "1opx");
                acciones.append("img")
                    .attr("src", "images/editar.svg")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => {
                    const usuarioActualizado = this.empresas.get(d.id);
                    if (usuarioActualizado) {
                        this.abrirModalUsuario("editar", usuarioActualizado);
                    }
                });
                acciones.append("img")
                    .attr("src", "images/eliminar.svg")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => this.mostrarModalConfirmacion(d));
                for (let i = 0; i < columnas.length; i++) {
                    const clave = columnas[i];
                    tr.append("td")
                        .classed(`data-col-${i}`, true)
                        .style("border", "1px solid black")
                        .style("padding", "6px")
                        .text(d => {
                        const valor = d[clave];
                        if (clave === 'activo') {
                            return valor ? "Si" : "No";
                        }
                        return valor instanceof Date ? this.formatFecha(valor) : String(valor);
                    });
                }
                return tr;
            }, update => {
                for (let i = 0; i < columnas.length; i++) {
                    const clave = columnas[i];
                    update.select(`td.data-col-${i}`)
                        .text(d => {
                        const valor = d[clave];
                        if (clave === 'activo') {
                            return valor ? "Si" : "No";
                        }
                        return valor instanceof Date ? this.formatFecha(valor) : String(valor);
                    });
                }
                ;
                return update;
            }, exit => exit.remove());
        }
        ;
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
                    .style("justify-content", "space-between")
                    .style("aling-items", "center");
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
                .each((d, i, nodes) => {
                if (!d.campo)
                    return;
                const th = d3.select(nodes[i]);
                const asc = th.select(".flecha-asc");
                const desc = th.select(".flecha-desc");
                asc.on("click", () => {
                    const datosOrdenados = usuarios.ordenar(Array.from(this.empresas.values()), d.campo, true);
                    this.renderTabla(datosOrdenados);
                    columnaActiva = d.campo;
                    direccionActiva = 'asc';
                    actualizarFlechas();
                });
                desc.on("click", () => {
                    const datosOrdenados = usuarios.ordenar(Array.from(this.empresas.values()), d.campo, false);
                    this.renderTabla(datosOrdenados);
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
        crearModalUsuario() {
            this._ventanaModal = new ventanaControl.ventanaControl({
                id: "modal-empresa",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Usuario",
                modal: true,
                onClose: () => console.log("Modal empresa cerrado"),
            });
        }
        mostrarModalConfirmacion(empresa) {
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;
            modal.append("h2").text("Confirmar eliminación");
            modal.append("p")
                .text("¿Estás seguro de que deseas eliminar este usuario?")
                .style("margin-bottom", "20px");
            const botones = modal.append("div").style("display", "flex").style("gap", "10px");
            botones.append("button")
                .text("Sí, eliminar")
                .on("click", () => {
                this.empresas.delete(empresa.id);
                console.log(this.empresas);
                this.cargar(false);
                this._ventanaModal.ocultar();
            });
            this._ventanaModal.mostrar();
        }
        abrirModalUsuario(modo, datosExistentes) {
            var _a;
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;
            modal.append("h3")
                .text(modo === "agregar" ? "Agregar" : "Editar");
            const campos = [
                { id: "nombre", label: "Nombre" },
                { id: "rfc", label: "Rfc" },
                { id: "telefono", label: "Telefono" },
                { id: "activo", label: "Activo" },
                { id: "fechaRegistro", label: "Fecha de registro" }
            ];
            for (let i = 0; i < campos.length; i++) {
                const campo = campos[i];
                modal.append("p").text(campo.label);
                if (campo.id === "activo") {
                    const select = modal.append("select")
                        .attr("id", campo.id)
                        .style("margin-bottom", "10px")
                        .style("display", "block");
                    select.append("option")
                        .attr("value", "true")
                        .text("Sí");
                    select.append("option")
                        .attr("value", "false")
                        .text("No");
                    if (datosExistentes) {
                        if (datosExistentes.activo) {
                            select.property("value", "true");
                        }
                        else {
                            select.property("value", "false");
                        }
                    }
                }
                else if (campo.id === "fechaRegistro") {
                    const fechaInput = modal.append("input")
                        .attr("id", campo.id)
                        .attr("type", "datetime-local")
                        .style("margin-bottom", "10px")
                        .style("display", "block");
                    if (datosExistentes) {
                        const fechaLocal = datosExistentes.fechaRegistro; // Date ya en JS
                        const fechaStr = this.formatInputFecha(fechaLocal); // Usando d3 para formatear
                        fechaInput.property("value", fechaStr);
                    }
                }
                else {
                    modal.append("input")
                        .attr("id", campo.id)
                        .style("margin-bottom", "10px")
                        .style("display", "block")
                        .property("value", (_a = datosExistentes === null || datosExistentes === void 0 ? void 0 : datosExistentes[campo.id]) !== null && _a !== void 0 ? _a : "");
                }
            }
            ;
            modal.append("button")
                .text("Guardar")
                .style("margin-right", "10px")
                .on("click", () => {
                const nuevaEmpresa = {};
                for (let i = 0; i < campos.length; i++) {
                    const campo = campos[i];
                    const input = document.getElementById(campo.id);
                    let valor = input.value;
                    if (campo.id === "telefono") {
                        valor = Number(valor);
                    }
                    else if (campo.id === "activo") {
                        valor = valor.toLowerCase() === "true";
                    }
                    if (campo.id === "fechaRegistro") {
                        const inputFecha = document.getElementById(campo.id);
                        valor = new Date(inputFecha.value); // hora local
                    }
                    nuevaEmpresa[campo.id] = valor;
                }
                ;
                if (modo === "agregar") {
                    nuevaEmpresa.id = this.empresas.size + 1;
                    this.empresas.set(nuevaEmpresa.id, nuevaEmpresa);
                }
                else if (modo === "editar" && datosExistentes) {
                    this.empresas.set(datosExistentes.id, Object.assign(Object.assign({}, datosExistentes), nuevaEmpresa));
                }
                this.cargar(false);
                this._ventanaModal.ocultar();
            });
            this._ventanaModal.mostrar();
        }
        abrirPantallaEmpresas() {
            this._ventana.mostrar();
        }
        cerrarPantallaEpresas() {
            this._ventana.ocultar();
        }
    }
    empresas.C_empresas = C_empresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=empresas.js.map