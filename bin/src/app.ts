namespace app {
    export class main {
        _circ: circulos.ControladorCirculos | null = null;
        _user: usuarios.ControladorUsuarios | null = null;  
        _emp: empresas.ControladorEmpresas | null = null; 

        constructor() {
            this.inicializar();
        }

      private async inicializar() {
    d3.select("body")
        .append("button")
        .text("Circulos")
        .on("click", () => {
            if (!this._circ) this._circ = new circulos.ControladorCirculos();
            this._circ.abrirPantallaCirculos();
            if (this._user) this._user.cerrarPantalla();
            if (this._emp) this._emp.cerrarPantalla(); 
           
        });

    d3.select("body")
        .append("button")
        .text("Usuarios")
        .on("click", () => {
            if (!this._user) this._user = new usuarios.ControladorUsuarios();
            
            this._user.abrirPantalla();
            if (this._circ) this._circ.cerrarPantallaCirculos();
            if (this._emp) this._emp.cerrarPantalla(); 
        });

    d3.select("body")
        .append("button")
        .text("Empresas")
        .on("click", () => {
           if(!this._emp) this._emp = new empresas.ControladorEmpresas();  
            this._emp.abrirPantalla(); 
            if (this._user) this._user.cerrarPantalla();
            if (this._circ) this._circ.cerrarPantallaCirculos();
        });

    d3.selectAll("button")
        .style("background", "#d9fab2ff")
        .style("margin", "10px")
        .style("padding", "10px 20px")
        .style("cursor", "pointer");
    }  }

    let _main: app.main = new app.main();
}
