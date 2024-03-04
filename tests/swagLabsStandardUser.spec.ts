import { test, expect } from '@playwright/test';
interface Item {
  itemName: string;
  itemPrice: string;
  itemDescription: string;
}

test.describe('Select items for checkout, adjust as needed, and ensure user information is complete before checkout.', async() =>{
    test('Check out a random number of items', async ({ page }) => {
      // Enter your user credentials to log into SauceDemo.
        await page.goto('https://www.saucedemo.com/');
        await expect(page,"The comparison of the Saucedemo login page title was unsuccessful.").toHaveTitle(/Swag Labs/);
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();

        // Assume there's a maximum of six items. Randomly select a number, then choose that many items from an array. 
        // After each selection, remove the chosen item from the original array to prevent repeated selection.
        const maxNumberOfItems = 6;
        const minNumberOfItems = 1
        const numberOfItemsToAdd = Math.floor(Math.random() * (maxNumberOfItems - minNumberOfItems + 1) + minNumberOfItems);
        const arrayOfNumbers: number[] = [0, 1, 2, 3, 4, 5];
        const arrayOfNumbersCopy = [...arrayOfNumbers];
        const arrayOfItems:Item[] =[];
        await expect.soft(page, "The comparison of URLs before item selection was unsuccessful.").toHaveURL(/.*inventory.html/);
        for (let i = 0; i < numberOfItemsToAdd; i++) {
          const randomIndex = Math.floor(Math.random() * arrayOfNumbersCopy.length);
          const [randomValue] = arrayOfNumbersCopy.splice(randomIndex, 1);
          const identifier = `#item_${randomValue}_title_link`;
          console.log(identifier);
          await page.locator(identifier).click();

          // Extract the item details and keep them for validation in the subsequent steps.
          await expect(page, "The attempt to compare URLs prior to extracting item details was unsuccessful.").toHaveURL(/.*inventory-item\.html\?id=(\d+)/);
          const itemName = await page.locator('.inventory_details_name.large_size').textContent();
          const itemPrice= await page.locator('.inventory_details_price').textContent();
          const itemDescription= await page.locator('.inventory_details_desc').textContent();
          await page.getByRole('button').filter({ hasText: 'Add to cart' }).click();
          arrayOfItems.push({
            itemName: itemName ?? 'Default Name',
            itemPrice: itemPrice ?? 'Default Price',
            itemDescription: itemDescription ?? 'Default Description'
          })
          await page.locator('[data-test="back-to-products"]').click();
        }

        // Open the cart and verify the details of the selected item.
        await page.locator('a').filter({ hasText: `${numberOfItemsToAdd}` }).click();
        await expect(page, "The comparison of URLs was unsuccessful before validating items in the cart.").toHaveURL(/.*cart.html/);
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
          const itemPrice = item.itemPrice; 
          const itemDescription = item.itemDescription;
          await expect (page.getByRole('link', { name: itemName })).toBeVisible();
          await expect (page.getByText(`1${itemName}`).filter({ hasText: `${itemPrice}` })).toBeVisible();
          await expect (page.getByText(itemDescription)).toBeVisible();
        }

        //Proceed to checkout step one to collect the necessary user information.
        await page.locator('[data-test="checkout"]').click();
        await expect(page, "The comparison of URLs failed during the first checkout step for entering user information.").toHaveURL(/.*checkout-step-one.html/);
        await page.locator('[data-test="firstName"]').fill('FirstName');
        await page.locator('[data-test="lastName"]').fill('lastName');
        await page.locator('[data-test="postalCode"]').fill('1234');

        // Go to the checkout overview and confirm the items before finalizing the transaction.
        await page.locator('[data-test="continue"]').click();
        await expect(page, "The comparison of URLs failed during the overview of items in the second checkout step.").toHaveURL(/.*checkout-step-two.html/);
        
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
          const itemPrice = item.itemPrice; 
          const itemDescription = item.itemDescription;
          await expect (page.getByRole('link', { name: itemName })).toBeVisible();
          await expect (page.getByText(`1${itemName}`).filter({ hasText: `${itemPrice}` })).toBeVisible();
          await expect (page.getByText(itemDescription)).toBeVisible();
        }
        await expect(page.getByText('SauceCard #')).toBeVisible();

        // Complete the checkout process and validate the checkout confirmation.
        await page.locator('[data-test="finish"]').click();
        await expect(page, "The comparison of URLs failed after the checkout was completed.").toHaveURL(/.*checkout-complete.html/);
        await expect(page.getByRole('img', { name: 'Pony Express' })).toBeVisible();
      });

      test('Remove items from checkout.', async ({ page }) => {
        // Enter your user credentials to log into SauceDemo.
        await page.goto('https://www.saucedemo.com/');
        await expect(page,"The comparison of the Saucedemo login page title was unsuccessful.").toHaveTitle(/Swag Labs/);
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();

        // Assume there's a maximum of six items. Randomly select a number, then choose that many items from an array. 
        // After each selection, remove the chosen item from the original array to prevent repeated selection.
        const numberOfItemsToAdd = Math.floor(Math.random() * (6 - 1 + 1) + 1);
        const arrayOfNumbers: number[] = [0, 1, 2, 3, 4, 5];
        const arrayOfNumbersCopy = [...arrayOfNumbers];
        const arrayOfItems:Item[] =[];
        await expect(page, "The comparison of URLs before item selection was unsuccessful.").toHaveURL(/.*inventory.html/);
        for (let i = 0; i < numberOfItemsToAdd; i++) {
          const randomIndex = Math.floor(Math.random() * arrayOfNumbersCopy.length);
          const [randomValue] = arrayOfNumbersCopy.splice(randomIndex, 1);
          const identifier = `#item_${randomValue}_title_link`;
          console.log(identifier);
          await page.locator(identifier).click();
          
          // Extract the item details and keep them for validation in the subsequent steps.
          await expect(page, "The attempt to compare URLs prior to extracting item details was unsuccessful.").toHaveURL(/.*inventory-item\.html\?id=(\d+)/);
          const itemName = await page.locator('.inventory_details_name.large_size').textContent();
          const itemPrice= await page.locator('.inventory_details_price').textContent();
          const itemDescription= await page.locator('.inventory_details_desc').textContent();
          await page.getByRole('button').filter({ hasText: 'Add to cart' }).click();
          arrayOfItems.push({
            itemName: itemName ?? 'Default Name',
            itemPrice: itemPrice ?? 'Default Price',
            itemDescription: itemDescription ?? 'Default Description'
          })
          await page.locator('[data-test="back-to-products"]').click();
        }

        // Open the cart and verify the details of the selected item.
        await page.locator('a').filter({ hasText: `${numberOfItemsToAdd}` }).click();
        await expect(page, "The comparison of URLs was unsuccessful before validating items in the cart.").toHaveURL(/.*cart.html/);
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
          const itemPrice = item.itemPrice; 
          const itemDescription = item.itemDescription;
          await expect (page.getByRole('link', { name: itemName })).toBeVisible();
          await expect (page.getByText(`1${itemName}`).filter({ hasText: `${itemPrice}` })).toBeVisible();
          await expect (page.getByText(itemDescription)).toBeVisible();
        }
        await expect(page.locator('[data-test="checkout"]')).toBeVisible();
        await expect(page.locator('[data-test="continue-shopping"]')).toBeVisible();

        // Remove all selected items from the cart.
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
        const nameWithHyphens = itemName.replace(/\s+/g, '-');
        const lowercaseName = nameWithHyphens.toLowerCase();
        const id = `remove-${lowercaseName}`;
        await page.locator(`[data-test="${id}"]`).click();
        }
        await expect(page.locator('.removed_cart_item').first()).toHaveClass(/removed_cart_item/)

      });

      test('Cancel the checkout', async ({ page }) => {
        // Enter your user credentials to log into SauceDemo.
        await page.goto('https://www.saucedemo.com/');
        await expect(page,"The comparison of the Saucedemo login page title was unsuccessful.").toHaveTitle(/Swag Labs/);
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();

        // Assume there's a maximum of six items. Randomly select a number, then choose that many items from an array. 
        // After each selection, remove the chosen item from the original array to prevent repeated selection.
        const numberOfItemsToAdd = Math.floor(Math.random() * (6 - 1 + 1) + 1);
        const arrayOfNumbers: number[] = [0, 1, 2, 3, 4, 5];
        const arrayOfNumbersCopy = [...arrayOfNumbers];
        const arrayOfItems:Item[] =[];
        await expect(page, "The comparison of URLs before item selection was unsuccessful.").toHaveURL(/.*inventory.html/);
        for (let i = 0; i < numberOfItemsToAdd; i++) {
          const randomIndex = Math.floor(Math.random() * arrayOfNumbersCopy.length);
          const [randomValue] = arrayOfNumbersCopy.splice(randomIndex, 1);
          const identifier = `#item_${randomValue}_title_link`;
          console.log(identifier);
          await page.locator(identifier).click();

          // Extract the item details and keep them for validation in the subsequent steps.
          await expect(page, "The attempt to compare URLs prior to extracting item details was unsuccessful.").toHaveURL(/.*inventory-item\.html\?id=(\d+)/);
          const itemName = await page.locator('.inventory_details_name.large_size').textContent();
          const itemPrice= await page.locator('.inventory_details_price').textContent();
          const itemDescription= await page.locator('.inventory_details_desc').textContent();
          await page.getByRole('button').filter({ hasText: 'Add to cart' }).click();
          arrayOfItems.push({
            itemName: itemName ?? 'Default Name',
            itemPrice: itemPrice ?? 'Default Price',
            itemDescription: itemDescription ?? 'Default Description'
          })
          await page.locator('[data-test="back-to-products"]').click();
        }

        // Open the cart and verify the details of the selected item.
        await page.locator('a').filter({ hasText: `${numberOfItemsToAdd}` }).click();
        await expect(page, "The comparison of URLs was unsuccessful before validating items in the cart.").toHaveURL(/.*cart.html/);
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
          const itemPrice = item.itemPrice; 
          const itemDescription = item.itemDescription;
          await expect (page.getByRole('link', { name: itemName })).toBeVisible();
          await expect (page.getByText(`1${itemName}`).filter({ hasText: `${itemPrice}` })).toBeVisible();
          await expect (page.getByText(itemDescription)).toBeVisible();
        }

        // Proceed to the next page to collect the required user information.
        await page.locator('[data-test="checkout"]').click();
        await expect(page, "The comparison of URLs failed during the first checkout step for entering user information.").toHaveURL(/.*checkout-step-one.html/);
        await page.locator('[data-test="firstName"]').fill('userinformation');
        await page.locator('[data-test="lastName"]').fill('lastname');
        await page.locator('[data-test="postalCode"]').fill('1234');

        // Go to the checkout overview and confirm the items before finalizing the transaction.
        await page.locator('[data-test="continue"]').click();
        await expect(page, "The comparison of URLs failed during the overview of items in the second checkout step.").toHaveURL(/.*checkout-step-two.html/);
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
          const itemPrice = item.itemPrice; 
          const itemDescription = item.itemDescription;
          await expect (page.getByRole('link', { name: itemName })).toBeVisible();
          await expect (page.getByText(`1${itemName}`).filter({ hasText: `${itemPrice}` })).toBeVisible();
          await expect (page.getByText(itemDescription)).toBeVisible();
        }
        await expect(page.locator('[data-test="finish"]')).toBeVisible();
        await expect(page.getByText('SauceCard #')).toBeVisible();


        await page.locator('[data-test="cancel"]').click();
        await page.locator('a').filter({ hasText: `${numberOfItemsToAdd}` }).click();
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
          const itemPrice = item.itemPrice; 
          const itemDescription = item.itemDescription;
          await expect (page.getByRole('link', { name: itemName })).toBeVisible();
          await expect (page.getByText(`1${itemName}`).filter({ hasText: `${itemPrice}` })).toBeVisible();
          await expect (page.getByText(itemDescription)).toBeVisible();
        }
      });

      test('Add more items during checkout.', async ({ page }) => {
        // Enter your user credentials to log into SauceDemo.
        await page.goto('https://www.saucedemo.com/');
        await expect(page,"The comparison of the Saucedemo login page title was unsuccessful.").toHaveTitle(/Swag Labs/);
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();

        // Assume there's a maximum of six items. Randomly select a number, then choose that many items from an array. 
        // After each selection, remove the chosen item from the original array to prevent repeated selection.
        const maxItems = 6;
        const numberOfItemsToAdd = Math.floor(Math.random() * (maxItems - 1 + 1) + 1);
        const remainingItems = maxItems - numberOfItemsToAdd;
        // const numberOfItemsToAppend = Math.floor(Math.random() * remainingItems) + 1;
        const numberOfItemsToAppend = Math.floor(Math.random() * (remainingItems - 1 + 1) + 1);

        const arrayOfNumbers: number[] = [0, 1, 2, 3, 4, 5];
        const arrayOfNumbersCopy = [...arrayOfNumbers];
        const arrayOfItems:Item[] =[];
        console.log({numberOfItemsToAdd});
        console.log({numberOfItemsToAppend});
        await expect(page, "The comparison of URLs before item selection was unsuccessful.").toHaveURL(/.*inventory.html/);
        for (let i = 0; i < numberOfItemsToAdd; i++) {
          const randomIndex = Math.floor(Math.random() * arrayOfNumbersCopy.length);
          const [randomValue] = arrayOfNumbersCopy.splice(randomIndex, 1);
          const identifier = `#item_${randomValue}_title_link`;
          console.log(identifier);
          await page.locator(identifier).click();

          // Extract the item details and keep them for validation in the subsequent steps.
          await expect(page, "The attempt to compare URLs prior to extracting item details was unsuccessful.").toHaveURL(/.*inventory-item\.html\?id=(\d+)/);
          const itemName = await page.locator('.inventory_details_name.large_size').textContent();
          const itemPrice= await page.locator('.inventory_details_price').textContent();
          const itemDescription= await page.locator('.inventory_details_desc').textContent();
          await page.getByRole('button').filter({ hasText: 'Add to cart' }).click();
          arrayOfItems.push({
            itemName: itemName ?? 'Default Name',
            itemPrice: itemPrice ?? 'Default Price',
            itemDescription: itemDescription ?? 'Default Description'
          })
          await page.locator('[data-test="back-to-products"]').click();
        }

        // Open the cart and verify the details of the selected item.
        await page.locator('a').filter({ hasText: `${numberOfItemsToAdd}` }).click();
        await expect(page, "The comparison of URLs was unsuccessful before validating items in the cart.").toHaveURL(/.*cart.html/);
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
          const itemPrice = item.itemPrice; 
          const itemDescription = item.itemDescription;
          await expect (page.getByRole('link', { name: itemName })).toBeVisible();
          await expect (page.getByText(`1${itemName}`).filter({ hasText: `${itemPrice}` })).toBeVisible();
          await expect (page.getByText(itemDescription)).toBeVisible();
        }

         //Proceed to checkout step one to collect the necessary user information.
        await page.locator('[data-test="checkout"]').click();
        await expect(page, "The comparison of URLs failed during the first checkout step for entering user information.").toHaveURL(/.*checkout-step-one.html/);
        await page.locator('[data-test="firstName"]').fill('userinformation');
        await page.locator('[data-test="lastName"]').fill('lastname');
        await page.locator('[data-test="postalCode"]').fill('1234');

        // Go to the checkout overview and confirm the items before finalizing the transaction.
        await page.locator('[data-test="continue"]').click();
        await expect(page, "The comparison of URLs failed during the overview of items in the second checkout step.").toHaveURL(/.*checkout-step-two.html/);
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
          const itemPrice = item.itemPrice; 
          const itemDescription = item.itemDescription;
          await expect (page.getByRole('link', { name: itemName })).toBeVisible();
          await expect (page.getByText(`1${itemName}`).filter({ hasText: `${itemPrice}` })).toBeVisible();
          await expect (page.getByText(itemDescription)).toBeVisible();
        }
        await expect(page.locator('[data-test="finish"]')).toBeVisible();
        await expect(page.getByText('SauceCard #')).toBeVisible();

        // Cancel the checkout
        await page.locator('[data-test="cancel"]').click();

        // An order can contain up to six items. If the order already has items, add permissible ones from a previous array.
        //  Make sure to remove each selected item to avoid duplicates.
        for (let i = 0; i < numberOfItemsToAppend; i++) {
          const randomIndex = Math.floor(Math.random() * arrayOfNumbersCopy.length);
          const [randomValue] = arrayOfNumbersCopy.splice(randomIndex, 1);
          const identifier = `#item_${randomValue}_title_link`;
          console.log(identifier);
          await page.locator(identifier).click();

          // Extract the item details and keep them for validation in the subsequent steps.
          await expect(page, "The attempt to compare URLs prior to extracting item details was unsuccessful.").toHaveURL(/.*inventory-item\.html\?id=(\d+)/);
          const itemName = await page.locator('.inventory_details_name.large_size').textContent();
          const itemPrice= await page.locator('.inventory_details_price').textContent();
          const itemDescription= await page.locator('.inventory_details_desc').textContent();
          await page.getByRole('button').filter({ hasText: 'Add to cart' }).click();
          arrayOfItems.push({
            itemName: itemName ?? 'Default Name',
            itemPrice: itemPrice ?? 'Default Price',
            itemDescription: itemDescription ?? 'Default Description'
          })
          await page.locator('[data-test="back-to-products"]').click();
        }

        // Open the cart and verify the details of the items that were added and later appended to the order.
        const totalNumberOfItems = numberOfItemsToAdd+ numberOfItemsToAppend;
        await page.locator('a').filter({ hasText: `${totalNumberOfItems}` }).click();
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
          const itemPrice = item.itemPrice; 
          const itemDescription = item.itemDescription;
          await expect (page.getByRole('link', { name: itemName })).toBeVisible();
          await expect (page.getByText(`1${itemName}`).filter({ hasText: `${itemPrice}` })).toBeVisible();
          await expect (page.getByText(itemDescription)).toBeVisible();
        }

        // Proceed to checkout step one to collect the necessary user information.
        await page.locator('[data-test="checkout"]').click();
        await expect(page, "The comparison of URLs failed during the first checkout step for entering user information.").toHaveURL(/.*checkout-step-one.html/);
        await page.locator('[data-test="firstName"]').fill('fistName');
        await page.locator('[data-test="lastName"]').fill('lastName');
        await page.locator('[data-test="postalCode"]').fill('1234');

        // Go to the checkout overview and confirm the items before finalizing the transaction.
        await page.locator('[data-test="continue"]').click();
        await expect(page, "The comparison of URLs failed during the overview of items in the second checkout step.").toHaveURL(/.*checkout-step-two.html/);
        await expect(page.getByText('SauceCard #')).toBeVisible();

        // Complete the checkout process and validate the checkout confirmation.
        await page.locator('[data-test="finish"]').click();
        await expect(page, "The comparison of URLs failed after the checkout was completed.").toHaveURL(/.*checkout-complete.html/);
        await expect(page.getByRole('img', { name: 'Pony Express' })).toBeVisible();
      });

      test('Cannot checkout without complete information.', async ({ page }) => {
        // Enter your user credentials to log into SauceDemo.
        await page.goto('https://www.saucedemo.com/');
        await expect(page,"The comparison of the Saucedemo login page title was unsuccessful.").toHaveTitle(/Swag Labs/);
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();

        // Assume there's a maximum of six items. Randomly select a number, then choose that many items from an array. 
        // After each selection, remove the chosen item from the original array to prevent repeated selection.
        const numberOfItemsToAdd = Math.floor(Math.random() * (6 - 1 + 1) + 1);
        const arrayOfNumbers: number[] = [0, 1, 2, 3, 4, 5];
        const arrayOfNumbersCopy = [...arrayOfNumbers];
        const arrayOfItems:Item[] =[];
        await expect(page, "The comparison of URLs before item selection was unsuccessful.").toHaveURL(/.*inventory.html/);
        for (let i = 0; i < numberOfItemsToAdd; i++) {
          const randomIndex = Math.floor(Math.random() * arrayOfNumbersCopy.length);
          const [randomValue] = arrayOfNumbersCopy.splice(randomIndex, 1);
          const identifier = `#item_${randomValue}_title_link`;
          console.log(identifier);
          await page.locator(identifier).click();

          // Extract the item details and keep them for validation in the subsequent steps.
          await expect(page, "The attempt to compare URLs prior to extracting item details was unsuccessful.").toHaveURL(/.*inventory-item\.html\?id=(\d+)/);
          const itemName = await page.locator('.inventory_details_name.large_size').textContent();
          const itemPrice= await page.locator('.inventory_details_price').textContent();
          const itemDescription= await page.locator('.inventory_details_desc').textContent();
          await page.getByRole('button').filter({ hasText: 'Add to cart' }).click();
          arrayOfItems.push({
            itemName: itemName ?? 'Default Name',
            itemPrice: itemPrice ?? 'Default Price',
            itemDescription: itemDescription ?? 'Default Description'
          })
          await page.locator('[data-test="back-to-products"]').click();
        }

        // Open the cart and verify the details of the selected item.
        await page.locator('a').filter({ hasText: `${numberOfItemsToAdd}` }).click();
        await expect(page, "The comparison of URLs was unsuccessful before validating items in the cart.").toHaveURL(/.*cart.html/);
        for (const item of arrayOfItems) {
          const itemName = item.itemName;
          const itemPrice = item.itemPrice; 
          const itemDescription = item.itemDescription;
          await expect (page.getByRole('link', { name: itemName })).toBeVisible();
          await expect (page.getByText(`1${itemName}`).filter({ hasText: `${itemPrice}` })).toBeVisible();
          await expect (page.getByText(itemDescription)).toBeVisible();
        }

         //Proceed to checkout step one to collect the necessary user information.
        await page.locator('[data-test="checkout"]').click();
        await expect(page, "The comparison of URLs failed during the first checkout step for entering user information.").toHaveURL(/.*checkout-step-one.html/);

        // Try proceeding to checkout and confirming items without providing user information.
        await page.locator('[data-test="continue"]').click();
        await expect(page.locator('div').filter({ hasText: /^Error: First Name is required$/ }).nth(1)).toBeVisible();
        await expect(page.locator('path').first()).toBeVisible();
      });
})
