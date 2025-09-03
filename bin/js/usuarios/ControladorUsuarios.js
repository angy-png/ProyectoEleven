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
    class ControladorUsuarios {
        constructor() {
            this.modelo = new usuarios.ModeloUsuarios();
            this.vista = new usuarios.VistaUsuarios();
            // Callbacks de usuario
            this.vista.onAgregarEditar = (modo, datos) => this.abrirModal(modo, datos);
            this.vista.onEliminar = (usuario) => this.eliminar(usuario);
            this.vista.onFiltrar = (texto, idEmpresa) => this.filtrar(texto, idEmpresa);
            this.vista.onOrdenar = (campo, asc) => {
                const datosOrdenados = usuarios.ordenar(this.modelo.obtenerTodos(), campo, asc);
                this.vista.renderTabla(datosOrdenados);
            };
            // 🔹 Suscripción al callback de actualización de empresas
            this.vista.onEmpresasActualizadas = (listaEmpresas) => {
                // Actualiza select y propiedad interna
                this.vista.setEmpresas(listaEmpresas);
                this.vista.empresas = listaEmpresas;
                // Refresca la tabla con filtros actuales
                const texto = d3.select("#filtro-nombre").property("value") || "";
                const idEmpresa = Number(d3.select("#select-empresa").property("value") || 0);
                this.filtrar(texto, idEmpresa);
            };
            this.cargar();
        }
        cargar() {
            return __awaiter(this, arguments, void 0, function* (recargarJson = true) {
                if (recargarJson) {
                    const response = yield fetch("./datos.json");
                    const data = yield response.json();
                    this.modelo.cargarDesdeJson(data);
                }
                this.vista.renderTabla(this.modelo.obtenerTodos());
            });
        }
        abrirModal(modo, datos) {
            this.vista.mostrarModal(datos, (nuevoUsuario) => {
                if (modo === "agregar") {
                    nuevoUsuario.id = this.modelo.obtenerTodos().length + 1;
                    this.modelo.agregar(nuevoUsuario);
                }
                else if (modo === "editar" && datos) {
                    this.modelo.actualizar(datos.id, nuevoUsuario);
                }
                this.cargar(false);
            });
        }
        eliminar(usuario) {
            this.vista.mostrarConfirmacion(`¿Seguro que deseas eliminar al usuario "${usuario.nombre}"?`, () => {
                this.modelo.eliminar(usuario.id);
                this.cargar(false);
            });
        }
        filtrar(nombre, idEmpresa) {
            const filtrados = this.modelo.obtenerTodos().filter(u => {
                var _a;
                const nombreEmpresa = ((_a = this.vista.empresas.find(e => e.id === u.id_empresa)) === null || _a === void 0 ? void 0 : _a.nombre) || "";
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                return coincideNombre && coincideEmpresa;
            });
            this.vista.renderTabla(filtrados);
        }
        abrirPantallaUsuarios() { this.vista.mostrar(); }
        cerrarPantallaUsuarios() { this.vista.ocultar(); }
    }
    usuarios.ControladorUsuarios = ControladorUsuarios;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=ControladorUsuarios.js.map