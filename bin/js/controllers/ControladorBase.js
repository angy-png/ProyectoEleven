var controladorBase;
(function (controladorBase_1) {
    class controladorBase {
        constructor(modelo, vista) {
            this.modelo = modelo;
            this.vista = vista;
            this.inicializarCallbacks();
        }
        inicializarCallbacks() {
            this.vista.onAgregarEditar = (modo, datos) => this.abrirModal(modo, datos);
            this.vista.onEliminar = (item) => this.eliminar(item);
        }
        abrirModal(modo, datos) {
            this.vista.mostrarModal(datos, (nuevo) => {
                if (modo === "agregar") {
                    const nuevoId = this.modelo.obtenerTodos().length > 0
                        ? Math.max(...this.modelo.obtenerTodos().map((x) => { var _a; return ((_a = x.id) !== null && _a !== void 0 ? _a : 0); })) + 1
                        : 1;
                    nuevo.id = nuevoId;
                    this.modelo.agregar(nuevo);
                }
                else if (modo === "editar" && datos) {
                    this.modelo.actualizar(datos.id, nuevo);
                }
                this.refrescarTabla();
            });
        }
        eliminar(item) {
            this.vista.mostrarConfirmacion(`¿Seguro que deseas eliminar "${item.nombre || item.usuario}"?`, () => {
                this.modelo.eliminar(item.id);
                this.refrescarTabla();
            });
        }
        refrescarTabla() {
            const todos = this.modelo.obtenerTodos();
            this.vista.renderTabla(todos);
        }
        cargar(dataUrl) {
            return fetch(dataUrl)
                .then(res => res.json())
                .then(data => {
                this.modelo.cargarDesdeJson(data);
                this.refrescarTabla();
            });
        }
        abrirPantalla() {
            this.refrescarTabla();
            this.vista.mostrar();
        }
        cerrarPantalla() {
            this.vista.ocultar();
        }
    }
    controladorBase_1.controladorBase = controladorBase;
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
    controladorBase_1.ordenar = ordenar;
})(controladorBase || (controladorBase = {}));
//# sourceMappingURL=ControladorBase.js.map