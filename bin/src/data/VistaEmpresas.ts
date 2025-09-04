namespace empresas {
    export class VistaEmpresas {
        private _ventana: ventanaControl.ventanaControl;
        private _ventanaModal: ventanaControl.ventanaControl;
        private _conten: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private formatFecha = d3.timeFormat("%d/%m/%Y, %I:%M:%S %p");
        private formatInputFecha = d3.timeFormat("%Y-%m-%dT%H:%M");
// En VistaEmpresas
public onEmpresasActualizadas?: (listaEmpresas: I_empresas[]) => void;


        private _ventanaConfirmacion: ventanaControl.ventanaControl;


        public onAgregarEditar?: (modo: "agregar" | "editar", datos?: I_empresas) => void;
        public onEliminar?: (empresa: I_empresas) => void;
        public onOrdenar?: (campo: keyof I_empresas, asc: boolean) => void;
        public onFiltrar?: (texto: string) => void;

        constructor() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "VentanaEmpresas",
                ancho: 900, alto: 400,
                colorFondo: "white", titulo: "Empresas",
                onClose() {
                    console.log("ventana empresas fue cerrada");
                },
            });
            this._conten = this._ventana._contenedor;

            this.crearControles();
            this.crearTabla();
            this.crearModal();
            this.crearModalConfirmacion();

        }

        

        private crearControles(): void {
            const contenedorInput = this._conten
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");

            const inputTexto = contenedorInput.append("input")
                .attr("type", "text")
                .attr("placeholder", "Filtrar por empresa");

            inputTexto.on("input", () => {
                const texto = inputTexto.property("value") || "";
                this.onFiltrar?.(texto);
            });

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

            trHead.selectAll("th")
                .data(columnas)
                .enter()
                .append("th")
                .style("border", "1px solid black")
                .style("background-color", "#bde9c4ff")
                .style("padding", "4px")
                .each(function (d) {
                    const th = d3.select(this);
                    if (!d.campo) {
                        th.text(d.titulo);
                        return;
                    }
                    const cont = th.append("div")
                        .style("display", "flex")
                        .style("justify-content", "space-between");
                    cont.append("span").text(d.titulo);
                    const flechas = cont.append("span")
                        .style("display", "flex")
                        .style("flex-direction", "column");
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
                })
                .each((d: I_columna, i, nodes) => {
                    if (!d.campo) return;
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
                });

            tabla.append("tbody").attr("id", "tabla-empresas-body");

            const actualizarFlechas = () => {
                trHead.selectAll("th").each((d: I_columna, i, nodes) => {
                    if (!d.campo) return;
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
                });
            };
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

        public renderTabla(data: I_empresas[]): void {
            const tbody = d3.select("#tabla-empresas-body");

            const columnas = ["nombre", "rfc", "telefono", "activo", "fechaRegistro"];

            const filas = tbody.selectAll<HTMLTableElement, I_empresas>("tr")
                .data(data, d => d.id)
                .join(
                    enter => {
                        const tr = enter.append("tr");
                        const acciones = tr.append("td")
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
                            .on("click", (event, d) => this.onAgregarEditar?.("editar", d));

                        acciones.append("img")
                            .attr("src", "images/eliminar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (event, d) => this.onEliminar?.(d));

                        columnas.forEach((clave, i) => {
                            tr.append("td")
                                .classed(`data-col-${i}`, true)
                                .style("border", "1px solid black")
                                .style("padding", "6px")
                                .text(d => {
                                    const valor = d[clave as keyof I_empresas];
                                    if (clave === "activo") {
                                        return valor ? "Sí" : "No";
                                    }
                                    return valor instanceof Date ? this.formatFecha(valor) : String(valor);
                                });
                        });
                        return tr;
                    },
                    update => {
                        columnas.forEach((clave, i) => {
                            update.select(`td.data-col-${i}`)
                                .text(d => {
                                    const valor = d[clave as keyof I_empresas];
                                    if (clave === "activo") {
                                        return valor ? "Sí" : "No";
                                    }
                                    return valor instanceof Date ? this.formatFecha(valor) : String(valor);
                                });
                        });
                        return update;
                    },
                    exit => exit.remove()
                );
        }
public mostrarModal(
    datos?: I_empresas,
    guardarCb?: (nuevaEmpresa: Partial<I_empresas>) => void
): void {
    // Limpiar contenido previo
    this._ventanaModal.limpiarContenido();
    const modal = this._ventanaModal._contenido;

    modal.append("h3").text(datos ? "Editar" : "Agregar");

    const campos: { id: keyof I_empresas; label: string }[] = [
        { id: "nombre", label: "Nombre" },
        { id: "rfc", label: "RFC" },
        { id: "telefono", label: "Teléfono" },
        { id: "activo", label: "Activo" },
        { id: "fechaRegistro", label: "Fecha de Registro" }
    ];

    campos.forEach(campo => {
        modal.append("p").text(campo.label);

        if (campo.id === "activo") {
            const select = modal.append("select")
                .attr("data-campo", campo.id)
                .style("margin-bottom", "10px")
                .style("display", "block");

            select.append("option").attr("value", "true").text("Sí");
            select.append("option").attr("value", "false").text("No");

            if (datos) select.property("value", datos.activo ? "true" : "false");

        } else if (campo.id === "fechaRegistro") {
            const fechaInput = modal.append("input")
                .attr("type", "datetime-local")
                .attr("data-campo", campo.id)
                .style("margin-bottom", "10px")
                .style("display", "block");

            if (datos) fechaInput.property("value", this.formatInputFecha(datos.fechaRegistro));

        } else {
            modal.append("input")
                .attr("type", "text")
                .attr("data-campo", campo.id)
                .style("margin-bottom", "10px")
                .style("display", "block")
                .property("value", datos?.[campo.id] ?? "");
        }
    });

    modal.append("button")
        .text("Guardar")
        .on("click", () => {
            const nuevaEmpresa: Partial<I_empresas> = {};

            campos.forEach(campo => {
                const input = modal.select(`[data-campo='${campo.id}']`).node() as HTMLInputElement;
                let valor: string | number | boolean | Date = input.value;

                if (campo.id === "telefono") valor = Number(valor);
                else if (campo.id === "activo") valor = valor.toLowerCase() === "true";
                else if (campo.id === "fechaRegistro") valor = new Date(valor);

                nuevaEmpresa[campo.id] = valor as never;
            });

            guardarCb?.(nuevaEmpresa);
            this._ventanaModal.ocultar();
        });

    this._ventanaModal.mostrar();
}

        private crearModalConfirmacion(): void {
    this._ventanaConfirmacion = new ventanaControl.ventanaControl({
        id: "modal-confirmacion",
        ancho: 300,
        alto: 150,
        colorFondo: "#f8d7da",
        titulo: "Confirmar Eliminación",
        modal: true,
        onClose: () => console.log("Modal de confirmación cerrado"),
    });
}


public mostrarConfirmacion(mensaje: string, confirmarCb: () => void): void {
    this._ventanaConfirmacion.limpiarContenido();
    const contenido = this._ventanaConfirmacion._contenido;

    contenido.append("p").text(mensaje);

    const botones = contenido.append("div")
        .style("margin-top", "10px")
        .style("text-align", "right");

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



        public mostrar(): void {
            this._ventana.mostrar();
        }

        public ocultar(): void {
            this._ventana.ocultar();
        }
    }
}
