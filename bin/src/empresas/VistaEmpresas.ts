namespace empresas{
    export class  VistaEmpresa{

          constructor(
            private ventana: ventanaControl.ventanaControl
        ) {
        }

         public crearModalUsuario(): void {
            this.ventana = new ventanaControl.ventanaControl({
                id: "modal-empresa",
                ancho: 400,
                alto: 350,
                colorFondo: "#a5c9f1ff",
                titulo: "Usuario",
                modal: true,
                onClose: () => console.log("Modal empresa cerrado"),
            });
        }

          public crearControles(): void {
            const contenedorInput = this.ventana._contenido
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");
           

            const inputTexto = contenedorInput.append("input").attr("type", "text").attr("placeholder", "Filtrar por empresa");
            const aplicarFiltro = () => {
                const textoBusqueda = inputTexto.property("value") || "";
               
            }
            inputTexto.on("input", aplicarFiltro);

            contenedorInput.append("img")
                .attr("src", "images/nuevo.svg")
                .attr("width", 30)
                .attr("height", 30)
                .style("cursor", "pointer")
                .style("margin-left", "auto") 
        }

             public crearTablaUser(): void {
            const tabla = this.ventana._contenido.append("table")
                .attr("id", "tabla-usuarios")
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
                })

                // d: datos de columna, indice arreglo de nodos 
                .each((d: I_columna, i, nodes) => {
                    if (!d.campo) return;

                    const th = d3.select(nodes[i]);
                    const asc = th.select(".flecha-asc");
                    const desc = th.select(".flecha-desc");

                    asc.on("click", () => {
                     
                        columnaActiva = d.campo!; //no nulo 
                        direccionActiva = 'asc';
                        actualizarFlechas();
                    });


                    desc.on("click", () => {
                     
                        columnaActiva = d.campo!;
                        direccionActiva = 'desc';
                        actualizarFlechas();
                    });
                });

            tabla.append("tbody").attr("id", "tabla-usuarios-body");

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

        
        public renderizarUser(data: I_empresas[]): void {
            const tbody = d3.select("#tabla-usuarios-body");

                const columnas = ["nombre", "rfc", "telefono", "activo", "fechaRegistro"]; 


             const filas = tbody.selectAll<HTMLTableRowElement, I_empresas>("tr")
                .data(data, d => d.id)
                .join(
                    enter => {
                        const tr = enter.append("tr");

                        // Columna de acciones
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
                           

                        acciones.append("img")
                            .attr("src", "images/eliminar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            

                        for (let i = 0; i < columnas.length; i++) {
                            const clave = columnas[i];
                            tr.append("td")
                                .classed(`data-col-${i}`, true)
                                .style("border", "1px solid black")
                                .style("padding", "6px")
                                .text(d => (d as I_empresas)[clave] ?? "—");
                        }
                        return tr;
                    },
                    update => {
                        for (let i = 0; i < columnas.length; i++) {
                            const clave = columnas[i];
                            update.select(`td.data-col-${i}`)
                                .text(d => (d as I_empresas)[clave] ?? "—");
                        };
                        return update;
                    },
                    exit => exit.remove()
                );
        }


    }
}