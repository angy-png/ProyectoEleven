namespace base {
    export class ModeloBase<T extends { id: number }> {

        //T = el tipo genérico de los objetos (usuarios, empresas, etc.)
        //Partial<T> = permite actualizar solo algunos campos sin requerir todos
        //any = datos crudos   
        //mapper es una función de conversión que se defines para transformar ese raw en un objeto válido(T)

        protected items: Map<number, T> = new Map();
        public obtenerTodos(): T[] {
            return Array.from(this.items.values());
        }

        public obtenerPorId(id: number): T | undefined {
            return this.items.get(id);
        }

        public agregar(item: T): void {
            this.items.set(item.id, item);
        }
        public actualizar(id: number, parcial: Partial<T>): void {
            const existente = this.items.get(id);
            if (existente) {
                // una combinación de ambos objetos
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
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const nuevo = mapper(item);
                this.items.set(nuevo.id, nuevo);
            }

        }
    }
}
