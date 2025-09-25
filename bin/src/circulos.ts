namespace circulos {
    interface ICirculo {
        id: number;
        cx: number;
        cy: number;
        r: number;
        color: string;
    }

    export class SvgCirculo {
        private _ventana: ventanaControl.ventanaControl;
        private circulosMap: Map<number, ICirculo> = new Map();

        private _contenedor: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

        private radio = 20;
        private svgWidth = 400;
        private svgHeight = 300;
        private selectId: number | null = null;
        private contador: number = -1;

        constructor() {
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
                .style("text-align", "center")

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

        private agregarCirculo(): void {
            const nuevo: ICirculo = {
                id: this.contador++,
                cx: Math.random() * (this.svgHeight - 2 * this.radio) + this.radio,
                cy: Math.random() * (this.svgHeight - 2 * this.radio) + this.radio,
                r: this.radio,
                color: this.getRandomColor()
            };
            this.circulosMap.set(nuevo.id, nuevo);
            this.renderizar();
        }

        private eliminarSeleccionado(): void {
            if (this.selectId !== null && this.circulosMap.has(this.selectId)) {
                this.circulosMap.delete(this.selectId);//elimina directamente por id
                this.selectId = null;
                this.renderizar();
            } else {
                alert("Selecciona un círculo primero :)");
            }
        }

        private renderizar(): void {
            // se convierte a arreglo 
            const circulosArray = Array.from(this.circulosMap.values());
            this.svg.selectAll<SVGCircleElement, ICirculo>("circle").interrupt();

            const seleccion = this.svg.selectAll<SVGCircleElement, ICirculo>("circle")
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
                    d3.select<SVGCircleElement, ICirculo>(event.currentTarget)
                        .attr("stroke", "red")
                        .attr("stroke-width", 3);
                })
                .call(
                    d3.drag<SVGCircleElement, ICirculo>()
                        .on("drag", (event, d) => {
                            const r = d.r;
                            d.cx = Math.max(r, Math.min(this.svgWidth - r, event.x));
                            d.cy = Math.max(r, Math.min(this.svgHeight - r, event.y));
                            d3.select<SVGCircleElement, ICirculo>(event.sourceEvent.target as SVGCircleElement)
                                .attr("cx", d.cx)
                                .attr("cy", d.cy);
                        })
                );

            nuevos.transition()
                .duration(300)
                .attr("r", d => d.r);
        }

        private getRandomColor(): string {
            return d3.interpolateRainbow(Math.random());
        }
        public abrirPantallaCirculos(): void {
            this._ventana.mostrar();

        }
        public cerrarPantallaCirculos(): void {
            this._ventana.ocultar();
        }
    }


}