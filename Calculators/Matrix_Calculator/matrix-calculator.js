document.addEventListener('DOMContentLoaded', () => {
    const matrixARows = document.getElementById('matrixARows');
    const matrixACols = document.getElementById('matrixACols');
    const matrixBRows = document.getElementById('matrixBRows');
    const matrixBCols = document.getElementById('matrixBCols');
    const operation = document.getElementById('operation');
    const calculateBtn = document.getElementById('calculateMatrix');
    const matrixADiv = document.getElementById('matrixA');
    const matrixBDiv = document.getElementById('matrixB');
    const resultDiv = document.getElementById('matrixResult');

    // Generate matrix input grid
    function generateMatrix(rows, cols, targetDiv) {
        targetDiv.innerHTML = '';
        for(let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'matrix-row';
            for(let j = 0; j < cols; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'matrix-cell';
                input.value = '0';
                row.appendChild(input);
            }
            targetDiv.appendChild(row);
        }
    }

    // Get matrix values
    function getMatrixValues(matrixDiv) {
        const matrix = [];
        const rows = matrixDiv.querySelectorAll('.matrix-row');
        rows.forEach(row => {
            const rowValues = [];
            row.querySelectorAll('input').forEach(input => {
                rowValues.push(Number(input.value) || 0);
            });
            matrix.push(rowValues);
        });
        return matrix;
    }

    // Matrix Operations
    const matrixOps = {
        add: (A, B) => {
            if(A.length !== B.length || A[0].length !== B[0].length) {
                throw new Error('Matrices must have same dimensions for addition');
            }
            return A.map((row, i) => row.map((val, j) => val + B[i][j]));
        },

        subtract: (A, B) => {
            if(A.length !== B.length || A[0].length !== B[0].length) {
                throw new Error('Matrices must have same dimensions for subtraction');
            }
            return A.map((row, i) => row.map((val, j) => val - B[i][j]));
        },

        multiply: (A, B) => {
            if(A[0].length !== B.length) {
                throw new Error('Number of columns in first matrix must equal rows in second');
            }
            return A.map(row => {
                return B[0].map((_, j) => {
                    return row.reduce((sum, val, k) => sum + val * B[k][j], 0);
                });
            });
        },

        determinant: (A) => {
            if(A.length !== A[0].length) {
                throw new Error('Matrix must be square for determinant');
            }
            if(A.length === 1) return A[0][0];
            if(A.length === 2) {
                return A[0][0] * A[1][1] - A[0][1] * A[1][0];
            }
            let det = 0;
            for(let i = 0; i < A[0].length; i++) {
                det += Math.pow(-1, i) * A[0][i] * matrixOps.determinant(
                    A.slice(1).map(row => [...row.slice(0, i), ...row.slice(i + 1)])
                );
            }
            return det;
        },

        inverse: (A) => {
            const det = matrixOps.determinant(A);
            if(det === 0) {
                throw new Error('Matrix is not invertible');
            }
            if(A.length === 1) return [[1/A[0][0]]];
            
            const cofactors = A.map((row, i) => 
                row.map((_, j) => {
                    const minor = A.filter((_, k) => k !== i)
                        .map(row => row.filter((_, k) => k !== j));
                    return Math.pow(-1, i + j) * matrixOps.determinant(minor);
                })
            );
            
            const adjugate = cofactors[0].map((_, i) => 
                cofactors.map(row => row[i])
            );
            
            return adjugate.map(row => row.map(val => val / det));
        }
    };

    // Display result matrix
    function displayResult(matrix) {
        resultDiv.innerHTML = '';
        matrix.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'matrix-row';
            row.forEach(val => {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.textContent = Number(val.toFixed(4));
                rowDiv.appendChild(cell);
            });
            resultDiv.appendChild(rowDiv);
        });
    }

    // Event Listeners
    [matrixARows, matrixACols].forEach(input => {
        input.addEventListener('change', () => {
            generateMatrix(Number(matrixARows.value), Number(matrixACols.value), matrixADiv);
        });
    });

    [matrixBRows, matrixBCols].forEach(input => {
        input.addEventListener('change', () => {
            generateMatrix(Number(matrixBRows.value), Number(matrixBCols.value), matrixBDiv);
        });
    });

    operation.addEventListener('change', () => {
        const op = operation.value;
        const matrixBControls = document.querySelector('[for="matrixB"]');
        matrixBControls.style.display = (op === 'determinant' || op === 'inverse') ? 'none' : 'block';
    });

    calculateBtn.addEventListener('click', () => {
        try {
            const matrixA = getMatrixValues(matrixADiv);
            let result;

            if(operation.value === 'determinant') {
                result = [[matrixOps.determinant(matrixA)]];
            } else if(operation.value === 'inverse') {
                result = matrixOps.inverse(matrixA);
            } else {
                const matrixB = getMatrixValues(matrixBDiv);
                result = matrixOps[operation.value](matrixA, matrixB);
            }

            displayResult(result);
        } catch(error) {
            resultDiv.innerHTML = `<div class="error-message">${error.message}</div>`;
        }
    });

    // Initialize matrices
    generateMatrix(2, 2, matrixADiv);
    generateMatrix(2, 2, matrixBDiv);
});