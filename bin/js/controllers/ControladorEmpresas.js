var empresas;
(function (empresas_1) {
    class ControladorEmpresas extends controladorBase.controladorBase {
        constructor() {
            const modelo = new empresas_1.ModeloEmpresas();
            const vista = new empresas_1.VistaEmpresas();
            super(modelo, vista);
            this.vista.onFiltrar = (texto) => this.filtrar(texto);
            this.vista.onOrdenar = (campo, asc) => {
                const datosOrdenados = controladorBase.ordenar(this.modelo.obtenerTodos(), campo, asc);
                this.vista.renderTabla(datosOrdenados);
            };
            this.cargar("./datos/empresas.json").then(() => {
                if (this.onDatosCargados) {
                    this.onDatosCargados(this.modelo.obtenerTodos());
                }
            });
        }
        filtrar(nombre) {
            const filtrados = this.modelo.obtenerTodos().filter(u => {
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                return coincideNombre;
            });
            this.vista.renderTabla(filtrados);
        }
    }
    empresas_1.ControladorEmpresas = ControladorEmpresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=ControladorEmpresas.js.map