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
        private empresas: Map<number, I_empresas> = new Map();

        private _ventana: ventanaControl.ventanaControl;
        private _conten: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private _ventanaModal: ventanaControl.ventanaControl;
        constructor() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "VentanaEmpresas",
                ancho: 900,
                alto: 400,
                colorFondo: "white",
                titulo: "Empresas",
                onClose() {
                    console.log("ventana empresas fue cerrada");
                },
            });
            this._conten = this._ventana._contenedor;

            this.crearModalUsuario();
            this.crearTabla();
            this.cargar();
        }


        // public async cargar(recargarJson: boolean = true): Promise<void> {
        //     if (recargarJson) {
        //         const response = await fetch("./empresas.json");
        //         const data: [] = await response.json(); 
        //         this.empresas.clear();

                
        //         // data.forEach(u => {this.empresas.set(u.id, u)}) ; 
        //         for(let i= 0;  i< data.length; i++ ){
        //             let _empresa[]
        //             //ciclos de comunicacion
        //             //usar for con para recorrer un arreglo y despues extraer lños datos para ahgreg<rlo a una rrelfo
                    
        //         }



        //     }
        //     this.renderTabla(Array.from(this.empresas.values()));

        // }


        
 public async cargar(recargarJson: boolean = true): Promise<void> {
    if (recargarJson) {
        const response = await fetch("./empresas.json");
        const data: I_empresas[] = await response.json(); 
 
        this.empresas.clear();

        // recorrer y llenar el Map
        for (let i = 0; i < data.length; i++) {
            let u = data[i];
            this.empresas.set(u.id, u);
        }
    }

    // convertir Map a arreglo y renderizar tabla
    this.renderTabla(Array.from(this.empresas.values()));
}



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
                            .style("gap", "1opx");

                        acciones.append("img")
                            .attr("src", "images/editar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (event, d) => {
                                const usuarioActualizado = this.empresas.get(d.id);
                                if (usuarioActualizado) {

                                }
                            })

                        acciones.append("img")
                            .attr("src", "images/eliminar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (event, d) => this.mostrarModalConfirmacion(d));

                        columnas.forEach((clave, i) => {
                            tr.append("td")
                                .classed(`data-col-${i}`, true)
                                .style("border", "1px solid black")
                                .style("padding", "6px")
                                .text(d => {

                                    if (clave === "fechaRegistro") {
                                        // convertir UTC → zona horaria local del dispositivo
                                        const fecha = new Date(d.fechaRegistro);
                                        return fecha.toLocaleString();
                                    }
                                    // as type assertion "confia que d es de tipo I_empresas"
                                    return (d as I_empresas)[clave] ?? "—";
                                });
                        });


                        return tr;
                    }, update => {
                        columnas.forEach((clave, i) => {
                            update.select(`td.data-col-${i}`)
                                .text(d => {
                                    if (clave === "fechaRegistro") {
                                        const fecha = new Date(d.fechaRegistro);
                                        return fecha.toLocaleString();
                                    }
                                    return (d as I_empresas)[clave] ?? "—";
                                });
                        });

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
                .style("margin-top", "2opx");

            const columnas: I_columna[] = [
                { titulo: 'Acciones', campo: null },
                { titulo: 'Nombre', campo: 'nombre' },
                { titulo: 'Rfc', campo: 'rfc' },
                { titulo: 'Telefono', campo: 'telefono' },
                { titulo: 'Activo', campo: 'activo' },
                { titulo: 'Fecha Refistro', campo: 'fechaRegistro' }
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
                        .style("justify-content", "space-between")
                        .style("aling-items", "center");

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

                })
                .each((d: I_columna, i, nodes) => {

                    if (!d.campo) return;

                    const th = d3.select(nodes[i]);
                    const asc = th.select(".flecha-asc");
                    const desc = th.select(".flecha-desc");

                    asc.on("click", () => {
                        const datosOrdenados = usuarios.ordenar(Array.from(this.empresas.values()), d.campo!, true);
                        this.renderTabla(datosOrdenados);
                        columnaActiva = d.campo!;
                        direccionActiva = 'asc';
                        actualizarFlechas();
                    });

                    desc.on("click", () => {
                        const datosOrdenados = usuarios.ordenar(Array.from(this.empresas.values()), d.campo!, false);
                        this.renderTabla(datosOrdenados);
                        columnaActiva = d.campo!;
                        direccionActiva = 'desc';
                        actualizarFlechas();
                    });
                });

            tabla.append("tbody").attr("id", "tabla-empresas-body")

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
                })
            }
        }

        private crearModalUsuario(): void {
            this._ventanaModal = new ventanaControl.ventanaControl({
                id: "modal-empresa",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Usuario",
                modal: true,
                onClose: () => console.log("Modal empresa cerrado"),
            });
        }

        private mostrarModalConfirmacion(empresa: I_empresas): void {
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;

            modal.append("h2").text("Confirmar eliminación");
            modal.append("p")
                .text("¿Estás seguro de que deseas eliminar este usuario?")
                .style("margin-bottom", "20px");

            const botones = modal.append("div").style("display", "flex").style("gap", "10px");

            botones.append("button")
                .text("Sí, eliminar")
                .on("click", () => {
                    this.empresas.delete(empresa.id);
                    console.log(this.empresas)
                    this.cargar(false);
                    this._ventanaModal.ocultar();
                });
            this._ventanaModal.mostrar();
        }


        public abrirPantallaEmpresas(): void {
            this._ventana.mostrar();
        }

        public cerrarPantallaEpresas(): void {
            this._ventana.ocultar();
        }

    }
}
