import { test, expect } from '../fixtures';
import { esperarAlerta } from '../utils/alertas';
import { evidenciaElemento } from '../../utils/acciones';

const HU04 = { type: 'HU', description: 'HU-04 Realizar una compra' };

// Datos ficticios: nunca uses datos reales ni tarjetas reales
const DATOS = {
  nombre: 'Ana Pérez',
  pais: 'Colombia',
  ciudad: 'Bogotá',
  tarjeta: '1234567890123456',
  mes: '11',
  anio: '2026',
};

test.describe('HU-04 Realizar una compra', () => {

  test('CP-R09 Compra completa de un producto', {
    tag: ['@smoke', '@compra'],
    annotation: HU04,
  }, async ({ homePage, cartPage, orderModal, productoEnCarrito }) => {
    await homePage.openCart();
    await expect(cartPage.item(productoEnCarrito)).toBeVisible();

    await cartPage.placeOrder();
    await orderModal.fillData(DATOS);
    await orderModal.purchase();

    await expect(orderModal.confirmationTitle).toHaveText('Thank you for your purchase!');
    await evidenciaElemento(orderModal.confirmation, 'Resultado: compra confirmada');
  });

  test('CP-R10 Compra sin diligenciar los datos obligatorios', {
    tag: ['@compra'],
    annotation: HU04,
  }, async ({ page, homePage, cartPage, orderModal, productoEnCarrito }) => {
    await homePage.openCart();
    await expect(cartPage.item(productoEnCarrito)).toBeVisible();

    await cartPage.placeOrder();
    const mensaje = await esperarAlerta(page, () => orderModal.purchase());

    expect(mensaje).toContain('Please fill out Name and Creditcard');
    await expect(orderModal.confirmation).toBeHidden();   // no se confirmó ninguna compra
  });
});
