var generico;
(function (generico) {
    class ControladorBase {
        constructor(modelo, vista // la vista concreta (Usuarios, Productos, etc.)
        ) {
            this.modelo = modelo;
            this.vista = vista;
        }
        inicializar() {
            // Render inicial
            this.vista.renderizarUser(this.modelo.obtenerTodos());
            // Conectar eventos
            if (this.vista.onGuardar)
                this.vista.onGuardar((modo, datos) => {
                    if (modo === "agregar") {
                        const nuevoId = this.generarId();
                        this.modelo.agregar(Object.assign(Object.assign({}, datos), { id: nuevoId }));
                    }
                    else {
                        this.modelo.editar(datos);
                    }
                    this.vista.renderizarUser(this.modelo.obtenerTodos());
                });
            if (this.vista.onEliminar)
                this.vista.onEliminar((usuario) => {
                    this.modelo.eliminar(usuario.id);
                    this.vista.renderizarUser(this.modelo.obtenerTodos());
                });
            if (this.vista.onOrdenar)
                this.vista.onOrdenar((campo, asc) => {
                    const ordenados = this.modelo.ordenar(campo, asc);
                    this.vista.renderizarUser(ordenados);
                });
        }
        generarId() {
            return Math.max(0, ...Array.from(this.modelo.items.keys())) + 1;
        }
    }
    generico.ControladorBase = ControladorBase;
})(generico || (generico = {}));
//# sourceMappingURL=controladorBase.js.map