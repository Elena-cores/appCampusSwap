//validar contraseñas! 

function hasNumber(password) {
    return /\d/.test(password);
}

function hasLowerCase(password) {
    return /[a-z]/.test(password);
}

function hasUpperCase(password) {
    return /[A-Z]/.test(password); 
}

module.exports = {
    hasNumber,
    hasLowerCase,
    hasUpperCase
};
