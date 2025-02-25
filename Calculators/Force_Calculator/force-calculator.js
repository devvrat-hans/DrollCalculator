document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const forceType = document.getElementById('forceType');
    const newtonForce = document.getElementById('newtonForce');
    const springForce = document.getElementById('springForce');
    const gravityForce = document.getElementById('gravityForce');
    const frictionForce = document.getElementById('frictionForce');
    const calculateBtn = document.getElementById('calculateForce');
    const forceResult = document.getElementById('forceResult');

    // Constants
    const G = 6.67430e-11; // Gravitational constant in m³/kg/s²

    // Show/hide input fields based on force type
    function updateForceInputs() {
        const selected = forceType.value;
        [newtonForce, springForce, gravityForce, frictionForce].forEach(div => {
            div.style.display = 'none';
        });

        switch(selected) {
            case 'newton':
                newtonForce.style.display = 'flex';
                break;
            case 'spring':
                springForce.style.display = 'flex';
                break;
            case 'gravity':
                gravityForce.style.display = 'flex';
                break;
            case 'friction':
                frictionForce.style.display = 'flex';
                break;
        }
    }

    // Format force output with proper units
    function formatForce(value) {
        if (Math.abs(value) < 0.01) {
            return value.toExponential(4) + ' N';
        }
        return value.toFixed(4).replace(/\.?0+$/, '') + ' N';
    }

    // Animate the result value
    function animateValue(start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                clearInterval(timer);
                forceResult.textContent = formatForce(end);
            } else {
                forceResult.textContent = formatForce(current);
            }
        }, 16);
    }

    // Calculate force based on type
    function calculateForce() {
        let force = 0;
        const type = forceType.value;

        try {
            switch(type) {
                case 'newton':
                    const mass = parseFloat(document.getElementById('mass').value);
                    const acceleration = parseFloat(document.getElementById('acceleration').value);
                    
                    if (!mass || !acceleration) throw new Error('Please enter both mass and acceleration');
                    if (mass < 0) throw new Error('Mass cannot be negative');
                    
                    force = mass * acceleration;
                    break;

                case 'spring':
                    const springConstant = parseFloat(document.getElementById('springConstant').value);
                    const displacement = parseFloat(document.getElementById('displacement').value);
                    
                    if (!springConstant || !displacement) throw new Error('Please enter both spring constant and displacement');
                    if (springConstant < 0) throw new Error('Spring constant cannot be negative');
                    
                    force = springConstant * displacement;
                    break;

                case 'gravity':
                    const mass1 = parseFloat(document.getElementById('mass1').value);
                    const mass2 = parseFloat(document.getElementById('mass2').value);
                    const distance = parseFloat(document.getElementById('distance').value);
                    
                    if (!mass1 || !mass2 || !distance) throw new Error('Please enter all gravitational force parameters');
                    if (mass1 < 0 || mass2 < 0) throw new Error('Mass cannot be negative');
                    if (distance <= 0) throw new Error('Distance must be greater than zero');
                    
                    force = (G * mass1 * mass2) / (distance * distance);
                    break;

                case 'friction':
                    const coefficient = parseFloat(document.getElementById('coefficient').value);
                    const normalForce = parseFloat(document.getElementById('normalForce').value);
                    
                    if (!coefficient || !normalForce) throw new Error('Please enter both coefficient of friction and normal force');
                    if (coefficient < 0) throw new Error('Coefficient of friction cannot be negative');
                    
                    force = coefficient * normalForce;
                    break;
            }

            animateValue(0, force, 1000);
        } catch (error) {
            alert(error.message);
        }
    }

    // Event Listeners
    forceType.addEventListener('change', updateForceInputs);
    calculateBtn.addEventListener('click', calculateForce);

    // Input validation for all number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value < 0 && input.id !== 'displacement') {
                input.value = 0;
            }
        });
    });

    // Initialize force type inputs
    updateForceInputs();
});