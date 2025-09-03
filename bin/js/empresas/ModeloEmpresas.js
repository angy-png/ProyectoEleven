var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var empresas;
(function (empresas) {
    class Modelompresas {
        constructor() {
            this.empresas = new Map();
        }
        obtenerTodosEm() {
            return Array.from(this.empresas.values());
        }
        obtene(id) {
            return this.empresas.get(id);
        }
        cargar() {
            return __awaiter(this, arguments, void 0, function* (recargarJson = true) {
                if (recargarJson) {
                    const response = yield fetch("./empresas.json");
                    const data = yield response.json();
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
            });
        }
        ;
        eliminar(id) {
            this.empresas.delete(id);
        }
        agregar(usuario) {
            console.log(usuario);
            usuario.id = this.empresas.size + 1; // asignar id incremental
            this.empresas.set(usuario.id, usuario);
        }
        editar(id, usuarioActualizado) {
            const existente = this.empresas.get(id);
            if (existente) {
                this.empresas.set(id, Object.assign(Object.assign({}, existente), usuarioActualizado));
                console.log(usuarioActualizado);
            }
        }
    }
    empresas.Modelompresas = Modelompresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=ModeloEmpresas.js.map