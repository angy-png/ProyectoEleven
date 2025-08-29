 namespace circu {
    export interface ICirculo {
        id: number;
        cx: number;
        cy: number;
        r: number;
        color: string;
    }

    export class CirculoModel {
        private circulos: Map<number, ICirculo> = new Map();
        private contador: number = -1;
        private radio = 20;
        private width = 400;
        private height = 300;

        public getCirculos(): ICirculo[] {
            return Array.from(this.circulos.values());
        }  

        public agregarCirculo(): ICirculo {
            const nuevo: ICirculo = {
                id: this.contador++,
                cx: Math.random() * (this.width - 2 * this.radio) + this.radio,
                cy: Math.random() * (this.height - 2 * this.radio) + this.radio,
                r: this.radio,
                color: d3.interpolateRainbow(Math.random())
            };
            this.circulos.set(nuevo.id, nuevo);
            return nuevo;
        }

        public eliminarCirculo(id: number): void {
            this.circulos.delete(id);
        }
    }
}
