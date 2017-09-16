// $(document).ready(function(){

// Vue.component('add-vocab-comp', {
//   template: '#add-vocab-temp',
// })

// Vue.component('learn-vocab-comp', {
//   template: '#learn-vocab-temp',
//   props: ['eachw'],
// //   props: ['eword'],
// //   props: ['kword'],
//   props: ['invisib'],
//   props: ['isvis'],
//   props: ['isinvis'],
//   props: ['togglevis'],
//   props: ['wordind']
// })


// Vue.component('test-vocab-comp', {
//   template: '#test-vocab-temp',
//   props: ['quizpop']
// })

// Vue.component('list-vocab-comp', {
//   template: '#list-vocab-temp',
//   props: ['vocabs']
// })

// Vue.component('list-perform-comp', {
//   template: '#list-perform-temp',
//   props: ['vocabs']
// })


var mainVm = new Vue({
    el: '#app',
    data: {
        newUserName: '',
        newUserPassword: '',
        oldUserName: 'Howard',
        oldUserPassword:'h',
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
        testType: 0,
        countPerform: 0,      
        todayDate: '',  
        previousDate: '',
        lastWeek: [],
        lastWeek2: [],
        lastWeekData: [],
        aCount: 0,

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

        calcWordLevel: function(){
            if (this.wordKnown > 10){
                this.wordLevel = 3
            } else if (this.wordKnown > 5){
                this.wordLevel = 2
            } else if (this.wordKnown > 0){
                this.wordLevel = 1
            } else {
                this.wordLevel = 0
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
            mainVm.calcWordLevel()
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
                    wordlevel: this.wordLevel,
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
            mainVm.calcWordLevel()
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
                    wordknown: this.wordKnown
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
                    wordlevel: this.wordLevel,
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
                    this.chooseQuestion()
                }, 1000)
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
                    this.chooseQuestion()
                }, 1000)
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

        logOutUser: function(event){
            event.preventDefault()
            window.location.href="/index.html"
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
                    console.log('/create-vocab dataFromServer: ', dataFromServer)
                    if (dataFromServer.success){
                        mainVm.getMyVocabs()
                    }
                }
            })
            this.kyrgyzWord = ''
            this.englishWord = ''
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
            
            console.log('this.lastWeek: ', this.lastWeek)

            // for (var i = 0; i < 7; i++){
            //     // this.aCount += 1
            //     // this.lastWeek.push(this.aCount)
            //     // console.log('this.lastWeek: ', this.lastWeek)
            //     // console.log('this.aCount: ', this.aCount)
            //     mainVm.todayDate.setDate(this.todayDate.getDate() - i)
                
            // }

            // console.log('this.todayDate: ', this.todayDate)
            // console.log('this.todayDate: ', this.todayDate)
            // console.log('this.previousDate: ', this.previousDate)
                    // this.previousDate = this.previousDate.toDateString()

                    // this.lastWeek.push(this.previousDate)
                    // console.log('lastWeek: ', this.lastWeek)
// myDate.setDate(myDate.getDate() + 1);

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
                for (var i = 0; i<7; i++){
                    for (var k = 0; k < this.lastWeekData.length; k++){
                        if (this.lastWeek2[i] === this.lastWeekData[k].testdate){
                            console.log('yay!!!')
                            this.aCount += 1
                        } else{
                            console.log('boo!!!!')
                        }
                        console.log('aCount: ', this.aCount)
                    }
                }
            })
        },

        // getLastWeekPerform: function(){
            
        // },


        // getMyPerform : function(){
        //     $.get('/me/perform', function(data){
        //         // console.log(data[2])
        //         mainVm.allMeals = data
        //         for (var i=0; i<mainVm.allMeals.length; i++){
        //             mainVm.allMeals[i].mealdate = new Date(mainVm.allMeals[i].mealdate);
        //             mainVm.labels.push(new Date(mainVm.allMeals[i].mealdate).toDateString());
        //             // mainVm.calories.push(new Date(mainVm.allMeals[i].mealdate).toDateString());
        //         }
        //         // meal variables
        //         var breakCalories = 0
        //         var snackCalories = 0

        //         // food variables
        //         var eggCal = 0
        //         var pancakeCal = 0

        //         // calorie counters - meals
        //         for (var i=0; i<mainVm.allMeals.length; i++){
        //             if (mainVm.allMeals[i].mealname === 'Breakfast'){
        //                 breakCalories += mainVm.allMeals[i].calories
        //             }
        //         }

        //         var ctx2 = document.getElementById("theCanvas");

        //         var myChart2 = new Chart(ctx2, {
        //             type: 'line',

        //             data: {
        //                 datasets: [{
        //                     data: [{
        //                         x: theDate,
        //                         y: countPerform
        //                     }], 
        //                     // backgroundColor: [
        //                     // 'rgb(63, 112, 191)',
        //                     // 'rgb(78, 63, 191)',
        //                     // 'rgb(142, 63, 191)',
        //                     // 'rgb(191, 63, 176)',
        //                     // ]
        //                 }],

        //                 // These labels appear in the legend and in the tooltips when hovering different arcs
        //                 labels: [
        //                     'The Date',
        //                 ],

        //             },
        //         });

        //     })
        // }













    }
})



// })