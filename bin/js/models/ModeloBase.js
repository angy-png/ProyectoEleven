var base;
(function (base) {
    class ModeloBase {
        constructor() {
            this.items = new Map();
        }
        obtenerTodos() {
            return Array.from(this.items.values());
        }
        agregar(item) {
            this.items.set(item.id, item);
        }
        actualizar(id, parcial) {
            const existente = this.items.get(id);
            if (existente) {
                this.items.set(id, Object.assign(Object.assign({}, existente), parcial));
            }
        }
        eliminar(id) {
            this.items.delete(id);
        }
        limpiar() {
            this.items.clear();
        }
        cargarDesdeJson(data, mapper) {
            this.items.clear();
            for (const item of data) {
                const nuevo = mapper(item);
                this.items.set(nuevo.id, nuevo);
            }
        }
    }
    base.ModeloBase = ModeloBase;
})(base || (base = {}));
//# sourceMappingURL=ModeloBase.js.map