    getMyMeals : function(){
            $.get('/me/meals', function(data){
                // console.log(data[2])
                mainVm.allMeals = data
                for (var i=0; i<mainVm.allMeals.length; i++){
                    mainVm.allMeals[i].mealdate = new Date(mainVm.allMeals[i].mealdate);
                    mainVm.labels.push(new Date(mainVm.allMeals[i].mealdate).toDateString());
                    // mainVm.calories.push(new Date(mainVm.allMeals[i].mealdate).toDateString());
                }
                // meal variables
                var breakCalories = 0
                var snackCalories = 0

                // food variables
                var eggCal = 0
                var pancakeCal = 0

                // calorie counters - meals
                for (var i=0; i<mainVm.allMeals.length; i++){
                    if (mainVm.allMeals[i].mealname === 'Breakfast'){
                        breakCalories += mainVm.allMeals[i].calories
                    }
                }

                console.log('Cupcake/Cookie/Donut/Egg Calories: ', cupcakeCal, cookieCal, donutCal, eggCal)
                console.log('this is mainVM.allMeals:', mainVm.allMeals)

                var ctx2 = document.getElementById("theCanvas2");

                var myChart2 = new Chart(ctx2, {
                    type: 'pie',

                    data: {
                        datasets: [{
                            data: [breakCalories, lunchCalories, dinnerCalories, snackCalories], 
                            backgroundColor: [
                            'rgb(63, 112, 191)',
                            'rgb(78, 63, 191)',
                            'rgb(142, 63, 191)',
                            'rgb(191, 63, 176)',
                            ]

                        }],

                        // These labels appear in the legend and in the tooltips when hovering different arcs
                        labels: [
                            'Breakfast',
                            'Lunch',
                            'Dinner',
                            'Snack',
                        ],

                    },
                });

            })
        }