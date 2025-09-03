namespace usuarios {
    
    // ===================== Interfaces =====================
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

    export interface I_columna {
        titulo: string;
        campo: keyof I_Usuarios | null;
    }

    // ===================== Modelo =====================
    export class ModeloUsuarios {
        private usuarios: Map<number, I_Usuarios> = new Map();

        public obtenerTodos(): I_Usuarios[] {
            return Array.from(this.usuarios.values());
        }

        public agregar(usuario: I_Usuarios): void {
            this.usuarios.set(usuario.id, usuario);
        }

        public actualizar(id: number, usuario: Partial<I_Usuarios>): void {
            const existente = this.usuarios.get(id);
            if (existente) {
                this.usuarios.set(id, { ...existente, ...usuario });
            }
        }

        public eliminar(id: number): void {
            this.usuarios.delete(id);
        }

        public limpiar(): void {
            this.usuarios.clear();
        }

        public cargarDesdeJson(data: any[]): void {
            this.usuarios.clear();
 for (let i = 0; i < data.length; i++) {
                    const item = data[i];

                    const userNuevo: I_Usuarios = {
                        id: item.id !== undefined && item.id !== null ? Number(item.id) : 0,
                        nombre: item.nombre ? String(item.nombre) : "",
                        apellidoPaterno: item.apellidoPaterno ? String(item.apellidoPaterno) : "",
                        apellidoMaterno: item.apellidoMaterno ? String(item.apellidoMaterno) : "",
                        usuario: item.usuario ? String(item.usuario) : "",
                        id_empresa: item.id_empresa !== undefined && item.id_empresa !== null ? Number(item.id_empresa) : 0,
                        correo: item.correo ? String(item.correo) : "",
                        telefono: item.telefono !== undefined && item.telefono !== null ? Number(item.telefono) : 0
                    }
                   this.usuarios.set(userNuevo.id, userNuevo);
                }
        }

        public obtenerUsuariosPorEmpresa(idEmpresa: number): I_Usuarios[] {
            return this.obtenerTodos().filter(u => u.id_empresa === idEmpresa);
        }

        
    }
}
