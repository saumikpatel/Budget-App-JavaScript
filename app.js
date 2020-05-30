var budgetController = (function(){

    var Expenses = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage=-1;
        
    };
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    Expenses.prototype.calcPercentage=function(totalIncome){
        if(totalIncome>0){
        this.percentage=Math.round((this.value/totalIncome)*100);
        }else{
            this.percentage=-1;
        }

    };

    Expenses.prototype.getPercentage=function(){
         return this.percentage;
    }
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
            id =data.allItems[type][data.allItems[type].length-1].id+1;
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
        deleteItem : function(type, id){
            var ids,index;
               
            var ids=  data.allItems[type].map(function(current){
                return current.id;

            });

            index=ids.indexOf(id);
            if(index!== -1){
                data.allItems[type].splice(index,1);
            }
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
        calculatepercentages:function(){
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);

            });

        },
        getPercentage:function(){
            var allperc=data.allItems.exp.map(function(cur){
                return cur.getPercentage();

            });
            return allperc;

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
        expensesContainer : '.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLable:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercentagelabel:'.item__percentage',
        dateLabel: '.budget__title--month'


    };
    var  formatNumber= function(num,type){
        num=Math.abs(num);
        num=num.toFixed(2);
        var numSplit =num.split('.');
        var int= numSplit[0];
        var dec =numSplit[1];
        if(int.length>3){
         int=   int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);


        }
       
        return  (type==='exp'?'-':'+')+''+int+'.'+dec;

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
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteItem:function(selectorID){
        var el=document.getElementById(selectorID);
        el.parentNode.removeChild(el);


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
        displayBudget:function(obj){
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLable).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage+'%';

            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent='---'; 
            }

        },
        displayPercentages : function(percentages){
            var fields=document.querySelectorAll(DOMstrings.expensesPercentagelabel);
            var nodeListForEach=function(list,callback){
                for(var i=0;i<list.length;i++){
                    callback(list[i],i)
                }

            }
            nodeListForEach(fields,function(current,index){
                if(percentages[index]>0){
                current.textContent=percentages[index]+'%';
                }else{
                    current.textContent='---';
                }

            }); 


        },
        displayMonth:function(){
            var now, months, month, year;
            
            now = new Date();
            //var christmas = new Date(2016, 11, 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
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

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);  
    };

    var updatePercentage =function(){
        budgetCtrl.calculatepercentages();
        var percentages=budgetCtrl.getPercentage();
        console.log(percentages);
        UICtrl.displayPercentages(percentages);
        

    };
    
    var updateBudget=function(){
        budgetCtrl.calculateBudget();

        var budget=budgetCtrl.getBudget();
        console.log(budget);
        UICtrl.displayBudget(budget);
       


        
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
        updatePercentage();
     }
     else{
         alert("please enter the value in the given fields");
     }


    };

    var ctrlDeleteItem=function(event){ 
        var itemID,splitId,type,ID;
        itemID=  event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitId=itemID.split('-');
            type=splitId[0];
            ID= parseInt(splitId[1]);

            budgetCtrl.deleteItem(type,ID);
            UICtrl.deleteItem(itemID);
            updateBudget();
            updatePercentage();
        } 

    };
    return { 
        init : function(){
            UICtrl.displayMonth();
          //  console.log('hi');
          UICtrl.displayBudget({
            budget:0,
            totalInc:0,
            totalExp:0,
            percentage:-1
          });

            setupEventListner();
        }
    };
 

 

})(budgetController, UIController);


Controller.init();