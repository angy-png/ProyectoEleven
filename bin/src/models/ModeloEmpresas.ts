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
                id: item.id ? Number(item.id) : 0,
                nombre: item.nombre ?? "",
                rfc: item.rfc ?? "",
                telefono: item.telefono ? Number(item.telefono) : 0,
                activo: item.activo === true || item.activo === "true",
                fechaRegistro: item.fechaRegistro ? new Date(item.fechaRegistro) : new Date()
            }));
        }
    }
}
