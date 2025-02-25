document.addEventListener('DOMContentLoaded', () => {
    const birthDateInput = document.getElementById('birthDate');
    const currentDateInput = document.getElementById('currentDate');
    const calculateBtn = document.getElementById('calculateAge');
    const yearsResult = document.getElementById('years');
    const monthsResult = document.getElementById('months');
    const daysResult = document.getElementById('days');

    // Set today's date as default for current date
    const today = new Date();
    currentDateInput.value = today.toISOString().split('T')[0];
    currentDateInput.max = today.toISOString().split('T')[0];

    calculateBtn.addEventListener('click', () => {
        const birthDate = new Date(birthDateInput.value);
        const currentDate = new Date(currentDateInput.value);

        if (!birthDateInput.value) {
            alert('Please enter your birth date');
            return;
        }

        if (birthDate > currentDate) {
            alert('Birth date cannot be in the future');
            return;
        }

        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, birthDate.getDate());
            days += Math.floor((currentDate - lastMonth) / (1000 * 60 * 60 * 24));
        }

        if (months < 0) {
            years--;
            months += 12;
        }

        // Animate the numbers
        animateNumber(yearsResult, years);
        animateNumber(monthsResult, months);
        animateNumber(daysResult, days);
    });

    function animateNumber(element, final) {
        let current = 0;
        const duration = 1000; // 1 second
        const steps = 60;
        const increment = final / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= final) {
                clearInterval(timer);
                element.textContent = final;
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }
});