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
            this._empre = null;
            this._empreMo = null;
            this.inicializar();
        }
        inicializar() {
            return __awaiter(this, void 0, void 0, function* () {
                // 1️⃣ Crear botones primero
                d3.select("body")
                    .append("button")
                    .text("Circulos")
                    .on("click", () => {
                    if (!this._circ)
                        this._circ = new circulos.ControladorCirculos();
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
                    if (!this._user) {
                        this._user = new usuarios.ControladorUsuarios();
                        this._user["vista"].setEmpresas(listaEmpresas);
                    }
                    this._user.abrirPantallaUsuarios();
                    if (this._empre)
                        this._empre.cerrarPantallaEmpresas();
                    if (this._circ)
                        this._circ.cerrarPantallaCirculos();
                });
                d3.select("body")
                    .append("button")
                    .text("Empresas")
                    .on("click", () => {
                    if (this._empre)
                        this._empre.abrirPantallaEmpresas();
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
                this._empre = new empresas.ControladorEmpresas();
                yield this._empre.cargar();
                const listaEmpresas = this._empre.obtenerTodos();
                this._empre.onEmpresasActualizadas = (empresas) => {
                    if (this._user) {
                        this._user["vista"].setEmpresas(empresas); // 🔄 recargar en Usuarios
                    }
                };
            });
        }
    }
    app.main = main;
    let _main = new app.main();
})(app || (app = {}));
//# sourceMappingURL=app.js.map