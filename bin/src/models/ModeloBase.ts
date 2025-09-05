namespace base {
    export class ModeloBase<T extends { id: number }> {
        protected items: Map<number, T> = new Map();
        public obtenerTodos(): T[] {
            return Array.from(this.items.values());
        }
        public agregar(item: T): void {
            this.items.set(item.id, item);
        }
        public actualizar(id: number, parcial: Partial<T>): void {
            const existente = this.items.get(id);
            if (existente) {
                this.items.set(id, { ...existente, ...parcial });
            }
        }
        public eliminar(id: number): void {
            this.items.delete(id);
        }
        public limpiar(): void {
            this.items.clear();
        }
        public cargarDesdeJson(data: any[], mapper: (raw: any) => T): void {
            this.items.clear();
            for (const item of data) {
                const nuevo = mapper(item);
                this.items.set(nuevo.id, nuevo);
            }
        }
    }

    
  export function ordenar<T>(array: T[], propiedad: keyof T, asc: boolean = true) {
        return array.sort((a, b) => {
            const valorA = a[propiedad];
            const valorB = b[propiedad];

            if (typeof valorA === "string" && typeof valorB === "string") {
                if (asc) {
                    return valorA.localeCompare(valorB); // ascendente
                } else {
                    return valorB.localeCompare(valorA); // descendente
                }
            }

            if (typeof valorA === "number" && typeof valorB === "number") {
                if (asc) {
                    return valorA - valorB; // ascendente
                } else {
                    return valorB - valorA; // descendente
                }
            }

            if (typeof valorA === "boolean" && typeof valorB === "boolean"){
                if(asc){
                    return Number(valorA) - Number(valorB); 
                }else{
                    return Number (valorB) - Number(valorA);
                }
            }

            if(valorA instanceof Date && valorB instanceof Date){
                if(asc){
                    return valorA.getTime() - valorB.getTime(); 
                }else{
                    return valorB.getTime() - valorA.getTime();
                }

            }

            return 0;
        });

    }
}
