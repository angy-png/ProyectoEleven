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
    class ControladorEmpresa {
        constructor() {
            this.ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada");
                }
            });
            this.modelo = new empresas.Modelompresas();
            this.vista = new empresas.VistaEmpresa(this.ventana);
            this.vista.crearControles();
            this.mostrarTabla();
        }
        abrirPantallaEmpresa() {
            this.ventana.mostrar();
        }
        cerrarPantallaEmpresa() {
            this.ventana.ocultar();
        }
        mostrarTabla() {
            return __awaiter(this, void 0, void 0, function* () {
                this.vista.crearTablaUser();
                yield this.modelo.cargar();
                this.actVistaUser();
            });
        }
        actVistaUser() {
            const datosUser = this.modelo.obtenerTodosEm();
            this.vista.renderizarUser(datosUser);
        }
    }
    empresas.ControladorEmpresa = ControladorEmpresa;
})(empresas || (empresas = {}));
//# sourceMappingURL=ControladorEmpresas.js.map