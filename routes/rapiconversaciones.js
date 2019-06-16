module.exports = function (app, gestorBD) {



    app.get("/api/producto/conversacion/:id", function (req, res) {
        console.log("_id");
        console.log(req.headers['email']);

        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)}
        gestorBD.obtenerProductos(criterio, function (productos) {
            if (productos == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);

            }
        });
    });



}