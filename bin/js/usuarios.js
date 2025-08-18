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
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada");
                },
            });
            this._contenedor = this._ventana._contenedor;
            this.crearControles();
            this.crearModalUsuario();
            this.crearTabla();
            this.cargar();
        }
        cargar() {
            return __awaiter(this, arguments, void 0, function* (recargarJson = true) {
                if (recargarJson) {
                    const response = yield fetch("./datos.json");
                    const data = yield response.json();
                    this.usuarios.clear();
                    data.forEach(u => this.usuarios.set(u.id, u));
                }
                this.renderTabla(Array.from(this.usuarios.values()));
                this.llenarSelectEmpresas();
            });
        }
        llenarSelectEmpresas() {
            const select = d3.select("select#select-empresa");
            const empresasUnicas = Array.from(new Set(Array.from(this.usuarios.values()).map(u => u.id_empresa)));
            select.selectAll("option").remove();
            select.append("option").attr("selected", true)
                .text("Selecciona empresa");
            select.selectAll("option.empresa")
                .data(empresasUnicas)
                .enter()
                .append("option")
                .attr("class", "empresa")
                .attr("value", d => String(d))
                .text(d => `Empresa ${d}`);
        }
        filtrar(nombre, idEmpresa) {
            const filtrados = Array.from(this.usuarios.values())
                .filter(u => {
                // Filtrar por nombre si se escribió algo
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                // Filtrar por empresa si se seleccionó un id válido (>0)
                const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                return coincideNombre && coincideEmpresa;
            });
            this.renderTabla(filtrados);
        }
        crearControles() {
            const contenedorInput = this._contenedor.append("div").style("display", "flex").style("gap", "10px");
            const select = contenedorInput.append("select").attr("id", "select-empresa").style("padding", "10px 20px");
            const inputTexto = contenedorInput.append("input").attr("type", "text")
                .attr("placeholder", "Filtrar por nombre...").style("padding", "10px 20px");
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
                colorFondo: "#e6f7e9ff",
                titulo: "Usuario",
                modal: true,
                onClose: () => console.log("Modal usuario cerrado"),
            });
        }
        crearTabla() {
            const tabla = this._contenedor.append("table")
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
            trHead.selectAll("th")
                .data(columnas)
                .enter()
                .append("th")
                .style("border", "1px solid black")
                .style("background-color", "#bde9c4ff")
                .style("padding", "4px")
                .style("user-select", "none")
                .html(d => {
                if (!d.campo)
                    return d.titulo;
                return `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>${d.titulo}</span>
                    <span style="display:flex; flex-direction:column; line-height:8px;">
                        <span class="flecha-asc" style="cursor:pointer; font-size:10px; color:gray;">▲</span>
                        <span class="flecha-desc" style="cursor:pointer; font-size:10px; color:gray;">▼</span>
                    </span>
                </div>
            `;
            })
                .each((d, i, nodes) => {
                if (!d.campo)
                    return;
                const th = d3.select(nodes[i]);
                const asc = th.select(".flecha-asc");
                const desc = th.select(".flecha-desc");
                asc.on("click", () => {
                    const datosOrdenados = ordenarAsc(Array.from(this.usuarios.values()), d.campo);
                    this.renderTabla(datosOrdenados);
                    columnaActiva = d.campo;
                    direccionActiva = 'asc';
                    actualizarFlechas();
                });
                desc.on("click", () => {
                    const datosOrdenados = ordenarDesc(Array.from(this.usuarios.values()), d.campo);
                    this.renderTabla(datosOrdenados);
                    columnaActiva = d.campo;
                    direccionActiva = 'desc';
                    actualizarFlechas();
                });
            });
            tabla.append("tbody").attr("id", "tabla-usuarios-body");
            // 🔹 Mantener ambas flechas, pero resaltar la activa
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
                // Columnas de datos
                columnas.forEach((clave, i) => {
                    tr.append("td")
                        .classed(`data-col-${i}`, true)
                        .style("border", "1px solid black")
                        .style("padding", "6px")
                        .text(d => { var _a; return (_a = d[clave]) !== null && _a !== void 0 ? _a : "—"; });
                });
                return tr;
            }, update => {
                columnas.forEach((clave, i) => {
                    update.select(`td.data-col-${i}`)
                        .text(d => { var _a; return (_a = d[clave]) !== null && _a !== void 0 ? _a : "—"; });
                });
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
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;
            modal.append("h3")
                .text(modo === "agregar" ? "Agregar nuevo usuario" : "Editar usuario");
            const campos = [
                { id: "nombre", label: "Nombre" },
                { id: "apellidoPaterno", label: "Apellido paterno" },
                { id: "apellidoMaterno", label: "Apellido materno" },
                { id: "usuario", label: "Usuario" },
                { id: "correo", label: "Correo" },
                { id: "telefono", label: "Teléfono" },
                { id: "id_empresa", label: "Empresa" }
            ];
            campos.forEach(campo => {
                var _a;
                modal.append("p").text(campo.label);
                modal.append("input")
                    .attr("id", campo.id)
                    .style("margin-bottom", "10px")
                    .style("display", "block")
                    .property("value", (_a = datosExistentes === null || datosExistentes === void 0 ? void 0 : datosExistentes[campo.id]) !== null && _a !== void 0 ? _a : "");
            });
            modal.append("button")
                .text("Guardar")
                .style("margin-right", "10px")
                .on("click", () => {
                const nuevoUsuario = {};
                campos.forEach(campo => {
                    const input = document.getElementById(campo.id);
                    let valor = input.value;
                    if (campo.id === "id_empresa" || campo.id === "telefono") {
                        valor = Number(valor);
                    }
                    nuevoUsuario[campo.id] = valor;
                });
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
    function ordenarAsc(array, propiedad) {
        return array.sort((a, b) => {
            const valorA = a[propiedad];
            const valorB = b[propiedad];
            if (typeof valorA === "string" && typeof valorB === "string")
                return valorA.localeCompare(valorB);
            if (typeof valorA === "number" && typeof valorB === "number")
                return valorA - valorB;
            return 0;
        });
    }
    function ordenarDesc(array, propiedad) {
        return array.sort((a, b) => {
            const valorA = a[propiedad];
            const valorB = b[propiedad];
            if (typeof valorA === "string" && typeof valorB === "string")
                return valorB.localeCompare(valorA);
            if (typeof valorA === "number" && typeof valorB === "number")
                return valorB - valorA;
            return 0;
        });
    }
})(usuarios || (usuarios = {}));
//# sourceMappingURL=usuarios.js.map