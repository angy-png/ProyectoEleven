var circulos;
(function (circulos) {
    // Datos y la logica del negocio 
    class ModeloCirculos {
        constructor() {
            this.circulos = new Map();
            this.contador = 0;
        }
        getAll() {
            return Array.from(this.circulos.values());
        }
        agregar(radio, width, height) {
            const nuevo = {
                id: this.contador++,
                cx: Math.random() * (width - 2 * radio) + radio,
                cy: Math.random() * (height - 2 * radio) + radio,
                r: radio,
                color: d3.interpolateRainbow(Math.random())
            };
            this.circulos.set(nuevo.id, nuevo);
            return nuevo;
        }
        eliminar(id) {
            this.circulos.delete(id);
        }
    }
    circulos.ModeloCirculos = ModeloCirculos;
})(circulos || (circulos = {}));
//# sourceMappingURL=ModeloCirculos.js.map