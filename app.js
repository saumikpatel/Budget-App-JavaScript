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

    var data = {
        allItems :{
            exp : [],
            inc : [],

        },
        totals : {
            exp : 0,
            inc : 0
        }
        
        
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

    };
    return {
        getInput: function(){

            return{
             type : document.querySelector(DOMstrings.inputType).value,
             description : document.querySelector(DOMstrings.inputDescription).value,
             value : document.querySelector(DOMstrings.inputValue).value
        };
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
    
    var ctrlAddItem = function(){
        var input,newItem;
        input  = UICtrl.getInput();
        console.log(input);
        
        newItem = budgetController.addItem(input.type, input.description, input.value);       


    };


    return { 
        init : function(){
            console.log('hi');
            setupEventListner();
        }
    };
 

 

})(budgetController, UIController);


Controller.init();