var circulos;
(function (circulos_1) {
    //Recibe datos y los dibuja 
    class VistaCirculos {
        constructor(ventana, width = 400, height = 300) {
            this.ventana = ventana;
            this.width = width;
            this.height = height;
            this.selectId = null;
            this.svg = ventana._contenedor.append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("border", "1px solid black")
                .style("display", "block");
        }
        renderizar(circulos, onSelect) {
            const seleccion = this.svg.selectAll("circle")
                .data(circulos, d => d.id.toString());
            // EXIT
            seleccion.exit()
                .transition().duration(300)
                .attr("r", 0)
                .remove();
            // UPDATE
            seleccion
                .transition().duration(300)
                .attr("cx", d => d.cx)
                .attr("cy", d => d.cy)
                .attr("r", d => d.r)
                .attr("fill", d => d.color);
            // ENTER
            seleccion.enter()
                .append("circle")
                .attr("cx", d => d.cx)
                .attr("cy", d => d.cy)
                .attr("r", d => d.r)
                .attr("fill", d => d.color)
                .style("cursor", "pointer")
                .on("click", (event, d) => {
                this.selectId = d.id;
                this.svg.selectAll("circle").attr("stroke", null);
                d3.select(event.currentTarget)
                    .attr("stroke", "red")
                    .attr("stroke-width", 3);
                onSelect(d.id);
            });
        }
        getSeleccionado() {
            return this.selectId;
        }
    }
    circulos_1.VistaCirculos = VistaCirculos;
})(circulos || (circulos = {}));
//# sourceMappingURL=VistaCirculos.js.map