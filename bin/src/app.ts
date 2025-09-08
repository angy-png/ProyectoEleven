namespace app {
    export class main {
        _circ: circulos.ControladorCirculos | null = null;
        _user: usuarios.ControladorUsuarios | null = null;
        _emp: empresas.ControladorEmpresas | null = null;
        _contenedorBotones: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

        constructor() {
            this._contenedorBotones = d3.select("body")
                .append("div")
                .attr("id", "botones-arriba")
                .style("margin-bottom", "20px");

            this.inicializarEmpresas(); 
            this.inicializarBotones(); 
        }

        private inicializarEmpresas() {
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

        private inicializarBotones() {
            this._contenedorBotones
                .append("button")
                .text("Circulos")
                .on("click", () => {
                    if (!this._circ) this._circ = new circulos.ControladorCirculos();
                    this._circ.abrirPantallaCirculos();

                    if (this._user) this._user.cerrarPantalla();
                    if (this._emp) this._emp.cerrarPantalla();
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

                    if (this._circ) this._circ.cerrarPantallaCirculos();
                    if (this._emp) this._emp.cerrarPantalla();
                });

            this._contenedorBotones
                .append("button")
                .text("Empresas")
                .on("click", () => {
                    if (this._emp) {
                        this._emp.abrirPantalla();
                    }
                    if (this._user) this._user.cerrarPantalla();
                    if (this._circ) this._circ.cerrarPantallaCirculos();
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
