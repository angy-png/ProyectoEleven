namespace empresas {
    export interface I_empresas {
        id: number,
        nombre: string,
        rfc: string,
        telefono: number,
        activo: boolean,
        fechaRegistro: Date
    }

    export interface I_columna {
        titulo: string;
        campo: keyof I_empresas | null;
    }

    export class ModeloEmpresas {
        private empresas: Map<number, I_empresas> = new Map();

        public obtenerTodos(): I_empresas[] {
            return Array.from(this.empresas.values());
        }

        public agregar(empresa: I_empresas): void {
            this.empresas.set(empresa.id, empresa);
        }

        public actualizar(id: number, empresa: Partial<I_empresas>): void {
            const existente = this.empresas.get(id);
            if (existente) {
                this.empresas.set(id, { ...existente, ...empresa });
            }
        }

        public eliminar(id: number): void {
            this.empresas.delete(id);
        }

        public limpiar(): void {
            this.empresas.clear();
        }

        public cargarDesdeJson(data: any[]): void {
            this.empresas.clear();
            for (let i = 0; i < data.length; i++) {
                const item = data[i];
               

                 const empreNueva: I_empresas = {
                        id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                        nombre: item.nombre ? String(item.nombre) : "",
                        rfc: item.rfc ? String(item.rfc) : "",
                        telefono: item.telefono !== undefined && item.telefono !== null ? Number(item.telefono) : 0,
                        activo: item.activo !== undefined && item.activo !== null ? item.activo == true || item.activo === "true" : false,
                        fechaRegistro: item.fechaRegistro ? new Date(item.fechaRegistro) : new Date()
                    };

                    
                this.empresas.set(empreNueva.id, empreNueva);
            }
        }

        public obtenerUsuariosDeEmpresa(
    idEmpresa: number,
    modeloUsuarios: usuarios.ModeloUsuarios
): usuarios.I_Usuarios[] {
    return modeloUsuarios.obtenerUsuariosPorEmpresa(idEmpresa);
}

    }
}
