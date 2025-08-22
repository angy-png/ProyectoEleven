var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var empresas;
(function (empresas) {
    class C_empresas {
        constructor() {
            this.empresas = new Map();
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
        cargar() {
            return __awaiter(this, arguments, void 0, function* (recargarJson = true) {
                if (recargarJson) {
                    const response = yield fetch("./empresas.json");
                    const data = yield response.json();
                    this.empresas.clear();
                    // recorrer y llenar el Map
                    for (let i = 0; i < data.length; i++) {
                        let u = data[i];
                        this.empresas.set(u.id, u);
                    }
                }
                // convertir Map a arreglo y renderizar tabla
                this.renderTabla(Array.from(this.empresas.values()));
            });
        }
        renderTabla(data) {
            const tbody = d3.select("#tabla-empresas-body");
            const columnas = ["nombre", "rfc", "telefono", "activo", "fechaRegistro"];
            const filas = tbody.selectAll("tr")
                .data(data, d => d.id)
                .join(enter => {
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
                });
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
                        var _a;
                        if (clave === "fechaRegistro") {
                            // convertir UTC → zona horaria local del dispositivo
                            const fecha = new Date(d.fechaRegistro);
                            return fecha.toLocaleString();
                        }
                        // as type assertion "confia que d es de tipo I_empresas"
                        return (_a = d[clave]) !== null && _a !== void 0 ? _a : "—";
                    });
                });
                return tr;
            }, update => {
                columnas.forEach((clave, i) => {
                    update.select(`td.data-col-${i}`)
                        .text(d => {
                        var _a;
                        if (clave === "fechaRegistro") {
                            const fecha = new Date(d.fechaRegistro);
                            return fecha.toLocaleString();
                        }
                        return (_a = d[clave]) !== null && _a !== void 0 ? _a : "—";
                    });
                });
                return update;
            }, exit => exit.remove());
        }
        crearTabla() {
            const tabla = this._conten.append("table")
                .attr("id", "tabla-empresas")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "2opx");
            const columnas = [
                { titulo: 'Acciones', campo: null },
                { titulo: 'Nombre', campo: 'nombre' },
                { titulo: 'Rfc', campo: 'rfc' },
                { titulo: 'Telefono', campo: 'telefono' },
                { titulo: 'Activo', campo: 'activo' },
                { titulo: 'Fecha Refistro', campo: 'fechaRegistro' }
            ];
            let columnaActiva = null;
            let direccionActiva = null;
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
                .each((d, i, nodes) => {
                if (!d.campo)
                    return;
                const th = d3.select(nodes[i]);
                const asc = th.select(".flecha-asc");
                const desc = th.select(".flecha-desc");
                asc.on("click", () => {
                    const datosOrdenados = usuarios.ordenar(Array.from(this.empresas.values()), d.campo, true);
                    this.renderTabla(datosOrdenados);
                    columnaActiva = d.campo;
                    direccionActiva = 'asc';
                    actualizarFlechas();
                });
                desc.on("click", () => {
                    const datosOrdenados = usuarios.ordenar(Array.from(this.empresas.values()), d.campo, false);
                    this.renderTabla(datosOrdenados);
                    columnaActiva = d.campo;
                    direccionActiva = 'desc';
                    actualizarFlechas();
                });
            });
            tabla.append("tbody").attr("id", "tabla-empresas-body");
            const actualizarFlechas = () => {
                trHead.selectAll("th").each((d, i, nodes) => {
                    if (!d.campo)
                        return;
                    const th = d3.select(nodes[i]);
                    const asc = th.select(".flecha-asc");
                    const desc = th.select(".flecha-desc");
                    if (d.campo === columnaActiva) {
                        asc.style("color", direccionActiva === 'asc' ? "black" : "gray");
                        desc.style("color", direccionActiva === 'desc' ? "black" : "gray");
                    }
                    else {
                        asc.style("color", "gray");
                        desc.style("color", "gray");
                    }
                });
            };
        }
        crearModalUsuario() {
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
        mostrarModalConfirmacion(empresa) {
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
                console.log(this.empresas);
                this.cargar(false);
                this._ventanaModal.ocultar();
            });
            this._ventanaModal.mostrar();
        }
        abrirPantallaEmpresas() {
            this._ventana.mostrar();
        }
        cerrarPantallaEpresas() {
            this._ventana.ocultar();
        }
    }
    empresas.C_empresas = C_empresas;
})(empresas || (empresas = {}));
//# sourceMappingURL=empresas.js.map