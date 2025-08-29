namespace circu {
    export class CirculoView {
        private _ventana: ventanaControl.ventanaControl;
        private _contenedor: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;

        public svgWidth = 400;
        public svgHeight = 300;

        constructor() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventana-circulos",
                ancho: 450,
                alto: 450,
                colorFondo: "white",
                titulo: "pantalla circulos",
                onClose: () => console.log("La ventana fue cerrada")
            });

            this._contenedor = this._ventana._contenedor;
            this.svg = this._contenedor.append("svg")
                .attr("width", this.svgWidth)
                .attr("height", this.svgHeight)
                .style("border", "1px solid black")
                .style("display", "block");
        }

        public getSVG() {
            return this.svg;
        }

        public addBoton(label: string, onClick: () => void) {
            this._contenedor.append("button")
                .text(label)
                .style("padding", "10px 20px")
                .style("cursor", "pointer")
                .on("click", onClick);
        }

        public mostrar() {
            this._ventana.mostrar();
        }

        public ocultar() {
            this._ventana.ocultar();
        }
    }
}
