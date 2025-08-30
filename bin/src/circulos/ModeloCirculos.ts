namespace circulos {
    export interface ICirculo {
        id: number;
        cx: number;
        cy: number;
        r: number;
        color: string;
    }
// Datos y la logica del negocio 
    export class ModeloCirculos {
        private circulos: Map<number, ICirculo> = new Map();
        private contador: number = 0;

        public getAll(): ICirculo[]{
            return Array.from(this.circulos.values()); 
        }

        public agregar(radio: number, width: number, height: number): ICirculo {
            const nuevo: ICirculo = {
                id: this.contador++,
                cx: Math.random() * (width - 2 * radio) + radio,
                cy: Math.random() * (height - 2 * radio) + radio,
                r: radio,
                color: d3.interpolateRainbow(Math.random())
            };
            this.circulos.set(nuevo.id, nuevo);
            return nuevo;
        }

        public eliminar(id: number): void {
            this.circulos.delete(id);
        }

        
    }
}
