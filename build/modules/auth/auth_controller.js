var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { registerNewUser, loginUser, googleAuth } from "../auth/auth_service.js";
const registerCtrl = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseUser = yield registerNewUser(body);
        res.json(responseUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const loginCtrl = ({ body }, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = body;
        const responseUser = yield loginUser({ name, email, password });
        if (responseUser === 'INCORRECT_PASSWORD') {
            return res.status(403).json({ message: 'Contraseña incorrecta' });
        }
        if (responseUser === 'NOT_FOUND_USER') {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.json(responseUser);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
const googleAuthCtrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URL;
    if (!redirectUri) {
        console.error(" ERROR: GOOGLE_OAUTH_REDIRECT_URL no està definida a .env");
        return res.status(500).json({ message: "Error interno de configuración" });
    }
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'; //ojo tema versió
    const options = new URLSearchParams({
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
    });
    const fullUrl = `${rootUrl}?${options.toString()}`;
    console.log("Redireccionando a:", fullUrl);
    res.redirect(fullUrl);
});
const googleAuthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).json({ message: 'Código de autorización faltante' });
        }
        const authData = yield googleAuth(code);
        if (!authData) {
            return res.redirect('/login?error=authentication_failed');
        }
        console.log(authData.token);
        // Configurar cookies no https (secure)--> acces des del web.
        res.cookie('token', authData.token, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 86400000 // 1 día
        });
        console.log(authData.token);
        res.redirect(`http://localhost:4200/?token=${authData.token}`);
    }
    catch (error) {
        console.error('Error en callback de Google:', error);
        res.redirect('/login?error=server_error');
    }
});
export { registerCtrl, loginCtrl, googleAuthCtrl, googleAuthCallback };
