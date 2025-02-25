document.addEventListener('DOMContentLoaded', () => {
    const dataInput = document.getElementById('dataInput');
    const calculateBtn = document.getElementById('calculateStats');
    const resultsContainer = document.querySelector('.stats-result-container');
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');

    // Statistical Functions
    const stats = {
        mean: (data) => data.reduce((a, b) => a + b, 0) / data.length,

        median: (data) => {
            const sorted = [...data].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        },

        mode: (data) => {
            const freq = {};
            data.forEach(num => freq[num] = (freq[num] || 0) + 1);
            const maxFreq = Math.max(...Object.values(freq));
            const modes = Object.keys(freq).filter(key => freq[key] === maxFreq);
            return modes.map(Number);
        },

        standardDeviation: (data) => {
            const mean = stats.mean(data);
            const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
            return Math.sqrt(variance);
        },

        variance: (data) => {
            const mean = stats.mean(data);
            return data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
        },

        range: (data) => {
            const sorted = [...data].sort((a, b) => a - b);
            return sorted[sorted.length - 1] - sorted[0];
        },

        quartiles: (data) => {
            const sorted = [...data].sort((a, b) => a - b);
            const q2 = stats.median(sorted);
            const lowerHalf = sorted.slice(0, Math.floor(sorted.length / 2));
            const upperHalf = sorted.slice(Math.ceil(sorted.length / 2));
            return {
                Q1: stats.median(lowerHalf),
                Q2: q2,
                Q3: stats.median(upperHalf)
            };
        }
    };

    function parseData(input) {
        return input.split(',')
            .map(num => num.trim())
            .filter(num => num !== '')
            .map(num => parseFloat(num))
            .filter(num => !isNaN(num));
    }

    function formatNumber(num) {
        return num.toFixed(4).replace(/\.?0+$/, '');
    }

    function createResultBox(label, value) {
        const box = document.createElement('div');
        box.className = 'stat-item';
        box.innerHTML = `
            <span class="stat-value">${value}</span>
            <span class="stat-label">${label}</span>
        `;
        return box;
    }

    function animateValue(element, start, end, duration) {
        let current = start;
        const range = end - start;
        const increment = range / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                clearInterval(timer);
                element.textContent = formatNumber(end);
            } else {
                element.textContent = formatNumber(current);
            }
        }, 16);
    }

    calculateBtn.addEventListener('click', () => {
        try {
            const data = parseData(dataInput.value);
            
            if (data.length < 2) {
                throw new Error('Please enter at least two numbers');
            }

            resultsContainer.innerHTML = '';
            const selectedOps = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            selectedOps.forEach(op => {
                switch(op) {
                    case 'mean':
                        resultsContainer.appendChild(
                            createResultBox('Mean', formatNumber(stats.mean(data)))
                        );
                        break;
                    case 'median':
                        resultsContainer.appendChild(
                            createResultBox('Median', formatNumber(stats.median(data)))
                        );
                        break;
                    case 'mode':
                        const modes = stats.mode(data);
                        resultsContainer.appendChild(
                            createResultBox('Mode', modes.map(formatNumber).join(', '))
                        );
                        break;
                    case 'stdDev':
                        resultsContainer.appendChild(
                            createResultBox('Std Dev', formatNumber(stats.standardDeviation(data)))
                        );
                        break;
                    case 'variance':
                        resultsContainer.appendChild(
                            createResultBox('Variance', formatNumber(stats.variance(data)))
                        );
                        break;
                    case 'range':
                        resultsContainer.appendChild(
                            createResultBox('Range', formatNumber(stats.range(data)))
                        );
                        break;
                    case 'quartiles':
                        const q = stats.quartiles(data);
                        resultsContainer.appendChild(
                            createResultBox('Q1', formatNumber(q.Q1))
                        );
                        resultsContainer.appendChild(
                            createResultBox('Q2', formatNumber(q.Q2))
                        );
                        resultsContainer.appendChild(
                            createResultBox('Q3', formatNumber(q.Q3))
                        );
                        break;
                }
            });

            // Animate all stat values
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(el => {
                const value = parseFloat(el.textContent);
                if (!isNaN(value)) {
                    animateValue(el, 0, value, 1000);
                }
            });

        } catch (error) {
            resultsContainer.innerHTML = `<div class="error-message">${error.message}</div>`;
        }
    });

    // Allow pasting Excel data
    dataInput.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text');
        const processed = paste.replace(/\t/g, ',').replace(/\n/g, ',');
        dataInput.value = processed;
    });
});