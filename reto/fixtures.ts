import { test as base } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { LoginModal } from './pages/LoginModal';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { OrderModal } from './pages/OrderModal';
import { esperarAlerta } from './utils/alertas';

type FixturesReto = {
  homePage: HomePage;               // página de inicio ya abierta
  loginModal: LoginModal;
  productPage: ProductPage;
  cartPage: CartPage;
  orderModal: OrderModal;
  productoEnCarrito: string;        // precondición: un producto ya agregado al carrito (devuelve su nombre)
};

export const test = base.extend<FixturesReto>({
  homePage: async ({ page }, use) => {
    const home = new HomePage(page);
    await home.goto();
    await use(home);
  },

  loginModal: async ({ page }, use) => {
    await use(new LoginModal(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  orderModal: async ({ page }, use) => {
    await use(new OrderModal(page));
  },

  // Deja un producto en el carrito (como invitado: cada prueba tiene su propio carrito)
  productoEnCarrito: async ({ page, homePage, productPage }, use) => {
    const producto = 'Samsung galaxy s6';
    await homePage.openProduct(producto);
    await esperarAlerta(page, () => productPage.addToCart());   // acepta el aviso "Product added"
    await use(producto);
  },
});

export { expect } from '@playwright/test';
