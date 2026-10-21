
//this is calaculator script in feature branch
const display = document.getElementById("display");

function appendValue(value) {
    if (display.value === "Error") {
        display.value = "0";
    }

    if (display.value === "0" && /[0-9.]/.test(value)) {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    display.value = "0";
}

function deleteLast() {
    display.value = display.value.slice(0, -1) || "0";
}

function calculate() {
    try {
        const expression = display.value;

        // Allow only numbers and basic arithmetic operators.
        if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
            throw new Error("Invalid input");
        }

        const result = parseExpression(expression);

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        display.value = String(
            Number(result.toPrecision(12))
        );
    } catch {
        display.value = "Error";
    }
}

// Safe arithmetic parser supporting +, -, *, /, %, and parentheses.
function parseExpression(expression) {
    const tokens = expression.match(
        /\d*\.?\d+(?:e[+-]?\d+)?|[()+\-*/%]/gi
    );

    if (!tokens || tokens.join("") !== expression.replace(/\s/g, "")) {
        throw new Error("Invalid expression");
    }

    let index = 0;

    function primary() {
        const token = tokens[index++];

        if (token === "+") return primary();
        if (token === "-") return -primary();

        if (token === "(") {
            const value = addSub();
            if (tokens[index++] !== ")") {
                throw new Error("Missing parenthesis");
            }
            return value;
        }

        if (token === undefined || !/^\d/.test(token)) {
            throw new Error("Expected a number");
        }

        return Number(token);
    }

    function mulDiv() {
        let value = primary();

        while (["*", "/", "%"].includes(tokens[index])) {
            const op = tokens[index++];
            const right = primary();

            if (right === 0 && (op === "/" || op === "%")) {
                throw new Error("Division by zero");
            }

            if (op === "*") value *= right;
            if (op === "/") value /= right;
            if (op === "%") value %= right;
        }

        return value;
    }

    function addSub() {
        let value = mulDiv();

        while (tokens[index] === "+" || tokens[index] === "-") {
            const op = tokens[index++];
            const right = mulDiv();

            value = op === "+" ? value + right : value - right;
        }

        return value;
    }

    const result = addSub();

    if (index !== tokens.length) {
        throw new Error("Invalid expression");
    }

    return result;
}

// Keyboard support
document.addEventListener("keydown", function (event) {
    if (/^[0-9.+\-*/%()]$/.test(event.key)) {
        appendValue(event.key);
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        deleteLast();
    } else if (event.key === "Escape") {
        clearDisplay();
    }
});
