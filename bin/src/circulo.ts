namespace circu {
    export class circu{
    crearControlador(): CirculoController {
        const model = new CirculoModel();
        const view = new CirculoView();
        return new CirculoController(model, view);
    }

    }
   
}

 