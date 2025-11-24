import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import axios from "axios";

// 1. Definimos que esta función necesita acceso a este secreto
const hcaptchaSecret = defineSecret("HCAPTCHA_SECRET_KEY");

export const validateCaptcha = onRequest(
  // 2. Configuración: CORS activado y secretos inyectados
  { 
    cors: true, 
    secrets: [hcaptchaSecret] 
  }, 
  async (req, res) => {
    // 3. Validación de Método: Solo aceptamos POST
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // 4. Extracción de datos
    const { token } = req.body;
    const secretKey = hcaptchaSecret.value(); // Acceso seguro al secreto

    if (!token) {
      res.status(400).json({ error: "Token is required" });
      return;
    }

    try {
      // 5. Preparar datos para hCaptcha (esperan x-www-form-urlencoded, no JSON)
      const params = new URLSearchParams();
      params.append("secret", secretKey);
      params.append("response", token);

      // 6. Llamada con Axios
      const response = await axios.post(
        "https://api.hcaptcha.com/siteverify",
        params
      );
      
      const { success } = response.data;

      if (success) {
        res.status(200).json({ success: true });
      } else {
        // Logueamos el error en la consola de Google Cloud para depuración interna
        console.warn("Captcha failed:", response.data);
        res.status(400).json({ success: false, error: "Invalid captcha" });
      }

    } catch (error) {
      console.error("Internal Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);