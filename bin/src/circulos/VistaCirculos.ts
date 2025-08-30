namespace circulos {

    //Recibe datos y los dibuja 
    export class VistaCirculos {
        private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
        private selectId: number | null = null;

        constructor(
            private ventana: ventanaControl.ventanaControl,
            private width = 400,
            private height = 300
        ) {
            this.svg = ventana._contenedor.append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("border", "1px solid black")
                .style("display", "block");
        }

        public renderizar(circulos: ICirculo[], onSelect: (id: number) => void): void {
            const seleccion = this.svg.selectAll<SVGCircleElement, ICirculo>("circle")
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

        public getSeleccionado(): number | null {
            return this.selectId;
        }
    }
}
 