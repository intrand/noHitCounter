


var indexApp = new Vue({
    el: '#app',
    http: {
    },
    data: {
        hotkeys : []
    },
    mounted: function(){

        this.loadSettings();
    },
    methods: {

        loadSettings: function() {
            this.$http.get('/db/settings/hotkeys')
                .then((response) => {
                    this.hotkeys = response.body;
                    console.log('update hotkeys ', this.hotkeys);
                });
        },
        save: function() {
            this.$http.put('/db/settings/hotkeys', JSON.stringify(this.hotkeys))
                .then((response) => {
                    this.hotkeys = response.body;
                    window.location.href= "/";
                })

        }


    }
});