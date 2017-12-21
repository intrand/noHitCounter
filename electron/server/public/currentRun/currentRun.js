ACTION = {
    INC: "split:inc",
    UP: "split:moveUp",
    DOWN: "split:moveDown"
}

var socket = io();

var currentRunApp = new Vue({
    el: '#app',
    http: {


    },
    data: {
        currentRun: {},
        socket: socket
    },
    mounted: function() {
        console.log('mounted in current run.js');


        this.$http.get('/db/currentRun')
            .then((response) => {
                this.currentRun = response.body;
            })

        this.refresh();
        this.socket.open();
        this.socket.on('currentRunUpdate', function(msg) {
            console.log('run updated', msg);
            this.currentRun = msg.currentRun;
        });
    },
    methods: {
        refresh: function() {
            setTimeout(() => {
                this.$http.get('/db/currentRun')
                    .then((response) => {
                        this.currentRun = response.body;
                        this.refresh();
                    });
            }, 500);
        },
        incrementHit: function(){
            this.currentRun.splits[this.currentRun.currentSplit].hits += 1;
            this.saveRunState();
        },
        moveDown: function() {
            if(this.currentRun.currentSplit < this.currentRun.splits.length){
                this.currentRun.currentSplit += 1;
            }
            this.saveRunState();
        },
        moveUp:function() {
            if(this.currentRun.currentSplit > 0){
                this.currentRun.currentSplit -= 1;
            }
            this.saveRunState();
        },
        saveRunState: function() {
            this.$http.put('/db/runs/' + this.currentRun.id, this.currentRun)
                .then((response) => {
                    console.log('run state save', response.body);
                })
        }
    }
});