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
        testItem: 'this is a test',
        checkedObject: '',

    },

    created: function(){
        let that = this
        $.get('/me', function(data){
            mainVm.user = data
            that.getMyVocabs()
            console.log(mainVm.allVocabs)
            console.log('wordknown: ', this.wordknown )
            console.log('kyrgyzWord: ', this.kyrgyzWord )
            console.log('#39 this.checkedObject: ', this.checkedObject)

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
                    wordknown: 0,
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
                this.eachWord = data
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
        
        // WORK ON THIS ON THURSDAY!!!
        incrKnown: function(){
            this.wordKnown = 0
            // console.log('incrKnown started to run')
            // console.log('#122 this.kyrgyzword: ', this.kyrgyzword )
            console.log('#123 this.checkedObject: ', this.checkedObject )
            console.log('#124 this.checkedObject.kyrgyzword: ', this.checkedObject.kyrgyzword )
            // console.log('#123 this.quizPopl[i].englishword: ', this.quizPopl[i].englishword,)
            
            this.wordKnown += 1
            console.log('#128 this.checkedObject.wordknown: ', this.checkedObject.wordknown )
            console.log('#129 this.wordKnown: ', this.wordKnown )
            $.ajax({
                url: '/incr-known',
                type: 'PUT',
                data: JSON.stringify({
                    _id: this.checkedObject._id,
                    _languser: mainVm.user._id,
                    kyrgyzword: this.checkedObject.kyrgyzword,
                    englishword: this.checkedObject.englishword,
                    wordknown: this.wordKnown,
                    testitem: this.testItem
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

        },


        decrKnown: function(){
            this.wordKnown = 0
            // console.log('incrKnown started to run')
            // console.log('#122 this.kyrgyzword: ', this.kyrgyzword )
            console.log('#161 this.checkedObject: ', this.checkedObject )
            console.log('#162 this.checkedObject.kyrgyzword: ', this.checkedObject.kyrgyzword )
            // console.log('#123 this.quizPopl[i].englishword: ', this.quizPopl[i].englishword,)
            
            this.wordKnown -= 1
            console.log('#166 this.checkedObject.wordknown: ', this.checkedObject.wordknown )
            console.log('#167 this.wordKnown: ', this.wordKnown )
            $.ajax({
                url: '/decr-known',
                type: 'PUT',
                data: JSON.stringify({
                    _id: this.checkedObject._id,
                    _languser: mainVm.user._id,
                    kyrgyzword: this.checkedObject.kyrgyzword,
                    englishword: this.checkedObject.englishword,
                    wordknown: this.wordKnown,
                    testitem: this.testItem
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

        },
 


        checkRight: function(event, i){
            console.log('checkRight running')
            console.log(this.theQuestion)
            if (this.theQuestion.englishword === this.quizPopl[i].englishword){
                this.checkedObject = this.quizPopl[i]
                // console.log('this.checkedObject: ', this.checkedObject)
                this.isCorrect = true
                this.isWrong = false
                // console.log('#179 this.quizPopl[i].englishword: ', this.quizPopl[i].englishword),            console.log('#179 this.quizPopl[i]._id: ', this.quizPopl[i]._id)
                 setTimeout(() =>{
                    this.incrKnown() 
                    this.makeQuiz()
                    this.isCorrect = false
                    this.getMyWord()
                    this.chooseQuestion()
                }, 1000)
                console.log('isCorrect: ', this.isCorrect)
            }
            else {
                this.checkedObject = this.theQuestion

                this.isCorrect = false
                this.isWrong = true
                setTimeout(() =>{
                    this.decrKnown()
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
                    englishword: this.englishWord,
                    wordknown: this.wordKnown

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