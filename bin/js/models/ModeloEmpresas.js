var empresas;
(function (empresas) {
    class ModeloEmpresas extends base.ModeloBase {
        constructor() {
            super();
        }
        cargarDesdeJson(data) {
            // normaliza y tipa los datos provenientes de JSON 
            super.cargarDesdeJson(data, (item) => ({
                // Convierte el valor a número y asigna 0 si no existe.
                id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                nombre: item.nombre ? String(item.nombre) : "",
                // Convierte el valor a cadena y asigna "" si no existe.
                rfc: item.rfc ? String(item.rfc) : "",
                telefono: item.telefono !== undefined && item.telefono !== null ? Number(item.telefono) : 0,
                // Convierte el valor a true/false y asigna false si no existe
                activo: item.activo !== undefined && item.activo !== null ? item.activo == true || item.activo === "true" : false,
                // Convierte el valor a fecha y asigna la fecha actual si no existe 
                fechaRegistro: item.fechaRegistro ? new Date(item.fechaRegistro) : new Date()
            }));
        }
    }
    empresas.ModeloEmpresas = ModeloEmpresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=ModeloEmpresas.js.map