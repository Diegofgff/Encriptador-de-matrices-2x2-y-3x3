// Esperar a que cargue el HTML
document.addEventListener("DOMContentLoaded", () => {
    const matrixTypeSelect = document.getElementById("matrixType");
    const matrixContainer = document.getElementById("matrixContainer");
    const btnEncrypt = document.getElementById("btnEncrypt");
    const btnDecrypt = document.getElementById("btnDecrypt");
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");

    // Generar los inputs de la matriz según la selección (2x2 o 3x3)
    function generateMatrixInputs() {
        const size = parseInt(matrixTypeSelect.value);
        matrixContainer.innerHTML = ""; // Limpiar contenedor
        
        // Asignar la clase CSS correcta para la cuadrícula
        matrixContainer.className = `matrix-container grid-${size}x${size}`;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const input = document.createElement("input");
                input.type = "number";
                input.id = `m${i}${j}`;
                // Valores por defecto (las matrices seguras recomendadas)
                if (size === 2) {
                    const default2x2 = [[2, 3], [1, 4]];
                    input.value = default2x2[i][j];
                } else {
                    const default3x3 = [[3, 4, 5], [2, 3, 4], [1, 1, 2]];
                    input.value = default3x3[i][j];
                }
                matrixContainer.appendChild(input);
            }
        }
    }

    // Leer la matriz desde los inputs del HTML
    function getMatrixFromUI() {
        const size = parseInt(matrixTypeSelect.value);
        let matrix = [];
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                const val = document.getElementById(`m${i}${j}`).value;
                row.push(parseInt(val) || 0); // Si está vacío, usa 0
            }
            matrix.push(row);
        }
        return matrix;
    }

    // Ejecutar la acción (Encriptar o Desencriptar)
    function processAction(isEncrypting) {
        try {
            const text = inputText.value;
            const size = parseInt(matrixTypeSelect.value);
            const matrix = getMatrixFromUI();
            let result = "";

            if (!text) {
                alert("Por favor, ingresa un mensaje.");
                return;
            }

            // Llamar a los métodos de hillCipher.js
            if (size === 2) {
                result = HillCipher.process2x2(text, matrix, isEncrypting);
            } else if (size === 3) {
                result = HillCipher.process3x3(text, matrix, isEncrypting);
            }

            outputText.value = result;

        } catch (error) {
            alert("Error matemático: " + error.message);
        }
    }

    // Event Listeners
    matrixTypeSelect.addEventListener("change", generateMatrixInputs);
    btnEncrypt.addEventListener("click", () => processAction(true));
    btnDecrypt.addEventListener("click", () => processAction(false));

    // Inicializar la matriz al cargar la página
    generateMatrixInputs();
});