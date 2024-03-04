import { test, expect } from '@playwright/test';

test.describe('Select items for checkout, adjust as needed, and ensure user information is complete before checkout.', async() =>{
    test('Check out a random number of items', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('visual_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
        await page.locator('a').filter({ hasText: '2' }).click();
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
        await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').click();
        await page.locator('[data-test="firstName"]').fill('FirstName');
        await page.locator('[data-test="firstName"]').press('Tab');
        await page.locator('[data-test="lastName"]').fill('lastName');
        await page.locator('[data-test="lastName"]').press('Tab');
        await page.locator('[data-test="postalCode"]').fill('1234');
        await page.locator('[data-test="continue"]').click();
        await expect(page.getByText('SauceCard #')).toBeVisible();
        await page.locator('[data-test="finish"]').click();
        await expect(page.getByRole('img', { name: 'Pony Express' })).toBeVisible();
      });

      test('Remove items from checkout.', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('visual_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
        await page.locator('a').filter({ hasText: '2' }).click();
        await expect(page.locator('[data-test="checkout"]')).toBeVisible();
        await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();
        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
        await page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]').click();
      });

      test('Cancel the checkout', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('visual_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
        await page.locator('a').filter({ hasText: '2' }).click();
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').click();
        await page.locator('[data-test="firstName"]').fill('userinformation');
        await page.locator('[data-test="firstName"]').press('Tab');
        await page.locator('[data-test="lastName"]').fill('lastname');
        await page.locator('[data-test="lastName"]').press('Tab');
        await page.locator('[data-test="postalCode"]').fill('1234');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="finish"]')).toBeVisible();
        await expect(page.getByText('SauceCard #')).toBeVisible();
        await page.locator('[data-test="cancel"]').click();
        await page.locator('a').filter({ hasText: '2' }).click();
        await expect(page.locator('#cart_contents_container')).toContainText('Sauce Labs Backpackcarry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.$29.99Remove');
      });

      test('Add more items during checkout.', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('visual_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
        await page.locator('a').filter({ hasText: '2' }).click();
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').click();
        await page.locator('[data-test="firstName"]').fill('userinformation');
        await page.locator('[data-test="firstName"]').press('Tab');
        await page.locator('[data-test="lastName"]').fill('lastname');
        await page.locator('[data-test="lastName"]').press('Tab');
        await page.locator('[data-test="postalCode"]').fill('1234');
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('[data-test="finish"]')).toBeVisible();
        await expect(page.getByText('SauceCard #')).toBeVisible();
        await page.locator('[data-test="cancel"]').click();
        await page.locator('a').filter({ hasText: '2' }).click();
        await expect(page.locator('#cart_contents_container')).toContainText('Sauce Labs Backpackcarry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.$29.99Remove');
        await page.locator('a').filter({ hasText: '2' }).click();
        await page.locator('[data-test="continue-shopping"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('a').filter({ hasText: '3' }).click();
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').click();
        await page.locator('[data-test="firstName"]').fill('fistName');
        await page.locator('[data-test="firstName"]').press('Tab');
        await page.locator('[data-test="lastName"]').fill('lastName');
        await page.locator('[data-test="lastName"]').press('Tab');
        await page.locator('[data-test="postalCode"]').fill('1234');
        await page.locator('[data-test="continue"]').click();
        await expect(page.getByText('SauceCard #')).toBeVisible();
        await page.locator('[data-test="finish"]').click();
        await expect(page.getByRole('img', { name: 'Pony Express' })).toBeVisible();
      });

      test('Cannot checkout without complete information.', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');
        await page.locator('[data-test="username"]').click();
        await page.locator('[data-test="username"]').fill('visual_user');
        await page.locator('[data-test="password"]').click();
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('a').filter({ hasText: '1' }).click();
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('div').filter({ hasText: /^Error: First Name is required$/ }).nth(1)).toBeVisible();
        await expect(page.locator('path').first()).toBeVisible();
      });
})
