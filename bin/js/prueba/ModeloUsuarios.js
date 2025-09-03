var generico;
(function (generico) {
    class ModeloBase {
        constructor() {
            this.items = new Map();
        }
        obtenerTodos() {
            return Array.from(this.items.values());
        }
        obtener(id) {
            return this.items.get(id);
        }
        eliminar(id) {
            this.items.delete(id);
        }
        agregar(entidad) {
            entidad.id = this.items.size + 1; // asignar id incremental
            this.items.set(entidad.id, entidad);
        }
        editar(id, actualizado) {
            const existente = this.items.get(id);
            if (existente) {
                this.items.set(id, Object.assign(Object.assign({}, existente), actualizado));
            }
        }
        ordenar(propiedad, asc = true) {
            const todos = this.obtenerTodos();
            return ordenar(todos, propiedad, asc); // usas tu función genérica ordenar<T>
        }
    }
    generico.ModeloBase = ModeloBase;
})(generico || (generico = {}));
//# sourceMappingURL=ModeloUsuarios.js.map