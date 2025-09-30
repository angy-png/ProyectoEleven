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
                if (!this._circ)
                    this._circ = new circulos.SvgCirculo();
                this._circ.abrirPantallaCirculos();
                if (this._user)
                    this._user.cerrarPantallaUsuarios();
                if (this._empre)
                    this._empre.cerrarPantallaEmpresas();
            });
            d3.select("body")
                .append("button")
                .text("Usuarios")
                .on("click", () => {
                if (!this._empre)
                    this._empre = new empresas.C_empresas();
                if (!this._user) {
                    this._user = new usuarios.Usuarios(this._empre);
                    // Registra el callback
                    // Aquí se le pasa a setOnEmpresasChange una función que llama a renderTabla y llenarSelectEmpresas
                    this._empre.setOnEmpresasChange(() => {
                        this._user.renderTabla(Array.from(this._user.usuarios.values()));
                        //! que no es nulo 
                        this._user.llenarSelectEmpresas();
                    });
                }
                this._user.abrirPantallaUsuarios();
                if (this._circ)
                    this._circ.cerrarPantallaCirculos();
                if (this._empre)
                    this._empre.cerrarPantallaEmpresas();
            });
            d3.select("body")
                .append("button")
                .text("Empresas")
                .on("click", () => {
                if (!this._empre)
                    this._empre = new empresas.C_empresas();
                this._empre.abrirPantallaEmpresas();
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