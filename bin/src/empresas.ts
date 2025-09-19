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
        campo: keyof I_empresas;
    }

    export class C_empresas {
        public empresas: Map<number, I_empresas> = new Map();
        private _ventanaModal: ventanaControl.ventanaControl;
        private _ventana: ventanaControl.ventanaControl;
        private _conten: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

        private formatFecha = d3.timeFormat("%d/%m/%Y, %I:%M:%S %p");
        private formatInputFecha = d3.timeFormat("%Y-%m-%dT%H:%M");

        private onEmpresasChange?: () => void;


        constructor() {
            this.pantPrincipal()
            this.crearVentanaModalEmpresa();
            this.crearControles();
            this.crearTabla();
            this.cargar();
        }

        public setOnEmpresasChange(callback: () => void) {
            this.onEmpresasChange = callback;
        }

        private notificarCambio() {
            if (this.onEmpresasChange) this.onEmpresasChange();
        }


        public pantPrincipal() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "VentanaEmpresas",
                ancho: 900, alto: 400,
                colorFondo: "white", titulo: "Empresas",
                onClose() {
                    console.log("ventana empresas fue cerrada");
                },
            });
            this._conten = this._ventana._contenedor;
        };

        public abrirPantallaEmpresas(): void {
            this._ventana.mostrar();
        };

        public cerrarPantallaEmpresas(): void {
            this._ventana.ocultar();
        };

        private crearVentanaModalEmpresa(): void {
            this._ventanaModal = new ventanaControl.ventanaControl({
                id: "modal-empresa",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Usuario",
                modal: true,
                onClose: () => console.log("Modal empresa cerrado"),
            });
        };

        private crearContenidoModalEmpresa(): void {
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;

            modal.append("h3").attr("id", "titulo-modal-empre");

            modal.append("p").text("Nombre");
            modal.append("input").attr("id", "nombre-empre");

            modal.append("p").text("RFC");
            modal.append("input").attr("id", "rfc-empre");

            modal.append("p").text("Teléfono");
            modal.append("input").attr("id", "telefono-empre");

            modal.append("p").text("Activo");
            const select = modal.append("select").attr("id", "activo-empre");
            select.append("option").attr("value", "true").text("Sí");
            select.append("option").attr("value", "false").text("No");

            modal.append("p").text("Fecha de registro");
            modal.append("input").attr("id", "fechaRegistro-empre").attr("type", "datetime-local");

            modal.append("button")
                .text("Guardar")
                .attr("id", "btn-guardar-empre")
                .style("margin-right", "10px");

            this._ventanaModal.mostrar();
        };

        private abrirModalEmpresa(esAgregar: boolean, datosExistentes?: I_empresas): void {
            this.crearContenidoModalEmpresa();

            d3.select("#titulo-modal-empre").text(esAgregar ? "Agregar empresa" : "Editar empresa");

            if (!esAgregar && datosExistentes) {
                (document.getElementById("nombre-empre") as HTMLInputElement).value = datosExistentes.nombre;
                (document.getElementById("rfc-empre") as HTMLInputElement).value = datosExistentes.rfc;
                (document.getElementById("telefono-empre") as HTMLInputElement).value = datosExistentes.telefono.toString();
                (document.getElementById("activo-empre") as HTMLSelectElement).value = datosExistentes.activo ? "true" : "false";
                (document.getElementById("fechaRegistro-empre") as HTMLInputElement).value = this.formatInputFecha(datosExistentes.fechaRegistro);
            }

            document.getElementById("btn-guardar-empre")!.onclick = () => {
                this.guardarEmpresa(esAgregar, datosExistentes);
            };
        };

        private guardarEmpresa(esAgregar: boolean, datosExistentes?: I_empresas): void {
            const nuevaEmpresa: Partial<I_empresas> = {
                nombre: (document.getElementById("nombre-empre") as HTMLInputElement).value,
                rfc: (document.getElementById("rfc-empre") as HTMLInputElement).value,
                telefono: Number((document.getElementById("telefono-empre") as HTMLInputElement).value),
                activo: (document.getElementById("activo-empre") as HTMLSelectElement).value === "true",
                fechaRegistro: new Date((document.getElementById("fechaRegistro-empre") as HTMLInputElement).value),
            };

            if (esAgregar) {
                const maxId = Math.max(0, ...Array.from(this.empresas.keys()));
                nuevaEmpresa.id = maxId + 1;
                this.empresas.set(nuevaEmpresa.id!, nuevaEmpresa as I_empresas);
            } else if (datosExistentes) {
                this.empresas.set(datosExistentes.id, { ...datosExistentes, ...nuevaEmpresa } as I_empresas);
            }
            this.renderTabla(Array.from(this.empresas.values()));
            this._ventanaModal.ocultar();
            this.notificarCambio();
        };

        private mostrarModalConfirmacion(empresa: I_empresas): void {
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;

            modal.append("h2").text("Confirmar eliminación");
            modal.append("p")
                .text(`¿Estás seguro de que deseas eliminar la empresa "${empresa.nombre}"?`)
                .style("margin-bottom", "20px");

            const botones = modal.append("div").style("display", "flex").style("gap", "10px");

            botones.append("button")
                .text("Sí, eliminar")
                .on("click", () => {
                    this.empresas.delete(empresa.id);
                    this.renderTabla(Array.from(this.empresas.values()));
                    this._ventanaModal.ocultar();
                    this.notificarCambio();
                });
            this._ventanaModal.mostrar();
        };

        private crearControles(): void {
            const contenedorInput = this._conten
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");


            const inputTexto = contenedorInput.append("input").attr("type", "text").attr("placeholder", "Filtrar por nombre");

            const aplicarFiltro = () => {
                const textoBusqueda = inputTexto.property("value") || "";

                this.filtrar(textoBusqueda);
            };

            inputTexto.on("input", aplicarFiltro);

            contenedorInput.append("img")
                .attr("src", "images/nuevo.svg")
                .attr("width", 30)
                .attr("height", 30)
                .style("cursor", "pointer")
                .style("margin-left", "auto")
                .on("click", () => this.abrirModalEmpresa(true));
        };

        private filtrar(nombre: string) {
            const filtrados = Array.from(this.empresas.values()) //map a array 
                .filter(u => {
                    // Filtrar por nombre si se escribió algo, true si nombre es vacío, null, undefined, etc.  ||=o
                    const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());
                    return coincideNombre;
                });

            this.renderTabla(filtrados);
        };

        public getEmpresas(): Map<number, I_empresas> {
            return this.empresas;
        };

        private crearTabla(): void {
            const tabla = this._conten.append("table")
                .attr("id", "tabla-empresas")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");

            let columnaActiva: keyof I_empresas | null = null;
            let direccionActiva: 'asc' | 'desc' | null = null;

            const thead = tabla.append("thead");
            const trHead = thead.append("tr");

            //Helper para crear columnas con ordenamiento
            const crearColumnaOrdenable = (titulo: string, campo: keyof I_empresas) => {
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
                        const datosOrdenados = usuarios.ordenar(Array.from(this.empresas.values()), campo, true);
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
                        const datosOrdenados = usuarios.ordenar(Array.from(this.empresas.values()), campo, false);
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
            crearColumnaOrdenable("RFC", "rfc");
            crearColumnaOrdenable("Teléfono", "telefono");
            crearColumnaOrdenable("Activo", "activo");
            crearColumnaOrdenable("Fecha registro", "fechaRegistro");

            //Cuerpo de tabla
            tabla.append("tbody").attr("id", "tabla-empresas-body");

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
        };

        public async cargar(recargarJson: boolean = true) {
            if (recargarJson) {
                try {
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
                        console.log("nueva emp" + empreNueva.fechaRegistro)
                    }
                } catch (error) {
                    console.error("Error al cargar o parsear empresas.json:", error);
                }
                this.renderTabla(Array.from(this.empresas.values()));
            }
        };

        private renderTabla(data: I_empresas[]): void {
            const tbody = d3.select("#tabla-empresas-body");

            const columnas = ["nombre", "rfc", "telefono", "activo", "fechaRegistro"];

            const filas = tbody.selectAll<HTMLTableElement, I_empresas>("tr")
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
                                const usuarioActualizado = this.empresas.get(d.id);
                                if (usuarioActualizado) {
                                    this.abrirModalEmpresa(false, usuarioActualizado);
                                }
                            })

                        acciones.append("img")
                            .attr("src", "images/eliminar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (event, d) => this.mostrarModalConfirmacion(d));


                        for (let i = 0; i < columnas.length; i++) {
                            const clave = columnas[i];

                            tr.append("td")
                                .classed(`data-col-${i}`, true)
                                .style("border", "1px solid black")
                                .style("padding", "6px")
                                .text(d => {
                                    const valor = d[clave];
                                    if (clave === 'activo') {
                                        return valor ? "Si" : "No";
                                    }
                                    return valor instanceof Date ? this.formatFecha(valor) : String(valor);
                                });
                        }
                        return tr;
                    }, update => {
                        for (let i = 0; i < columnas.length; i++) {
                            const clave = columnas[i];
                            update.select(`td.data-col-${i}`)
                                .text(d => {
                                    const valor = d[clave];

                                    if (clave === 'activo') {
                                        return valor ? "Si" : "No";
                                    }
                                    return valor instanceof Date ? this.formatFecha(valor) : String(valor);
                                });

                        };
                        return update;
                    },
                    exit => exit.remove()
                );
        };
    }
}
