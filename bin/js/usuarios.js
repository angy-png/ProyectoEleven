var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var usuarios;
(function (usuarios) {
    class Usuarios {
        constructor(empresasRef) {
            this.usuarios = new Map();
            this.empresas = empresasRef;
            this.pantPrincipal();
            this.crearVentanaModalUsuario();
            this.crearControles();
            this.crearTabla();
            this.cargar();
        }
        pantPrincipal() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 900,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada");
                },
            });
            this._conten = this._ventana._contenedor;
        }
        ;
        abrirPantallaUsuarios() {
            this._ventana.mostrar();
        }
        ;
        cerrarPantallaUsuarios() {
            this._ventana.ocultar();
        }
        ;
        crearVentanaModalUsuario() {
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
        ;
        crearContenidoModalUsuario() {
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;
            modal.append("h3").attr("id", "titulo-modal-user");
            modal.append("p").text("Nombre");
            modal.append("input").attr("id", "nombre-user");
            modal.append("p").text("Apellido paterno");
            modal.append("input").attr("id", "apellidoP-user");
            modal.append("p").text("Apellido materno");
            modal.append("input").attr("id", "apellidoM-user");
            modal.append("p").text("Usuario");
            modal.append("input").attr("id", "usuario-user");
            modal.append("p").text("Correo");
            modal.append("input").attr("id", "correo-user");
            modal.append("p").text("Teléfono");
            modal.append("input").attr("id", "telefono-user");
            modal.append("p").text("Empresa");
            modal.append("select").attr("id", "id_empresa-user");
            this.llenarSelectEmpresasModal("id_empresa-user");
            modal.append("br");
            modal.append("br");
            modal.append("button")
                .text("Guardar")
                .attr("id", "btn-guardar-user")
                .style("margin-right", "10px");
            this._ventanaModal.mostrar();
        }
        llenarSelectEmpresasModal(idSelect) {
            const select = d3.select(`#${idSelect}`);
            console.log(select);
            const empresasArray = Array.from(this.empresas.getEmpresas().values());
            select.selectAll("option").remove();
            select.append("option")
                .attr("selected", true)
                .attr("value", "0")
                .text("Selecciona empresa");
            select.selectAll("option.empresa")
                .data(empresasArray)
                .enter()
                .append("option")
                .attr("class", "empresa")
                .attr("value", d => String(d.id))
                .text(d => d.nombre);
        }
        abrirModalUsuario(esAgregar, datosExistentesU) {
            this.crearContenidoModalUsuario();
            d3.select("#titulo-modal-user").text(esAgregar ? "Agregar usuario" : "Editar usuario");
            if (!esAgregar && datosExistentesU) {
                document.getElementById("nombre-user").value = datosExistentesU.nombre;
                document.getElementById("apellidoP-user").value = datosExistentesU.apellidoPaterno;
                document.getElementById("apellidoM-user").value = datosExistentesU.apellidoMaterno;
                document.getElementById("usuario-user").value = datosExistentesU.usuario;
                document.getElementById("correo-user").value = datosExistentesU.correo;
                document.getElementById("telefono-user").value = datosExistentesU.telefono.toString();
                document.getElementById("id_empresa-user").value = datosExistentesU.id_empresa.toString();
            }
            document.getElementById("btn-guardar-user").onclick = () => {
                this.guardarUsuario(esAgregar, datosExistentesU);
            };
        }
        ;
        guardarUsuario(esAgregar, datosExistentesU) {
            const userNuevo = {
                nombre: document.getElementById("nombre-user").value,
                apellidoPaterno: document.getElementById("apellidoP-user").value,
                apellidoMaterno: document.getElementById("apellidoM-user").value,
                usuario: document.getElementById("usuario-user").value,
                correo: document.getElementById("correo-user").value,
                telefono: Number(document.getElementById("telefono-user").value),
                id_empresa: Number(document.getElementById("id_empresa-user").value),
            };
            if (esAgregar) {
                const maxId = Math.max(0, ...Array.from(this.usuarios.keys()));
                userNuevo.id = maxId + 1;
                this.usuarios.set(userNuevo.id, userNuevo);
            }
            else if (datosExistentesU) {
                this.usuarios.set(datosExistentesU.id, Object.assign(Object.assign({}, datosExistentesU), userNuevo));
            }
            this.renderTabla(Array.from(this.usuarios.values()));
            this._ventanaModal.ocultar();
        }
        ;
        mostrarModalConfirmacion(usuario) {
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;
            modal.append("h2").text("Confirmar eliminación");
            modal.append("p")
                .text(`¿Estás seguro de que deseas eliminar la empresa "${usuario.nombre}"?`)
                .style("margin-bottom", "20px");
            const botones = modal.append("div").style("display", "flex").style("gap", "10px");
            botones.append("button")
                .text("Sí, eliminar")
                .on("click", () => {
                this.usuarios.delete(usuario.id);
                this.renderTabla(Array.from(this.usuarios.values()));
                this._ventanaModal.ocultar();
            });
            this._ventanaModal.mostrar();
        }
        ;
        crearControles() {
            const contenedorInput = this._conten
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");
            const select = contenedorInput
                .append("select")
                .attr("id", "select-empresa");
            const inputTexto = contenedorInput
                .append("input")
                .attr("type", "text")
                .attr("placeholder", "Filtrar por nombre");
            const aplicarFiltro = () => {
                const textoBusqueda = inputTexto.property("value") || "";
                const valorEmpresa = Number(select.property("value") || 0);
                this.filtrar(textoBusqueda, valorEmpresa);
            };
            select.on("change", aplicarFiltro);
            inputTexto.on("input", aplicarFiltro);
            contenedorInput.append("img")
                .attr("src", "images/nuevo.svg")
                .attr("width", 30)
                .attr("height", 30)
                .style("cursor", "pointer")
                .style("margin-left", "auto")
                .on("click", () => this.abrirModalUsuario(true));
        }
        ;
        llenarSelectEmpresas() {
            const select = d3.select("select#select-empresa");
            // Obtener todas las empresas desde C_empresas
            const empresasArray = Array.from(this.empresas.getEmpresas().values());
            select.selectAll("option").remove();
            select.append("option")
                .attr("selected", true)
                .attr("value", "0")
                .text("Selecciona empresa");
            select.selectAll("option.empresa")
                .data(empresasArray)
                .enter()
                .append("option")
                .attr("class", "empresa")
                .attr("value", d => String(d.id))
                .text(d => d.nombre);
        }
        filtrar(nombre, idEmpresa) {
            const filtrados = Array.from(this.usuarios.values())
                .filter(u => {
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                return coincideNombre && coincideEmpresa;
            });
            this.renderTabla(filtrados);
        }
        crearTabla() {
            const tabla = this._conten.append("table")
                .attr("id", "tabla-usuarios")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");
            let columnaActiva = null;
            let direccionActiva = null;
            const thead = tabla.append("thead");
            const trHead = thead.append("tr");
            const crearColumnaOrdenable = (titulo, campo) => {
                const th = trHead.append("th")
                    .style("border", "1px solid black")
                    .style("background-color", "#bde9c4ff")
                    .style("padding", "4px");
                const cont = th.append("div")
                    .style("display", "flex")
                    .style("justify-content", "space-between")
                    .style("align-items", "center");
                cont.append("span").text(titulo);
                const flechas = cont.append("span")
                    .style("display", "flex")
                    .style("flex-direction", "column")
                    .style("line-height", "8px");
                const asc = flechas.append("span")
                    .attr("class", `flecha-asc-${campo}`)
                    .style("cursor", "pointer")
                    .style("font-size", "10px")
                    .style("color", "gray")
                    .text("▲")
                    .on("click", () => {
                    const datosOrdenados = ordenar(Array.from(this.usuarios.values()), campo, true);
                    this.renderTabla(datosOrdenados);
                    columnaActiva = campo;
                    direccionActiva = "asc";
                    actualizarFlechas();
                });
                const desc = flechas.append("span")
                    .attr("class", `flecha-desc-${campo}`)
                    .style("cursor", "pointer")
                    .style("font-size", "10px")
                    .style("color", "gray")
                    .text("▼")
                    .on("click", () => {
                    const datosOrdenados = ordenar(Array.from(this.usuarios.values()), campo, false);
                    this.renderTabla(datosOrdenados);
                    columnaActiva = campo;
                    direccionActiva = "desc";
                    actualizarFlechas();
                });
            };
            trHead.append("th")
                .text("Acciones")
                .style("border", "1px solid black")
                .style("background-color", "#bde9c4ff")
                .style("padding", "4px");
            crearColumnaOrdenable("Nombre", "nombre");
            crearColumnaOrdenable("Apellido paterno", "apellidoPaterno");
            crearColumnaOrdenable("Apellido materno", "apellidoMaterno");
            crearColumnaOrdenable("Usuario", "usuario");
            crearColumnaOrdenable("Correo", "correo");
            crearColumnaOrdenable("Teléfono", "telefono");
            crearColumnaOrdenable("Empresa", "id_empresa");
            tabla.append("tbody").attr("id", "tabla-usuarios-body");
            const actualizarFlechas = () => {
                var _a;
                const thElements = trHead.selectAll("th").nodes();
                for (let i = 0; i < thElements.length; i++) {
                    const th = d3.select(thElements[i]);
                    const flechaAsc = th.select(`[class*="flecha-asc"]`);
                    const flechaDesc = th.select(`[class*="flecha-desc"]`);
                    if (flechaAsc.empty() || flechaDesc.empty())
                        continue;
                    const esColumnaActiva = columnaActiva && ((_a = flechaAsc.attr("class")) === null || _a === void 0 ? void 0 : _a.includes(columnaActiva));
                    flechaAsc.style("color", esColumnaActiva && direccionActiva === "asc" ? "black" : "gray");
                    flechaDesc.style("color", esColumnaActiva && direccionActiva === "desc" ? "black" : "gray");
                }
            };
        }
        cargar() {
            return __awaiter(this, arguments, void 0, function* (recargarJson = true) {
                if (recargarJson) {
                    try {
                        const response = yield fetch("./datos.json");
                        const data = yield response.json();
                        this.usuarios.clear();
                        for (let i = 0; i < data.length; i++) {
                            const item = data[i];
                            const userNuevo = {
                                id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                                nombre: item.nombre ? String(item.nombre) : "",
                                apellidoPaterno: item.apellidoPaterno ? String(item.apellidoPaterno) : "",
                                apellidoMaterno: item.apellidoMaterno ? String(item.apellidoMaterno) : "",
                                usuario: item.usuario ? String(item.usuario) : "",
                                id_empresa: item.id_empresa !== undefined && item.id_empresa !== null ? Number(item.id_empresa) : 0,
                                correo: item.correo ? String(item.correo) : "",
                                telefono: item.telefono !== undefined && item.telefono !== null ? Number(item.telefono) : 0
                            };
                            this.usuarios.set(userNuevo.id, userNuevo);
                        }
                    }
                    catch (error) {
                        console.error("Error al cargar o parsear datos.json:", error);
                    }
                    this.renderTabla(Array.from(this.usuarios.values()));
                    this.llenarSelectEmpresas();
                }
            });
        }
        ;
        renderTabla(data) {
            const tbody = d3.select("#tabla-usuarios-body");
            const columnas = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'usuario', 'correo', 'telefono', 'id_empresa'];
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
                    .style("gap", "10px");
                acciones.append("img")
                    .attr("src", "images/editar.svg")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => {
                    const usuarioActualizado = this.usuarios.get(d.id);
                    if (usuarioActualizado) {
                        this.abrirModalUsuario(false, usuarioActualizado);
                    }
                });
                acciones.append("img")
                    .attr("src", "images/eliminar.svg")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => this.mostrarModalConfirmacion(d));
                // Crear celdas de datos
                for (let i = 0; i < columnas.length; i++) {
                    const clave = columnas[i];
                    tr.append("td")
                        .classed(`data-col-${i}`, true)
                        .style("border", "1px solid black")
                        .style("padding", "6px")
                        .text(d => {
                        var _a;
                        if (clave === "id_empresa") {
                            // Mostrar nombre de la empresa
                            const empresa = this.empresas.empresas.get(d.id_empresa);
                            return empresa ? empresa.nombre : "No asignada";
                        }
                        return (_a = d[clave]) !== null && _a !== void 0 ? _a : "—";
                    });
                }
                return tr;
            }, update => {
                for (let i = 0; i < columnas.length; i++) {
                    const clave = columnas[i];
                    update.select(`td.data-col-${i}`)
                        .text(d => {
                        var _a;
                        if (clave === "id_empresa") {
                            const empresa = this.empresas.empresas.get(d.id_empresa);
                            return empresa ? empresa.nombre : "No asignada";
                        }
                        return (_a = d[clave]) !== null && _a !== void 0 ? _a : "—";
                    });
                }
                ;
                return update;
            }, exit => exit.remove());
        }
    }
    usuarios.Usuarios = Usuarios;
    // true por defecto es ascendente 
    function ordenar(array, propiedad, asc = true) {
        return array.sort((a, b) => {
            const valorA = a[propiedad];
            const valorB = b[propiedad];
            if (typeof valorA === "string" && typeof valorB === "string") {
                if (asc) {
                    return valorA.localeCompare(valorB); // ascendente
                }
                else {
                    return valorB.localeCompare(valorA); // descendente
                }
            }
            if (typeof valorA === "number" && typeof valorB === "number") {
                if (asc) {
                    return valorA - valorB; // ascendente
                }
                else {
                    return valorB - valorA; // descendente
                }
            }
            if (typeof valorA === "boolean" && typeof valorB === "boolean") {
                if (asc) {
                    return Number(valorA) - Number(valorB);
                }
                else {
                    return Number(valorB) - Number(valorA);
                }
            }
            if (valorA instanceof Date && valorB instanceof Date) {
                if (asc) {
                    return valorA.getTime() - valorB.getTime();
                }
                else {
                    return valorB.getTime() - valorA.getTime();
                }
            }
            return 0;
        });
    }
    usuarios.ordenar = ordenar;
    ;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=usuarios.js.map