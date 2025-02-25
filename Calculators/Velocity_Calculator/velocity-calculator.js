document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const velocityType = document.getElementById('velocityType');
    const basicVelocity = document.getElementById('basicVelocity');
    const accelerationVelocity = document.getElementById('accelerationVelocity');
    const distanceVelocity = document.getElementById('distanceVelocity');
    const averageVelocity = document.getElementById('averageVelocity');
    const calculateBtn = document.getElementById('calculateVelocity');
    const velocityResult = document.getElementById('velocityResult');

    // Show/hide input fields based on velocity type
    function updateVelocityInputs() {
        const selected = velocityType.value;
        [basicVelocity, accelerationVelocity, distanceVelocity, averageVelocity].forEach(div => {
            div.style.display = 'none';
        });

        switch(selected) {
            case 'basic':
                basicVelocity.style.display = 'flex';
                break;
            case 'acceleration':
                accelerationVelocity.style.display = 'flex';
                break;
            case 'distance':
                distanceVelocity.style.display = 'flex';
                break;
            case 'average':
                averageVelocity.style.display = 'flex';
                break;
        }
    }

    // Format velocity output with proper units
    function formatVelocity(value) {
        if (Math.abs(value) < 0.01) {
            return value.toExponential(4) + ' m/s';
        }
        return value.toFixed(4).replace(/\.?0+$/, '') + ' m/s';
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
                velocityResult.textContent = formatVelocity(end);
            } else {
                velocityResult.textContent = formatVelocity(current);
            }
        }, 16);
    }

    // Calculate velocity based on type
    function calculateVelocity() {
        let velocity = 0;
        const type = velocityType.value;

        try {
            switch(type) {
                case 'basic':
                    const distance = parseFloat(document.getElementById('distance').value);
                    const time = parseFloat(document.getElementById('time').value);
                    
                    if (!distance || !time) throw new Error('Please enter both distance and time');
                    if (time <= 0) throw new Error('Time must be greater than zero');
                    
                    velocity = distance / time;
                    break;

                case 'acceleration':
                    const initialVelocity = parseFloat(document.getElementById('initialVelocity').value);
                    const acceleration = parseFloat(document.getElementById('acceleration').value);
                    const accTime = parseFloat(document.getElementById('accTime').value);
                    
                    if (initialVelocity === undefined || !acceleration || !accTime) 
                        throw new Error('Please enter all parameters for acceleration calculation');
                    if (accTime <= 0) throw new Error('Time must be greater than zero');
                    
                    velocity = initialVelocity + (acceleration * accTime);
                    break;

                case 'distance':
                    const initVelocity = parseFloat(document.getElementById('initVelocity').value);
                    const distAcceleration = parseFloat(document.getElementById('distAcceleration').value);
                    const distDistance = parseFloat(document.getElementById('distDistance').value);
                    
                    if (initVelocity === undefined || !distAcceleration || !distDistance)
                        throw new Error('Please enter all parameters for distance calculation');
                    
                    velocity = Math.sqrt((initVelocity * initVelocity) + (2 * distAcceleration * distDistance));
                    break;

                case 'average':
                    const velocity1 = parseFloat(document.getElementById('velocity1').value);
                    const velocity2 = parseFloat(document.getElementById('velocity2').value);
                    
                    if (velocity1 === undefined || velocity2 === undefined)
                        throw new Error('Please enter both initial and final velocities');
                    
                    velocity = (velocity1 + velocity2) / 2;
                    break;
            }

            if (isNaN(velocity) || !isFinite(velocity)) {
                throw new Error('Invalid calculation result');
            }

            animateValue(0, velocity, 1000);
        } catch (error) {
            alert(error.message);
        }
    }

    // Event Listeners
    velocityType.addEventListener('change', updateVelocityInputs);
    calculateBtn.addEventListener('click', calculateVelocity);

    // Input validation for all number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            // Allow negative values for velocity and acceleration
            const allowNegative = ['initialVelocity', 'velocity1', 'velocity2', 'acceleration', 
                                 'distAcceleration', 'initVelocity'].includes(input.id);
            if (!allowNegative && input.value < 0) {
                input.value = 0;
            }
        });
    });

    // Initialize velocity type inputs
    updateVelocityInputs();
});