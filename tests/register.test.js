const assert = require('assert');
const { hasNumber } = require('../public/javascript/comprobaciones.js');

describe('Validación de contraseñas', () => {
    it('Contraseña sin número', () => {
        const password = 'SecurePassword!';
        assert.strictEqual(hasNumber(password), false);
    });

});
