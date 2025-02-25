document.addEventListener('DOMContentLoaded', () => {
    const monthlyInvestmentInput = document.getElementById('monthlyInvestment');
    const returnRateInput = document.getElementById('returnRate');
    const timePeriodInput = document.getElementById('timePeriod');
    const stepUpRateInput = document.getElementById('stepUpRate');
    const calculateBtn = document.getElementById('calculateSIP');
    const totalInvestmentSpan = document.getElementById('totalInvestment');
    const estimatedReturnsSpan = document.getElementById('estimatedReturns');
    const totalValueSpan = document.getElementById('totalValue');

    function calculateSIP(monthly, rate, years, stepUp = 0) {
        let totalInvestment = 0;
        let futureValue = 0;
        const monthlyRate = (rate / 100) / 12;
        const months = years * 12;
        let monthlyInvestment = monthly;

        for(let i = 0; i < months; i++) {
            if(i % 12 === 0 && i !== 0) {
                monthlyInvestment += monthlyInvestment * (stepUp / 100);
            }
            totalInvestment += monthlyInvestment;
            futureValue = (futureValue + monthlyInvestment) * (1 + monthlyRate);
        }

        const estimatedReturns = futureValue - totalInvestment;

        return {
            totalInvestment,
            estimatedReturns,
            totalValue: futureValue
        };
    }

    function formatCurrency(amount) {
        if(amount >= 10000000) {
            return '₹' + (amount/10000000).toFixed(2) + ' Cr';
        } else if(amount >= 100000) {
            return '₹' + (amount/100000).toFixed(2) + ' L';
        }
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
        const monthly = parseFloat(monthlyInvestmentInput.value);
        const rate = parseFloat(returnRateInput.value);
        const years = parseFloat(timePeriodInput.value);
        const stepUp = parseFloat(stepUpRateInput.value) || 0;

        if (!monthly || !rate || !years) {
            alert('Please fill all required fields with valid numbers');
            return;
        }

        if (monthly <= 0 || rate <= 0 || years <= 0) {
            alert('Please enter positive values');
            return;
        }

        const result = calculateSIP(monthly, rate, years, stepUp);

        animateValue(totalInvestmentSpan, 0, Math.round(result.totalInvestment), 1000);
        animateValue(estimatedReturnsSpan, 0, Math.round(result.estimatedReturns), 1000);
        animateValue(totalValueSpan, 0, Math.round(result.totalValue), 1000);
    });

    // Input validation
    [monthlyInvestmentInput, returnRateInput, timePeriodInput, stepUpRateInput].forEach(input => {
        input.addEventListener('input', () => {
            if (parseFloat(input.value) < 0) {
                input.value = 0;
            }
        });
    });
});