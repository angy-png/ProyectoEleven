var empresas;
(function (empresas) {
    class ModeloEmpresas {
        constructor() {
            this.empresas = new Map();
        }
        obtenerTodos() {
            return Array.from(this.empresas.values());
        }
        agregar(empresa) {
            this.empresas.set(empresa.id, empresa);
        }
        actualizar(id, empresa) {
            const existente = this.empresas.get(id);
            if (existente) {
                this.empresas.set(id, Object.assign(Object.assign({}, existente), empresa));
            }
        }
        eliminar(id) {
            this.empresas.delete(id);
        }
        limpiar() {
            this.empresas.clear();
        }
        cargarDesdeJson(data) {
            this.empresas.clear();
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const empreNueva = {
                    id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                    nombre: item.nombre ? String(item.nombre) : "",
                    rfc: item.rfc ? String(item.rfc) : "",
                    telefono: item.telefono !== undefined && item.telefono !== null ? Number(item.telefono) : 0,
                    activo: item.activo !== undefined && item.activo !== null ? item.activo == true || item.activo === "true" : false,
                    fechaRegistro: item.fechaRegistro ? new Date(item.fechaRegistro) : new Date()
                };
                this.empresas.set(empreNueva.id, empreNueva);
            }
        }
        obtenerUsuariosDeEmpresa(idEmpresa, modeloUsuarios) {
            return modeloUsuarios.obtenerUsuariosPorEmpresa(idEmpresa);
        }
    }
    empresas.ModeloEmpresas = ModeloEmpresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=ModeloEmpresas.js.map