import { Page, Locator } from '@playwright/test';
import { clic } from '../../utils/acciones';

// Detalle de un producto
export class ProductPage {
  readonly page: Page;
  readonly name: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('h2.name');
    this.price = page.locator('h3.price-container');
    this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
  }

  async addToCart() {
    await clic(this.addToCartButton, 'Clic en "Add to cart"');
  }
}
