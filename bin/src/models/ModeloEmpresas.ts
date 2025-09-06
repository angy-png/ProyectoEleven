namespace empresas {
    export interface I_empresas {
        id: number;
        nombre: string;
        rfc: string;
        telefono: number;
        activo: boolean;
        fechaRegistro: Date;
    }

    export class ModeloEmpresas extends base.ModeloBase<I_empresas> {
        constructor() {
            super();
        }

        public cargarDesdeJson(data: any[]): void {
            super.cargarDesdeJson(data, (item) => ({
                id: item.id !== undefined && item.id !== null? Number(item.id) : 0,
                nombre: item.nombre? String(item.nombre) : "",
                rfc: item.rfc? String(item.rfc) : "",
                telefono: item.telefono ! == undefined && item.telefono !== null? Number(item.telefono): 0,
                activo: item.activo !== undefined && item.activo !== null? item.activo == true || item.activo === "true": false,
                fechaRegistro: item.fechaRegistro ? new Date(item.fechaRegistro): new Date()
            }));
        }
    }
}
