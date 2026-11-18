import { Page, Locator } from '@playwright/test';
import { clic } from '../../utils/acciones';

// Carrito de compras
export class CartPage {
  readonly page: Page;
  readonly rows: Locator;
  readonly total: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rows = page.locator('#tbodyid tr.success');
    this.total = page.locator('#totalp');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
  }

  // Fila de un producto dentro del carrito
  item(name: string): Locator {
    return this.rows.filter({ hasText: name });
  }

  async deleteItem(name: string) {
    await clic(this.item(name).getByRole('link', { name: 'Delete' }),
               `Eliminar "${name}" del carrito`);
  }

  async placeOrder() {
    await clic(this.placeOrderButton, 'Clic en "Place Order"');
  }
}
