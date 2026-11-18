import { Page, Locator } from '@playwright/test';
import { clic, evidenciaPantalla } from '../../utils/acciones';

// Página de inicio (catálogo). También contiene la barra de navegación,
// que es idéntica en todas las páginas del sitio (login, carrito, etc.).
export class HomePage {
  readonly page: Page;
  // Barra de navegación
  readonly loginLink: Locator;
  readonly cartLink: Locator;
  readonly welcomeUser: Locator;
  readonly logoutLink: Locator;
  // Catálogo
  readonly productList: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.locator('#login2');
    this.cartLink = page.locator('#cartur');
    this.welcomeUser = page.locator('#nameofuser');
    this.logoutLink = page.locator('#logout2');
    this.productList = page.locator('#tbodyid');
    this.productCards = page.locator('#tbodyid .card');
    this.productNames = page.locator('#tbodyid .card-title');
  }

  async goto() {
    await this.page.goto('/');
    await this.productCards.first().waitFor();   // el catálogo se carga por JavaScript
    await evidenciaPantalla(this.page, 'Abrir la página de inicio');
  }

  // Tarjeta de un producto a partir de su nombre
  product(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors') {
    await clic(this.page.getByRole('link', { name: category, exact: true }),
               `Seleccionar la categoría "${category}"`);
  }

  async openProduct(name: string) {
    await clic(this.product(name).getByRole('link', { name }),
               `Abrir el detalle de "${name}"`);
  }

  async openLogin() {
    await clic(this.loginLink, 'Clic en "Log in" de la barra de navegación');
  }

  async openCart() {
    await clic(this.cartLink, 'Ir al carrito');
  }
}
