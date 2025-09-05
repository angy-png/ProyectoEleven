var empresas;
(function (empresas) {
    class ModeloEmpresas extends base.ModeloBase {
        constructor() {
            super();
        }
        cargarDesdeJson(data) {
            super.cargarDesdeJson(data, (item) => {
                var _a, _b;
                return ({
                    id: item.id ? Number(item.id) : 0,
                    nombre: (_a = item.nombre) !== null && _a !== void 0 ? _a : "",
                    rfc: (_b = item.rfc) !== null && _b !== void 0 ? _b : "",
                    telefono: item.telefono ? Number(item.telefono) : 0,
                    activo: item.activo === true || item.activo === "true",
                    fechaRegistro: item.fechaRegistro ? new Date(item.fechaRegistro) : new Date()
                });
            });
        }
    }
    empresas.ModeloEmpresas = ModeloEmpresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=ModeloEmpresas.js.map