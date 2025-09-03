namespace app {
    export class main {
        _circ: circulos.ControladorCirculos | null = null;
        _user: usuarios.ControladorUsuarios | null = null;
        _empre: empresas.ControladorEmpresa | null = null;

        constructor() {
            d3.select("body")
                .append("button")
                .text("Circulos")
                .on("click", () => {
                    if (!this._circ) {
                        this._circ = new circulos.ControladorCirculos();
                    }
                    this._circ.abrirPantallaCirculos();
                    
                    if (this._user) this._user.cerrarPantallaUsuarios();
                    if (this._empre) this._empre.cerrarPantallaEmpresa();
                });

            d3.select("body")
                .append("button")
                .text("Usuarios")
                .on("click", () => {
                    if (!this._user) {
                        this._user = new usuarios.ControladorUsuarios();
                    }
                    this._user.abrirPantallaUusuarios();

                    if (this._empre) this._empre.cerrarPantallaEmpresa();
                    if (this._circ) this._circ.cerrarPantallaCirculos();
                });

            d3.select("body")
                .append("button")
                .text("Empresas")
                .on("click", () => {
                    if (!this._empre) {
                        this._empre = new empresas.ControladorEmpresa();
                    }
                    this._empre.abrirPantallaEmpresa();

                    if (this._user) this._user.cerrarPantallaUsuarios();
                    if (this._circ) this._circ.cerrarPantallaCirculos();
                });

            d3.selectAll("button")
                .style("background", "#d9fab2ff")
                .style("margin", "10px")
                .style("padding", "10px 20px")
                .style("cursor", "pointer");
        }
    }
    let _main: app.main = new app.main();
}
