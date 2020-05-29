var budgetController = (function(){

    var Expenses = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var calculateTotal=function(type){
        var sum=0;
        data.allItems[type].forEach(function(cur){
            sum=sum+cur.value;


        });
        data.totals[type]=sum;
    }
    var data = {
        allItems :{
            exp : [],
            inc : [],

        },
        totals : {
            exp : 0,
            inc : 0
        },
        budget:0,
        percentage:-1
        
        
    };

    return {
        addItem : function(type, des, val){
            var newItem,id;
            if(data.allItems[type].length > 0){
            id =data.allItems[type][data.allItems[type].length-1],id+1;
            }
            else{
                id=0;
            }
            if(type=== 'exp'){
               newItem = new Expenses(id, des, val);

            }else if(type==='inc'){
                newItem= new Income( id, des, val);

            }
            data.allItems[type].push(newItem);
            return newItem;
            

        },

        calculateBudget : function(){
            calculateTotal('exp');
            calculateTotal('inc');

            data.budget=data.totals.inc-data.totals.exp;

            if(data.totals.inc>0){

            data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }else{
                data.percentage=-1;
            }

             

        },

        getBudget:function(){
            return {
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage
            }

        },
        testing : function(){
            console.log(data);
        }
    };



    




    

})();


var UIController = (function(){
    var DOMstrings = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputButton : '.add__btn',
        incomeContainer : '.income__list',
        expensesContainer : '.expenses__list'

    };
    return {
        getInput: function(){

            return{
             type : document.querySelector(DOMstrings.inputType).value,
             description : document.querySelector(DOMstrings.inputDescription).value,
             value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
    },
    addLIstItem: function(  obj, type){
        var html, newHtml,element;
        if(type==='inc'){
        element=DOMstrings.incomeContainer;    
        html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
        else if(type==='exp')
            {
            element=DOMstrings.expensesContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';


            }
            newHtml=html.replace('%id%', obj.id);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

        clearFileds: function(){
            var fields;
            fields=document.querySelectorAll(DOMstrings.inputDescription +','+ DOMstrings.inputValue );
            
            var fieldsarray= Array.prototype.slice.call(fields);
            fieldsarray.forEach(function(current, index, array){
             current.value="";
            

           });
           fieldsarray[0].focus();




    },

    getDOMstrings : function(){
        return DOMstrings;  
    }

    };






})();



var Controller = (function(budgetCtrl, UICtrl){

    var setupEventListner = function(){
        
        var DOM  = UICtrl.getDOMstrings(); 
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.keyCode === 13){
                ctrlAddItem();
    
            }
            
    
        }); 
    };
    
    var updateBudget=function(){
        budgetCtrl.calculateBudget();

        var budget=budgetCtrl.getBudget();
        console.log(budget);


        
    };


    var ctrlAddItem = function(){
        var input,newItem;
        input  = UICtrl.getInput();
     //   console.log(input);
     if(input.description!=="" &&  !isNaN(input.value) && input.value>0){
        
        newItem = budgetController.addItem(input.type, input.description, input.value); 
        
        UICtrl.addLIstItem(newItem, input.type);

        UICtrl.clearFileds();

        updateBudget();
     }
     else{
         alert("please enter the value in the given fields");
     }


    };


    return { 
        init : function(){
          //  console.log('hi');
            setupEventListner();
        }
    };
 

 

})(budgetController, UIController);


Controller.init();