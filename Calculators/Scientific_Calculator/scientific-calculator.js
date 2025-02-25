document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('input');
    const history = document.getElementById('history');
    const angleMode = document.getElementById('angleMode');
    let currentInput = '0';
    let lastOperation = '';
    let memory = 0;
    let isRadian = true;

    const constants = {
        'π': Math.PI,
        'e': Math.E
    };

    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    function toDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    const scientificOps = {
        'sin': (x) => Math.sin(isRadian ? x : toRadians(x)),
        'cos': (x) => Math.cos(isRadian ? x : toRadians(x)),
        'tan': (x) => Math.tan(isRadian ? x : toRadians(x)),
        'asin': (x) => isRadian ? Math.asin(x) : toDegrees(Math.asin(x)),
        'acos': (x) => isRadian ? Math.acos(x) : toDegrees(Math.acos(x)),
        'atan': (x) => isRadian ? Math.atan(x) : toDegrees(Math.atan(x)),
        'log': (x) => Math.log10(x),
        'ln': (x) => Math.log(x),
        'sqrt': (x) => Math.sqrt(x),
        'square': (x) => Math.pow(x, 2),
        'cube': (x) => Math.pow(x, 3),
        'pow': (x, y) => Math.pow(x, y),
        'fact': (x) => {
            if (x < 0) return NaN;
            if (x === 0) return 1;
            let result = 1;
            for(let i = 2; i <= x; i++) result *= i;
            return result;
        },
        '1/x': (x) => 1 / x,
        '%': (x) => x / 100
    };

    function updateDisplay() {
        display.textContent = currentInput;
    }

    function handleScientificOperation(operation) {
        try {
            const value = parseFloat(currentInput);
            let result;

            if (operation in scientificOps) {
                result = scientificOps[operation](value);
            }

            if (isNaN(result) || !isFinite(result)) {
                throw new Error('Invalid operation');
            }

            history.textContent = `${operation}(${currentInput})`;
            currentInput = result.toString();
            updateDisplay();
        } catch (error) {
            display.textContent = 'Error';
            setTimeout(() => {
                currentInput = '0';
                updateDisplay();
            }, 1000);
        }
    }

    document.querySelectorAll('.calc-btn').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            
            if (!action) {
                if (currentInput === '0' || shouldResetInput) {
                    currentInput = button.textContent;
                    shouldResetInput = false;
                } else {
                    currentInput += button.textContent;
                }
                updateDisplay();
                return;
            }

            switch (action) {
                case 'toggle-angle':
                    isRadian = !isRadian;
                    angleMode.textContent = isRadian ? 'RAD' : 'DEG';
                    break;
                case 'constant':
                    const constant = button.textContent;
                    currentInput = constants[constant].toString();
                    updateDisplay();
                    break;
                default:
                    if (action in scientificOps) {
                        handleScientificOperation(action);
                    }
            }
        });
    });

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            if (currentInput === '0' || shouldResetInput) {
                currentInput = e.key;
                shouldResetInput = false;
            } else {
                currentInput += e.key;
            }
            updateDisplay();
        }

        const keyMappings = {
            's': 'sin',
            'c': 'cos',
            't': 'tan',
            'l': 'log',
            'n': 'ln',
            'r': 'sqrt',
            '^': 'pow',
            '!': 'fact'
        };

        if (e.key in keyMappings) {
            handleScientificOperation(keyMappings[e.key]);
        }
    });
});