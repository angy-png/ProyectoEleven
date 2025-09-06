var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var app;
(function (app) {
    class main {
        constructor() {
            this._circ = null;
            this._user = null;
            this._emp = null;
            this.inicializar();
        }
        inicializar() {
            return __awaiter(this, void 0, void 0, function* () {
                d3.select("body")
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
                d3.select("body")
                    .append("button")
                    .text("Usuarios")
                    .on("click", () => {
                    if (!this._user)
                        this._user = new usuarios.ControladorUsuarios();
                    this._user.abrirPantalla();
                    if (this._circ)
                        this._circ.cerrarPantallaCirculos();
                    if (this._emp)
                        this._emp.cerrarPantalla();
                });
                d3.select("body")
                    .append("button")
                    .text("Empresas")
                    .on("click", () => {
                    if (!this._emp)
                        this._emp = new empresas.ControladorEmpresas();
                    this._emp.abrirPantalla();
                    if (this._user)
                        this._user.cerrarPantalla();
                    if (this._circ)
                        this._circ.cerrarPantallaCirculos();
                });
                d3.selectAll("button")
                    .style("background", "#d9fab2ff")
                    .style("margin", "10px")
                    .style("padding", "10px 20px")
                    .style("cursor", "pointer");
            });
        }
    }
    app.main = main;
    let _main = new app.main();
})(app || (app = {}));
//# sourceMappingURL=app.js.map