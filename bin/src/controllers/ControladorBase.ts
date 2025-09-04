namespace controladorBase{
    // ---------------- Interfaces y Base ----------------
export interface IVista<T> {
    onAgregarEditar?: (modo: "agregar" | "editar", datos?: T) => void;
    onEliminar?: (item: T) => void;
    mostrarModal(datos?: T, callback?: (nuevo: Partial<T>) => void): void;
    mostrarConfirmacion(mensaje: string, callback: () => void): void;
    renderTabla(items: T[]): void;
    mostrar(): void;
    ocultar(): void;
}

export interface IModelo<T> {
    obtenerTodos(): T[];
    agregar(item: T): void;
    actualizar(id: number, item: Partial<T>): void;
    eliminar(id: number): void;
    cargarDesdeJson(data: any[]): void;
}

export abstract class controladorBase<T, V extends IVista<T>> {
    protected modelo: IModelo<T>;
    protected vista: V;

    constructor(modelo: IModelo<T>, vista: V) {
        this.modelo = modelo;
        this.vista = vista;
        this.inicializarCallbacks();
    }

    protected inicializarCallbacks(): void {
        this.vista.onAgregarEditar = (modo: "agregar" | "editar", datos?: T) => this.abrirModal(modo, datos);
        this.vista.onEliminar = (item: T) => this.eliminar(item);
    }

    protected abrirModal(modo: "agregar" | "editar", datos?: T): void {
        this.vista.mostrarModal(datos, (nuevo: Partial<T>) => {
            if (modo === "agregar") {
                const nuevoId = this.modelo.obtenerTodos().length > 0
                    ? Math.max(...this.modelo.obtenerTodos().map((x: any) => (x.id ?? 0))) + 1
                    : 1;
                (nuevo as any).id = nuevoId;
                this.modelo.agregar(nuevo as T);
            } else if (modo === "editar" && datos) {
                this.modelo.actualizar((datos as any).id, nuevo);
            }
            this.refrescarTabla();
        });
    }

    protected eliminar(item: T): void {
        this.vista.mostrarConfirmacion(
            `¿Seguro que deseas eliminar "${(item as any).nombre || (item as any).usuario}"?`,
            () => {
                this.modelo.eliminar((item as any).id);
                this.refrescarTabla();
            }
        );
    }

    protected refrescarTabla(): void {
        const todos = this.modelo.obtenerTodos();
        this.vista.renderTabla(todos);
    }

    public cargar(dataUrl: string): Promise<void> {
        return fetch(dataUrl)
            .then(res => res.json())
            .then(data => {
                this.modelo.cargarDesdeJson(data);
                this.refrescarTabla();
            });
    }

    public abrirPantalla(): void {
        this.refrescarTabla();
        this.vista.mostrar();
    }

    public cerrarPantalla(): void {
        this.vista.ocultar();
    }
}

}