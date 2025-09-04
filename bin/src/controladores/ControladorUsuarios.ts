namespace usuarios {
    export class ControladorUsuarios 
        extends controladorBase.controladorBase<I_Usuarios, VistaUsuarios> {
        
        constructor() {
            const modelo = new ModeloUsuarios();
            const vista = new VistaUsuarios();
            super(modelo, vista);

            // Callbacks adicionales específicos de usuarios
            this.vista.onFiltrar = (texto, idEmpresa) => this.filtrar(texto, idEmpresa);
            this.vista.onOrdenar = (campo, asc) => {
                const datosOrdenados = ordenar(this.modelo.obtenerTodos(), campo, asc);
                this.vista.renderTabla(datosOrdenados);
            };

            // 🔹 Suscripción al callback de actualización de empresas
            this.vista.onEmpresasActualizadas = (listaEmpresas) => {
                this.vista.setEmpresas(listaEmpresas);
                this.vista.empresas = listaEmpresas;

                const texto = d3.select<HTMLInputElement, unknown>("#filtro-nombre").property("value") || "";
                const idEmpresa = Number(d3.select<HTMLSelectElement, unknown>("#select-empresa").property("value") || 0);
                this.filtrar(texto, idEmpresa);
            };

            // Cargar datos
            this.cargar("./datos.json");
        }

        // 👇 Solo métodos específicos de usuarios
        private filtrar(nombre: string, idEmpresa: number): void {
            const filtrados = this.modelo.obtenerTodos().filter(u => {
                const nombreEmpresa = this.vista.empresas.find(e => e.id === u.id_empresa)?.nombre || "";
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                return coincideNombre && coincideEmpresa;
            });
            this.vista.renderTabla(filtrados);
        }
    }
}
