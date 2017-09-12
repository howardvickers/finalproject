// $(document).ready(function(){


var mainVm = new Vue({
    el: '#app',
    data: {
        newUserName: '',
        newUserPassword: '',
        oldUserName: '',
        oldUserPassword:'',
        user: {},
        allVocabs: [],
        quizVocabs: [],
        // eachWord:{},
        wordIndex: 0,
        randomIndex: 0,
        kyrgyzWord: '',
        englishWord: '',
        isInVisible: true,
        isVisible: false,
        wordKnown: 0,
        active1: false,
        active2: false,
        active3: false,
        active4: false,

    },

    created: function(){
        let that = this
        $.get('/me', function(data){
            mainVm.user = data
            that.getMyVocabs()
            console.log(mainVm.allVocabs)
        })
    },

    computed: {
        eachWord: function(){
            if (this.allVocabs.length === 0){
                return {
                    englishword: '',
                    kyrgyzword: '',
                }
            } else {
            console.log(mainVm.allVocabs)
            return this.allVocabs[this.wordIndex]
            }
        },
        quizWord1: function(){
           randomIndex = Math.ceil(Math.random()*mainVm.allVocabs.length-1)
           console.log('randomIndex: ', randomIndex)
           console.log(mainVm.allVocabs)
           return this.allVocabs[randomIndex]
        },
        quizWord2: function(){
           randomIndex = Math.ceil(Math.random()*mainVm.allVocabs.length-1)
           console.log('randomIndex: ', randomIndex)
           console.log(mainVm.allVocabs)
           return this.allVocabs[randomIndex]
        },
        quizWord3: function(){
           randomIndex = Math.ceil(Math.random()*mainVm.allVocabs.length-1)
           console.log('randomIndex: ', randomIndex)
           console.log(mainVm.allVocabs)
           return this.allVocabs[randomIndex]
        },
    },


    methods: {
        getMyVocabs: function(){
            $.get('/me/vocabs', function(data){
                mainVm.allVocabs = data
                console.log(mainVm.allVocabs)
            })
        },

        getMyWord: function(){
            $.get('/me/word', function(data){
                console.log('getMyWord: ', data)
                mainVm.eachWord = data
            })
        },

        toggleVisible: function(event){
            if (this.isInVisible === false) {
                this.isInVisible = true
                this.isVisible = false
            } else {
                this.isInVisible = false
                this.isVisible = true
            }
        },
        mouseOver: function(active) {
            this[active] = !this[active];
            console.log("flag " + this.active);
        },

        
        
        createUser: function(event){
            event.preventDefault()
            var that = this
            console.log(this.newUserName)

            $.ajax({
                url: '/lang-user', 
                type: 'POST',
                data: JSON.stringify({username: this.newUserName, password: this.newUserPassword}), 
                contentType: 'application/json; charset=utf-8', 
                dataType: 'json',
                success: function(dataFromServer) {
                    console.log('dataFromServer: ', dataFromServer)
                    if (dataFromServer.success){
                        window.location.href="/dash.html"
                    }
                }
            })
        },

        signInUser: function(event){
            event.preventDefault()
            var that = this

            console.log(this.oldUserName)

            $.ajax({
                url: 'signin-user', 
                type: 'POST',
                data: JSON.stringify({username: this.oldUserName, password: this.oldUserPassword}),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer){
                    console.log('dataFromServer: ', dataFromServer)
                    if(dataFromServer.success){
                            window.location.href="/dash.html"
                    }
                }
            })
        },

        createVocab: function(event){
            event.preventDefault()
            var that = this
            console.log(this.kyrgyzWord, this.englishWord)

            $.ajax({
                url: '/create-vocab',
                type: 'POST',
                data: JSON.stringify({
                    _languser: mainVm.user._id,
                    kyrgyzword: this.kyrgyzWord,
                    englishword: this.englishWord

                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer){
                    console.log(dataFromServer)
                    if (dataFromServer.success){
                        mainVm.getMyVocabs()


                    }
                }
            })
        }

    }
})



// })