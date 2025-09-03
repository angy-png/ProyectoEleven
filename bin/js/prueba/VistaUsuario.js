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
    var ModeloBase = generico.ModeloBase;
    var ControladorBase = generico.ControladorBase;
    class UsuariosApp {
        constructor() {
            this.formatFecha = d3.timeFormat("%d/%m/%Y, %I:%M:%S %p");
            // 1️⃣ Ventana principal
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() { console.log("La ventana de usuarios fue cerrada"); }
            });
            this._conten = this._ventana._contenedor;
            // 2️⃣ Ventana modal
            this._ventanaModal = new ventanaControl.ventanaControl({
                id: "modal-usuario",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Usuario",
                modal: true,
                onClose: () => console.log("Modal usuario cerrado")
            });
            // 3️⃣ Modelo y controlador genéricos
            this.modelo = new ModeloBase();
            this.controlador = new ControladorBase(this.modelo, this);
            // 4️⃣ Controles y tabla
            this.crearControles();
            this.crearTabla();
        }
        // 🔹 Métodos que el controlador genérico necesita
        renderizarUser(data) {
            this.renderTabla(data);
        }
        abrirModal(modo, datos) {
            var _a;
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;
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
            for (const campo of campos) {
                modal.append("p").text(campo.label);
                modal.append("input")
                    .attr("id", campo.id)
                    .style("margin-bottom", "10px")
                    .style("display", "block")
                    .property("value", (_a = datos === null || datos === void 0 ? void 0 : datos[campo.id]) !== null && _a !== void 0 ? _a : "");
            }
            modal.append("button")
                .text("Guardar")
                .on("click", () => {
                const nuevoUsuario = {};
                for (const campo of campos) {
                    const input = document.getElementById(campo.id);
                    let valor = input.value;
                    if (campo.id === "id_empresa" || campo.id === "telefono")
                        valor = Number(valor);
                    nuevoUsuario[campo.id] = valor;
                }
                if (modo === "agregar") {
                    const nuevoId = Math.max(0, ...Array.from(this.modelo.items.keys())) + 1;
                    this.modelo.agregar(Object.assign(Object.assign({}, nuevoUsuario), { id: nuevoId }));
                }
                else if (modo === "editar" && datos) {
                    this.modelo.editar(Object.assign(Object.assign({}, datos), nuevoUsuario));
                }
                this.controlador.inicializar();
                this._ventanaModal.ocultar();
            });
            this._ventanaModal.mostrar();
        }
        eliminar(usuario) {
            this.modelo.eliminar(usuario.id);
            this.controlador.inicializar();
        }
        // 🔹 Cargar datos desde JSON
        cargarDesdeJSON(url) {
            return __awaiter(this, void 0, void 0, function* () {
                const res = yield fetch(url);
                const data = yield res.json();
                data.forEach(u => this.modelo.agregar(u));
                this.controlador.inicializar();
            });
        }
        // 🔹 Abrir/cerrar ventana principal
        abrirPantallaUsuarios() { this._ventana.mostrar(); }
        cerrarPantallaUsuarios() { this._ventana.ocultar(); }
        // 🔹 Controles (filtro + botón agregar)
        crearControles() {
            const contenedorInput = this._conten.append("div")
                .style("display", "flex")
                .style("gap", "10px");
            const inputTexto = contenedorInput.append("input")
                .attr("type", "text")
                .attr("placeholder", "Filtrar por nombre");
            const aplicarFiltro = () => {
                const texto = inputTexto.property("value") || "";
                const filtrados = this.modelo.obtenerTodos()
                    .filter(u => !texto || u.nombre.toLowerCase().includes(texto.toLowerCase()));
                this.renderTabla(filtrados);
            };
            inputTexto.on("input", aplicarFiltro);
            contenedorInput.append("img")
                .attr("src", "images/nuevo.svg")
                .attr("width", 30).attr("height", 30)
                .style("cursor", "pointer")
                .style("margin-left", "auto")
                .on("click", () => this.abrirModal("agregar"));
        }
        // 🔹 Crear tabla
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
            const thead = tabla.append("thead");
            const trHead = thead.append("tr");
            trHead.selectAll("th")
                .data(columnas)
                .enter()
                .append("th")
                .style("border", "1px solid black")
                .style("background-color", "#bde9c4ff")
                .style("padding", "4px")
                .each((d, i, nodes) => {
                const th = d3.select(nodes[i]);
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
                flechas.append("span").attr("class", "flecha-asc")
                    .style("cursor", "pointer")
                    .style("font-size", "10px").style("color", "gray")
                    .text("▲")
                    .on("click", () => this.ordenarColumna(d.campo, true));
                flechas.append("span").attr("class", "flecha-desc")
                    .style("cursor", "pointer")
                    .style("font-size", "10px").style("color", "gray")
                    .text("▼")
                    .on("click", () => this.ordenarColumna(d.campo, false));
            });
            tabla.append("tbody").attr("id", "tabla-usuarios-body");
        }
        // 🔹 Ordenar columna
        ordenarColumna(campo, asc) {
            const ordenados = this.modelo.ordenar(campo, asc);
            this.renderTabla(ordenados);
        }
        // 🔹 Renderizar filas
        renderTabla(data) {
            const tbody = d3.select("#tabla-usuarios-body");
            const columnas = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'usuario', 'correo', 'telefono', 'id_empresa'];
            tbody.selectAll("tr")
                .data(data)
                .join(enter => {
                const tr = enter.append("tr");
                // Acciones
                const acciones = tr.append("td")
                    .classed("acciones", true)
                    .style("border", "1px solid black")
                    .style("padding", "6px")
                    .append("div").style("display", "flex").style("gap", "10px");
                acciones.append("img")
                    .attr("src", "images/editar.svg").attr("width", 20).attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => this.abrirModal("editar", d));
                acciones.append("img")
                    .attr("src", "images/eliminar.svg").attr("width", 20).attr("height", 20)
                    .style("cursor", "pointer")
                    .on("click", (event, d) => this.eliminar(d));
                // Otras columnas
                columnas.forEach((col, i) => {
                    tr.append("td")
                        .classed(`data-col-${i}`, true)
                        .style("border", "1px solid black")
                        .style("padding", "6px")
                        .text(d => { var _a; return (_a = d[col]) !== null && _a !== void 0 ? _a : "—"; });
                });
                return tr;
            }, update => {
                columnas.forEach((col, i) => {
                    update.select(`td.data-col-${i}`)
                        .text(d => { var _a; return (_a = d[col]) !== null && _a !== void 0 ? _a : "—"; });
                });
                return update;
            }, exit => exit.remove());
        }
    }
    usuarios.UsuariosApp = UsuariosApp;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=VistaUsuario.js.map