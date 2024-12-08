const assert = require('assert');
const { 
    hasNumber,
    hasLowerCase,
    hasUpperCase
    } = require('../public/javascript/comprobaciones.js');

describe('Validación de contraseñas', () => {
    it('Validar que contraseña contiene al menos un número', () => {
        const password = 'SecurePassword';
        assert.strictEqual(hasNumber(password), false);
        assert.strictEqual(hasNumber('SecurePassword1!'), true);
    });

    it('Validar que contraseña contiene al menos una letra minúscula', () => {
        const password = 'SECUREPASSWORD';
        assert.strictEqual(hasLowerCase(password), false);
        assert.strictEqual(hasLowerCase('SECUREPASSWORDy'), true);
    });

    it('Validar que contraseña contiene al menos una letra mayúscula', () => {
        const password = 'password1';
        assert.strictEqual(hasUpperCase(password), false);
        assert.strictEqual(hasUpperCase('Password1'), true);
    });

});
