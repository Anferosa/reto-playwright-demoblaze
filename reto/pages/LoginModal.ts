import { Page, Locator } from '@playwright/test';
import { clic, escribir } from '../../utils/acciones';

// Ventana emergente (modal) de inicio de sesión
export class LoginModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('#logInModal');
    this.usernameInput = this.modal.locator('#loginusername');
    this.passwordInput = this.modal.locator('#loginpassword');
    // Se busca DENTRO del modal: en la barra de navegación también hay un "Log in"
    this.loginButton = this.modal.getByRole('button', { name: 'Log in' });
  }

  async login(username: string, password: string) {
    await escribir(this.usernameInput, username, `Ingresar usuario "${username}"`);
    await escribir(this.passwordInput, password, 'Ingresar contraseña');
    await clic(this.loginButton, 'Clic en el botón Log in');
  }
}
