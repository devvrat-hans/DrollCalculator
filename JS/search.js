document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('calculator-search');
    const searchResults = document.getElementById('search-results');
    const searchBtn = document.getElementById('search-btn');

    const calculators = [
        { name: 'Basic Calculator', category: 'Mathematics', keywords: 'add subtract multiply divide' },
        { name: 'Scientific Calculator', category: 'Mathematics', keywords: 'sin cos tan log' },
        { name: 'Matrix Calculator', category: 'Mathematics', keywords: 'matrix determinant inverse' },
        { name: 'Unit Converter', category: 'Physics', keywords: 'convert units measurement' },
        { name: 'EMI Calculator', category: 'Finance', keywords: 'loan interest payment' },
    ];

    function getRelevanceScore(calc, query) {
        const searchString = (calc.name + ' ' + calc.category + ' ' + calc.keywords).toLowerCase();
        const queryTerms = query.toLowerCase().split(' ');
        
        let score = 0;
        queryTerms.forEach(term => {
            // Exact match in name
            if (calc.name.toLowerCase().includes(term)) score += 10;
            // Exact match in category
            if (calc.category.toLowerCase().includes(term)) score += 5;
            // Match in keywords
            if (calc.keywords.toLowerCase().includes(term)) score += 3;
            // Starts with term
            if (calc.name.toLowerCase().startsWith(term)) score += 5;
        });
        
        return score;
    }

    function highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    function displayResults(results, query) {
        searchResults.innerHTML = '';
        
        if (results.length > 0) {
            results.forEach(calc => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.innerHTML = `
                    <a href="#" class="result-link">
                        <div class="result-main">
                            <span class="calc-name">${highlightMatch(calc.name, query)}</span>
                            <span class="calc-category">${calc.category}</span>
                        </div>
                        <div class="result-keywords">${calc.keywords}</div>
                    </a>
                `;
                searchResults.appendChild(div);
            });
            searchResults.style.display = 'block';
        } else {
            searchResults.style.display = 'none';
        }
    }

    function performSearch() {
        const query = searchInput.value.trim();
        if (query.length < 1) {
            searchResults.style.display = 'none';
            return;
        }

        const results = calculators
            .map(calc => ({
                ...calc,
                relevance: getRelevanceScore(calc, query)
            }))
            .filter(calc => calc.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance);

        displayResults(results, query);
    }

    // Add keyboard navigation
    let selectedIndex = -1;

    searchInput.addEventListener('keydown', (e) => {
        const items = searchResults.querySelectorAll('.search-result-item');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    items[selectedIndex].querySelector('a').click();
                }
                break;
            default:
                return;
        }
        
        items.forEach((item, index) => {
            item.classList.toggle('selected', index === selectedIndex);
        });
    });

    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);

    document.addEventListener('click', (e) => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });
});