var circulos;
(function (circulos) {
    class SvgCirculo {
        constructor() {
            this.circulosMap = new Map();
            this.radio = 20;
            this.svgWidth = 400;
            this.svgHeight = 300;
            this.selectId = null;
            this.contador = -1;
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventana-circulos",
                ancho: 450,
                alto: 450,
                colorFondo: "white",
                titulo: "pantalla circulos",
                onClose: () => {
                    console.log("La ventana ventana-circulos fue cerrada.");
                }
            });
            this._contenedor = this._ventana._contenedor;
            this.svg = this._contenedor.append("svg")
                .attr("width", this.svgWidth)
                .attr("height", this.svgHeight)
                .style("border", "1px solid black")
                .style("display", "block");
            const botones = this._contenedor.append("div")
                .style("margin-top", "30px")
                .style("text-align", "center");
            botones.append("button")
                .text("Dibujar circulos")
                .style("padding", "10px 20px")
                .style("cursor", "pointer")
                .on("click", () => this.agregarCirculo());
            botones.append("button")
                .text("Eliminar circulo")
                .style("padding", "10px 20px")
                .style("cursor", "pointer")
                .on("click", () => this.eliminarSeleccionado());
        }
        abrirPantallaCirculos() {
            this._ventana.mostrar();
        }
        cerrarPantallaCirculos() {
            this._ventana.ocultar();
        }
        agregarCirculo() {
            const nuevo = {
                id: this.contador++,
                cx: Math.random() * (this.svgHeight - 2 * this.radio) + this.radio,
                cy: Math.random() * (this.svgHeight - 2 * this.radio) + this.radio,
                r: this.radio,
                color: this.getRandomColor()
            };
            this.circulosMap.set(nuevo.id, nuevo);
            this.renderizar();
        }
        eliminarSeleccionado() {
            if (this.selectId !== null && this.circulosMap.has(this.selectId)) {
                this.circulosMap.delete(this.selectId); //elimina directamente por id
                this.selectId = null;
                this.renderizar();
            }
            else {
                alert("Selecciona un círculo primero :)");
            }
        }
        renderizar() {
            // se convierte a arreglo 
            const circulosArray = Array.from(this.circulosMap.values());
            this.svg.selectAll("circle").interrupt();
            const seleccion = this.svg.selectAll("circle")
                .data(circulosArray, d => d.id.toString());
            // EXIT
            seleccion.exit()
                .transition()
                .duration(300)
                .attr("r", 0)
                .remove();
            // UPDATE
            seleccion
                .transition()
                .duration(300)
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
                this.svg.selectAll("circle").attr("stroke", null);
                d3.select(event.currentTarget)
                    .attr("stroke", "red")
                    .attr("stroke-width", 3);
            })
                .call(d3.drag()
                .on("drag", (event, d) => {
                const r = d.r;
                d.cx = Math.max(r, Math.min(this.svgWidth - r, event.x));
                d.cy = Math.max(r, Math.min(this.svgHeight - r, event.y));
                d3.select(event.sourceEvent.target)
                    .attr("cx", d.cx)
                    .attr("cy", d.cy);
            }));
            nuevos.transition()
                .duration(300)
                .attr("r", d => d.r);
        }
        getRandomColor() {
            return d3.interpolateRainbow(Math.random());
        }
    }
    circulos.SvgCirculo = SvgCirculo;
})(circulos || (circulos = {}));
//# sourceMappingURL=circulos.js.map