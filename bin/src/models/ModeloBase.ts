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
}
