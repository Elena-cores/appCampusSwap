//validar contraseñas! 

function hasNumber(password) {
    return /\d/.test(password);
}

function isPasswordSecure(password) {
    return (
        hasNumber(password) 
    );
}

module.exports = {
    hasNumber
};
