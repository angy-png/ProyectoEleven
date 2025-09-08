namespace usuarios {
    export class VistaUsuarios {
        private _ventana: ventanaControl.ventanaControl;
        private _ventanaModal: ventanaControl.ventanaControl;
        private _ventanaConfirmacion: ventanaControl.ventanaControl;
        private _conten: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private _selectEmpresas!: d3.Selection<HTMLSelectElement, unknown, HTMLElement, any>;

        public empresas: empresas.I_empresas[] = [];

        public onAgregarEditar?: (modo: "agregar" | "editar", datos?: I_Usuarios) => void;
        public onEliminar?: (usuario: I_Usuarios) => void;
        public onOrdenar?: (campo: keyof I_Usuarios, asc: boolean) => void;
        public onFiltrar?: (texto: string, idEmpresa: number) => void;
        public onEmpresasActualizadas?: (listaEmpresas: empresas.I_empresas[]) => void;

        constructor() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada");
                }
            });
            this._conten = this._ventana._contenedor;

            this.crearControles();
            this.crearTabla();
            this.crearModal();
            this.crearModalConfirmacion();
        }
        public actualizarSelectEmpresas(empresas: empresas.I_empresas[]) {
            this._selectEmpresas.selectAll("option").remove(); // limpiar
            // opción "todas"
            this._selectEmpresas.append("option")
                .attr("value", "0")
                .text("Todas las empresas");

            this._selectEmpresas.selectAll<HTMLOptionElement, empresas.I_empresas>("option.empresa")
                .data(empresas, d => d.id)
                .join(
                    enter => enter.append("option")
                        .attr("class", "empresa")
                        .attr("value", d => String(d.id))
                        .text(d => d.nombre)
                );
        }
        
        private crearControles(): void {
            const contenedorInput = this._conten.append("div")
                .style("display", "flex")
                .style("gap", "10px");

            this._selectEmpresas = contenedorInput.append("select").attr("id", "select-empresa");

            const inputTexto = contenedorInput.append("input")
                .attr("type", "text")
                .attr("placeholder", "Filtrar por nombre");

            const aplicarFiltro = () => {
                const textoBusqueda = inputTexto.property("value") || "";
                const valorEmpresa = Number(this._selectEmpresas.property("value") || 0);
                this.onFiltrar?.(textoBusqueda, valorEmpresa);
            };

            this._selectEmpresas.on("change", aplicarFiltro);
            inputTexto.on("input", aplicarFiltro);

            contenedorInput.append("img")
                .attr("src", "images/nuevo.svg")
                .attr("width", 30)
                .attr("height", 30)
                .style("cursor", "pointer")
                .style("margin-left", "auto")
                .on("click", () => this.onAgregarEditar?.("agregar"));
        }

        private crearTabla(): void {
            const tabla = this._conten.append("table")
                .attr("id", "tabla-usuarios")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");

            const columnas: I_columna[] = [
                { titulo: 'Acciones', campo: null },
                { titulo: 'Nombre', campo: 'nombre' },
                { titulo: 'Apellido paterno', campo: 'apellidoPaterno' },
                { titulo: 'Apellido materno', campo: 'apellidoMaterno' },
                { titulo: 'Usuario', campo: 'usuario' },
                { titulo: 'Correo', campo: 'correo' },
                { titulo: 'Teléfono', campo: 'telefono' },
                { titulo: 'Empresa', campo: 'id_empresa' }
            ];

            let columnaActiva: keyof I_Usuarios | null = null;
            let direccionActiva: 'asc' | 'desc' | null = null;

            const thead = tabla.append("thead");
            const trHead = thead.append("tr");

            const ths = trHead.selectAll("th")
                .data(columnas)
                .enter()
                .append("th")
                .style("border", "1px solid black")
                .style("background-color", "#bde9c4ff")
                .style("padding", "4px");

            // Recorremos los th generados con for
            const thNodes = ths.nodes();
            for (let i = 0; i < columnas.length; i++) {
                const columna = columnas[i];
                const th = d3.select(thNodes[i]);

                if (!columna.campo) {
                    th.text(columna.titulo);
                    continue;
                }

                const cont = th.append("div")
                    .style("display", "flex")
                    .style("justify-content", "space-between");
                cont.append("span").text(columna.titulo);

                const flechas = cont.append("span")
                    .style("display", "flex")
                    .style("flex-direction", "column");
                const asc = flechas.append("span")
                    .attr("class", "flecha-asc")
                    .style("cursor", "pointer")
                    .style("font-size", "10px")
                    .style("color", "gray")
                    .text("▲");

                const desc = flechas.append("span")
                    .attr("class", "flecha-desc")
                    .style("cursor", "pointer")
                    .style("font-size", "10px")
                    .style("color", "gray")
                    .text("▼");

                asc.on("click", () => {
                    this.onOrdenar?.(columna.campo!, true);
                    columnaActiva = columna.campo!;
                    direccionActiva = 'asc';
                    actualizarFlechas();
                });

                desc.on("click", () => {
                    this.onOrdenar?.(columna.campo!, false);
                    columnaActiva = columna.campo!;
                    direccionActiva = 'desc';
                    actualizarFlechas();
                });
            }

            tabla.append("tbody").attr("id", "tabla-usuario-body");

            const actualizarFlechas = () => {
                const thsActual = trHead.selectAll("th").nodes();
                for (let i = 0; i < columnas.length; i++) {
                    const columna = columnas[i];
                    if (!columna.campo) continue;
                    const th = d3.select(thsActual[i]);
                    const asc = th.select(".flecha-asc");
                    const desc = th.select(".flecha-desc");
                    if (columna.campo === columnaActiva) {
                        asc.style("color", direccionActiva === 'asc' ? "black" : "gray");
                        desc.style("color", direccionActiva === 'desc' ? "black" : "gray");
                    } else {
                        asc.style("color", "gray");
                        desc.style("color", "gray");
                    }
                }
            };
        }

        public actualizarEmpresas(nuevasEmpresas: empresas.I_empresas[], usuarios: I_Usuarios[]) {
            this.empresas = nuevasEmpresas;   // actualiza la lista interna de empresas
            this.actualizarSelectEmpresas(nuevasEmpresas);
            this.renderTabla(usuarios);       // refresca la tabla de usuarios con nombres de empresa actualizados
        }


        public renderTabla(data: I_Usuarios[]): void {
            const tbody = d3.select("#tabla-usuario-body");
            const columnas = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'usuario', 'correo', 'telefono', 'id_empresa'];

            const filas = tbody.selectAll<HTMLTableElement, I_Usuarios>("tr")
                .data(data, d => d.id)
                .join(
                    enter => {
                        const tr = enter.append("tr");
                        const acciones = tr.append("td").style("border", "1px solid black").style("padding", "6px");
                        const contAcc = acciones.append("div").style("display", "flex").style("gap", "10px");

                        contAcc.append("img")
                            .attr("src", "images/editar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (event, d) => this.onAgregarEditar?.("editar", d));

                        contAcc.append("img")
                            .attr("src", "images/eliminar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (event, d) => this.onEliminar?.(d));

                        for (let i = 0; i < columnas.length; i++) {
                            const clave = columnas[i];
                            const td = tr.append("td")
                                .classed(`data-col-${i}`, true)
                                .style("border", "1px solid black")
                                .style("padding", "6px");

                            td.text(d => {
                                if (clave === 'id_empresa') {
                                    const empresa = this.empresas.find(e => e.id === d.id_empresa);
                                    return empresa ? empresa.nombre : "—";
                                }
                                return (d as any)[clave] ?? "—";
                            });
                        }

                        return tr;
                    },
                    update => {
                        for (let i = 0; i < columnas.length; i++) {
                            const clave = columnas[i];
                            update.select(`td.data-col-${i}`).text(d => {
                                if (clave === 'id_empresa') {
                                    const empresa = this.empresas.find(e => e.id === d.id_empresa);
                                    return empresa ? empresa.nombre : "—";
                                }
                                return (d as any)[clave] ?? "—";
                            });
                        }
                        return update;
                    },

                    exit => exit.remove()

                );
        }

        private crearModal(): void {
            this._ventanaModal = new ventanaControl.ventanaControl({
                id: "modal-usuario",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Usuario",
                modal: true,
                onClose: () => console.log("Modal usuario cerrado"),
            });
        }

        private crearModalConfirmacion(): void {
            this._ventanaConfirmacion = new ventanaControl.ventanaControl({
                id: "modal-confirmacion-usuario",
                ancho: 300,
                alto: 150,
                colorFondo: "#f8d7da",
                titulo: "Confirmar Eliminación",
                modal: true,
                onClose: () => console.log("Modal usuario cerrado"),
            });
        }

        public mostrarModal(datos?: I_Usuarios, guardarCb?: (nuevo: Partial<I_Usuarios>) => void): void {
            const modal = this._ventanaModal._contenido;
            this._ventanaModal.limpiarContenido();
            modal.append("h3").text(datos ? "Editar" : "Agregar");

            // Campos del usuario
            const campos = ["nombre", "apellidoPaterno", "apellidoMaterno", "usuario", "correo", "telefono", "id_empresa"];

            for (let i = 0; i < campos.length; i++) {
                const campo = campos[i];
                modal.append("p").text(campo);

                if (campo === "id_empresa") {
                    // Crear select para empresas
                    const select = modal.append("select").attr("id", campo).style("display", "block").style("margin-bottom", "10px");

                    // Llenar opciones con empresas
                    this.empresas.forEach(e => {
                        select.append("option")
                            .attr("value", e.id)
                            .text(e.nombre);
                    });

                    // Seleccionar empresa actual si es edición
                    if (datos) select.property("value", datos.id_empresa);

                } else {
                    // Input normal
                    modal.append("input")
                        .attr("id", campo)
                        .style("margin-bottom", "10px")
                        .style("display", "block")
                        .property("value", datos?.[campo as keyof I_Usuarios] ?? "");
                }
            }

            // Botón Guardar
            modal.append("button")
                .text("Guardar")
                .on("click", () => {
                    const nuevoUsuario: Partial<I_Usuarios> = {};

                    for (let i = 0; i < campos.length; i++) {
                        const campo = campos[i];
                        let valor: any;

                        if (campo === "id_empresa") {
                            // Tomar valor del select
                            const select = document.getElementById(campo) as HTMLSelectElement;
                            valor = Number(select.value);
                        } else if (campo === "telefono") {
                            const input = document.getElementById(campo) as HTMLInputElement;
                            valor = Number(input.value);
                        } else {
                            const input = document.getElementById(campo) as HTMLInputElement;
                            valor = input.value;
                        }

                        nuevoUsuario[campo as keyof I_Usuarios] = valor as never;
                    }

                    console.log("Datos editados por el usuario:", nuevoUsuario);

                    guardarCb?.(nuevoUsuario);
                    this._ventanaModal.ocultar();
                });

            this._ventanaModal.mostrar();
        }


        public mostrarConfirmacion(mensaje: string, confirmarCb: () => void): void {
            const modal = this._ventanaConfirmacion._contenido;
            this._ventanaConfirmacion.limpiarContenido();
            modal.append("p").text(mensaje);

            const botones = modal.append("div").style("margin-top", "10px").style("text-align", "right");

            botones.append("button")
                .text("Cancelar")
                .style("margin-right", "5px")
                .on("click", () => this._ventanaConfirmacion.ocultar());

            botones.append("button")
                .text("Eliminar")
                .style("background-color", "#dc3545")
                .style("color", "white")
                .on("click", () => {
                    confirmarCb();
                    this._ventanaConfirmacion.ocultar();
                });

            this._ventanaConfirmacion.mostrar();
        }

        public mostrar(): void { this._ventana.mostrar(); }
        public ocultar(): void { this._ventana.ocultar(); }


    }
} 