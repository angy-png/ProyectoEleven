var empresas;
(function (empresas) {
    class ControladorEmpresas extends controladorBase.controladorBase {
        constructor() {
            const modelo = new empresas.ModeloEmpresas();
            const vista = new empresas.VistaEmpresas();
            super(modelo, vista);
            this.vista.onFiltrar = (texto) => this.filtrar(texto);
            this.vista.onOrdenar = (campo, asc) => {
                const datosOrdenados = controladorBase.ordenar(this.modelo.obtenerTodos(), campo, asc);
                this.vista.renderTabla(datosOrdenados);
            };
            this.cargar("./datos/empresas.json");
        }
        filtrar(nombre) {
            const filtrados = this.modelo.obtenerTodos().filter(u => {
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                return coincideNombre;
            });
            this.vista.renderTabla(filtrados);
        }
    }
    empresas.ControladorEmpresas = ControladorEmpresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=ControladorEmpresas.js.map