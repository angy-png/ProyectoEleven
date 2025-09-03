namespace empresas{
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
        campo: keyof I_empresas;
    }


    export class Modelompresas{
          private empresas: Map<number, I_empresas> = new Map();

          public obtenerTodosEm(): I_empresas[]{
            return Array.from(this.empresas.values()); 
          }

          public obtene(id: number):I_empresas|undefined {
            return this.empresas.get(id);
          }

            public async cargar(recargarJson: boolean = true) {
            if (recargarJson) {
                const response = await fetch("./empresas.json");
                const data = await response.json();
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
                    }
                    this.empresas.set(empreNueva.id, empreNueva); 
                }
            } 
        };

         public eliminar(id: number): void {
            this.empresas.delete(id);
        }

        public agregar(usuario: I_empresas): void {
            console.log(usuario);
            usuario.id = this.empresas.size + 1; // asignar id incremental
            this.empresas.set(usuario.id, usuario);
        }

        public editar(id: number, usuarioActualizado: Partial<I_empresas>): void {
            const existente = this.empresas.get(id);
            if (existente) {
                this.empresas.set(id, { ...existente, ...usuarioActualizado });
                console.log(usuarioActualizado);
            }
        }

        



    }
}