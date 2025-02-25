document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const initialAmountInput = document.getElementById('initialAmount');
    const monthlyContributionInput = document.getElementById('monthlyContribution');
    const returnRateInput = document.getElementById('returnRate');
    const timePeriodInput = document.getElementById('timePeriod');
    const calculateBtn = document.getElementById('calculateInvestment');
    const futureValueSpan = document.getElementById('futureValue');
    const totalContributionSpan = document.getElementById('totalContribution');
    const totalInterestSpan = document.getElementById('totalInterest');
    const chartCanvas = document.getElementById('investmentChart');

    let investmentChart = null;

    // Calculate investment returns
    function calculateInvestment(initial, monthly, rate, years) {
        const monthlyRate = (rate / 100) / 12;
        const months = years * 12;
        let balance = initial;
        let totalContribution = initial;
        const yearlyData = [initial];

        for (let i = 1; i <= months; i++) {
            balance = (balance + monthly) * (1 + monthlyRate);
            totalContribution += monthly;
            
            if (i % 12 === 0) {
                yearlyData.push(balance);
            }
        }

        const totalInterest = balance - totalContribution;

        return {
            futureValue: balance,
            totalContribution: totalContribution,
            totalInterest: totalInterest,
            yearlyData: yearlyData
        };
    }

    // Format currency
    function formatCurrency(amount) {
        if (amount >= 10000000) {
            return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
        } else if (amount >= 100000) {
            return '₹' + (amount / 100000).toFixed(2) + ' L';
        }
        return '₹' + amount.toLocaleString('en-IN', {
            maximumFractionDigits: 0
        });
    }

    // Animate value changes
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

    // Create/Update chart
    function updateChart(years, yearlyData) {
        const labels = Array.from({length: years + 1}, (_, i) => `Year ${i}`);
        
        if (investmentChart) {
            investmentChart.destroy();
        }

        investmentChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Investment Value',
                    data: yearlyData,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.1)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Investment Growth Over Time'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Value: ' + formatCurrency(context.raw);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });
    }

    // Calculate button click handler
    calculateBtn.addEventListener('click', () => {
        const initial = parseFloat(initialAmountInput.value) || 0;
        const monthly = parseFloat(monthlyContributionInput.value) || 0;
        const rate = parseFloat(returnRateInput.value) || 0;
        const years = parseFloat(timePeriodInput.value) || 0;

        if (!initial && !monthly) {
            alert('Please enter either initial amount or monthly contribution');
            return;
        }

        if (!rate || !years) {
            alert('Please fill all required fields');
            return;
        }

        if (rate < 0 || years < 0 || initial < 0 || monthly < 0) {
            alert('Please enter positive values');
            return;
        }

        const result = calculateInvestment(initial, monthly, rate, years);

        // Animate results
        animateValue(futureValueSpan, 0, Math.round(result.futureValue), 1000);
        animateValue(totalContributionSpan, 0, Math.round(result.totalContribution), 1000);
        animateValue(totalInterestSpan, 0, Math.round(result.totalInterest), 1000);

        // Update chart
        updateChart(years, result.yearlyData);
    });

    // Input validation
    [initialAmountInput, monthlyContributionInput, returnRateInput, timePeriodInput].forEach(input => {
        input.addEventListener('input', () => {
            if (parseFloat(input.value) < 0) {
                input.value = 0;
            }
        });
    });

    // Initialize empty chart
    updateChart(0, [0]);
});