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
        constructor() {
            this.usuarios = new Map();
            this.pantPrincipal();
            this.crearControles();
            this.crearModalUsuario();
            this.crearTabla();
            this.cargar();
        }
        pantPrincipal() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios", ancho: 800, alto: 400, colorFondo: "white", titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada");
                },
            });
            this._conten = this._ventana._contenedor;
        }
        ;
        cargar() {
            return __awaiter(this, arguments, void 0, function* (recargarJson = true) {
                if (recargarJson) {
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
                this.renderTabla(Array.from(this.usuarios.values()));
                this.llenarSelectEmpresas();
            });
        }
        ;
        llenarSelectEmpresas() {
            const select = d3.select("select#select-empresa");
            const empresasUnicas = Array.from(new Set(Array.from(this.usuarios.values()).map(u => u.id_empresa)));
            select.selectAll("option").remove();
            select.append("option").attr("selected", true).text("Selecciona empresa");
            select.selectAll("option.empresa")
                .data(empresasUnicas)
                .enter()
                .append("option")
                .attr("class", "empresa")
                .attr("value", d => String(d))
                .text(d => `Empresa ${d}`);
        }
        filtrar(nombre, idEmpresa) {
            const filtrados = Array.from(this.usuarios.values()) //map a array 
                .filter(u => {
                console.log("que es u:" + u.nombre);
                // Filtrar por nombre si se escribió algo, true si nombre es vacío, null, undefined, etc.  ||=o
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                // Filtrar por empresa si se seleccionó un id válido (>0)
                const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                return coincideNombre && coincideEmpresa;
            });
            this.renderTabla(filtrados);
        }
        crearControles() {
            const contenedorInput = this._conten
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");
            const select = contenedorInput.append("select").attr("id", "select-empresa");
            const inputTexto = contenedorInput.append("input").attr("type", "text").attr("placeholder", "Filtrar por nombre");
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
                .on("click", () => this.abrirModalUsuario("agregar"));
        }
        crearModalUsuario() {
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
        crearTabla() {
            const tabla = this._conten.append("table")
                .attr("id", "tabla-usuarios")
                .style("width", "100%")
                .style("border-collapse", "collapse") //bordes compartidas 
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
            const thead = tabla.append("thead"); //encabezado 
            const trHead = thead.append("tr"); //fila 
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
                    const datosOrdenados = ordenar(Array.from(this.usuarios.values()), d.campo, true);
                    this.renderTabla(datosOrdenados);
                    columnaActiva = d.campo; //no nulo 
                    direccionActiva = 'asc';
                    actualizarFlechas();
                });
                desc.on("click", () => {
                    const datosOrdenados = ordenar(Array.from(this.usuarios.values()), d.campo, false);
                    this.renderTabla(datosOrdenados);
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
        renderTabla(data) {
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
                    const usuarioActualizado = this.usuarios.get(d.id);
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
        mostrarModalConfirmacion(usuario) {
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
                this.usuarios.delete(usuario.id);
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
            ;
            modal.append("button")
                .text("Guardar")
                .style("margin-right", "10px")
                .on("click", () => {
                const nuevoUsuario = {};
                for (let i = 0; i < campos.length; i++) {
                    const campo = campos[i];
                    const input = document.getElementById(campo.id);
                    let valor = input.value;
                    if (campo.id === "id_empresa" || campo.id === "telefono") {
                        valor = Number(valor);
                    }
                    nuevoUsuario[campo.id] = valor;
                }
                ;
                if (modo === "agregar") {
                    nuevoUsuario.id = this.usuarios.size + 1;
                    this.usuarios.set(nuevoUsuario.id, nuevoUsuario);
                }
                else if (modo === "editar" && datosExistentes) {
                    this.usuarios.set(datosExistentes.id, Object.assign(Object.assign({}, datosExistentes), nuevoUsuario));
                }
                this.cargar(false);
                this.llenarSelectEmpresas();
                this._ventanaModal.ocultar();
            });
            this._ventanaModal.mostrar();
        }
        abrirPantallaUsuarios() {
            this._ventana.mostrar();
        }
        cerrarPantallaUsuarios() {
            this._ventana.ocultar();
        }
    }
    usuarios.Usuarios = Usuarios;
    // T tipo generico  
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
            return 0;
        });
    }
    usuarios.ordenar = ordenar;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=usuarios.js.map