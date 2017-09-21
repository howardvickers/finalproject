

var mainVm = new Vue({
    el: '#app',
    data: {
        newUserName: '',
        newUserPassword: '',
        oldUserName: '',
        oldUserPassword:'',
        user: {},
        dicty: {},
        quizPopl: [],
        allVocabs: [],
        quizVocabs: [],
        wordIndex: 0,
        randomIndex: 0,
        kyrgyzWord: '',
        englishWord: '',
        isInVisible: true,
        isVisible: false,
        invisible: '',
        wordKnown: 0,
        isCorrect: false,
        isWrong: false,
        theQuestion: {},
        checkedObject: '',
        learningTally: 0,
        testDate: '',
        wordLevel: 0,
        wordAchieve: 'Needs Practice',
        testType: 0,
        countPerform: 0,      
        todayDate: '',  
        previousDate: '',
        lastWeek: [],
        lastWeek2: [],
        lastWeekData: [],
        aCount: 0,
        chartDay: {},
        chartData: [],
        chartDays: [],
        enterEnglish: '',
        foundKyrgyz: '',
        confirmWordAdded: '',

    },

    created: function(){
        let that = this
        $.get('/me', function(data){
            mainVm.user = data
            that.getMyVocabs()
            console.log(mainVm.allVocabs)
            console.log('wordknown: ', this.wordknown )
            console.log('kyrgyzWord: ', this.kyrgyzWord )
            console.log('/me this.checkedObject: ', this.checkedObject)
        })
        $.get('/me/vocabs', (data) => {
                this.allVocabs = data
                console.log(this.allVocabs)
            }).then(() => {
                this.makeQuiz()
                this.chooseQuestion()
                this.getAllPerform()
            })
    },

    computed: {
        eachWord: function(){
            if (this.allVocabs.length === 0){
                return {
                    englishword: '',
                    kyrgyzword: '',
                    wordknown: 0,
                    wordachieve: '',
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

        createEmpty: function(){
            if (this.allVocabs.length !=0){
            }
            else{
                $.ajax({
                    url: '/create-vocab',
                    type: 'POST',
                    data: JSON.stringify({
                        _languser: mainVm.user._id,
                        kyrgyzword: '',
                        englishword: '',
                        wordknown: 0,
                        wordachieve: ''
                    }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function(dataFromServer){
                        console.log('/create-vocab dataFromServer: ', dataFromServer)
                        if (dataFromServer.success){
                            mainVm.getMyVocabs()
                        }
                    }
                })
            }
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
                if (data){
                    // this.eachWord = data
                    console.log('getMyWord: ', data)
                }
                // this.eachWord = ''
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

        calcWordAchieve: function(){
            if (this.wordKnown > 10){
                this.wordAchieve = 'Way to Go!'
            } else if (this.wordKnown > 5){
                this.wordAchieve = 'Committed to Memory'
            } else if (this.wordKnown > 0){
                this.wordAchieve = 'Seems Familiar'
            } else {
                this.wordAchieve = 'Needs Practice!'
            }
        },

        incrKnown: function(){
            this.wordKnown = 0
            // console.log('incrKnown started to run')
            // console.log('#122 this.kyrgyzword: ', this.kyrgyzword )
            console.log('incrKnown this.checkedObject: ', this.checkedObject )
            console.log('incrKnown this.checkedObject.kyrgyzword: ', this.checkedObject.kyrgyzword )
            // console.log('#123 this.quizPopl[i].englishword: ', this.quizPopl[i].englishword,)
            
            this.wordKnown += 1
            mainVm.calcWordAchieve()
            console.log('incrKnown this.checkedObject.wordknown: ', this.checkedObject.wordknown )
            console.log('incrKnown this.wordKnown: ', this.wordKnown )
            $.ajax({
                url: '/incr-known',
                type: 'PUT',
                data: JSON.stringify({
                    _id: this.checkedObject._id,
                    _languser: mainVm.user._id,
                    kyrgyzword: this.checkedObject.kyrgyzword,
                    englishword: this.checkedObject.englishword,
                    wordknown: this.wordKnown,
                    wordlevel: this.wordLevel, // change this?
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
            console.log('this.wordLevel: ', this.wordLevel)
            this.testDate = new Date()
            this.testDate = this.testDate.toDateString()
            console.log('this.testDate.substring: ', this.testDate)
            $.ajax({
                url: '/create-perform',
                type: 'POST',
                data: JSON.stringify({
                    _languser: mainVm.user._id,
                    _langvocab: mainVm.dicty._id,
                    testtype: this.testType,
                    wordlevel: this.wordLevel,// change this?
                    testdate: this.testDate,
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer){
                    console.log('/create-perform dataFromServer: ', dataFromServer)
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
            console.log('decrKnown this.checkedObject: ', this.checkedObject )
            console.log('decrKnown this.checkedObject.kyrgyzword: ', this.checkedObject.kyrgyzword )
            // console.log('#123 this.quizPopl[i].englishword: ', this.quizPopl[i].englishword,)
            
            this.wordKnown -= 1
            mainVm.calcWordAchieve()
            console.log('decrKnown this.checkedObject.wordknown: ', this.checkedObject.wordknown )
            console.log('decrKnown this.wordKnown: ', this.wordKnown )
            $.ajax({
                url: '/decr-known',
                type: 'PUT',
                data: JSON.stringify({
                    _id: this.checkedObject._id,
                    _languser: mainVm.user._id,
                    kyrgyzword: this.checkedObject.kyrgyzword,
                    englishword: this.checkedObject.englishword,
                    wordknown: this.wordKnown,
                    wordlevel: this.wordLevel // change this?
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',   
                success: function(dataFromServer){
                    console.log('/decr-known dataFromServer: ', dataFromServer)
                    if (dataFromServer.success){
                        mainVm.getMyVocabs()
                    }
                }
            })
            this.testDate = new Date()
            this.testDate = this.testDate.toDateString()
            console.log('this.testDate.substring: ', this.testDate)
            $.ajax({
                url: '/create-perform',
                type: 'POST',
                data: JSON.stringify({
                    _languser: mainVm.user._id,
                    _langvocab: mainVm.dicty._id,
                    testtype: this.testType,
                    wordlevel: this.wordLevel, // change this?
                    testdate: this.testDate,
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer){
                    console.log('/create-perform dataFromServer: ', dataFromServer)
                    if (dataFromServer.success){
                        mainVm.getMyVocabs()
                    }
                }
            })
        },
        
        checkRight: function(event, i){
            console.log('checkRight checkRight running')
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
                    this.getAllPerform()
                    this.chooseQuestion()
                    this.calcWordAchieve()
                }, 2000)
                console.log('checkRight isCorrect: ', this.isCorrect)
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
                    this.getAllPerform()
                    this.chooseQuestion()
                    this.calcWordAchieve()
                }, 2000)
                console.log('checkRight isCorrect: ', this.isCorrect)
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
                    console.log('/lang-user dataFromServer: ', dataFromServer)
                    if (dataFromServer.success){
                        window.location.href="/dash.html"
                    }
                }
            })
            this.createEmpty()
        },

        signInUser: function(event){
            event.preventDefault()
            var that = this
            console.log('signInUser this.oldUserName: ', this.oldUserName)
            $.ajax({
                url: '/signin-user', 
                type: 'POST',
                data: JSON.stringify({username: this.oldUserName, password: this.oldUserPassword}),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer){
                    console.log('/signin-user dataFromServer: ', dataFromServer)
                    if(dataFromServer.success){
                            window.location.href="/dash.html"
                    }
                }
            })
        },

        lookUpWord: function(event){
            event.preventDefault()
            var that = this
            $.ajax({
                url: 'https://glosbe.com/gapi/translate?from=eng&dest=ky&format=json&phrase='+this.enterEnglish, 
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                crossDomain: true,
                dataType: 'jsonp',
                success: function(data){
                    that.foundKyrgyz = data.tuc["0"].phrase.text
                    // that.foundKyrgyz = 'hello'
                    console.log('this.foundKyrgyz: ', that.foundKyrgyz)
                    console.log('lookUpWord data: ', data)
                }
            })
        },

        logOutUser: function(event){
            event.preventDefault()
            window.location.href="/index.html"
        },

        createVocab: function(event){
            event.preventDefault()
            this.calcWordAchieve()
            var that = this
            console.log(this.kyrgyzWord, this.englishWord)
            $.ajax({
                url: '/create-vocab',
                type: 'POST',
                data: JSON.stringify({
                    _languser: mainVm.user._id,
                    kyrgyzword: this.foundKyrgyz,
                    englishword: this.enterEnglish,
                    wordknown: this.wordKnown,
                    wordlevel: this.wordLevel,
                    wordachieve: this.wordAchieve
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer){
                    console.log('/create-vocab dataFromServer: ', dataFromServer)
                    if (dataFromServer.success){
                        mainVm.getMyVocabs()
                    }
                }
            })
            this.kyrgyzWord = ''
            this.englishWord = ''
            this.foundKyrgyz = ''
            this.enterEnglish = ''
            this.confirmAdded()
        },

        confirmAdded: function(){
            this.confirmWordAdded = 'Word Added!'
            setTimeout(() =>{
                    this.confirmWordAdded = ''
                }, 2000)
        },
        createLastWeek: function(){
            this.todayDate = new Date()
            this.todayDate = this.todayDate.toDateString()
            this.lastWeek.push(this.todayDate)
            
            this.todayDate = new Date()
            this.todayDate.setDate(this.todayDate.getDate() - 1)
            this.todayDate = this.todayDate.toDateString()
            this.lastWeek.push(this.todayDate)
            
            this.todayDate = new Date()
            this.todayDate.setDate(this.todayDate.getDate() - 2)
            this.todayDate = this.todayDate.toDateString()
            this.lastWeek.push(this.todayDate)
            
            this.todayDate = new Date()
            this.todayDate.setDate(this.todayDate.getDate() - 3)
            this.todayDate = this.todayDate.toDateString()
            this.lastWeek.push(this.todayDate)
            
            this.todayDate = new Date()
            this.todayDate.setDate(this.todayDate.getDate() - 4)
            this.todayDate = this.todayDate.toDateString()
            this.lastWeek.push(this.todayDate)
            
            this.todayDate = new Date()
            this.todayDate.setDate(this.todayDate.getDate() - 5)
            this.todayDate = this.todayDate.toDateString()
            this.lastWeek.push(this.todayDate)
            
            this.todayDate = new Date()
            this.todayDate.setDate(this.todayDate.getDate() - 6)
            this.todayDate = this.todayDate.toDateString()
            this.lastWeek.push(this.todayDate)
            
            return this.lastWeek
        },

        getAllPerform: function(){
            console.log('this.lastWeek: ', this.lastWeek)
            $.get('/me/perform', (data) =>{
                this.lastWeekData = data
                console.log('/me/perform data: ', data)
                console.log('this.lastWeekData: ', this.lastWeekData)
                mainVm.createLastWeek()
                console.log('this.lastWeek: ', this.lastWeek)
                this.lastWeek2 = this.lastWeek
                this.chartData = []
                this.chartDays = []

                for (var i = 0; i<7; i++){
                    console.log('this.aCount: ', this.aCount)
                    this.chartDay = {x: this.lastWeek2[i], y: this.aCount}
                    console.log('this.chartDay: ', this.chartDay)
                    this.chartDays.push(this.chartDay.x)
                    this.chartData.push(this.chartDay.y)
                    console.log(this.chartData)
                    this.aCount = 0
                    for (var k = 0; k < this.lastWeekData.length; k++){
                        if (this.lastWeek2[i] === this.lastWeekData[k].testdate){
                            console.log('yay!!!', this.lastWeek2[i], ' = ', this.lastWeekData[k].testdate)
                            this.aCount += 1
                            this.dayCount = this.aCount
                            console.log('this.dayCount: ', this.dayCount)
                            this.dayCount = 0
                            // day7Perform.push()
                        } else{
                            console.log('boo!!!!')
                        }
                    }
                }
                var ctx2 = document.getElementById("theCanvas");

                var myChart2 = new Chart(ctx2, {
                    type: 'line',

                    data: {
                        datasets: [{
                            label: "Last Week",
                            data: this.chartData, 
                            backgroundColor: [
                            'rgb(78, 63, 191)',
                            'rgb(63, 112, 191)',
                            'rgb(142, 63, 191)',
                            'rgb(191, 63, 176)',
                            ]
                        }],
                        // These labels appear in the legend and in the tooltips when hovering different arcs
                        labels: this.chartDays.reverse(),
                    },
                    options: {
                        layout: {
                            padding: {
                                left: 50,
                                right: 100,
                                top: 10,
                                bottom: 10
                            }
                        }
                    }
                });
            })
        },
    }
})

