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
    function ordenar(array, propiedad, asc = true) {
        return array.sort((a, b) => {
            const valorA = a[propiedad];
            const valorB = b[propiedad];
            if (typeof valorA === "string" && typeof valorB === "string") {
                if (asc) {
                    return valorA.localeCompare(valorB); // ascendente
                }
                else {
                    return valorB.localeCompare(valorA); // descendente
                }
            }
            if (typeof valorA === "number" && typeof valorB === "number") {
                if (asc) {
                    return valorA - valorB; // ascendente
                }
                else {
                    return valorB - valorA; // descendente
                }
            }
            if (typeof valorA === "boolean" && typeof valorB === "boolean") {
                if (asc) {
                    return Number(valorA) - Number(valorB);
                }
                else {
                    return Number(valorB) - Number(valorA);
                }
            }
            if (valorA instanceof Date && valorB instanceof Date) {
                if (asc) {
                    return valorA.getTime() - valorB.getTime();
                }
                else {
                    return valorB.getTime() - valorA.getTime();
                }
            }
            return 0;
        });
    }
    base.ordenar = ordenar;
})(base || (base = {}));
//# sourceMappingURL=ModeloBase.js.map