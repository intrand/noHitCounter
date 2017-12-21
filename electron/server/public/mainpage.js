

var emptySetup = {"name":"", "type": "", "splits": []};
var emptySplit = {"name":"", hits: 0}



var indexApp = new Vue({
    el: '#app',
    http: {
    },
    data: {
        runs : [],
        viewForm: false,
        currentSetup: emptySetup
    },
    mounted: function(){
        console.log('mounted executed');

        this.$http.get('/db/runconfigs').then((response)=> {
            console.log('got rnconfigs' + JSON.stringify(response));
            this.runs = response.body;
        },(error) => {
            console.log('error getting runconfigs ' + JSON.stringify(error));
        })

    },
    methods: {

        sendSocketMessage: function(){
            console.log("sending sockets stuff", this.socket);
            this.socket.send("sending stuff");
        },
        editSetup: function(item){
            this.viewForm = true;
            console.log('item', item);
            this.currentSetup = JSON.parse(JSON.stringify(item));
        },
        saveSetup: function(setup){
            this.$http.post('/db/runconfigs', setup)
                .then((response) => {
                    this.loadRunConfigs();
                })
            this.currentSetup = JSON.parse(JSON.stringify(emptySetup));
            this.viewForm = false;
        },
        deleteSetup: function(item){
            this.$http.delete('/db/runconfigs/' + item.id)
                .then((response) => {
                    this.loadRunConfigs();
                })
        },
        cancelSetup: function(){
            this.currentSetup = JSON.parse(JSON.stringify(emptySetup));
            this.viewForm = false;
        },
        addNew: function(){
            this.currentSetup = JSON.parse(JSON.stringify(emptySetup));
            this.viewForm = true;
        },

        startRun: function(item){
            var newRun = JSON.parse(JSON.stringify(item));
            newRun.startDate = new Date();
            newRun.currentSplit = 0;
            this.$http.post('/db/runs', newRun)
                .then((response) => {
                    console.log('response', response.body);
                    window.location.href = "/run/" + response.body.id;
                });

        },
        loadRunConfigs: function(){
            this.$http.get("/db/runconfigs").then((response) => {
                this.runs = response.body
            });
        },
        newSplit: function() {
            this.currentSetup.splits.push(this.getEmptySplit());
        },
        onSubmit: function() {
            console.log('on submit');
        },
        getEmptySplit: function(){
            return JSON.parse(JSON.stringify(emptySplit));
        }

    }
});