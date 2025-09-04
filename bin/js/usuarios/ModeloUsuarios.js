var usuarios;
(function (usuarios) {
    class ModeloUsuarios {
        constructor() {
            this.usuarios = new Map();
        }
        obtenerTodos() {
            return Array.from(this.usuarios.values());
        }
        agregar(usuario) {
            this.usuarios.set(usuario.id, usuario);
        }
        actualizar(id, usuario) {
            const existente = this.usuarios.get(id);
            if (existente) {
                this.usuarios.set(id, Object.assign(Object.assign({}, existente), usuario));
            }
        }
        eliminar(id) {
            this.usuarios.delete(id);
        }
        limpiar() {
            this.usuarios.clear();
        }
        cargarDesdeJson(data) {
            this.usuarios.clear();
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
                const userNuevo = {
                    id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                    nombre: item.nombre ? String(item.nombre) : "",
                    apellidoPaterno: item.apellidoPaterno ? String(item.apellidoPaterno) : "",
                    apellidoMaterno: item.apellidoMaterno ? String(item.apellidoMaterno) : "",
                    usuario: item.usuario ? String(item.usuario) : "",
                    id_empresa: item.id_empresa !== undefined && item.id_empresa !== null ? Number(item.id_empresa) : 0,
                    correo: item.correo ? String(item.correo) : "",
                    telefono: item.telefono !== undefined && item.telefono !== null ? Number(item.telefono) : 0
                };
                this.usuarios.set(userNuevo.id, userNuevo);
            }
        }
        obtenerUsuariosPorEmpresa(idEmpresa) {
            return this.obtenerTodos().filter(u => u.id_empresa === idEmpresa);
        }
    }
    usuarios.ModeloUsuarios = ModeloUsuarios;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=ModeloUsuarios.js.map