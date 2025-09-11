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
            let datosAUsar = datos;
            // Si es edición, pide la versión actualizada al modelo
            if (modo === "editar" && datos) {
                const actualizado = this.modelo.obtenerPorId(datos.id);
                if (actualizado) {
                    datosAUsar = actualizado;
                }
            }
            this.vista.mostrarModal(datosAUsar, (nuevo) => {
                if (modo === "agregar") {
                    const todos = this.modelo.obtenerTodos();
                    let nuevoId;
                    if (todos.length > 0) {
                        const ids = todos.map(x => { var _a; return (_a = x.id) !== null && _a !== void 0 ? _a : 0; });
                        nuevoId = Math.max(...ids) + 1;
                    }
                    else {
                        nuevoId = 1;
                    }
                    nuevo.id = nuevoId;
                    this.modelo.agregar(nuevo);
                }
                else if (modo === "editar" && datosAUsar) {
                    this.modelo.actualizar(datosAUsar.id, nuevo);
                    // Mostrar en consola el objeto actualizado
                    const actualizado = this.modelo.obtenerPorId(datosAUsar.id);
                    console.log("Objeto actualizado:", actualizado);
                }
                this.refrescarTabla();
            });
        }
        eliminar(item) {
            const actualizado = this.modelo.obtenerTodos().find((x) => x.id === item.id);
            this.vista.mostrarConfirmacion(`¿Seguro que deseas eliminar "${(actualizado === null || actualizado === void 0 ? void 0 : actualizado.nombre) || (actualizado === null || actualizado === void 0 ? void 0 : actualizado.usuario)}"?`, () => {
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
                    return valorA.localeCompare(valorB);
                }
                else {
                    return valorB.localeCompare(valorA);
                }
            }
            if (typeof valorA === "number" && typeof valorB === "number") {
                if (asc) {
                    return valorA - valorB;
                }
                else {
                    return valorB - valorA;
                }
            }
            // typeof determina que tipo de dato es una variable 
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