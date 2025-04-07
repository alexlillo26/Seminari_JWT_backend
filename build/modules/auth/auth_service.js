var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { encrypt, verified } from "../../utils/bcrypt.handle.js";
import { generateToken } from "../../utils/jwt.handle.js";
import User from "../users/user_models.js";
import axios from 'axios';
const registerNewUser = ({ email, password, name, age }) => __awaiter(void 0, void 0, void 0, function* () {
    const checkIs = yield User.findOne({ email });
    if (checkIs)
        return "ALREADY_USER";
    const passHash = yield encrypt(password);
    const registerNewUser = yield User.create({
        email,
        password: passHash,
        name,
        age
    });
    return registerNewUser;
});
const loginUser = ({ email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const checkIs = yield User.findOne({ email });
    if (!checkIs)
        return "NOT_FOUND_USER";
    const passwordHash = checkIs.password; //El encriptado que ve de la bbdd
    const isCorrect = yield verified(password, passwordHash);
    if (!isCorrect)
        return "INCORRECT_PASSWORD";
    const token = generateToken(checkIs.email);
    const data = {
        token,
        user: checkIs
    };
    return data;
});
const googleAuth = (code) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("Client ID:", process.env.GOOGLE_CLIENT_ID);
        console.log("Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
        console.log("Redirect URI:", process.env.GOOGLE_OAUTH_REDIRECT_URL);
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_OAUTH_REDIRECT_URL) {
            throw new Error("Variables de entorno faltantes");
        }
        //axios --> llibreria que s'utilitza per a fer peticions HTTP
        const tokenResponse = yield axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
            grant_type: 'authorization_code'
        });
        const access_token = tokenResponse.data.access_token;
        console.log("Access Token:", access_token);
        // Obté el perfil d'usuari
        const profileResponse = yield axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
            params: { access_token },
            headers: { Accept: 'application/json', },
        });
        const profile = profileResponse.data;
        console.log("Access profile:", profile);
        // Busca o crea el perfil a la BBDD
        let user = yield User.findOne({
            $or: [{ name: profile.name }, { email: profile.email }, { googleId: profile.id }]
        });
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8);
            const passHash = yield encrypt(randomPassword);
            user = yield User.create({
                name: profile.name,
                email: profile.email,
                googleId: profile.id,
                password: passHash,
            });
        }
        // Genera el token JWT
        const token = generateToken(user.email);
        console.log(token);
        return { token, user };
    }
    catch (error) {
        console.error('Google Auth Error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message); // Log detallado
        throw new Error('Error en autenticación con Google');
    }
});
export { registerNewUser, loginUser, googleAuth };
