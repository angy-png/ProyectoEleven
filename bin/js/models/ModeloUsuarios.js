var usuarios;
(function (usuarios) {
    class ModeloUsuarios extends base.ModeloBase {
        constructor() {
            super();
        }
        cargarDesdeJson(data) {
            super.cargarDesdeJson(data, (item) => {
                var _a, _b, _c, _d, _e;
                return ({
                    id: item.id ? Number(item.id) : 0,
                    nombre: (_a = item.nombre) !== null && _a !== void 0 ? _a : "",
                    apellidoPaterno: (_b = item.apellidoPaterno) !== null && _b !== void 0 ? _b : "",
                    apellidoMaterno: (_c = item.apellidoMaterno) !== null && _c !== void 0 ? _c : "",
                    usuario: (_d = item.usuario) !== null && _d !== void 0 ? _d : "",
                    id_empresa: item.id_empresa ? Number(item.id_empresa) : 0,
                    correo: (_e = item.correo) !== null && _e !== void 0 ? _e : "",
                    telefono: item.telefono ? Number(item.telefono) : 0,
                });
            });
        }
    }
    usuarios.ModeloUsuarios = ModeloUsuarios;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=ModeloUsuarios.js.map