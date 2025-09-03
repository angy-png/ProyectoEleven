var app;
(function (app) {
    class main {
        constructor() {
            this._circ = null;
            this._user = null;
            this._empre = null;
            d3.select("body")
                .append("button")
                .text("Circulos")
                .on("click", () => {
                if (!this._circ) {
                    this._circ = new circulos.ControladorCirculos();
                }
                this._circ.abrirPantallaCirculos();
                if (this._user)
                    this._user.cerrarPantallaUsuarios();
                if (this._empre)
                    this._empre.cerrarPantallaEmpresa();
            });
            d3.select("body")
                .append("button")
                .text("Usuarios")
                .on("click", () => {
                if (!this._user) {
                    this._user = new usuarios.ControladorUsuarios();
                }
                this._user.abrirPantallaUusuarios();
                if (this._empre)
                    this._empre.cerrarPantallaEmpresa();
                if (this._circ)
                    this._circ.cerrarPantallaCirculos();
            });
            d3.select("body")
                .append("button")
                .text("Empresas")
                .on("click", () => {
                if (!this._empre) {
                    this._empre = new empresas.ControladorEmpresa();
                }
                this._empre.abrirPantallaEmpresa();
                if (this._user)
                    this._user.cerrarPantallaUsuarios();
                if (this._circ)
                    this._circ.cerrarPantallaCirculos();
            });
            d3.selectAll("button")
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