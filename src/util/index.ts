import CryptoJS from 'crypto-js';

// 密码加密
export const encrypt = (pwd:string, secretKey:string) => {
    return CryptoJS.AES.encrypt(pwd, secretKey).toString();
}

// 密码解密
export const decrypt = (pwd:string, secretKey:string) => {
    return CryptoJS.AES.decrypt(pwd, secretKey).toString(CryptoJS.enc.Utf8);
}
