var usuarios;
(function (usuarios) {
    class ModeloUsuarios extends base.ModeloBase {
        constructor() {
            super();
        }
        cargarDesdeJson(data) {
            super.cargarDesdeJson(data, (item) => ({
                id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                nombre: item.nombre ? String(item.nombre) : "",
                apellidoPaterno: item.apellidoPaterno ? String(item.apellidoPaterno) : "",
                apellidoMaterno: item.apellidoMaterno ? String(item.apellidoMaterno) : "",
                usuario: item.usuario ? String(item.usuario) : "",
                id_empresa: item.id_empresa !== undefined && item.id_empresa !== null ? Number(item.id_empresa) : 0,
                correo: item.correo ? String(item.correo) : "",
                telefono: item.telefono !== undefined && item.telefono !== null ? Number(item.telefono) : 0
            }));
        }
    }
    usuarios.ModeloUsuarios = ModeloUsuarios;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=ModeloUsuarios.js.map