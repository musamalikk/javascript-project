setInterval(
  () =>
    (document.getElementById("time").innerHTML =
      new Date().toLocaleTimeString()),
  1000
);

const FontCheck = () => {
  var presentInput = document.getElementById("present");

  const adjustFontSize = () => {
    var maxWidth = presentInput.clientWidth;
    var fontSize = 3; // Starting font size

    while (presentInput.scrollWidth > maxWidth) {
      fontSize -= 0.1;
      presentInput.style.fontSize = fontSize + "rem";
    }
  };

  window.addEventListener("resize", adjustFontSize);
};

const parenthesisCheck = (str) => {
  const stack = [];

  for (const char of str) {
    if (char === "(") {
      stack.push(char);
    } else if (char === ")") {
      if (stack.length === 0) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
};

const trigonometricCheck = (str) => {
  let value = "";
  if (str.includes("sin")) {
    value = str.replaceAll("sin", "Math.sin");
  }

  if (str.includes("cos")) {
    value = str.replaceAll("cos", "Math.cos");
  }

  if (str.includes("tan")) {
    value = str.replaceAll("tan", "Math.tan");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const exponentCheck = (str) => {
  let value = "";
  if (str.includes("^")) {
    value = str.replaceAll("^", "**");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const squareRootCheck = (str) => {
  let value = "";
  if (str.includes("√")) {
    value = str.replaceAll("√", "Math.sqrt");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const exponentialConstantCheck = (str) => {
  let value = "";
  if (str === "e") {
    value = str.replaceAll("e", "Math.E");
  } else if (str.includes("e")) {
    value = str.replaceAll("e", "Math.E**");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const pieCheck = (str) => {
  let value = "";
  if (str === "π") {
    value = str.replaceAll("π", "Math.PI");
  } else if (str.includes("π")) {
    value = str.replaceAll("π", "Math.PI *");
  }

  if (value === "") {
    return str;
  }

  return value;
};

const expressionChecks = (str) => {
  return trigonometricCheck(
    exponentCheck(squareRootCheck(exponentialConstantCheck(pieCheck(str))))
  );
};

const historyListener = (element) => () => {
  document.getElementById("present").value = element;
};

const variableListener = (element) => () => {
  document.getElementById("present").value += element.value;
};

const populateHistory = () => {
  const container = document.getElementById("myArrayContainer");
  container.innerHTML = ""; // Clear the existing content

  history.forEach((element) => {
    var li = document.createElement("li");
    li.textContent = element;
    li.classList.add("list-item");
    li.onclick = historyListener(element);
    container.appendChild(li);
  });
};

const populateVariables = () => {
  const container = document.getElementById("variablesContainer");
  container.innerHTML = ""; // Clear the existing content

  variables.forEach((element) => {
    var li = document.createElement("li");
    li.textContent = element.name + "  -->  " + element.value;
    li.classList.add("list-item");
    li.onclick = variableListener(element);
    container.appendChild(li);
  });
};

const addMultiplicationOperator = (expression) => {
  var regex = /(\d+)([a-zA-Z\(])/g;

  var result = expression.replace(regex, "$1*$2");

  return result;
};

const history = [];
const variables = [];

populateHistory();
populateVariables();

const result = () => {
  const value = document.getElementById("present").value;

  if (!parenthesisCheck(value)) {
    return alert("Add Proper Parenthesis!");
  }

  if (value.includes("/0"))
    return alert("Arithmetic Exception: Division by 0 Error!");

  if (!value) return alert("Kindly Enter Some Expression to Proceed!");

  const newValue = expressionChecks(value);
  console.log("value " + value);
  console.log("new value " + newValue);

  const multiplicationOperator = addMultiplicationOperator(newValue);
  console.log("new evaluated value " + multiplicationOperator);

  try {
    const evaluatedValue = eval(multiplicationOperator);

    const resultValue =
      Math.abs(evaluatedValue) % 1 !== 0
        ? (eval(evaluatedValue) / 1).toFixed(4)
        : eval(evaluatedValue);

    // console.log("eval value " + resultValue);
    document.getElementById("past").value = value;
    document.getElementById("present").value = resultValue;

    history.push(value);
    // console.log("history", history);
    console.log("variables", variables);

    populateHistory();
    populateVariables();

    return;
  } catch (error) {
    return alert(error.message);
  }
};

const addVariable = (e) => {
  e.preventDefault();
  let exists = false;

  try {
    let name = document.getElementById("variableName").value;
    let value = document.getElementById("variableValue").value;

    variables.forEach((element) => {
      if (element.name === name) {
        exists = true;
      }
    });

    if (exists) {
      return alert("Variable Already Exists!");
    } else {
      variables.push({
        name: name,
        value: value,
      });

      populateVariables();

      // var modal = new bootstrap.Modal(
      //   document.getElementById("addVariableModal")
      // );
      // modal.hide();

      name = "";
      value = "";

      console.log(name, value);
      return alert("Variable has been added!");
    }
  } catch (error) {
    console.log(error);
  }
};
