var base;
(function (base) {
    class ModeloBase {
        constructor() {
            //T = el tipo genérico de los objetos (usuarios, empresas, etc.)
            //Partial<T> = permite actualizar solo algunos campos sin requerir todos
            //any = datos crudos   
            //mapper es una función de conversión que se defines para transformar ese raw en un objeto válido(T)
            this.items = new Map();
        }
        obtenerTodos() {
            return Array.from(this.items.values());
        }
        obtenerPorId(id) {
            return this.items.get(id);
        }
        agregar(item) {
            this.items.set(item.id, item);
        }
        actualizar(id, parcial) {
            const existente = this.items.get(id);
            if (existente) {
                // una combinación de ambos objetos
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
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const nuevo = mapper(item);
                this.items.set(nuevo.id, nuevo);
            }
        }
    }
    base.ModeloBase = ModeloBase;
})(base || (base = {}));
//# sourceMappingURL=ModeloBase.js.map