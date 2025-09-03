namespace empresas {
    export class ControladorEmpresas {
        private modelo: ModeloEmpresas;
        private vista: VistaEmpresas;
        public onEmpresasActualizadas?: (empresas: I_empresas[]) => void;


        constructor() {
            this.modelo = new ModeloEmpresas();
            this.vista = new VistaEmpresas();

            this.vista.onAgregarEditar = (modo, datos) => this.abrirModal(modo, datos);
            this.vista.onEliminar = (empresa) => this.eliminar(empresa);
            this.vista.onFiltrar = (texto) => this.filtrar(texto);
            this.vista.onOrdenar = (campo, asc) => {
                const datosOrdenados = usuarios.ordenar(this.modelo.obtenerTodos(), campo, asc);
                this.vista.renderTabla(datosOrdenados);
            };
        }

        // 🔹 Solo carga datos en el modelo
        public async cargar(recargarJson: boolean = true) {
            if (recargarJson) {
                const response = await fetch("./empresas.json");
                const data = await response.json();
                this.modelo.cargarDesdeJson(data);
            }
            // ❌ Ya no llamamos renderTabla aquí
        }

        private abrirModal(modo: "agregar" | "editar", datos?: I_empresas) {
            this.vista.mostrarModal(datos, (nuevaEmpresa) => {
                if (modo === "agregar") {
                    nuevaEmpresa.id = this.modelo.obtenerTodos().length + 1;
                    this.modelo.agregar(nuevaEmpresa as I_empresas);
                } else if (modo === "editar" && datos) {
                    this.modelo.actualizar(datos.id, nuevaEmpresa);
                }
                this.refrescarTabla();
            });
        }

        private eliminar(empresa: I_empresas): void {
            this.vista.mostrarConfirmacion(
                `¿Seguro que deseas eliminar la empresa "${empresa.nombre}"?`,
                () => {
                    this.modelo.eliminar(empresa.id);
                    this.refrescarTabla();
                }
            );
        }

        public obtenerTodos(): I_empresas[] {
            return this.modelo.obtenerTodos();
        }

        private filtrar(nombre: string): void {
            const filtrados = this.modelo.obtenerTodos().filter(e =>
                !nombre || e.nombre.toLowerCase().includes(nombre.toLowerCase())
            );
            this.vista.renderTabla(filtrados);
        }

        // 🔹 Ahora la tabla se dibuja aquí
        public abrirPantallaEmpresas(): void {
            this.refrescarTabla();
            this.vista.mostrar();
        }

        public cerrarPantallaEmpresas(): void {
            this.vista.ocultar();
        }

      private refrescarTabla(): void {
    const todas = this.modelo.obtenerTodos();
    this.vista.renderTabla(todas);
    this.onEmpresasActualizadas?.(todas); // 🔔 notificar
 
}
private refrescarUsuarios(): void {
    this.refrescarTabla(); // primero refresca tabla de empresas
    this.vista.onEmpresasActualizadas?.(this.modelo.obtenerTodos());
}



    }
}
