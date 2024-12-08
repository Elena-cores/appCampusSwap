//validar contraseñas! 

function hasNumber(password) {
    return /\d/.test(password);
}

function hasLowerCase(password) {
    return /[a-z]/.test(password);
}



module.exports = {
    hasNumber,
    hasLowerCase
};
