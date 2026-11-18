import { Page, Locator } from '@playwright/test';
import { clic, escribir } from '../../utils/acciones';

export interface DatosCompra {
  nombre: string;
  pais: string;
  ciudad: string;
  tarjeta: string;
  mes: string;
  anio: string;
}

// Ventana emergente "Place order" y mensaje de confirmación de la compra
export class OrderModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly cardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseButton: Locator;
  readonly confirmation: Locator;
  readonly confirmationTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.locator('#orderModal');
    this.nameInput = this.modal.locator('#name');
    this.countryInput = this.modal.locator('#country');
    this.cityInput = this.modal.locator('#city');
    this.cardInput = this.modal.locator('#card');
    this.monthInput = this.modal.locator('#month');
    this.yearInput = this.modal.locator('#year');
    this.purchaseButton = this.modal.getByRole('button', { name: 'Purchase' });
    this.confirmation = page.locator('.sweet-alert');
    this.confirmationTitle = page.locator('.sweet-alert h2');
  }

  async fillData(d: DatosCompra) {
    await escribir(this.nameInput, d.nombre, `Ingresar nombre "${d.nombre}"`);
    await escribir(this.countryInput, d.pais, `Ingresar país "${d.pais}"`);
    await escribir(this.cityInput, d.ciudad, `Ingresar ciudad "${d.ciudad}"`);
    await escribir(this.cardInput, d.tarjeta, 'Ingresar número de tarjeta (ficticio)');
    await escribir(this.monthInput, d.mes, `Ingresar mes "${d.mes}"`);
    await escribir(this.yearInput, d.anio, `Ingresar año "${d.anio}"`);
  }

  async purchase() {
    await clic(this.purchaseButton, 'Clic en "Purchase"');
  }
}
