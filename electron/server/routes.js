
module.exports = function(app, db, io) {


    /***************************************
     *
     * Run configs
     * ****************************************
     */
    app.route('/db/runconfigs')
        .get((req, res) => {
            res.json(db.get('runConfigs').value());
        })
        .post( (req, res) => {
            var newRunConfig = req.body;
            console.log('new run config: ' + JSON.stringify(newRunConfig));
            res.json(db.get('runConfigs').upsert(newRunConfig)
                .write());
        });

    app.route('/db/runconfigs/:id')
        .get((req, res) => {
           res.json(db.get('runConfigs').getById(req.params.id));
        })
        .put((req, res) =>{
            res.json(db.get('runConfigs').replaceById(req.params.id, req.body));
        })
        .delete((req,res) => {
            res.json(db.get('runConfigs').removeById(req.params.id));
        });


    app.route('/db/settings/hotkeys')
        .get((req, res) => {
            res.json(db.get('settings').value().hotkeys);
        })
        .put((req,res) => {
            var settings = db.get('settings').value();
            settings.hotkeys = req.body;
            db.set('settings', settings).write()
            res.json(db.get('settings').value().hotkeys);
            io.emit("hotkeysSync", {"hotkeys": settings.hotkeys});

        })



    /******************************************************************
     * Runs
     * ***********************
     */

    app.route('/db/runs')
        .get((req,res) => {
            res.json(db.get('runs').value());
        })
        .post((req,res) => {
            res.json(db.get('runs').upsert(req.body));
        })

    app.route('/db/runs/:id')
        .get((req,res) => {
            res.json(db.get('runs').getById(req.params.id));
        })
        .put((req,res) => {
            res.json(db.get('runs').replaceById(req.params.id, req.body));
        })
        .delete((req,res) => {
            res.json(db.get('runs').removeById(req.params.id));
        })

    app.route('/db/currentRun')
        .get((req, res)=> {
            var currRunId = db.get('currentRunId').value();
            if(currRunId && currRunId != undefined && currRunId.length > 0){
                res.json(db.get('runs').getById(currRunId));
            }
            else{
                res.json();
            }
        })

    app.route('/db/currentRun/inc')
        .get((req, res) => {
            var currRunId = db.get('currentRunId').value();
            if(currRunId && currRunId != undefined && currRunId.length > 0){
                var currentRun = db.get('runs').getById(currRunId).value();
                currentRun.splits[currentRun.currentSplit].hits += 1;
                db.get('runs').replaceById(currRunId, currentRun);
                io.emit("currentRunUpdate", {"currentRun": currentRun});
                res.json(currentRun);
            }
            else{
                res.json();
            }
        });

    app.route('/db/currentRun/up')
        .get((req, res) => {
            var currRunId = db.get('currentRunId').value();
            if(currRunId && currRunId != undefined && currRunId.length > 0){
                var currentRun = db.get('runs').getById(currRunId).value();
                if(currentRun.currentSplit > 0){
                    currentRun.currentSplit -= 1;
                    db.get('runs').replaceById(currRunId, currentRun);
                    io.emit("currentRunUpdate", {"currentRun": currentRun});
                }

                res.json(currentRun);
            }
            else{
                res.json();
            }
        })

    app.route('/db/currentRun/down')
        .get((req, res) => {
            var currRunId = db.get('currentRunId').value();
            if(currRunId && currRunId != undefined && currRunId.length > 0){
                var currentRun = db.get('runs').getById(currRunId).value();
                if(currentRun.currentSplit < currentRun.splits.length){
                    currentRun.currentSplit += 1;
                    db.get('runs').replaceById(currRunId, currentRun);
                    io.emit("currentRunUpdate", {"currentRun": currentRun});
                }

                res.json(currentRun);
            }
            else{
                res.json();
            }
        })



    app.route('/run/:id')
        .get((req, res) => {
            db.set('currentRunId', req.params.id).write();
            res.redirect('/currentRun');
        })

}