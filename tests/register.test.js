const assert = require('assert');
const { 
    hasNumber,
    hasLowerCase
    } = require('../public/javascript/comprobaciones.js');

describe('Validación de contraseñas', () => {
    it('Contraseña contiene al menos un número', () => {
        const password = 'SecurePassword';
        assert.strictEqual(hasNumber(password), false);
    });

    it('Contraseña contiene al menos una letra minúscula', () => {
        const password = 'SECUREPASSWORD';
        assert.strictEqual(hasLowerCase(password), false);
    });

});
