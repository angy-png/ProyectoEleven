var generico;
(function (generico) {
    class ControladorBase {
        constructor(modelo, vista) {
            this.modelo = modelo;
            this.vista = vista;
        }
        // Agregar cualquier entidad    
        agregar(item) {
            this.modelo.agregar(item);
            this.actualizarVista();
        }
        // Editar por ID
        editar(id, datos) {
            this.modelo.editar(id, datos);
            this.actualizarVista();
        }
        // Eliminar por ID con confirmación
        eliminar(id) {
            this.vista.mostrarModalConfirmacion("¿Deseas eliminar este elemento?", () => {
                this.modelo.eliminar(id);
                this.actualizarVista();
            });
        }
        // Refrescar la vista
        actualizarVista() {
            const datos = this.modelo.obtenerTodos();
            this.vista.actualizarTabla(datos);
        }
    }
    generico.ControladorBase = ControladorBase;
})(generico || (generico = {}));
//# sourceMappingURL=ControladorGenerico.js.map