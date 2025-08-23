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

    export interface I_columna {
        titulo: string;
        campo: keyof I_Usuarios; // keyofoperador de tipos (tipo de union)
    }

    export class Usuarios {
        //Map<K,V> k: tipo de clave  V:tipo de valor  = se crea un nuevo mapa vacio 
        private usuarios: Map<number, I_Usuarios> = new Map();

        private _ventana: ventanaControl.ventanaControl;
        private _conten: d3.Selection<
            HTMLDivElement,//GElement, tipo del elemento seleccionado (ej. HTMLDivElement)
            unknown, //Datum, tipo de los datos asociados (unknown si no se sabe)
            HTMLElement, //PElement, tipo del padre de ese elemento (ej. HTMLElement)
            any>;//PDatum, tipo de los datos del padre (any si no importa)
        private _ventanaModal: ventanaControl.ventanaControl;

        constructor() {
            this._ventana = new ventanaControl.ventanaControl({
                id: "ventanaUsuarios",
                ancho: 800,
                alto: 400,
                colorFondo: "white",
                titulo: "Usuarios",
                onClose() {
                    console.log("La ventana de usuario fue cerrada");
                },
            });
            this._conten = this._ventana._contenedor;
            this.crearControles();
            this.crearModalUsuario();
            this.crearTabla();
            this.cargar();

            // formato fecha/separadorT/hora/z hora en utc
            const fecha = new Date();

            console.log("Local:", fecha.toString());
            console.log("UTC:", fecha.toUTCString());
            const fechaUTC = new Date("2025-08-19T20:53:13Z"); // fecha en UTC

            // Lista de zonas horarias mexicanas (IANA)
            const zonas = [
                "America/Tijuana",      // UTC-8
                "America/Hermosillo",   // UTC-7
                "America/Mazatlan",     // UTC-7
                "America/Mexico_City",  // UTC-6
                "America/Cancun"        // UTC-5
            ];

            zonas.forEach(zona => {
                const formato = new Intl.DateTimeFormat("es-MX", {
                    timeZone: zona,
                    dateStyle: "full",
                    timeStyle: "long"
                });
                console.log(`Hora en ${zona}:`, formato.format(fechaUTC));
            });

        }
        // metodo asincrono, espera la respuesta sin bloquear el programa y regresa una promesa 
        public async cargar(recargarJson: boolean = true): Promise<void> {
            if (recargarJson) {
                const response = await fetch("./datos.json"); //await espera el resultado de una promesa 
                const data: I_Usuarios[] = await response.json();
                this.usuarios.clear();
                data.forEach(u => this.usuarios.set(u.id, u));  // map.set(clave, valor);
            }
            //transforma algo iterable(se puede recorrer) en un array
            this.renderTabla(Array.from(this.usuarios.values()));
            this.llenarSelectEmpresas();
        }

        private llenarSelectEmpresas(): void {
            const select = d3.select("select#select-empresa");

            const empresasUnicas = Array.from(
                new Set(Array.from(this.usuarios.values()).map(u => u.id_empresa))
            );
            select.selectAll("option").remove();
            select.append("option").attr("selected", true).text("Selecciona empresa");
            select.selectAll("option.empresa")
                .data(empresasUnicas)
                .enter()
                .append("option")
                .attr("class", "empresa")
                .attr("value", d => String(d))
                .text(d => `Empresa ${d}`);
        }

        private filtrar(nombre: string, idEmpresa: number) {
            const filtrados = Array.from(this.usuarios.values()) //map a array 
                .filter(u => {

                    console.log("que es u:" + u.nombre);

                    // Filtrar por nombre si se escribió algo, true si nombre es vacío, null, undefined, etc.  ||=o
                    const coincideNombre = !nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase());

                    // Filtrar por empresa si se seleccionó un id válido (>0)
                    const coincideEmpresa = !idEmpresa || u.id_empresa === idEmpresa;
                    return coincideNombre && coincideEmpresa;
                });

            this.renderTabla(filtrados);
        }

        private crearControles(): void {
            const contenedorInput = this._conten
                .append("div")
                .style("display", "flex")
                .style("gap", "10px");

            const select = contenedorInput.append("select").attr("id", "select-empresa");

            const inputTexto = contenedorInput.append("input").attr("type", "text").attr("placeholder", "Filtrar por nombre");

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
                .on("click", () => this.abrirModalUsuario("agregar"));
        }

        private crearModalUsuario(): void {
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

        private crearTabla(): void {
            const tabla = this._conten.append("table")
                .attr("id", "tabla-usuarios")
                .style("width", "100%")
                .style("border-collapse", "collapse") //bordes compartidas 
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

            const thead = tabla.append("thead");//encabezado 
            const trHead = thead.append("tr"); //fila 

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
                        const datosOrdenados = ordenar(Array.from(this.usuarios.values()), d.campo!, true);
                        this.renderTabla(datosOrdenados);
                        columnaActiva = d.campo!; //no nulo 
                        direccionActiva = 'asc';
                        actualizarFlechas();
                    });

                    desc.on("click", () => {
                        const datosOrdenados = ordenar(Array.from(this.usuarios.values()), d.campo!, false);
                        this.renderTabla(datosOrdenados);
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

        private renderTabla(data: I_Usuarios[]): void {
            const tbody = d3.select("#tabla-usuarios-body");

            const columnas = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'usuario', 'correo', 'telefono', 'id_empresa'];

            const filas = tbody.selectAll<HTMLTableRowElement, I_Usuarios>("tr")
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
                            .on("click", (event, d) => {
                                const usuarioActualizado = this.usuarios.get(d.id);
                                if (usuarioActualizado) {
                                    this.abrirModalUsuario("editar", usuarioActualizado);
                                }
                            });

                        acciones.append("img")
                            .attr("src", "images/eliminar.svg")
                            .attr("width", 20)
                            .attr("height", 20)
                            .style("cursor", "pointer")
                            .on("click", (event, d) => this.mostrarModalConfirmacion(d));

                        // Columnas de datos
                        columnas.forEach((clave, i) => {
                            tr.append("td")
                                .classed(`data-col-${i}`, true)
                                .style("border", "1px solid black")
                                .style("padding", "6px")
                                .text(d => (d as I_Usuarios)[clave] ?? "—");
                        });

                        return tr;
                    },
                    update => {
                        columnas.forEach((clave, i) => {
                            update.select(`td.data-col-${i}`)
                                .text(d => (d as I_Usuarios)[clave] ?? "—");
                        });
                        return update;
                    },
                    exit => exit.remove()
                );
        }

        private mostrarModalConfirmacion(usuario: I_Usuarios): void {
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
                    this.usuarios.delete(usuario.id);
                    this.cargar(false);
                    this._ventanaModal.ocultar();
                });
            this._ventanaModal.mostrar();
        }

        private abrirModalUsuario(modo: "agregar" | "editar", datosExistentes?: I_Usuarios): void {
            this._ventanaModal.limpiarContenido();
            const modal = this._ventanaModal._contenido;

            modal.append("h3")
                .text(modo === "agregar" ? "Agregar" : "Editar");

            const campos = [
                { id: "nombre", label: "Nombre" },
                { id: "apellidoPaterno", label: "Apellido paterno" },
                { id: "apellidoMaterno", label: "Apellido materno" },
                { id: "usuario", label: "Usuario" },
                { id: "correo", label: "Correo" },
                { id: "telefono", label: "Teléfono" },
                { id: "id_empresa", label: "Empresa" }
            ];

            campos.forEach(campo => {
                modal.append("p").text(campo.label);
                modal.append("input")
                    .attr("id", campo.id)
                    .style("margin-bottom", "10px")
                    .style("display", "block")
                    .property("value", datosExistentes?.[campo.id] ?? "");
            });

            modal.append("button")
                .text("Guardar")
                .style("margin-right", "10px")
                .on("click", () => {
                    const nuevoUsuario: Partial<I_Usuarios> = {};

                    campos.forEach(campo => {
                        const input = document.getElementById(campo.id) as HTMLInputElement;
                        let valor: any = input.value;

                        if (campo.id === "id_empresa" || campo.id === "telefono") {
                            valor = Number(valor);
                        }
                        nuevoUsuario[campo.id as keyof I_Usuarios] = valor as never;
                    });

                    if (modo === "agregar") {
                        nuevoUsuario.id = this.usuarios.size + 1;
                        this.usuarios.set(nuevoUsuario.id!, nuevoUsuario as I_Usuarios);
                    } else if (modo === "editar" && datosExistentes) {
                        this.usuarios.set(datosExistentes.id, {
                            // actualiza datosExistentes con nuevos datos, sin perder los datos que no cambian
                            ...datosExistentes,
                            ...nuevoUsuario
                        } as I_Usuarios);
                    }

                    this.cargar(false);
                    this.llenarSelectEmpresas();
                    this._ventanaModal.ocultar();
                });
            this._ventanaModal.mostrar();
        }

        public abrirPantallaUsuarios(): void {
            this._ventana.mostrar();
        }

        public cerrarPantallaUsuarios(): void {
            this._ventana.ocultar();
        }
    }

    // T tipo generico  
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

            return 0;
        });

    }

}
