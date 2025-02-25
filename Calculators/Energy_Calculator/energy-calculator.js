document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const energyType = document.getElementById('energyType');
    const kineticEnergy = document.getElementById('kineticEnergy');
    const potentialEnergy = document.getElementById('potentialEnergy');
    const elasticEnergy = document.getElementById('elasticEnergy');
    const thermalEnergy = document.getElementById('thermalEnergy');
    const calculateBtn = document.getElementById('calculateEnergy');
    const energyResult = document.getElementById('energyResult');

    // Show/hide input fields based on energy type
    function updateEnergyInputs() {
        const selected = energyType.value;
        [kineticEnergy, potentialEnergy, elasticEnergy, thermalEnergy].forEach(div => {
            div.style.display = 'none';
        });

        switch(selected) {
            case 'kinetic':
                kineticEnergy.style.display = 'flex';
                break;
            case 'potential':
                potentialEnergy.style.display = 'flex';
                break;
            case 'elastic':
                elasticEnergy.style.display = 'flex';
                break;
            case 'thermal':
                thermalEnergy.style.display = 'flex';
                break;
        }
    }

    // Format energy output with proper units
    function formatEnergy(value) {
        if (Math.abs(value) < 0.01) {
            return value.toExponential(4) + ' J';
        }
        return value.toFixed(4).replace(/\.?0+$/, '') + ' J';
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
                energyResult.textContent = formatEnergy(end);
            } else {
                energyResult.textContent = formatEnergy(current);
            }
        }, 16);
    }

    // Calculate energy based on type
    function calculateEnergy() {
        let energy = 0;
        const type = energyType.value;

        try {
            switch(type) {
                case 'kinetic':
                    const mass = parseFloat(document.getElementById('mass').value);
                    const velocity = parseFloat(document.getElementById('velocity').value);
                    
                    if (!mass || !velocity) throw new Error('Please enter both mass and velocity');
                    if (mass < 0) throw new Error('Mass cannot be negative');
                    
                    energy = 0.5 * mass * velocity * velocity;
                    break;

                case 'potential':
                    const potMass = parseFloat(document.getElementById('potMass').value);
                    const height = parseFloat(document.getElementById('height').value);
                    const gravity = parseFloat(document.getElementById('gravity').value);
                    
                    if (!potMass || !height || !gravity) throw new Error('Please enter all gravitational potential energy parameters');
                    if (potMass < 0) throw new Error('Mass cannot be negative');
                    if (height < 0) throw new Error('Height cannot be negative');
                    if (gravity <= 0) throw new Error('Gravitational acceleration must be positive');
                    
                    energy = potMass * gravity * height;
                    break;

                case 'elastic':
                    const springConstant = parseFloat(document.getElementById('springConstant').value);
                    const displacement = parseFloat(document.getElementById('displacement').value);
                    
                    if (!springConstant || displacement === undefined) throw new Error('Please enter both spring constant and displacement');
                    if (springConstant < 0) throw new Error('Spring constant cannot be negative');
                    
                    energy = 0.5 * springConstant * displacement * displacement;
                    break;

                case 'thermal':
                    const thermalMass = parseFloat(document.getElementById('thermalMass').value);
                    const specificHeat = parseFloat(document.getElementById('specificHeat').value);
                    const tempChange = parseFloat(document.getElementById('tempChange').value);
                    
                    if (!thermalMass || !specificHeat || tempChange === undefined) throw new Error('Please enter all thermal energy parameters');
                    if (thermalMass < 0) throw new Error('Mass cannot be negative');
                    if (specificHeat < 0) throw new Error('Specific heat capacity cannot be negative');
                    
                    energy = thermalMass * specificHeat * tempChange;
                    break;
            }

            animateValue(0, energy, 1000);
        } catch (error) {
            alert(error.message);
        }
    }

    // Event Listeners
    energyType.addEventListener('change', updateEnergyInputs);
    calculateBtn.addEventListener('click', calculateEnergy);

    // Input validation for all number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value < 0 && !['displacement', 'tempChange'].includes(input.id)) {
                input.value = 0;
            }
        });
    });

    // Initialize energy type inputs
    updateEnergyInputs();
});