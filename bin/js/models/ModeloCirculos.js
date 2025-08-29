var circu;
(function (circu) {
    class CirculoModel {
        constructor() {
            this.circulos = new Map();
            this.contador = -1;
            this.radio = 20;
            this.width = 400;
            this.height = 300;
        }
        getCirculos() {
            return Array.from(this.circulos.values());
        }
        agregarCirculo() {
            const nuevo = {
                id: this.contador++,
                cx: Math.random() * (this.width - 2 * this.radio) + this.radio,
                cy: Math.random() * (this.height - 2 * this.radio) + this.radio,
                r: this.radio,
                color: d3.interpolateRainbow(Math.random())
            };
            this.circulos.set(nuevo.id, nuevo);
            return nuevo;
        }
        eliminarCirculo(id) {
            this.circulos.delete(id);
        }
    }
    circu.CirculoModel = CirculoModel;
})(circu || (circu = {}));
//# sourceMappingURL=ModeloCirculos.js.map