var runssetup = [
    {"name":"run type 1", "type": "nohit", "splits": {"name": "bossman 1", "best_hit":0, "hits": 1}},
    {"name":"run type 2", "type": "nohit", "splits": {"name": "bossman 2", "best_hit":0, "hits": 1}}
];

var emptySetup = {"name":"", "type": "", "splits": []};

var indexApp = new Vue({
    el: '#app',
    data: {
        runs : runssetup,
        viewForm: false,
        currentSetup: emptySetup
    },
    methods: {

        doSomething: function() {
            console.log("do something");
            this.viewForm = !this.viewForm;
        },
        editSetup: function(item){
            this.viewForm = true;
            console.log('item', item);
            this.currentSetup = item;
        },
        saveSetup: function(setup){
            console.log('save setup', setup);
            this.currentSetup = emptySetup;
            this.viewForm = false;
        },
        cancelSetup: function(){
            this.currentSetup = emptySetup;
            this.viewForm = false;
        }
    }
});