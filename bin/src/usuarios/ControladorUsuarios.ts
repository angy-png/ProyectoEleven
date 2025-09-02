namespace usuarios {

    export class ControladorUsuarios {
        private modelo: ModeloUsuarios;
        private vista: VistaUsuarios;
        private ventana: ventanaControl.ventanaControl;

        private columnaActiva: keyof I_Usuarios = 'nombre';
private direccionActiva: 'asc' | 'desc' = 'asc';
        constructor() {
            this.ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada")
                }
            });

            this.modelo = new ModeloUsuarios();
            this.vista = new VistaUsuarios(this.ventana);

            this.vista.crearControles();
            this.mostrarTabla();
            this.vista.crearModalUsuario();
            this.inicializar();
            this.vista.onFiltro((nombre, idEmpresa) => {
                this.filtrar(nombre, idEmpresa);
            });
        }

        public abrirPantallaUusuarios(): void {
            this.ventana.mostrar();
        }

        public cerrarPantallaUsuarios(): void {
            this.ventana.ocultar();
        }

        public async mostrarTabla(): Promise<void> {
            this.vista.crearTablaUser();
            await this.modelo.cargarUser();
            this.actVistaUser();
            this.vista.onEliminar((usuario: I_Usuarios) => {
                this.confirmarEliminar(usuario);
            });
        }

        private confirmarEliminar(usuario: I_Usuarios) {
            this.vista.mostrarModalEliminar(usuario.nombre, () => {
                this.modelo.eliminar(usuario.id);
                this.actVistaUser();
            });
        }

        public inicializar(): void {
            this.vista.onGuardar((modo, datos) => {
                if (modo === "agregar") {
                    this.modelo.agregar(datos as I_Usuarios);
                } else if (modo === "editar") {
                    this.modelo.editar((datos as I_Usuarios).id, datos);
                }
                this.actVistaUser();
            });

            this.vista.onEliminar(usuario => {
                this.confirmarEliminar(usuario);
            });
            this.actVistaUser();
        }

        private actVistaUser(): void {
            const datosUser = this.modelo.obtenerTodos();
            this.vista.renderizarUser(datosUser);
            const empresas = this.modelo.obtenerEmpresas();
            this.vista.renderSelectEmpresas(empresas);

        }
        private filtrar(nombre: string, idEmpresa: number) {
            const filtrados = this.modelo.obtenerTodos()
                .filter(u => {
                    const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                    const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                    return coincideNombre && coincideEmpresa;
                });
            this.vista.renderizarUser(filtrados);
        }
 
 

    }
}