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
(function (empresas_1) {
    class ControladorEmpresas {
        constructor() {
            this.modelo = new empresas_1.ModeloEmpresas();
            this.vista = new empresas_1.VistaEmpresas();
            this.vista.onAgregarEditar = (modo, datos) => this.abrirModal(modo, datos);
            this.vista.onEliminar = (empresa) => this.eliminar(empresa);
            this.vista.onFiltrar = (texto) => this.filtrar(texto);
            this.vista.onOrdenar = (campo, asc) => {
                const datosOrdenados = usuarios.ordenar(this.modelo.obtenerTodos(), campo, asc);
                this.vista.renderTabla(datosOrdenados);
            };
        }
        // 🔹 Solo carga datos en el modelo
        cargar() {
            return __awaiter(this, arguments, void 0, function* (recargarJson = true) {
                if (recargarJson) {
                    const response = yield fetch("./empresas.json");
                    const data = yield response.json();
                    this.modelo.cargarDesdeJson(data);
                }
                // ❌ Ya no llamamos renderTabla aquí
            });
        }
        abrirModal(modo, datos) {
            this.vista.mostrarModal(datos, (nuevaEmpresa) => {
                if (modo === "agregar") {
                    nuevaEmpresa.id = this.modelo.obtenerTodos().length + 1;
                    this.modelo.agregar(nuevaEmpresa);
                }
                else if (modo === "editar" && datos) {
                    this.modelo.actualizar(datos.id, nuevaEmpresa);
                }
                this.refrescarTabla();
            });
        }
        eliminar(empresa) {
            this.vista.mostrarConfirmacion(`¿Seguro que deseas eliminar la empresa "${empresa.nombre}"?`, () => {
                this.modelo.eliminar(empresa.id);
                this.refrescarTabla();
            });
        }
        obtenerTodos() {
            return this.modelo.obtenerTodos();
        }
        filtrar(nombre) {
            const filtrados = this.modelo.obtenerTodos().filter(e => !nombre || e.nombre.toLowerCase().includes(nombre.toLowerCase()));
            this.vista.renderTabla(filtrados);
        }
        // 🔹 Ahora la tabla se dibuja aquí
        abrirPantallaEmpresas() {
            this.refrescarTabla();
            this.vista.mostrar();
        }
        cerrarPantallaEmpresas() {
            this.vista.ocultar();
        }
        refrescarTabla() {
            var _a;
            const todas = this.modelo.obtenerTodos();
            this.vista.renderTabla(todas);
            (_a = this.onEmpresasActualizadas) === null || _a === void 0 ? void 0 : _a.call(this, todas); // 🔔 notificar
        }
        refrescarUsuarios() {
            var _a, _b;
            this.refrescarTabla(); // primero refresca tabla de empresas
            (_b = (_a = this.vista).onEmpresasActualizadas) === null || _b === void 0 ? void 0 : _b.call(_a, this.modelo.obtenerTodos());
        }
    }
    empresas_1.ControladorEmpresas = ControladorEmpresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=ControladorEmpresas.js.map