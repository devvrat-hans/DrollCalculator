document.addEventListener('DOMContentLoaded', () => {
    const loanAmountInput = document.getElementById('loanAmount');
    const interestRateInput = document.getElementById('interestRate');
    const loanTermInput = document.getElementById('loanTerm');
    const extraPaymentInput = document.getElementById('extraPayment');
    const calculateBtn = document.getElementById('calculateLoan');
    const monthlyPayment = document.getElementById('monthlyPayment');
    const totalInterest = document.getElementById('totalInterest');
    const totalPayment = document.getElementById('totalPayment');

    function calculateLoan(principal, rate, years, extraPayment = 0) {
        const monthlyRate = (rate / 100) / 12;
        const numberOfPayments = years * 12;
        
        const monthlyPaymentAmount = principal * monthlyRate * 
            Math.pow(1 + monthlyRate, numberOfPayments) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        let balance = principal;
        let totalInterestPaid = 0;
        let actualPayments = 0;
        
        while (balance > 0 && actualPayments < numberOfPayments) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPaymentAmount - interestPayment + extraPayment;
            
            balance -= principalPayment;
            totalInterestPaid += interestPayment;
            actualPayments++;
            
            if (balance < 0) balance = 0;
        }

        return {
            monthlyPayment: monthlyPaymentAmount + extraPayment,
            totalInterest: totalInterestPaid,
            totalPayment: principal + totalInterestPaid
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
        const years = parseFloat(loanTermInput.value);
        const extraPayment = parseFloat(extraPaymentInput.value) || 0;

        if (!principal || !rate || !years) {
            alert('Please fill all required fields with valid numbers');
            return;
        }

        if (principal <= 0 || rate <= 0 || years <= 0) {
            alert('Please enter positive values');
            return;
        }

        const result = calculateLoan(principal, rate, years, extraPayment);

        // Animate the results
        animateValue(monthlyPayment, 0, Math.round(result.monthlyPayment), 1000);
        animateValue(totalInterest, 0, Math.round(result.totalInterest), 1000);
        animateValue(totalPayment, 0, Math.round(result.totalPayment), 1000);
    });

    // Input validation
    [loanAmountInput, interestRateInput, loanTermInput, extraPaymentInput].forEach(input => {
        input.addEventListener('input', () => {
            if (parseFloat(input.value) < 0) {
                input.value = 0;
            }
        });
    });
});