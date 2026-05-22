const HillCipher = {
    // 1. Definimos el alfabeto (28 caracteres, el espacio es el primero = 0)
    ALPHABET: " ABCDEFGHIJKLMNÑOPQRSTUVWXYZ",

    // 2. Función matemática segura para el módulo
    mod: function(n, m) {
        return ((n % m) + m) % m;
    },

    // 3. Encontrar el inverso modular
    modInverse: function(a, m) {
        a = this.mod(a, m);
        for (let x = 1; x < m; x++) {
            if (this.mod(a * x, m) === 1) return x;
        }
        throw new Error("El determinante de la matriz no es coprimo con 28. No tiene inverso modular. Usa otra matriz.");
    },

    // 4. Limpieza del texto ingresado (Permite letras, Ñ y espacios)
    cleanText: function(text) {
        return text.toUpperCase().replace(/[^A-ZÑ ]/g, ""); 
    },

    // --- LÓGICA PARA MATRIZ 2x2 ---

    process2x2: function(text, matrix, isEncrypting = true) {
        let m = this.ALPHABET.length; // Módulo 28
        let workingMatrix = matrix;
        let result = "";

        if (isEncrypting) {
            text = this.cleanText(text);
            if (text.length % 2 !== 0) text += "X";
            
            let numResult = [];
            for (let i = 0; i < text.length; i += 2) {
                let vec1 = this.ALPHABET.indexOf(text[i]);
                let vec2 = this.ALPHABET.indexOf(text[i + 1]);

                let res1 = this.mod((workingMatrix[0][0] * vec1) + (workingMatrix[0][1] * vec2), m);
                let res2 = this.mod((workingMatrix[1][0] * vec1) + (workingMatrix[1][1] * vec2), m);

                numResult.push(res1, res2);
            }
            return numResult.join(" "); // Devuelve números separados por espacio

        } else {
            // DESENCRIPTACIÓN (Lee números, devuelve texto)
            let a = matrix[0][0], b = matrix[0][1];
            let c = matrix[1][0], d = matrix[1][1];
            
            let det = this.mod((a * d) - (b * c), m);
            let invDet = this.modInverse(det, m);
            
            workingMatrix = [
                [this.mod(d * invDet, m), this.mod(-b * invDet, m)],
                [this.mod(-c * invDet, m), this.mod(a * invDet, m)]
            ];

            // Convertimos la cadena de texto de entrada en un array de números
            let numArray = text.trim().split(/\s+/).map(Number);
            let textResult = "";

            for (let i = 0; i < numArray.length; i += 2) {
                let vec1 = numArray[i];
                let vec2 = numArray[i + 1];

                let res1 = this.mod((workingMatrix[0][0] * vec1) + (workingMatrix[0][1] * vec2), m);
                let res2 = this.mod((workingMatrix[1][0] * vec1) + (workingMatrix[1][1] * vec2), m);

                textResult += this.ALPHABET[res1] + this.ALPHABET[res2];
            }
            return textResult.replace(/X+$/, ""); // Limpiamos las X finales
        }
    },

    // --- LÓGICA PARA MATRIZ 3x3 ---

    process3x3: function(text, matrix, isEncrypting = true) {
        let m = this.ALPHABET.length; // Módulo 28
        let workingMatrix = matrix;
        let result = "";

        if (isEncrypting) {
            text = this.cleanText(text);
            while (text.length % 3 !== 0) text += "X";

            let numResult = [];
            for (let i = 0; i < text.length; i += 3) {
                let vec1 = this.ALPHABET.indexOf(text[i]);
                let vec2 = this.ALPHABET.indexOf(text[i + 1]);
                let vec3 = this.ALPHABET.indexOf(text[i + 2]);

                let res1 = this.mod((workingMatrix[0][0]*vec1) + (workingMatrix[0][1]*vec2) + (workingMatrix[0][2]*vec3), m);
                let res2 = this.mod((workingMatrix[1][0]*vec1) + (workingMatrix[1][1]*vec2) + (workingMatrix[1][2]*vec3), m);
                let res3 = this.mod((workingMatrix[2][0]*vec1) + (workingMatrix[2][1]*vec2) + (workingMatrix[2][2]*vec3), m);

                numResult.push(res1, res2, res3);
            }
            return numResult.join(" "); // Devuelve números separados por espacio

        } else {
            // DESENCRIPTACIÓN (Lee números, devuelve texto)
            let [a, b, c] = matrix[0];
            let [d, e, f] = matrix[1];
            let [g, h, i] = matrix[2];

            let det = this.mod(a*(e*i - f*h) - b*(d*i - f*g) + c*(d*h - e*g), m);
            let invDet = this.modInverse(det, m);

            workingMatrix = [
                [this.mod((e*i - f*h) * invDet, m), this.mod(-(b*i - c*h) * invDet, m), this.mod((b*f - c*e) * invDet, m)],
                [this.mod(-(d*i - f*g) * invDet, m), this.mod((a*i - c*g) * invDet, m), this.mod(-(a*f - c*d) * invDet, m)],
                [this.mod((d*h - e*g) * invDet, m), this.mod(-(a*h - b*g) * invDet, m), this.mod((a*e - b*d) * invDet, m)]
            ];

            // Convertimos la cadena de entrada a array de números
            let numArray = text.trim().split(/\s+/).map(Number);
            let textResult = "";

            for (let i = 0; i < numArray.length; i += 3) {
                let vec1 = numArray[i];
                let vec2 = numArray[i + 1];
                let vec3 = numArray[i + 2];

                let res1 = this.mod((workingMatrix[0][0]*vec1) + (workingMatrix[0][1]*vec2) + (workingMatrix[0][2]*vec3), m);
                let res2 = this.mod((workingMatrix[1][0]*vec1) + (workingMatrix[1][1]*vec2) + (workingMatrix[1][2]*vec3), m);
                let res3 = this.mod((workingMatrix[2][0]*vec1) + (workingMatrix[2][1]*vec2) + (workingMatrix[2][2]*vec3), m);

                textResult += this.ALPHABET[res1] + this.ALPHABET[res2] + this.ALPHABET[res3];
            }
            return textResult.replace(/X+$/, ""); // Limpiamos las X finales
        }
    }
};