namespace app {
    export class main {
        _circ: circulos.SvgCirculo | null = null;
        _user: usuarios.Usuarios | null = null;
        _emp: empresas.C_empresas | null = null;
        _contenedorBotones: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

        constructor() {
            this._contenedorBotones = d3.select("body")
                .append("div")
                .attr("id", "botones-arriba")
                .style("margin-bottom", "20px");

            this.inicializarBotones(); 
        }

        private inicializarBotones() {
            this._contenedorBotones
                .append("button")
                .text("Circulos")
                .on("click", () => {
                    if (!this._circ) this._circ = new circulos.SvgCirculo();
                    this._circ.abrirPantallaCirculos();

                    if (this._user) this._user.cerrarPantallaUsuarios();
                    if (this._emp) this._emp.cerrarPantallaEpresas();
                });

            this._contenedorBotones
                .append("button")
                .text("Usuarios")
                .on("click", () => {
                    if (!this._user) {
                        this._user = new usuarios.Usuarios();
                         
                    }

                    this._user.abrirPantallaUsuarios();

                    if (this._circ) this._circ.cerrarPantallaCirculos();
                    if (this._emp) this._emp.cerrarPantallaEpresas();
                });


                this._contenedorBotones
                .append("button")
                .text("Empresas")
                .on("click", () => {
                    if (!this._emp) {
                        this._emp = new empresas.C_empresas(); 
                    }

                    this._emp.abrirPantallaEmpresas();

                    if (this._circ) this._circ.cerrarPantallaCirculos();
                    if (this._emp) this._emp.cerrarPantallaEpresas();
                });
 
 
            this._contenedorBotones.selectAll("button")
                .style("background", "#d9fab2ff")
                .style("margin", "10px")
                .style("padding", "10px 20px")
                .style("cursor", "pointer");
        }
    }
 
    let _main: app.main = new app.main();
}
