document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('input');
    const history = document.getElementById('history');
    let currentInput = '0';
    let lastOperation = '';
    let memory = 0;
    let shouldResetInput = false;

    function updateDisplay() {
        display.textContent = currentInput;
    }

    function handleNumber(num) {
        if (shouldResetInput) {
            currentInput = num;
            shouldResetInput = false;
        } else {
            currentInput = currentInput === '0' ? num : currentInput + num;
        }
        updateDisplay();
    }

    function handleOperation(operation) {
        const current = parseFloat(currentInput);
        
        if (lastOperation !== '') {
            calculate();
        }
        
        history.textContent = `${current} ${operation}`;
        lastOperation = operation;
        shouldResetInput = true;
    }

    function calculate() {
        const current = parseFloat(currentInput);
        const previous = parseFloat(history.textContent);
        let result = 0;

        switch (lastOperation) {
            case '+':
                result = previous + current;
                break;
            case '−':
                result = previous - current;
                break;
            case '×':
                result = previous * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero');
                    return;
                }
                result = previous / current;
                break;
        }

        currentInput = result.toString();
        history.textContent = '';
        lastOperation = '';
        updateDisplay();
    }

    // Event Listeners
    document.querySelectorAll('.calc-btn').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            
            if (!action) {
                handleNumber(button.textContent);
                return;
            }

            switch (action) {
                case 'add':
                    handleOperation('+');
                    break;
                case 'subtract':
                    handleOperation('−');
                    break;
                case 'multiply':
                    handleOperation('×');
                    break;
                case 'divide':
                    handleOperation('÷');
                    break;
                case 'calculate':
                    if (lastOperation) calculate();
                    break;
                case 'clear':
                    currentInput = '0';
                    updateDisplay();
                    break;
                case 'all-clear':
                    currentInput = '0';
                    history.textContent = '';
                    lastOperation = '';
                    updateDisplay();
                    break;
                case 'delete':
                    currentInput = currentInput.slice(0, -1) || '0';
                    updateDisplay();
                    break;
                case 'mc':
                    memory = 0;
                    break;
                case 'mr':
                    currentInput = memory.toString();
                    updateDisplay();
                    break;
                case 'm-plus':
                    memory += parseFloat(currentInput);
                    shouldResetInput = true;
                    break;
                case 'm-minus':
                    memory -= parseFloat(currentInput);
                    shouldResetInput = true;
                    break;
            }
        });
    });

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            handleNumber(e.key);
        }
        if (e.key === '+') handleOperation('+');
        if (e.key === '-') handleOperation('−');
        if (e.key === '*') handleOperation('×');
        if (e.key === '/') {
            e.preventDefault();
            handleOperation('÷');
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            if (lastOperation) calculate();
        }
        if (e.key === 'Backspace') {
            currentInput = currentInput.slice(0, -1) || '0';
            updateDisplay();
        }
        if (e.key === 'Escape') {
            currentInput = '0';
            history.textContent = '';
            lastOperation = '';
            updateDisplay();
        }
    });
});