var empresas;
(function (empresas) {
    class C_empresas {
        constructor() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "VentanaEmpresas",
                ancho: 900,
                alto: 400,
                colorFondo: "red",
                titulo: "Empresas",
                onClose() {
                    console.log("ventana empresas fue cerrada");
                },
            });
        }
        abrirPantallaEmpresas() {
            this._ventana.mostrar();
        }
        cerrarPantallaEpresas() {
            this._ventana.ocultar();
        }
    }
    empresas.C_empresas = C_empresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=empresas.js.map