import { test, expect } from '../fixtures';
import { esperarAlerta } from '../utils/alertas';
import { evidenciaElemento, evidenciaPantalla } from '../../utils/acciones';

const HU03 = { type: 'HU', description: 'HU-03 Carrito de compras' };

test.describe('HU-03 Carrito de compras', () => {

  test('CP-R07 Agregar un producto al carrito', {
    tag: ['@smoke', '@carrito'],
    annotation: HU03,
  }, async ({ page, homePage, productPage, cartPage }) => {
    const producto = 'Samsung galaxy s6';

    await homePage.openProduct(producto);
    const mensaje = await esperarAlerta(page, () => productPage.addToCart());
    expect(mensaje).toContain('Product added');

    await homePage.openCart();
    await expect(cartPage.item(producto)).toBeVisible();
    await evidenciaElemento(cartPage.item(producto), 'Resultado: el producto aparece en el carrito');
  });

  test('CP-R08 Eliminar un producto del carrito', {
    tag: ['@carrito'],
    annotation: HU03,
  }, async ({ page, homePage, cartPage, productoEnCarrito }) => {
    await homePage.openCart();
    await expect(cartPage.item(productoEnCarrito)).toBeVisible();

    await cartPage.deleteItem(productoEnCarrito);

    await expect(cartPage.item(productoEnCarrito)).toHaveCount(0);
    await evidenciaPantalla(page, 'Resultado: el carrito quedó sin el producto');
  });
});
