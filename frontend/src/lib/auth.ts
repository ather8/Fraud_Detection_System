import { api } from "./api";

const TOKEN_KEY = "fw_token";
const EMAIL_KEY = "fw_email";

export const auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getEmail: () => localStorage.getItem(EMAIL_KEY),
  isAuthed: () => !!localStorage.getItem(TOKEN_KEY),

  async login(username: string, password: string) {
    // FastAPI OAuth2PasswordRequestForm expects form-encoded data
    const form = new URLSearchParams();
    form.append("username", username);
    form.append("password", password);
    const { data } = await api.post("/auth/token", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const token = data.access_token || data.token;
    if (!token) throw new Error("No access token in response");
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EMAIL_KEY, username);
    return token;
  },

  async register(username: string, password: string) {
    // Backend expects username/password as query params, not a JSON body
    await api.post("/auth/register", null, { params: { username, password } });
    return auth.login(username, password);
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
  },
};
