async function GenerateRandomCode(length) {
    let charset = "0123456789abcdefghijklmnopqrstuvwxyz";
    let code = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
       code += charset.charAt(Math.floor(Math.random() * n));
    }
    return code;
}
module.exports = GenerateRandomCode;