/************ BEGIN: Variables declaration part ***********/
let is_currentExpressionDone = false;
let userInput =  "15/9*5/7-3+2/8*3+6-10/5";/**/
let numbersAndOperations = [];
let result;
let divisionCounter = 0;
let multiplicationCounter = 0;
let additionCounter = 0;
let subtractionCounter = 0;
clearAll();
/************ END: Variables declaration part ***********/


/************ BEGIN: adding events to buttons ***********/
document.getElementById("clearAllButton").addEventListener("click", clearAll);
document.getElementById("clearButton").addEventListener("click", clearLastChar);
document.getElementById("equalButton").addEventListener("click", equalClick);
let writingButtons = document.querySelectorAll('span.circle:not([id="clearAllButton"]):not([id="clearButton"]):not([id="equalButton"]):not(.deactivated-button)');
for (let i = 0; i < writingButtons.length; i++) {
    writingButtons[i].addEventListener("click", writeCharacter);
}
function clearAll() {
    document.getElementById("arithmeticExpression").value = "";
    document.getElementById("resultText").value = "";
}
function clearLastChar() {
    let lastChar_inExpression = document.getElementById("arithmeticExpression").value.charAt(document.getElementById("arithmeticExpression").value.length - 1);
    document.getElementById("arithmeticExpression").value = document.getElementById("arithmeticExpression").value.replace(lastChar_inExpression,"");
}

function writeCharacter() {
    //Before doing anything lets forbid writing two characters in a row like +*, /*, -*, -*...etc
    let newChar = event.target.innerText;
    let lastChar_inExpression = document.getElementById("arithmeticExpression").value.charAt(document.getElementById("arithmeticExpression").value.length - 1);
    if (!isNumber(lastChar_inExpression) && !isNumber(newChar)) {
        //Do nothing, because there are going to be two symboles in a row
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
function equalClick() {
    let lastChar_inExpression = document.getElementById("arithmeticExpression").value.charAt(document.getElementById("arithmeticExpression").value.length - 1);
    if (isNumber(lastChar_inExpression)) {
        //this function add the equal symbole (=) to the user input, calculate the result and display it in the second input
        document.getElementById("arithmeticExpression").value = document.getElementById("arithmeticExpression").value + "=";
        is_currentExpressionDone = true;
        startCalculation();
    }
}
/************ END: adding events to buttons ***********/


function startCalculation() {
    let lastChar_inExpression = document.getElementById("arithmeticExpression").value.charAt(document.getElementById("arithmeticExpression").value.length - 1);
    userInput = document.getElementById("arithmeticExpression").value.replace(lastChar_inExpression,"");
    
    numbersAndOperations = convertInputToArray(userInput);    
    result = calculate(numbersAndOperations)[0][0];
    //console.log(result); 
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
            //so the character is not a number, it is an operation symbole,
            //lets push this symbole with the previously built intermediateNumber to the array
            //and increase the operations counter
            myArray.push([intermediateNumber, input[i]]);
            intermediateNumber = "";
            increaseOperationCounter(input[i]);
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


