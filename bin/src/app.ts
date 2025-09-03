namespace app {
    export class main {
        _circ: circulos.ControladorCirculos | null = null;
        _user: usuarios.ControladorUsuarios | null = null;
        _empre: empresas.ControladorEmpresas | null = null;
        _empreMo: empresas.ModeloEmpresas | null = null;

        constructor() {
            this.inicializar();
        }

      private async inicializar() {
    // 1️⃣ Crear botones primero
    d3.select("body")
        .append("button")
        .text("Circulos")
        .on("click", () => {
            if (!this._circ) this._circ = new circulos.ControladorCirculos();
            this._circ.abrirPantallaCirculos();
            if (this._user) this._user.cerrarPantallaUsuarios();
            if (this._empre) this._empre.cerrarPantallaEmpresas();
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
            if (this._empre) this._empre.cerrarPantallaEmpresas();
            if (this._circ) this._circ.cerrarPantallaCirculos();
        });

    d3.select("body")
        .append("button")
        .text("Empresas")
        .on("click", () => {
            if (this._empre) this._empre.abrirPantallaEmpresas();
            if (this._user) this._user.cerrarPantallaUsuarios();
            if (this._circ) this._circ.cerrarPantallaCirculos();
        });

    d3.selectAll("button")
        .style("background", "#d9fab2ff")
        .style("margin", "10px")
        .style("padding", "10px 20px")
        .style("cursor", "pointer");

this._empre = new empresas.ControladorEmpresas();
await this._empre.cargar();
const listaEmpresas = this._empre.obtenerTodos();

this._empre.onEmpresasActualizadas = (empresas) => {
    if (this._user) {
        this._user["vista"].setEmpresas(empresas); // 🔄 recargar en Usuarios
    }
};

}

    }

    let _main: app.main = new app.main();
}
