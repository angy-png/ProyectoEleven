var app;
(function (app) {
    class main {
        constructor() {
            this._circ = null;
            this._user = null;
            this._emp = null;
            this._contenedorBotones = d3.select("body")
                .append("div")
                .attr("id", "botones-arriba")
                .style("margin-bottom", "20px");
            this.inicializarEmpresas();
            this.inicializarBotones();
        }
        inicializarEmpresas() {
            if (!this._emp) {
                this._emp = new empresas.ControladorEmpresas();
                this._emp.onCambioEmpresas = (listaEmpresas) => {
                    console.log("Empresas cambiadas, actualizando usuarios");
                    if (this._user) {
                        this._user.setEmpresas(listaEmpresas);
                    }
                };
            }
        }
        inicializarBotones() {
            this._contenedorBotones
                .append("button")
                .text("Circulos")
                .on("click", () => {
                if (!this._circ)
                    this._circ = new circulos.ControladorCirculos();
                this._circ.abrirPantallaCirculos();
                if (this._user)
                    this._user.cerrarPantalla();
                if (this._emp)
                    this._emp.cerrarPantalla();
            });
            this._contenedorBotones
                .append("button")
                .text("Usuarios")
                .on("click", () => {
                if (!this._user) {
                    this._user = new usuarios.ControladorUsuarios();
                    //Pasar empresas si ya existen
                    if (this._emp) {
                        this._user.setEmpresas(this._emp.modelo.obtenerTodos());
                    }
                }
                this._user.abrirPantalla();
                if (this._circ)
                    this._circ.cerrarPantallaCirculos();
                if (this._emp)
                    this._emp.cerrarPantalla();
            });
            this._contenedorBotones
                .append("button")
                .text("Empresas")
                .on("click", () => {
                if (this._emp) {
                    this._emp.abrirPantalla();
                }
                if (this._user)
                    this._user.cerrarPantalla();
                if (this._circ)
                    this._circ.cerrarPantallaCirculos();
            });
            this._contenedorBotones.selectAll("button")
                .style("background", "#d9fab2ff")
                .style("margin", "10px")
                .style("padding", "10px 20px")
                .style("cursor", "pointer");
        }
    }
    app.main = main;
    let _main = new app.main();
})(app || (app = {}));
//# sourceMappingURL=app.js.map