var lineData = [
    {
        "name": "Father Gascoigne",
        "hits": 1,
        "diff": -1,
        "pbhit": 0,
        "total": 7,
        "pbtotal": 4
    },
    {
        "name": "Cleric Beast",
        "hits": 1,
        "diff": -1,
        "pbhit": 0,
        "total": 7,
        "pbtotal": 4
    }
];

var db = require('../db/counterService');
db.clearDb().then(() => {
    db.loadDb();
})


var app = new Vue({
    el: '#app',
    data: {
        lines : lineData,
        db: db
    },
    methods: {

        doSomething: function() {
            this.db.getLines().then((lines) => {
                console.log('lines', lines);
                this.lines = lines;
            })
        },
        incrementHit: function(el){
            console.log('inc hit', el);
            this.db.addToCounter(el.name, "hits", 1)
                .then((item) => {
                    console.log('got item from promise', item);
                });
        }
    }
})