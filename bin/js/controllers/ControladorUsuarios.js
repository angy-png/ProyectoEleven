var usuarios;
(function (usuarios) {
    class ControladorUsuarios extends controladorBase.controladorBase {
        constructor() {
            const modelo = new usuarios.ModeloUsuarios();
            const vista = new usuarios.VistaUsuarios();
            super(modelo, vista);
            // Callbacks adicionales específicos de usuarios
            this.vista.onFiltrar = (texto, idEmpresa) => this.filtrar(texto, idEmpresa);
            this.vista.onOrdenar = (campo, asc) => {
                const datosOrdenados = usuarios.ordenar(this.modelo.obtenerTodos(), campo, asc);
                this.vista.renderTabla(datosOrdenados);
            };
            // 🔹 Suscripción al callback de actualización de empresas
            this.vista.onEmpresasActualizadas = (listaEmpresas) => {
                this.vista.setEmpresas(listaEmpresas);
                this.vista.empresas = listaEmpresas;
                const texto = d3.select("#filtro-nombre").property("value") || "";
                const idEmpresa = Number(d3.select("#select-empresa").property("value") || 0);
                this.filtrar(texto, idEmpresa);
            };
            // Cargar datos
            this.cargar("./datos/datos.json");
        }
        // 👇 Solo métodos específicos de usuarios
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