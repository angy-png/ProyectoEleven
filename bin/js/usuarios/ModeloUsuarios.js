var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var usuarios;
(function (usuarios) {
    class ModeloUsuarios {
        constructor() {
            this.usuarios = new Map();
        }
        obtenerTodos() {
            return Array.from(this.usuarios.values());
        }
        obtener(id) {
            return this.usuarios.get(id);
        }
        cargarUser() {
            return __awaiter(this, arguments, void 0, function* (recargarJson = true) {
                if (recargarJson) {
                    const response = yield fetch("../bin/datos.json");
                    const data = yield response.json();
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
                        console.log(userNuevo);
                    }
                }
            });
        }
        eliminar(id) {
            this.usuarios.delete(id);
        }
        agregar(usuario) {
            console.log(usuario);
            usuario.id = this.usuarios.size + 1; // asignar id incremental
            this.usuarios.set(usuario.id, usuario);
        }
        editar(id, usuarioActualizado) {
            const existente = this.usuarios.get(id);
            if (existente) {
                this.usuarios.set(id, Object.assign(Object.assign({}, existente), usuarioActualizado));
                console.log(usuarioActualizado);
            }
        }
        obtenerEmpresas() {
            return Array.from(new Set(Array.from(this.usuarios.values()).map(u => u.id_empresa)));
        }
        ordenarUsuarios(propiedad, asc = true) {
            const todos = this.obtenerTodos();
            return usuarios.ordenar(todos, propiedad, asc);
        }
    }
    usuarios.ModeloUsuarios = ModeloUsuarios;
})(usuarios || (usuarios = {}));
//# sourceMappingURL=ModeloUsuarios.js.map