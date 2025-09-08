namespace controladorBase {
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
        public modelo: IModelo<T>;
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
                    // Obtener todos los elementos actuales
                    const todos = this.modelo.obtenerTodos();
                    let nuevoId: number;

                    if (todos.length > 0) {
                        // Obtener el ID más alto existente y sumarle 1
                        const ids = todos.map(x => (x as any).id ?? 0);
                        nuevoId = Math.max(...ids) + 1;
                    } else {
                        // Si no hay elementos, empezar desde 1
                        nuevoId = 1;
                    }

                    // Asignar el nuevo ID al objeto que vamos a agregar
                    (nuevo as any).id = nuevoId;

                    // Agregar el nuevo objeto al modelo
                    this.modelo.agregar(nuevo as T);

                } else if (modo === "editar" && datos) {
                    // Para edición, actualizar el objeto existente
                    this.modelo.actualizar((datos as any).id, nuevo);
                }

                // Refrescar la tabla para reflejar los cambios
                this.refrescarTabla();
            });
        }


        protected eliminar(item: T): void {
            const actualizado = this.modelo.obtenerTodos().find((x: any) => x.id === (item as any).id);

            this.vista.mostrarConfirmacion(
                `¿Seguro que deseas eliminar "${(actualizado as any)?.nombre || (actualizado as any)?.usuario}"?`,
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

    export function ordenar<T>(array: T[], propiedad: keyof T, asc: boolean = true) {
        return array.sort((a, b) => {
            const valorA = a[propiedad];
            const valorB = b[propiedad];

            if (typeof valorA === "string" && typeof valorB === "string") {
                if (asc) {
                    return valorA.localeCompare(valorB);
                } else {
                    return valorB.localeCompare(valorA);
                }
            }

            if (typeof valorA === "number" && typeof valorB === "number") {
                if (asc) {
                    return valorA - valorB;
                } else {
                    return valorB - valorA;
                }
            }

            if (typeof valorA === "boolean" && typeof valorB === "boolean") {
                if (asc) {
                    return Number(valorA) - Number(valorB);
                } else {
                    return Number(valorB) - Number(valorA);
                }
            }

            if (valorA instanceof Date && valorB instanceof Date) {
                if (asc) {
                    return valorA.getTime() - valorB.getTime();
                } else {
                    return valorB.getTime() - valorA.getTime();
                }
            }
            return 0;
        });
    }
}