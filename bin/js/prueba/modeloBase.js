var generico;
(function (generico) {
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
        editar(item) {
            if (this.items.has(item.id))
                this.items.set(item.id, item);
        }
        eliminar(id) {
            this.items.delete(id);
        }
        ordenar(propiedad, asc = true) {
            return ordenar(this.obtenerTodos(), propiedad, asc);
        }
    }
    generico.ModeloBase = ModeloBase;
    function ordenar(array, propiedad, asc = true) {
        return array.sort((a, b) => {
            const valorA = a[propiedad];
            const valorB = b[propiedad];
            if (valorA instanceof Date && valorB instanceof Date) {
                return asc ? valorA.getTime() - valorB.getTime() : valorB.getTime() - valorA.getTime();
            }
            else if (typeof valorA === 'number' && typeof valorB === 'number') {
                return asc ? valorA - valorB : valorB - valorA;
            }
            else if (typeof valorA === 'string' && typeof valorB === 'string') {
                return asc ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
            }
            else if (typeof valorA === 'boolean' && typeof valorB === 'boolean') {
                return asc ? Number(valorA) - Number(valorB) : Number(valorB) - Number(valorA);
            }
            return 0;
        });
    }
    generico.ordenar = ordenar;
})(generico || (generico = {}));
//# sourceMappingURL=modeloBase.js.map