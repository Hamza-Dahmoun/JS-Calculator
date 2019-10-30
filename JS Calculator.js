/************ BEGIN: Variables declaration part ***********/
let is_currentExpressionDone = false;
let userInput = "15/9*5/7-3+2/8*3+6-10/5";/**/
let numbersAndOperations = [];
let result;
let divisionCounter = 0;
let multiplicationCounter = 0;
let additionCounter = 0;
let subtractionCounter = 0;
clearAll();
/************ END: Variables declaration part ***********/
//
//
/************ BEGIN: adding events to buttons ***********/
document.getElementById("clearAllButton").addEventListener("click", clearAll);
document.getElementById("clearButton").addEventListener("click", clearLastChar);
document.getElementById("equalButton").addEventListener("click", equalClick);
let writingButtons = document.querySelectorAll('span.circle:not([id="clearAllButton"]):not([id="clearButton"]):not([id="equalButton"]):not(.deactivated-button)');
for (let i = 0; i < writingButtons.length; i++) {
    writingButtons[i].addEventListener("click", writeCharacter);
}
/************ END: adding events to buttons ***********/
//
//
/************ BEGIN: functions called directly by user behaving with UI ***********/
function clearAll() {
    document.getElementById("arithmeticExpression").value = "";
    document.getElementById("resultText").value = "";
}
function clearLastChar() {
    let lastChar_inExpression = document.getElementById("arithmeticExpression").value.charAt(document.getElementById("arithmeticExpression").value.length - 1);
    document.getElementById("arithmeticExpression").value = document.getElementById("arithmeticExpression").value.replace(lastChar_inExpression, "");
}
let isCalculatorPadPressed = false;
function writeCharacter(CalculatorPad_keyTextValue) {
    let newChar = "";
    //We know that this function can be called when user clicks on a button in our calculator, or
    //or when user presses a key on the calculatorPad in the computer, lets first check what triggered this function and then proceed writing the new character in our calculator UI 
    if(isCalculatorPadPressed){
        //so the function has been called becuz user pressed one calculator key
        newChar = CalculatorPad_keyTextValue;
        isCalculatorPadPressed = false;
    }
    else{
        //so this function has been called becuz user clicked on the buttons in the page, not on the keyboard
        newChar = event.target.innerText;
    }
    
    //First of all, lets prevent user starts his input by an operation symbole
    if( document.getElementById("arithmeticExpression").value.length==0 && (!isNumber(newChar) || newChar==".")){
        //do nothing
        return;
    }
    //Second of all, lets prevent user for typing '.' more than once in a row, or "." followed by an operation
    let lastChar_inExpression = document.getElementById("arithmeticExpression").value.charAt(document.getElementById("arithmeticExpression").value.length - 1);
    if(lastChar_inExpression == "." && ((!isNumber(newChar) || newChar=="."))){
        //do nothing
        return;
    }
    //Third of all, lets check if user clicked an operation button just after clicking equal "="
    if (is_currentExpressionDone && !isNumber(newChar)){
        //do nothing, because it is an operation symbole after an already calculated expression
        return;
    }


    //Now Before doing anything lets forbid writing two characters in a row like +*, /*, -*, -*...etc by erasing the old operation symbole and write the new operation symbole input by user, e.g: 12/5*+4 ==> 12/5+4        
    if (!isNumber(lastChar_inExpression) && lastChar_inExpression != "%" && !isNumber(newChar)) {
        //so our Expression ends already with an operation symbole and the user has input another operation symbole,
        //lets remove the old one and consider the new one
        //e.g: 15/9*4+-9 ==> 15/9*4-9
        //e.g: 78%-15/9*4+-9 ==> 78%-15/9*4-9 (N.B: User should be forced to enter an operation symbole after '%')
        document.getElementById("arithmeticExpression").value = document.getElementById("arithmeticExpression").value.replace(lastChar_inExpression, newChar);
    }
    else {
        //So it is not the case of two operations' symboles in a row
        //But Now, we should check if lastChar_inExpression == '%' so that we force user to type an operation symbole not a number
        if (lastChar_inExpression == '%') {
            //lets prevent user from typing a number, and force him to type an operation symbole
            //why: 48%*5 = 0.48*5 = 2.4
            //and: 48%5 => 0.48 5 and this is not calculable
            if (isNumber(newChar)) {
                //so user already typed '%' and want to type a number, this is forbidden
                //lets do some animation to operations buttons to guide the user
                animateOperationsButtons();
                //this animation will be removed once the user clicks on an operation button       
            }
            else {
                //so user want to type an operation symbole after '%', it is okey, lets proceed
                //but lets first remove the animation from the operation buttons
                removeAnimationFromOperationsButtons();
                if (is_currentExpressionDone) {
                    //So this is the first character of a new expression, lets clear both input and then write the character
                    document.getElementById("resultText").value = "";
                    document.getElementById("arithmeticExpression").value = newChar;
                    is_currentExpressionDone = false;
                }
                else {
                    //so this is not th first character of the expression, lets just add the new character to the expression
                    document.getElementById("arithmeticExpression").value = document.getElementById("arithmeticExpression").value + newChar;
                }
            }
        }
        else {
            //This function write the characteres clicked to the arithmeticExpression input
            //But first we have to clear the OLD CALCULATED expression
            if (is_currentExpressionDone) {
                //So this is the first character of a new expression, lets clear both input and the write the character
                document.getElementById("resultText").value = "";
                document.getElementById("arithmeticExpression").value = newChar;
                is_currentExpressionDone = false;
            }
            else {
                //so this is not th first character of the expression, lets just add the new character to the expression
                document.getElementById("arithmeticExpression").value = document.getElementById("arithmeticExpression").value + newChar;
            }
        }

    }
}
function equalClick() {
    //First of all, before doing anything, there is a scenario of user typed "98%" then
    //he tried to type a number so the animation started to guide him to type
    //an operation, but he just decided to ignore all that and click on "=",
    //in this case we need to remove the animation 
    if(document.getElementById("divisionButton").className.includes("highlighted-button")){
        removeAnimationFromOperationsButtons();
    }

    //Second of all, lets check if the expression ends with '.', if so then do nothing
    if("." == document.getElementById("arithmeticExpression").value.charAt(document.getElementById("arithmeticExpression").value.length - 1)){
        //do nothng
        return;
    }

    //Now proceed the normal work of "="
    let lastChar_inExpression = document.getElementById("arithmeticExpression").value.charAt(document.getElementById("arithmeticExpression").value.length - 1);
    if (isNumber(lastChar_inExpression) || lastChar_inExpression == '%') {
        //this function add the equal symbole (=) to the user input, calculate the result and display it in the second input
        document.getElementById("arithmeticExpression").value = document.getElementById("arithmeticExpression").value + "=";
        is_currentExpressionDone = true;
        startCalculation();
    }
}
/************ END: functions called directly by user behaving with UI ***********/
//
//
/************ BEGIN: functions called directly by user behaving with PC CalculatorPad ***********/
document.onkeydown = function(e){
    //e.keyCode represents a code that is linked to a button in the keyboard
    //e.key represents  the text in the clicked key of the keyboard

    //when user uses the keyboard of his device, we'll check whether he clicked a button in the calculatorPad or not
    //if so we will trigger the writeCharacter() function with the text in the clicked button as a parameter
    var keyCode = e.keyCode;
    if(isCalculatorPadClicked(keyCode)){
        //so lets write what the user clicked in our UI
        //but is user clicked on "Enter" we w'll write in UI equal symbole '='
        isCalculatorPadPressed = true;
        if(keyCode == "13"){
            equalClick();
        }
        else{
            writeCharacter(e.key);
        }
        
    }    
}
function isCalculatorPadClicked(code){
    //The following are the keyCodes of the calculatorPad
    /*
    button --> keyCode
    '0' --> 96
    '1' --> 97
    '2' --> 98
    '3' --> 99
    '4' --> 100
    '5' --> 101
    '6' --> 102
    '7' --> 103
    '8' --> 104
    '9' --> 105
    '*' --> 106
    '+' --> 107
    '-' --> 109
    '.' --> 110
    '/' --> 111 
    'Enter' --> 13
    */
    if(code == "96" || code == "97" || code == "98" || code == "99" || code == "100"
    || code == "101" || code == "102" || code == "103" || code == "104" || code == "105"
    || code == "106" || code == "107" || code == "109" || code == "110" || code == "111"
    || code == "13"){
        return true;
    }
    else{
        return false;
    }
}

/************ END: functions called directly by user behaving with PC CalculatorPad ***********/




/************************ BEGIN: functions used for calculator logic **********************/
function startCalculation() {
    //first lets replace '=' with an empty string
    let lastChar_inExpression = document.getElementById("arithmeticExpression").value.charAt(document.getElementById("arithmeticExpression").value.length - 1);
    userInput = document.getElementById("arithmeticExpression").value.replace(lastChar_inExpression, "");

    numbersAndOperations = convertInputToArray(userInput);

    result = calculate(numbersAndOperations)[0][0];

    document.getElementById("resultText").value = result;
}


function convertInputToArray(input) {
    //This function will do the following: "10-6+9*8/2/2" ==> [[10,-], [6,+], [9,*], [8,/],[2,/],[2,""]]  
    let myArray = [];
    let intermediateNumber = "";
    for (let i = 0; i < input.length; i++) {
        if (isNumber(input[i])) {
            //lets first check if this character is the last number in the input
            if (i == input.length - 1) {
                //so lets concatenate this last number to the intermediateNumber & push this intermediateNumber with an empty string as operation symbole
                intermediateNumber = intermediateNumber + input[i];
                myArray.push([intermediateNumber, ""]);
            }
            else {
                //so we are still in the middle of the input lets keep building the intermediateNumber and move forward
                intermediateNumber = intermediateNumber + input[i];
            }
        }
        else {
            //so the character is not a number, it is an operation symbole or a percentage symbole,
            //1- If it is an operation symbole we will push this symbole with the previously built intermediateNumber to the array
            //and increase the operations counter
            //2- If it is a percentage symbole we will calculate the percentage of the previously built intermediateNumber (divide it by 100)
            //and the result will be considered as the intermediateNumber, and move forward to the next input character 
            //and move forward to the next input character if there are any, else, just push the new intermediateNumber to the array with an empty string as operation symbole
            if (input[i] != "%") {
                //so it is case (1-) explained above
                myArray.push([intermediateNumber, input[i]]);
                intermediateNumber = "";
                increaseOperationCounter(input[i]);
            }
            else {
                //so it is case (2-) explained above
                intermediateNumber = parseFloat(intermediateNumber) / 100;
                //Now lets check if this '%' is the last char in the expression
                if (i == input.length - 1) {
                    //so there were no characters in the expression after the '%'
                    myArray.push([intermediateNumber, ""]);
                }
            }
        }
    }
    return myArray;
}


function isNumber(char) {
    if (char != "." && char != "0" && char != "1" && char != "2" && char != "3" && char != "4" && char != "5" && char != "6" && char != "7" && char != "8" && char != "9")
        return false
    else return true;
}


function increaseOperationCounter(operationSymb) {
    switch (operationSymb) {
        case "/":
            divisionCounter = divisionCounter + 1;
            break;
        case "*":
            multiplicationCounter = multiplicationCounter + 1;
            break;
        case "+":
            additionCounter = additionCounter + 1;
            break;
        case "-":
            subtractionCounter = subtractionCounter + 1;
            break;
        default:
            break;
    }
}


function calculate(array) {
    //Lets start calculating the operations inside the array numbersAndOperations in this order: /, *, -, +

    array = calculateDivision(array);
    array = calculateMultiplication(array);
    array = calculateSubtraction(array);
    array = calculateAddition(array);
    return array;
}


function calculateDivision(array) {
    // - we will calculate the division operation between the number before and the number after
    // - we will delete the element containing the '/' operation and store the result in the next element
    // - we will do this divisionCounter times 
    for (let j = 1; j <= divisionCounter; j++) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][1] == "/") {
                //Expl: ...[5,*],[12,/],[3,*]... ==> ...[5,*],[4,*]...
                array[i + 1][0] = parseFloat(array[i][0]) / parseFloat(array[i + 1][0]);
                array.splice(i, 1);
            }
        }
    }
    return array;
}

function calculateMultiplication(array) {
    // - we will calculate the multiplication operation between the number before and the number after
    // - we will delete the element containing the '*' operation and store the result in the next element
    // - we will do this divisionCounter times 
    for (let j = 1; j <= multiplicationCounter; j++) {
        for (let i = 0; i < numbersAndOperations.length; i++) {
            if (numbersAndOperations[i][1] == "*") {
                //Expl: ...[5,*],[12,/],[3,*],[7,+]... ==> ...[60,/],[21,+]...
                numbersAndOperations[i + 1][0] = parseFloat(numbersAndOperations[i][0]) * parseFloat(numbersAndOperations[i + 1][0]);
                numbersAndOperations.splice(i, 1);
            }
        }
    }
    return array;
}

function calculateSubtraction(array) {
    // - we will calculate the subtraction operation between the number before and the number after
    // - we will delete the element containing the '-' operation and store the result in the next element
    // - we will do this subtractionCounter times 
    for (let j = 1; j <= subtractionCounter; j++) {
        for (let i = 0; i < numbersAndOperations.length; i++) {
            if (numbersAndOperations[i][1] == "-") {
                //Expl: ...[10,-],[5,+],[7,-],[4,+]... ==> ...[5,+],[3,+]...
                numbersAndOperations[i + 1][0] = parseFloat(numbersAndOperations[i][0]) - parseFloat(numbersAndOperations[i + 1][0]);
                numbersAndOperations.splice(i, 1);
            }
        }
    }
    return array;
}

function calculateAddition(array) {
    // - we will calculate the addition operation between the number before and the number after
    // - we will delete the element containing the '+' operation and store the result in the next element
    // - we will do this additionCounter times 
    for (let j = 1; j <= additionCounter; j++) {
        for (let i = 0; i < numbersAndOperations.length; i++) {
            if (numbersAndOperations[i][1] == "+") {
                //Expl: ...[5,+],[12,/],[3,+],[7,-]... ==> ...[17,/],[10,-]...
                numbersAndOperations[i + 1][0] = parseFloat(numbersAndOperations[i][0]) + parseFloat(numbersAndOperations[i + 1][0]);
                numbersAndOperations.splice(i, 1);
            }
        }
    }
    return array;
}

function animateOperationsButtons() {
    document.getElementById("divisionButton").className = "circle light-gray highlighted-button";
    document.getElementById("multiplicationButton").className = "circle light-gray highlighted-button";
    document.getElementById("subtractionButton").className = "circle light-gray highlighted-button";
    document.getElementById("additionButton").className = "circle light-gray highlighted-button";
    document.getElementById("ratioButton").className = "circle light-gray highlighted-button";
}
function removeAnimationFromOperationsButtons() {
    document.getElementById("divisionButton").className = "circle light-gray";
    document.getElementById("multiplicationButton").className = "circle light-gray";
    document.getElementById("subtractionButton").className = "circle light-gray";
    document.getElementById("additionButton").className = "circle light-gray";
    document.getElementById("ratioButton").className = "circle light-gray";
}

