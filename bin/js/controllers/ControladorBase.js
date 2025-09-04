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
})(controladorBase || (controladorBase = {}));
//# sourceMappingURL=ControladorBase.js.map