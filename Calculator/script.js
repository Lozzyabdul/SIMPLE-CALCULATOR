// Find the screen and buttons so the calculator can respond to clicks.
const display = document.querySelector("#display");
const buttons = document.querySelector(".buttons");

// These values keep track of the number being typed and the pending operation.
let currentInput = "0";
let storedValue = null;
let pendingOperator = null;
let startNewNumber = false;

// Update the screen whenever the current number changes.
function showDisplay(value = currentInput) {
  display.textContent = value;
}

// Add a digit to the number currently being entered.
function enterDigit(digit) {
  if (startNewNumber || currentInput === "Error") {
    currentInput = digit;
    startNewNumber = false;
  } else if (currentInput === "0") {
    currentInput = digit;
  } else {
    currentInput += digit;
  }

  showDisplay();
}

// Add a decimal point, but only one per number.
function enterDecimal() {
  if (startNewNumber || currentInput === "Error") {
    currentInput = "0.";
    startNewNumber = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  showDisplay();
}

// Calculate two numbers using the selected operator.
function calculate(firstNumber, operator, secondNumber) {
  switch (operator) {
    case "+":
      return firstNumber + secondNumber;
    case "-":
      return firstNumber - secondNumber;
    case "×":
      return firstNumber * secondNumber;
    case "÷":
      return secondNumber === 0 ? null : firstNumber / secondNumber;
    default:
      return secondNumber;
  }
}

// Apply the pending operation before saving a new one.
function chooseOperator(operator) {
  if (currentInput === "Error") return;

  const value = Number(currentInput);
  if (pendingOperator && !startNewNumber) {
    const result = calculate(storedValue, pendingOperator, value);

    if (result === null || !Number.isFinite(result)) {
      showError();
      return;
    }

    currentInput = String(Number(result.toPrecision(12)));
    showDisplay();
  }

  storedValue = Number(currentInput);
  pendingOperator = operator;
  startNewNumber = true;
}

// Finish the calculation and show a helpful message for invalid results.
function showResult() {
  if (!pendingOperator || storedValue === null || currentInput === "Error") return;

  const result = calculate(storedValue, pendingOperator, Number(currentInput));
  if (result === null || !Number.isFinite(result)) {
    showError();
    return;
  }

  currentInput = String(Number(result.toPrecision(12)));
  storedValue = null;
  pendingOperator = null;
  startNewNumber = true;
  showDisplay();
}

// Reset all calculator values and return the screen to zero.
function clearCalculator() {
  currentInput = "0";
  storedValue = null;
  pendingOperator = null;
  startNewNumber = false;
  showDisplay();
}

// Show an error and prepare the next digit to start a fresh calculation.
function showError() {
  currentInput = "Error";
  storedValue = null;
  pendingOperator = null;
  startNewNumber = true;
  showDisplay();
}

// Handle button clicks from the calculator grid.
buttons.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) {
    enterDigit(button.dataset.number);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else if (button.dataset.action === "decimal") {
    enterDecimal();
  } else if (button.dataset.action === "equals") {
    showResult();
  } else if (button.dataset.action === "clear") {
    clearCalculator();
  }
});

// Let beginners use a keyboard as well as clicking the on-screen buttons.
document.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) {
    enterDigit(event.key);
  } else if (event.key === ".") {
    enterDecimal();
  } else if (event.key === "+" || event.key === "-") {
    chooseOperator(event.key);
  } else if (event.key === "*" || event.key.toLowerCase() === "x") {
    chooseOperator("×");
  } else if (event.key === "/") {
    chooseOperator("÷");
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    showResult();
  } else if (event.key === "Escape" || event.key.toLowerCase() === "c") {
    clearCalculator();
  }
});
