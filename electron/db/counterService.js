var _db = new PouchDB('hitcounter');

var startData = {
    lines:
    [{
        "name": "Father Gascoigne",
        "hits": 1,
        "diff": -1,
        "pbhit": 0,
        "total": 7,
        "pbtotal": 1453
    },
    {
        "name": "Cleric Beast",
        "hits": 1,
        "diff": -1,
        "pbhit": 0,
        "total": 7,
        "pbtotal": 4
    }]}
;


module.exports = {

    loadDb: function() {
        console.log('load db called');
        _db.post(startData).then((response) => {
            console.log('load db done ', response);
        }).catch((err) => {
            console.error('error loading db', err);
        })
    },

    clearDb : function(){
        return _db.destroy().then((response) => {
            _db = new PouchDB('hitcounter');
            return;
        });

    },

    getLines : function (){
        return _db.allDocs({include_docs: true}).then((response) => {
            console.log("got response", response);
            var newLines = {}
            if(response.rows.length == 1){
                newLines = response.rows[0].doc;
            }
            console.log('return new lines: ', newLines);
            return newLines;
        });
    },

    addToCounter : function(name, type, incAmount){
        return _db.allDocs({include_docs: true}).then((response) => {
            console.log("got response", response);
            var newLines = {}
            if(response.rows.length == 1){
                newLines = response.rows[0].doc;
            }
            return newLines;
        }).then((lines) => {

        });
    }
}
