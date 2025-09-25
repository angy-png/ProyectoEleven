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

    export class Usuarios {
        private empresas: empresas.C_empresas; // referencia a C_empresas

        public usuarios: Map<number, I_Usuarios> = new Map();
        private _ventanaModal: ventanaControl.ventanaControl;
        private _ventana: ventanaControl.ventanaControl;
        private _conten: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

        constructor(empresasRef: empresas.C_empresas) {
            this.empresas = empresasRef;
            this.pantPrincipal();
            this.crearVentanaModalUsuario();
            this.crearControles();
            this.crearTabla();
            this.cargar();
        }

        public pantPrincipal() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 900,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada");
                },
            });
            this._conten = this._ventana._contenedor;
        };

        private crearVentanaModalUsuario(): void {
            this._ventanaModal = new ventanaControl.ventanaControl({
                id: "modal-usuario",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Usuario",
                modal: true,
                onClose: () => console.log("Modal usuario cerrado"),
            });
        };

        private crearContenidoModalUsuario(): void {
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;

            modal.append("h3").attr("id", "titulo-modal-user");

            modal.append("p").text("Nombre");
            modal.append("input").attr("id", "nombre-user");

            modal.append("p").text("Apellido paterno");
            modal.append("input").attr("id", "apellidoP-user");

            modal.append("p").text("Apellido materno");
            modal.append("input").attr("id", "apellidoM-user");

            modal.append("p").text("Usuario");
            modal.append("input").attr("id", "usuario-user");

            modal.append("p").text("Correo");
            modal.append("input").attr("id", "correo-user");

            modal.append("p").text("Teléfono");
            modal.append("input").attr("id", "telefono-user");

            modal.append("p").text("Empresa");
            modal.append("select").attr("id", "id_empresa-user");

            this.llenarSelectEmpresasModal("id_empresa-user");
            modal.append("br");
            modal.append("br");

            modal.append("button")
                .text("Guardar")
                .attr("id", "btn-guardar-user")
                .style("margin-right", "10px");
            this._ventanaModal.mostrar();
        }

        private llenarSelectEmpresasModal(idSelect: string): void {
            const select = d3.select(`#${idSelect}`);
            console.log(select)

            const empresasArray = Array.from(this.empresas.getEmpresas().values());

            select.selectAll("option").remove();
            select.append("option")
                .attr("selected", true)
                .attr("value", "0")
                .text("Selecciona empresa");

            select.selectAll("option.empresa")
                .data(empresasArray)
                .enter()
                .append("option")
                .attr("class", "empresa")
                .attr("value", d => String(d.id))
                .text(d => d.nombre);
        }

        private abrirModalUsuario(esAgregar: boolean, datosExistentesU?: I_Usuarios): void {
            this.crearContenidoModalUsuario();

            d3.select("#titulo-modal-user").text(esAgregar ? "Agregar usuario" : "Editar usuario");

            if (!esAgregar && datosExistentesU) {
                (document.getElementById("nombre-user") as HTMLInputElement).value = datosExistentesU.nombre;
                (document.getElementById("apellidoP-user") as HTMLInputElement).value = datosExistentesU.apellidoPaterno;
                (document.getElementById("apellidoM-user") as HTMLInputElement).value = datosExistentesU.apellidoMaterno;
                (document.getElementById("usuario-user") as HTMLInputElement).value = datosExistentesU.usuario;
                (document.getElementById("correo-user") as HTMLInputElement).value = datosExistentesU.correo;
                (document.getElementById("telefono-user") as HTMLInputElement).value = datosExistentesU.telefono.toString();
                (document.getElementById("id_empresa-user") as HTMLSelectElement).value = datosExistentesU.id_empresa.toString();
            }
            document.getElementById("btn-guardar-user")!.onclick = () => {
                this.guardarUsuario(esAgregar, datosExistentesU);
            }
        };

        private guardarUsuario(esAgregar: boolean, datosExistentesU?: I_Usuarios): void {
            const userNuevo: Partial<I_Usuarios> = {
                nombre: (document.getElementById("nombre-user") as HTMLInputElement).value,
                apellidoPaterno: (document.getElementById("apellidoP-user") as HTMLInputElement).value,
                apellidoMaterno: (document.getElementById("apellidoM-user") as HTMLInputElement).value,
                usuario: (document.getElementById("usuario-user") as HTMLInputElement).value,
                correo: (document.getElementById("correo-user") as HTMLInputElement).value,
                telefono: Number((document.getElementById("telefono-user") as HTMLInputElement).value),
                id_empresa: Number((document.getElementById("id_empresa-user") as HTMLInputElement).value),
            };
            if (esAgregar) {
                const maxId = Math.max(0, ...Array.from(this.usuarios.keys()));
                userNuevo.id = maxId + 1;
                this.usuarios.set(userNuevo.id!, userNuevo as I_Usuarios);
            } else if (datosExistentesU) {
                this.usuarios.set(datosExistentesU.id, { ...datosExistentesU, ...userNuevo } as I_Usuarios);
            }

            this.renderTabla(Array.from(this.usuarios.values()));
            this._ventanaModal.ocultar();
        };

        private mostrarModalConfirmacion(usuario: I_Usuarios): void {
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;

            modal.append("h2").text("Confirmar eliminación");
            modal.append("p")
                .text(`¿Estás seguro de que deseas eliminar la empresa "${usuario.nombre}"?`)

                .style("margin-bottom", "20px");

            const botones = modal.append("div").style("display", "flex").style("gap", "10px");

            botones.append("button")
                .text("Sí, eliminar")
                .on("click", () => {
                    this.usuarios.delete(usuario.id);
                    this.renderTabla(Array.from(this.usuarios.values()));
                    this._ventanaModal.ocultar();
                });
            this._ventanaModal.mostrar();
        };

        private crearControles(): void {
            const contenedorInput = this._conten
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");

            const select = contenedorInput
                .append("select")
                .attr("id", "select-empresa");
            const inputTexto = contenedorInput
                .append("input")
                .attr("type", "text")
                .attr("placeholder", "Filtrar por nombre");

            const aplicarFiltro = () => {
                const textoBusqueda = inputTexto.property("value") || "";
                const valorEmpresa = Number(select.property("value") || 0);
                this.filtrar(textoBusqueda, valorEmpresa);
            };

            select.on("change", aplicarFiltro);
            inputTexto.on("input", aplicarFiltro);

            contenedorInput.append("img")
                .attr("src", "images/nuevo.svg")
                .attr("width", 30)
                .attr("height", 30)
                .style("cursor", "pointer")
                .style("margin-left", "auto")
                .on("click", () => this.abrirModalUsuario(true));
        };

        public llenarSelectEmpresas(): void {
            const select = d3.select("select#select-empresa");

            // Obtener todas las empresas desde C_empresas
            const empresasArray = Array.from(this.empresas.getEmpresas().values());

            select.selectAll("option").remove();
            select.append("option")
                .attr("selected", true)
                .attr("value", "0")
                .text("Selecciona empresa");

            select.selectAll("option.empresa")
                .data(empresasArray)
                .enter()
                .append("option")
                .attr("class", "empresa")
                .attr("value", d => String(d.id))
                .text(d => d.nombre);
        }

        private filtrar(nombre: string, idEmpresa: number) {
            const filtrados = Array.from(this.usuarios.values())
                .filter(u => {
                    const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                    const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                    return coincideNombre && coincideEmpresa;
                });
            this.renderTabla(filtrados);
        }

        private crearTabla(): void {
            const tabla = this._conten.append("table")
                .attr("id", "tabla-usuarios")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");

            let columnaActiva: keyof I_Usuarios | null = null;
            let direccionActiva: 'asc' | 'desc' | null = null;

            const thead = tabla.append("thead");
            const trHead = thead.append("tr");

            const crearColumnaOrdenable = (titulo: string, campo: keyof I_Usuarios) => {
                const th = trHead.append("th")
                    .style("border", "1px solid black")
                    .style("background-color", "#bde9c4ff")
                    .style("padding", "4px");

                const cont = th.append("div")
                    .style("display", "flex")
                    .style("justify-content", "space-between")
                    .style("align-items", "center");

                cont.append("span").text(titulo);

                const flechas = cont.append("span")
                    .style("display", "flex")
                    .style("flex-direction", "column")
                    .style("line-height", "8px");

                const asc = flechas.append("span")
                    .attr("class", `flecha-asc-${campo}`)
                    .style("cursor", "pointer")
                    .style("font-size", "10px")
                    .style("color", "gray")
                    .text("▲")
                    .on("click", () => {
                        const datosOrdenados = ordenar(Array.from(this.usuarios.values()), campo, true);
                        this.renderTabla(datosOrdenados);
                        columnaActiva = campo;
                        direccionActiva = "asc";
                        actualizarFlechas();
                    });

                const desc = flechas.append("span")
                    .attr("class", `flecha-desc-${campo}`)
                    .style("cursor", "pointer")
                    .style("font-size", "10px")
                    .style("color", "gray")
                    .text("▼")
                    .on("click", () => {
                        const datosOrdenados = ordenar(Array.from(this.usuarios.values()), campo, false);
                        this.renderTabla(datosOrdenados);
                        columnaActiva = campo;
                        direccionActiva = "desc";
                        actualizarFlechas();
                    });
            };

            trHead.append("th")
                .text("Acciones")
                .style("border", "1px solid black")
                .style("background-color", "#bde9c4ff")
                .style("padding", "4px");

            crearColumnaOrdenable("Nombre", "nombre");
            crearColumnaOrdenable("Apellido paterno", "apellidoPaterno");
            crearColumnaOrdenable("Apellido materno", "apellidoMaterno");
            crearColumnaOrdenable("Usuario", "usuario");
            crearColumnaOrdenable("Correo", "correo");
            crearColumnaOrdenable("Teléfono", "telefono");
            crearColumnaOrdenable("Empresa", "id_empresa");

            tabla.append("tbody").attr("id", "tabla-usuarios-body");

            const actualizarFlechas = () => {
                const thElements = trHead.selectAll("th").nodes();

                for (let i = 0; i < thElements.length; i++) {
                    const th = d3.select(thElements[i]);

                    const flechaAsc = th.select(`[class*="flecha-asc"]`);
                    const flechaDesc = th.select(`[class*="flecha-desc"]`);

                    if (flechaAsc.empty() || flechaDesc.empty()) continue;
                    const esColumnaActiva = columnaActiva && flechaAsc.attr("class")?.includes(columnaActiva);

                    flechaAsc.style("color", esColumnaActiva && direccionActiva === "asc" ? "black" : "gray");
                    flechaDesc.style("color", esColumnaActiva && direccionActiva === "desc" ? "black" : "gray");
                }
            };
        }

        public async cargar(recargarJson: boolean = true) {
            if (recargarJson) {
                try {
                    const response = await fetch("./datos.json");
                    const data = await response.json();
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
                } catch (error) {
                    console.error("Error al cargar o parsear datos.json:", error);
                }
                this.renderTabla(Array.from(this.usuarios.values()));
                this.llenarSelectEmpresas();
            }
        };

        public renderTabla(data: I_Usuarios[]): void {
            const tbody = d3.select("#tabla-usuarios-body");

            const columnas = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'usuario', 'correo', 'telefono', 'id_empresa'];

            const filas = tbody.selectAll<HTMLTableRowElement, I_Usuarios>("tr")
                .data(data, d => d.id)
                .join(
                    enter => {
                        const tr = enter.append("tr");

                        const acciones = tr.append("td")
                            .classed("acciones", true)
                            .style("border", "1px solid black")
                            .style("padding", "6px")
                            .append("div")
                            .style("display", "flex")
                            .style("gap", "10px");

                        acciones.append("img")
                            .attr("src", "images/editar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (event, d) => {
                                const usuarioActualizado = this.usuarios.get(d.id);
                                if (usuarioActualizado) {
                                    this.abrirModalUsuario(false, usuarioActualizado);
                                }
                            });

                        acciones.append("img")
                            .attr("src", "images/eliminar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (event, d) => this.mostrarModalConfirmacion(d));

                        // Crear celdas de datos
                        for (let i = 0; i < columnas.length; i++) {
                            const clave = columnas[i];
                            tr.append("td")
                                .classed(`data-col-${i}`, true)
                                .style("border", "1px solid black")
                                .style("padding", "6px")
                                .text(d => {
                                    if (clave === "id_empresa") {
                                        // Mostrar nombre de la empresa
                                        const empresa = this.empresas.empresas.get(d.id_empresa);
                                        return empresa ? empresa.nombre : "No asignada";
                                    }
                                    return (d as any)[clave] ?? "—";
                                });
                        }
                        return tr;
                    },
                    update => {
                        for (let i = 0; i < columnas.length; i++) {
                            const clave = columnas[i];
                            update.select(`td.data-col-${i}`)
                                .text(d => {
                                    if (clave === "id_empresa") {
                                        const empresa = this.empresas.empresas.get(d.id_empresa);
                                        return empresa ? empresa.nombre : "No asignada";
                                    }
                                    return (d as any)[clave] ?? "—";
                                });
                        };
                        return update;
                    },
                    exit => exit.remove()
                );
        }
        public abrirPantallaUsuarios(): void {
            this._ventana.mostrar();
        };

        public cerrarPantallaUsuarios(): void {
            this._ventana.ocultar();
        };
    }
    // true por defecto es ascendente 
    export function ordenar<T>(array: T[], propiedad: keyof T, asc: boolean = true) {
        return array.sort((a, b) => {
            const valorA = a[propiedad];
            const valorB = b[propiedad];

            if (typeof valorA === "string" && typeof valorB === "string") {
                if (asc) {
                    return valorA.localeCompare(valorB); // ascendente
                } else {
                    return valorB.localeCompare(valorA); // descendente
                }
            }

            if (typeof valorA === "number" && typeof valorB === "number") {
                if (asc) {
                    return valorA - valorB; // ascendente
                } else {
                    return valorB - valorA; // descendente
                }
            }

            if (typeof valorA === "boolean" && typeof valorB === "boolean") {
                if (asc) {
                    return Number(valorA) - Number(valorB);
                } else {
                    return Number(valorB) - Number(valorA);
                }
            }

            if (valorA instanceof Date && valorB instanceof Date) {
                if (asc) {
                    return valorA.getTime() - valorB.getTime();
                } else {
                    return valorB.getTime() - valorA.getTime();
                }
            }
            return 0;
        });

    };

}
