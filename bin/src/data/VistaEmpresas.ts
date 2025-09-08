namespace empresas {

    export class VistaEmpresas implements controladorBase.IVista<I_empresas> {
        private _ventana: ventanaControl.ventanaControl;
        private _ventanaModal: ventanaControl.ventanaControl;
        private _ventanaConfirmacion: ventanaControl.ventanaControl;
        private _conten: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private empresasCache: I_empresas[] = [];

        private formatFecha = d3.timeFormat("%d/%m/%Y, %I:%M:%S %p");
        private formatInputFecha = d3.timeFormat("%Y-%m-%dT%H:%M");
        public onOrdenar?: (campo: keyof I_empresas, asc: boolean) => void;
        public onAgregarEditar?: (modo: "agregar" | "editar", datos?: I_empresas) => void;
        public onEliminar?: (empresa: I_empresas) => void;
        public onFiltrar?: (texto: string) => void;

        constructor() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventanaEmpresas",
                ancho: 900,
                alto: 400,
                colorFondo: "white",
                titulo: "Empresas",
                onClose() {
                    console.log("Ventana empresas cerrada");
                }
            });
            this._conten = this._ventana._contenedor;
            this.crearControles();
            this.crearTabla();
            this.crearModal();
            this.crearModalConfirmacion();
        }

        private crearControles(): void {
            const cont = this._conten.append("div")
                .style("display", "flex")
                .style("gap", "10px");


            const inputTexto = cont.append("input")
                .attr("type", "text")
                .attr("placeholder", "Filtrar por nombre");

            const aplicarFiltro = () => {
                const textoBusqueda = inputTexto.property("value") || "";
                this.onFiltrar?.(textoBusqueda);
            };
            inputTexto.on("input", aplicarFiltro);
            
            cont.append("img")
                .attr("src", "images/nuevo.svg")
                .attr("width", 30)
                .attr("height", 30)
                .style("cursor", "pointer")
                .style("margin-left", "auto")
                .on("click", () => this.onAgregarEditar?.("agregar"));
        }

        public renderTabla(data: I_empresas[]): void {
            this.empresasCache = data;
            const tbody = d3.select("#tabla-empresas-body");
            const columnas = ["nombre", "rfc", "telefono", "activo", "fechaRegistro"];

            tbody.selectAll<HTMLTableRowElement, I_empresas>("tr")
                .data(data, d => d.id)
                .join(
                    enter => {
                        const tr = enter.append("tr");
                        const acciones = tr.append("td").style("border", "1px solid black");
                        const cont = acciones.append("div").style("display", "flex").style("gap", "10px");

                        cont.append("img")
                            .attr("src", "images/editar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (_, d) => this.onAgregarEditar?.("editar", d));

                        cont.append("img")
                            .attr("src", "images/eliminar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (_, d) => this.onEliminar?.(d));

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
                    },
                    update => {
                        for (let i = 0; i < columnas.length; i++) {
                            const clave = columnas[i];
                            update.select(`td.data-col-${i}`)
                                .text(d => {
                                    const valor = d[clave];
                                    if (clave === 'activo') { return valor ? "Si" : "No"; }
                                    return valor instanceof Date ? this.formatFecha(valor) : String(valor);
                                });
                        };
                        return update;
                    },
                    exit => exit.remove()
                );
        }

       private crearTabla(): void {
    const tabla = this._conten.append("table")
        .attr("id", "tabla-empresas")
        .style("width", "100%")
        .style("border-collapse", "collapse")
        .style("margin-top", "20px");

    const columnas: I_columna[] = [
        { titulo: 'Acciones', campo: null },
        { titulo: 'Nombre', campo: 'nombre' },
        { titulo: 'Rfc', campo: 'rfc' },
        { titulo: 'Telefono', campo: 'telefono' },
        { titulo: 'Activo', campo: 'activo' },
        { titulo: 'Fecha registro', campo: 'fechaRegistro' }
    ];

    let columnaActiva: keyof I_empresas | null = null;
    let direccionActiva: 'asc' | 'desc' | null = null;

    const thead = tabla.append("thead");
    const trHead = thead.append("tr");

    // Crear th
    const ths = trHead.selectAll("th").data(columnas).enter().append("th")
        .style("border", "1px solid black")
        .style("background-color", "#bde9c4ff")
        .style("padding", "4px");

    const nodes = ths.nodes(); // array de nodos

    // Rellenar contenido de cada th
    for (let i = 0; i < columnas.length; i++) {
        const d = columnas[i];
        const th = d3.select(nodes[i]);

        if (!d.campo) {
            th.text(d.titulo);
            continue;
        }

        const cont = th.append("div")
            .style("display", "flex")
            .style("justify-content", "space-between")
            .style("align-items", "center");
        cont.append("span").text(d.titulo);

        const flechas = cont.append("span")
            .style("display", "flex")
            .style("flex-direction", "column")
            .style("line-height", "8px");

        flechas.append("span")
            .attr("class", "flecha-asc")
            .style("cursor", "pointer")
            .style("font-size", "10px")
            .style("color", "gray")
            .text("▲");

        flechas.append("span")
            .attr("class", "flecha-desc")
            .style("cursor", "pointer")
            .style("font-size", "10px")
            .style("color", "gray")
            .text("▼");
    }

    // Agregar eventos a flechas
    for (let i = 0; i < columnas.length; i++) {
        const d = columnas[i];
        if (!d.campo) continue;
        const th = d3.select(nodes[i]);

        th.select(".flecha-asc").on("click", () => {
            this.onOrdenar?.(d.campo!, true);
            columnaActiva = d.campo!;
            direccionActiva = 'asc';
            actualizarFlechas();
        });

        th.select(".flecha-desc").on("click", () => {
            this.onOrdenar?.(d.campo!, false);
            columnaActiva = d.campo!;
            direccionActiva = 'desc';
            actualizarFlechas();
        });
    }

    // Cuerpo de la tabla
    tabla.append("tbody").attr("id", "tabla-empresas-body");

    // Función para actualizar colores de flechas
    const actualizarFlechas = () => {
        for (let i = 0; i < columnas.length; i++) {
            const d = columnas[i];
            if (!d.campo) continue;
            const th = d3.select(nodes[i]);
            const asc = th.select(".flecha-asc");
            const desc = th.select(".flecha-desc");

            if (d.campo === columnaActiva) {
                asc.style("color", direccionActiva === 'asc' ? "black" : "gray");
                desc.style("color", direccionActiva === 'desc' ? "black" : "gray");
            } else {
                asc.style("color", "gray");
                desc.style("color", "gray");
            }
        }
    }
}


        private crearModal(): void {
            this._ventanaModal = new ventanaControl.ventanaControl({
                id: "modal-empresa",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Empresa",
                modal: true,
                onClose: () => console.log("Modal empresa cerrado"),
            });
        }

        private crearModalConfirmacion(): void {
            this._ventanaConfirmacion = new ventanaControl.ventanaControl({
                id: "modal-confirmacion-empresa",
                ancho: 300,
                alto: 150,
                colorFondo: "#f8d7da",
                titulo: "Confirmar Eliminación",
                modal: true,
                onClose: () => console.log("Modal empresa cerrado"),
            });
        }

      public mostrarModal(datos?: I_empresas, guardarCb?: (nuevaEmpresa: Partial<I_empresas>) => void): void {
    const modal = this._ventanaModal._contenido;
    this._ventanaModal.limpiarContenido();

    const modalIdPrefix = `modal-${Date.now()}`;

    modal.append("h3").text(datos ? "Editar Empresa" : "Agregar Empresa");

    const campos: (keyof I_empresas)[] = ["nombre", "rfc", "telefono", "activo", "fechaRegistro"];

    for (let i = 0; i < campos.length; i++) {
        const campo = campos[i];
        const inputId = `${modalIdPrefix}-${campo}`;

        modal.append("p").text(campo);

        if (campo === "activo") {
            const select = modal.append("select").attr("id", inputId);
            select.append("option").attr("value", "true").text("Sí");
            select.append("option").attr("value", "false").text("No");
            if (datos) select.property("value", datos.activo ? "true" : "false");
        } else if (campo === "fechaRegistro") {
            modal.append("input")
                .attr("id", inputId)
                .attr("type", "datetime-local")
                .style("display", "block")
                .property("value", datos ? this.formatInputFecha(datos.fechaRegistro) : "");
        } else {
            modal.append("input")
                .attr("id", inputId)
                .style("display", "block")
                .style("margin-bottom", "10px")
                .property("value", datos ? datos[campo] : "");
        }
    }

    modal.append("button")
        .text("Guardar")
        .on("click", () => {
            const nuevaEmpresa: Partial<I_empresas> = {};

            for (let i = 0; i < campos.length; i++) {
                const campo = campos[i];
                const input = document.getElementById(`${modalIdPrefix}-${campo}`) as HTMLInputElement;
                let valor: any = input.value;

                if (campo === "telefono") valor = Number(valor);
                if (campo === "activo") valor = valor === "true";
                if (campo === "fechaRegistro") valor = new Date(valor);

                nuevaEmpresa[campo] = valor as never;
            }

            console.log("Datos guardados:", nuevaEmpresa);
            guardarCb?.(nuevaEmpresa);
            this._ventanaModal.ocultar();
        });

    this._ventanaModal.mostrar();
}

        public mostrarConfirmacion(mensaje: string, confirmarCb: () => void): void {
            const modal = this._ventanaConfirmacion._contenido;
            this._ventanaConfirmacion.limpiarContenido();
            modal.append("p").text(mensaje);

            modal.append("button")
                .text("Cancelar")
                .on("click", () => this._ventanaConfirmacion.ocultar());

            modal.append("button")
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
