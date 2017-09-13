// $(document).ready(function(){


var mainVm = new Vue({
    el: '#app',
    data: {
        newUserName: '',
        newUserPassword: '',
        oldUserName: 'Portland',
        oldUserPassword:'p',
        user: {},
        quizPopl: [],
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
        isCorrect: false,
        isWrong: false,
        theQuestion: {},

    },

    created: function(){
        let that = this
        $.get('/me', function(data){
            mainVm.user = data
            that.getMyVocabs()
            console.log(mainVm.allVocabs)
        })
        $.get('/me/vocabs', (data) => {
                this.allVocabs = data
                console.log(this.allVocabs)
            }).then(() => {
                this.makeQuiz()
                this.chooseQuestion()
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
    },

    updated: function(){
        this.getMyWord()
    },

    methods: {
        makeQuiz: function(){
            var quizBuilder = []
            while (quizBuilder.length < 4) {
                let rn = Math.floor(Math.random()*this.allVocabs.length)
                if (!quizBuilder.some((ques) =>{
                    if (ques){
                        return ques.englishword === this.allVocabs[rn].englishword   
                    }
                })) {
                    quizBuilder.push(this.allVocabs[rn])
                }
            }
            console.log('quizBuilder: ', quizBuilder)
            this.quizPopl = quizBuilder
        },

        chooseQuestion: function(){
            let rn = Math.floor(Math.random()*this.quizPopl.length)
            this.theQuestion = this.quizPopl[rn]
            console.log('this.quizPopl: ', this.quizPopl)
        },

        getMyVocabs: function(){
            $.get('/me/vocabs', (data) => {
                this.allVocabs = data
                console.log(this.allVocabs)
            }).then(()=>{
                // this.shuffle()
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
        
        checkRight: function(event, i){
            console.log('checkRight running')
            if (this.theQuestion.englishword === this.quizPopl[i].englishword){
                this.isCorrect = true
                this.isWrong = false
                 setTimeout(() =>{
                    this.makeQuiz()
                    this.isCorrect = false
                    this.getMyWord()
                    this.chooseQuestion()
                }, 1000)
                console.log('isCorrect: ', this.isCorrect)
            }
            else {
                this.isCorrect = false
                this.isWrong = true
                setTimeout(() =>{
                    this.makeQuiz()
                    this.isWrong = false
                    this.getMyWord()
                    this.chooseQuestion()
                }, 1000)
                console.log('isCorrect: ', this.isCorrect)

            }    
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