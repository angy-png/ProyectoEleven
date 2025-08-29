"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControladorCirculos = void 0;
// ControladorCirculos.ts
const ModeloCirculos_1 = require("./ModeloCirculos");
class ControladorCirculos {
    constructor(vista) {
        this.vista = vista;
        this.modelo = new ModeloCirculos_1.ModeloCirculos();
        this.selectId = null;
        // render inicial
        this.actualizarVista();
    }
    agregarCirculo() {
        this.modelo.agregarCirculo();
        this.actualizarVista();
    }
    eliminarSeleccionado() {
        if (this.selectId !== null) {
            this.modelo.eliminarCirculo(this.selectId);
            this.selectId = null;
            this.actualizarVista();
        }
        else {
            alert("Selecciona un círculo primero");
        }
    }
    actualizarVista() {
        this.vista.render(this.modelo.obtenerCirculos(), (id) => { this.selectId = id; }, (d, x, y) => { d.cx = x; d.cy = y; });
    }
}
exports.ControladorCirculos = ControladorCirculos;
//# sourceMappingURL=circulosController.js.map