document.addEventListener('DOMContentLoaded', function() {
    // Dynamic path handling
    const isCalculatorPage = window.location.pathname.includes('/Calculators/');
    const baseUrl = isCalculatorPage ? '../..' : '.';

    // Load navbar
    fetch(`${baseUrl}/templates/shared/navbar.html`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load navbar');
            return response.text();
        })
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));

    // Load footer
    fetch(`${baseUrl}/templates/shared/footer.html`)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load footer');
            return response.text();
        })
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});