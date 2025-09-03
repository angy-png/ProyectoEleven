var generico;
(function (generico) {
    class ModeloBasewe {
        constructor() {
            this.items = new Map();
        }
        obtenerTodos() {
            return Array.from(this.items.values());
        }
        obtener(id) {
            return this.items.get(id);
        }
        agregar(item) {
            item.id = this.items.size + 1; // id incremental
            this.items.set(item.id, item);
        }
        editar(id, datos) {
            const existente = this.items.get(id);
            if (existente) {
                this.items.set(id, Object.assign(Object.assign({}, existente), datos));
            }
        }
        eliminar(id) {
            this.items.delete(id);
        }
    }
    generico.ModeloBasewe = ModeloBasewe;
})(generico || (generico = {}));
//# sourceMappingURL=ModelosGenerico.js.map