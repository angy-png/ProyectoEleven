namespace usuarios {
    export interface I_Usuarios {
        id: number;
        nombre: string;
        apellidoPaterno: string;
        apellidoMaterno: string;
        usuario: string;
        id_empresa: number;
        correo: string;
        telefono: number;
    }

    export class ModeloUsuarios extends base.ModeloBase<I_Usuarios> {
        constructor() {
            super();
        }

        public cargarDesdeJson(data: any[]): void {
            super.cargarDesdeJson(data, (item) => ({
                id: item.id ? Number(item.id) : 0,
                nombre: item.nombre ?? "",
                apellidoPaterno: item.apellidoPaterno ?? "",
                apellidoMaterno: item.apellidoMaterno ?? "",
                usuario: item.usuario ?? "",
                id_empresa: item.id_empresa ? Number(item.id_empresa) : 0,
                correo: item.correo ?? "",
                telefono: item.telefono ? Number(item.telefono) : 0,
            }));
        }

       
    }
}
