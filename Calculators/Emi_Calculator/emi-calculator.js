document.addEventListener('DOMContentLoaded', () => {
    const loanAmountInput = document.getElementById('loanAmount');
    const interestRateInput = document.getElementById('interestRate');
    const loanTenureInput = document.getElementById('loanTenure');
    const calculateBtn = document.getElementById('calculateEMI');
    const emiAmount = document.getElementById('emiAmount');
    const totalInterest = document.getElementById('totalInterest');
    const totalPayment = document.getElementById('totalPayment');

    function calculateEMI(principal, rate, time) {
        const monthlyRate = (rate / 12) / 100;
        const months = time * 12;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        const totalAmount = emi * months;
        const interestAmount = totalAmount - principal;

        return {
            emi: emi,
            totalInterest: interestAmount,
            totalPayment: totalAmount
        };
    }

    function formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN', {
            maximumFractionDigits: 0
        });
    }

    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / 60;
        const stepTime = duration / 60;
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                clearInterval(timer);
                element.textContent = formatCurrency(end);
            } else {
                element.textContent = formatCurrency(Math.floor(current));
            }
        }, stepTime);
    }

    calculateBtn.addEventListener('click', () => {
        const principal = parseFloat(loanAmountInput.value);
        const rate = parseFloat(interestRateInput.value);
        const time = parseFloat(loanTenureInput.value);

        if (!principal || !rate || !time) {
            alert('Please fill all fields with valid numbers');
            return;
        }

        if (principal <= 0 || rate <= 0 || time <= 0) {
            alert('Please enter positive values');
            return;
        }

        const result = calculateEMI(principal, rate, time);

        // Animate the results
        animateValue(emiAmount, 0, Math.round(result.emi), 1000);
        animateValue(totalInterest, 0, Math.round(result.totalInterest), 1000);
        animateValue(totalPayment, 0, Math.round(result.totalPayment), 1000);
    });

    // Add input validation
    const inputs = [loanAmountInput, interestRateInput, loanTenureInput];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (parseFloat(input.value) < 0) {
                input.value = 0;
            }
        });
    });
});