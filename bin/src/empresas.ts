namespace empresas{
    
   export interface Iempresas{
    id: number,
    nombre: string,
    rfc: string,
    telefono: number,
    activo: boolean,
    fecha_registro: string
   }


   export class C_empresas{

    private _ventana:ventanaControl.ventanaControl;
    private _contenedor:d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

    constructor(){
        this._ventana = new ventanaControl.ventanaControl({
            id: "VentanaEmpresas",
            ancho: 900,
            alto: 400,
            colorFondo:"red",
            titulo: "Empresas",
            onClose() {
                console.log("ventana empresas fue cerrada");
            },

        });

        
    }
    
     public abrirPantallaEmpresas(): void {
            this._ventana.mostrar();
        }

        public cerrarPantallaEpresas(): void {
            this._ventana.ocultar();
        }

}

 

}