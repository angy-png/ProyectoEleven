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
                    this._circ = new circulos.SvgCirculo();
                }
                this._circ.abrirPantallaCirculos();
                // Cerrar las otras si están abiertas
                if (this._user)
                    this._user.cerrarPantallaUsuarios();
                if (this._empre)
                    this._empre.cerrarPantallaEpresas();
            });
            d3.select("body")
                .append("button")
                .text("Usuarios")
                .on("click", () => {
                if (!this._user) {
                    this._user = new usuarios.Usuarios();
                }
                this._user.abrirPantallaUsuarios();
                // Cerrar las otras si están abiertas
                if (this._circ)
                    this._circ.cerrarPantallaCirculos();
                if (this._empre)
                    this._empre.cerrarPantallaEpresas();
            });
            d3.select("body")
                .append("button")
                .text("Empresas")
                .on("click", () => {
                if (!this._empre) {
                    this._empre = new empresas.C_empresas();
                }
                this._empre.abrirPantallaEmpresas();
                // Cerrar las otras si están abiertas
                if (this._circ)
                    this._circ.cerrarPantallaCirculos();
                if (this._user)
                    this._user.cerrarPantallaUsuarios();
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