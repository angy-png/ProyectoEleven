namespace usuarios {
    export class ControladorUsuarios
        extends controladorBase.controladorBase<I_Usuarios, VistaUsuarios> {

        constructor() {
            const modelo = new ModeloUsuarios();
            const vista = new VistaUsuarios();
            super(modelo, vista);

            this.vista.onFiltrar = (texto, idEmpresa) => this.filtrar(texto, idEmpresa);

            this.vista.onOrdenar = (campo, asc) => {
                const datosOrdenados = controladorBase.ordenar(this.modelo.obtenerTodos(), campo, asc);
                this.vista.renderTabla(datosOrdenados);
            };
            this.cargar("./datos/datos.json");
        }

        private filtrar(nombre: string, idEmpresa: number): void {
            const filtrados = this.modelo.obtenerTodos().filter(u => {
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                return coincideNombre && coincideEmpresa;
            });
            this.vista.renderTabla(filtrados);
        }

        // recibe empresas, y ordena a la vista sincronizar el UI de usuarios con ese nuevo catálogo 
        public setEmpresas(empresas: empresas.I_empresas[]) { //recibe empresas 
            console.log("Usuarios recibió empresas:", empresas);
            this.vista.actualizarEmpresas(empresas, this.modelo.obtenerTodos());
        }




    }
}
