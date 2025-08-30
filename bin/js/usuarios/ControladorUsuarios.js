var usuarios;
(function (usuarios) {
    class ControladorUsuarios {
        constructor() {
            this.ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 200,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada");
                }
            });
            this.modelo = new usuarios.ModeloUsuarios();
            this.vista = new usuarios.VistaUsuarios(this.ventana);
        }
        abrirPantallaUusuarios() {
            this.ventana.mostrar();
        }
        cerrarPantallaUsuarios() {
            this.ventana.ocultar();
        }
    }
    usuarios.ControladorUsuarios = ControladorUsuarios;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=ControladorUsuarios.js.map