var generico;
(function (generico) {
    class ControladorBase {
        constructor(modelo) {
            this.modelo = modelo;
        }
        obtenerTodos() {
            return this.modelo.obtenerTodos();
        }
        obtener(id) {
            return this.modelo.obtener(id);
        }
        eliminar(id) {
            this.modelo.eliminar(id);
        }
        agregar(entidad) {
            this.modelo.agregar(entidad);
        }
        editar(id, entidad) {
            this.modelo.editar(id, entidad);
        }
        ordenar(campo, asc = true) {
            return this.modelo.ordenar(campo, asc);
        }
    }
    generico.ControladorBase = ControladorBase;
})(generico || (generico = {}));
//# sourceMappingURL=controlGenerico.js.map