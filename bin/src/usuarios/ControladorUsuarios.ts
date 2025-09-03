namespace usuarios {
    export class ControladorUsuarios {
        private modelo: ModeloUsuarios;
        private vista: VistaUsuarios;

        constructor() {
            this.modelo = new ModeloUsuarios();
            this.vista = new VistaUsuarios();

            // Callbacks de usuario
            this.vista.onAgregarEditar = (modo, datos) => this.abrirModal(modo, datos);
            this.vista.onEliminar = (usuario) => this.eliminar(usuario);
            this.vista.onFiltrar = (texto, idEmpresa) => this.filtrar(texto, idEmpresa);
            this.vista.onOrdenar = (campo, asc) => {
                const datosOrdenados = ordenar(this.modelo.obtenerTodos(), campo, asc);
                this.vista.renderTabla(datosOrdenados);
            };

            // 🔹 Suscripción al callback de actualización de empresas
            this.vista.onEmpresasActualizadas = (listaEmpresas) => {
                // Actualiza select y propiedad interna
                this.vista.setEmpresas(listaEmpresas);
                this.vista.empresas = listaEmpresas;

                // Refresca la tabla con filtros actuales
                const texto = d3.select<HTMLInputElement, unknown>("#filtro-nombre").property("value") || "";
                const idEmpresa = Number(d3.select<HTMLSelectElement, unknown>("#select-empresa").property("value") || 0);
                this.filtrar(texto, idEmpresa);
            };

            this.cargar();
        }

        private async cargar(recargarJson: boolean = true) {
            if (recargarJson) {
                const response = await fetch("./datos.json");
                const data = await response.json();
                this.modelo.cargarDesdeJson(data);
            }
            this.vista.renderTabla(this.modelo.obtenerTodos());
        }

        private abrirModal(modo: "agregar" | "editar", datos?: I_Usuarios) {
            this.vista.mostrarModal(datos, (nuevoUsuario) => {
                if (modo === "agregar") {
                    nuevoUsuario.id = this.modelo.obtenerTodos().length + 1;
                    this.modelo.agregar(nuevoUsuario as I_Usuarios);
                } else if (modo === "editar" && datos) {
                    this.modelo.actualizar(datos.id, nuevoUsuario);
                }
                this.cargar(false);
            });
        }

        private eliminar(usuario: I_Usuarios): void {
            this.vista.mostrarConfirmacion(
                `¿Seguro que deseas eliminar al usuario "${usuario.nombre}"?`,
                () => {
                    this.modelo.eliminar(usuario.id);
                    this.cargar(false);
                }
            );
        }

        private filtrar(nombre: string, idEmpresa: number): void {
            const filtrados = this.modelo.obtenerTodos().filter(u => {
                const nombreEmpresa = this.vista.empresas.find(e => e.id === u.id_empresa)?.nombre || "";
                const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                return coincideNombre && coincideEmpresa;
            });
            this.vista.renderTabla(filtrados);
        }

        public abrirPantallaUsuarios(): void { this.vista.mostrar(); }
        public cerrarPantallaUsuarios(): void { this.vista.ocultar(); }
    }
}
