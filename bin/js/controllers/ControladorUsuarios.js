var usuarios;
(function (usuarios) {
    class ControladorUsuarios extends controladorBase.controladorBase {
        constructor() {
            const modelo = new usuarios.ModeloUsuarios();
            const vista = new usuarios.VistaUsuarios();
            super(modelo, vista);
            this.vista.onFiltrar = (texto, idEmpresa) => this.filtrar(texto, idEmpresa);
            this.vista.onOrdenar = (campo, asc) => {
                const datosOrdenados = controladorBase.ordenar(this.modelo.obtenerTodos(), campo, asc);
                this.vista.renderTabla(datosOrdenados);
            };
            this.cargar("./datos/datos.json");
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
    }
    usuarios.ControladorUsuarios = ControladorUsuarios;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=ControladorUsuarios.js.map