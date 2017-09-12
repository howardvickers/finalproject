// $(document).ready(function(){


var mainVm = new Vue({
    el: '#app',
    data: {
        newUserName: '',
        newUserPassword: '',
        oldUserName: 'Portland',
        oldUserPassword:'p',
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
        randQuizVocabs: [],
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
            // if not equal to eachWord
           randomIndex = Math.floor(Math.random()*this.allVocabs.length)
           console.log('randomIndex: ', randomIndex)
           console.log(this.allVocabs)
           return this.allVocabs[randomIndex]
        },
        quizWord2: function(){
           randomIndex = Math.floor(Math.random()*this.allVocabs.length)
           console.log('randomIndex: ', randomIndex)
           console.log(this.allVocabs)
           return this.allVocabs[randomIndex]
        },
        quizWord3: function(){
           randomIndex = Math.floor(Math.random()*this.allVocabs.length)
           console.log('randomIndex: ', randomIndex)
           console.log(this.allVocabs)
           return this.allVocabs[randomIndex]
        },
        
    },

    updated: function(){
        mainVm.quizVocabs = [mainVm.quizWord1,mainVm.quizWord2, mainVm.quizWord3, mainVm.eachWord]
    },

    methods: {
        getMyVocabs: function(){
            $.get('/me/vocabs', function(data){
                mainVm.allVocabs = data
                console.log(mainVm.allVocabs)
            }).then(()=>{
                this.shuffle()
            })
        },

        shuffle: function() {
            console.log(this.quizVocabs)
            var n=4, i;
            // While there remain elements to shuffle…
            while (n) {
                // Pick a remaining element…
                i = Math.floor(Math.random() * n--);
                // And move it to the new array.
                this.randQuizVocabs.push(this.quizVocabs.splice(i, 1)[0]);
            }
            console.log(this.randQuizVocabs)
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