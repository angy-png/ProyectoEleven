namespace empresas {
    export class ControladorEmpresas
        extends controladorBase.controladorBase<I_empresas, VistaEmpresas> {

        // Callback opcional cuando los datos ya se cargaron
        public onDatosCargados?: (empresas: I_empresas[]) => void;

        constructor() {
            const modelo = new ModeloEmpresas();
            const vista = new VistaEmpresas();
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

        private filtrar(nombre: string): void {
            const filtrados = this.modelo.obtenerTodos().filter(u => {
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                return coincideNombre;
            });
            this.vista.renderTabla(filtrados);
        }
    }
}
