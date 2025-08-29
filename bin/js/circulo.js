var circu;
(function (circu_1) {
    class circu {
        crearControlador() {
            const model = new circu_1.CirculoModel();
            const view = new circu_1.CirculoView();
            return new circu_1.CirculoController(model, view);
        }
    }
    circu_1.circu = circu;
})(circu || (circu = {}));
//# sourceMappingURL=circulo.js.map