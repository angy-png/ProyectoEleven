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
            this.columnaActiva = 'nombre';
            this.direccionActiva = 'asc';
            this.ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada");
                }
            });
            this.modelo = new usuarios.ModeloUsuarios();
            this.vista = new usuarios.VistaUsuarios(this.ventana);
            this.vista.crearControles();
            this.mostrarTabla();
            this.vista.crearModalUsuario();
            this.inicializar();
            this.vista.onFiltro((nombre, idEmpresa) => {
                this.filtrar(nombre, idEmpresa);
            });
        }
        abrirPantallaUusuarios() {
            this.ventana.mostrar();
        }
        cerrarPantallaUsuarios() {
            this.ventana.ocultar();
        }
        mostrarTabla() {
            return __awaiter(this, void 0, void 0, function* () {
                this.vista.crearTablaUser();
                yield this.modelo.cargarUser();
                this.actVistaUser();
                this.vista.onEliminar((usuario) => {
                    this.confirmarEliminar(usuario);
                });
            });
        }
        confirmarEliminar(usuario) {
            this.vista.mostrarModalEliminar(usuario.nombre, () => {
                this.modelo.eliminar(usuario.id);
                this.actVistaUser();
            });
        }
        inicializar() {
            this.vista.onGuardar((modo, datos) => {
                if (modo === "agregar") {
                    this.modelo.agregar(datos);
                }
                else if (modo === "editar") {
                    this.modelo.editar(datos.id, datos);
                }
                this.actVistaUser();
            });
            this.vista.onEliminar(usuario => {
                this.confirmarEliminar(usuario);
            });
            this.actVistaUser();
        }
        actVistaUser() {
            const datosUser = this.modelo.obtenerTodos();
            this.vista.renderizarUser(datosUser);
            const empresas = this.modelo.obtenerEmpresas();
            this.vista.renderSelectEmpresas(empresas);
        }
        filtrar(nombre, idEmpresa) {
            const filtrados = this.modelo.obtenerTodos()
                .filter(u => {
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                return coincideNombre && coincideEmpresa;
            });
            this.vista.renderizarUser(filtrados);
        }
    }
    usuarios.ControladorUsuarios = ControladorUsuarios;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=ControladorUsuarios.js.map