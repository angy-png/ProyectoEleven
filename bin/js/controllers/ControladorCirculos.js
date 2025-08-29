var circu;
(function (circu) {
    class CirculoController {
        constructor(model, view) {
            this.selectId = null;
            this.model = model;
            this.view = view;
            this.view.addBoton("Dibujar círculo", () => this.agregarCirculo());
            this.view.addBoton("Eliminar círculo", () => this.eliminarCirculo());
            this.renderizar();
        }
        agregarCirculo() {
            this.model.agregarCirculo();
            this.renderizar();
        }
        eliminarCirculo() {
            if (this.selectId !== null) {
                this.model.eliminarCirculo(this.selectId);
                this.selectId = null;
                this.renderizar();
            }
            else {
                alert("Selecciona un círculo primero :)");
            }
        }
        renderizar() {
            const svg = this.view.getSVG();
            const circulos = this.model.getCirculos();
            const seleccion = svg.selectAll("circle")
                .data(circulos, d => d.id.toString());
            // EXIT
            seleccion.exit()
                .transition().duration(300)
                .attr("r", 0)
                .remove();
            // UPDATE
            seleccion.transition().duration(300)
                .attr("cx", d => d.cx)
                .attr("cy", d => d.cy)
                .attr("r", d => d.r)
                .attr("fill", d => d.color);
            // ENTER
            const nuevos = seleccion.enter()
                .append("circle")
                .attr("cx", d => d.cx)
                .attr("cy", d => d.cy)
                .attr("fill", d => d.color)
                .style("cursor", "pointer")
                .on("click", (event, d) => {
                this.selectId = d.id;
                svg.selectAll("circle").attr("stroke", null);
                d3.select(event.currentTarget)
                    .attr("stroke", "red")
                    .attr("stroke-width", 3);
            })
                .call(d3.drag()
                .on("drag", (event, d) => {
                const r = d.r;
                d.cx = Math.max(r, Math.min(this.view.svgWidth - r, event.x));
                d.cy = Math.max(r, Math.min(this.view.svgHeight - r, event.y));
                d3.select(event.sourceEvent.target)
                    .attr("cx", d.cx)
                    .attr("cy", d.cy);
            }));
            nuevos.transition().duration(300).attr("r", d => d.r);
        }
    }
    circu.CirculoController = CirculoController;
})(circu || (circu = {}));
//# sourceMappingURL=ControladorCirculos.js.map