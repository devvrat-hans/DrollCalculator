document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const fromUnitSelect = document.getElementById('fromUnit');
    const toUnitSelect = document.getElementById('toUnit');
    const fromValueInput = document.getElementById('fromValue');
    const toValueInput = document.getElementById('toValue');
    const swapButton = document.getElementById('swapUnits');

    // Unit Definitions
    const units = {
        length: {
            meter: { factor: 1, display: 'Meter (m)' },
            kilometer: { factor: 1000, display: 'Kilometer (km)' },
            centimeter: { factor: 0.01, display: 'Centimeter (cm)' },
            millimeter: { factor: 0.001, display: 'Millimeter (mm)' },
            mile: { factor: 1609.34, display: 'Mile (mi)' },
            yard: { factor: 0.9144, display: 'Yard (yd)' },
            foot: { factor: 0.3048, display: 'Foot (ft)' },
            inch: { factor: 0.0254, display: 'Inch (in)' }
        },
        weight: {
            kilogram: { factor: 1, display: 'Kilogram (kg)' },
            gram: { factor: 0.001, display: 'Gram (g)' },
            milligram: { factor: 0.000001, display: 'Milligram (mg)' },
            pound: { factor: 0.453592, display: 'Pound (lb)' },
            ounce: { factor: 0.0283495, display: 'Ounce (oz)' }
        },
        temperature: {
            celsius: { display: 'Celsius (°C)' },
            fahrenheit: { display: 'Fahrenheit (°F)' },
            kelvin: { display: 'Kelvin (K)' }
        },
        area: {
            sqMeter: { factor: 1, display: 'Square Meter (m²)' },
            sqKilometer: { factor: 1000000, display: 'Square Kilometer (km²)' },
            hectare: { factor: 10000, display: 'Hectare (ha)' },
            acre: { factor: 4046.86, display: 'Acre' },
            sqFoot: { factor: 0.092903, display: 'Square Foot (ft²)' }
        },
        volume: {
            liter: { factor: 1, display: 'Liter (L)' },
            milliliter: { factor: 0.001, display: 'Milliliter (mL)' },
            cubicMeter: { factor: 1000, display: 'Cubic Meter (m³)' },
            gallon: { factor: 3.78541, display: 'Gallon (gal)' },
            quart: { factor: 0.946353, display: 'Quart (qt)' }
        },
        speed: {
            mps: { factor: 1, display: 'Meters per Second (m/s)' },
            kph: { factor: 0.277778, display: 'Kilometers per Hour (km/h)' },
            mph: { factor: 0.44704, display: 'Miles per Hour (mph)' },
            knot: { factor: 0.514444, display: 'Knot' }
        },
        time: {
            second: { factor: 1, display: 'Second (s)' },
            minute: { factor: 60, display: 'Minute (min)' },
            hour: { factor: 3600, display: 'Hour (h)' },
            day: { factor: 86400, display: 'Day' },
            week: { factor: 604800, display: 'Week' }
        },
        pressure: {
            pascal: { factor: 1, display: 'Pascal (Pa)' },
            kilopascal: { factor: 1000, display: 'Kilopascal (kPa)' },
            bar: { factor: 100000, display: 'Bar' },
            psi: { factor: 6894.76, display: 'PSI' },
            atmosphere: { factor: 101325, display: 'Atmosphere (atm)' }
        }
    };

    // Populate unit selections based on category
    function populateUnits(category) {
        const unitType = units[category];
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';
        
        Object.keys(unitType).forEach(unit => {
            const option1 = new Option(unitType[unit].display, unit);
            const option2 = new Option(unitType[unit].display, unit);
            fromUnitSelect.add(option1);
            toUnitSelect.add(option2);
        });
    }

    // Temperature conversion functions
    function convertTemperature(value, from, to) {
        let celsius;
        
        // Convert to Celsius first
        switch(from) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * (5/9);
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }
        
        // Convert from Celsius to target unit
        switch(to) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return (celsius * (9/5)) + 32;
            case 'kelvin':
                return celsius + 273.15;
        }
    }

    // General unit conversion
    function convert() {
        const fromValue = parseFloat(fromValueInput.value);
        if (isNaN(fromValue)) {
            toValueInput.value = '';
            return;
        }

        const category = categorySelect.value;
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;

        let result;
        if (category === 'temperature') {
            result = convertTemperature(fromValue, fromUnit, toUnit);
        } else {
            const fromFactor = units[category][fromUnit].factor;
            const toFactor = units[category][toUnit].factor;
            result = (fromValue * fromFactor) / toFactor;
        }

        toValueInput.value = result.toFixed(8).replace(/\.?0+$/, '');
    }

    // Event Listeners
    categorySelect.addEventListener('change', () => {
        populateUnits(categorySelect.value);
        convert();
    });

    [fromUnitSelect, toUnitSelect].forEach(select => {
        select.addEventListener('change', convert);
    });

    fromValueInput.addEventListener('input', convert);

    swapButton.addEventListener('click', () => {
        const tempUnit = fromUnitSelect.value;
        const tempValue = fromValueInput.value;
        
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = tempUnit;
        
        fromValueInput.value = toValueInput.value;
        convert();
    });

    // Initialize
    populateUnits(categorySelect.value);
});