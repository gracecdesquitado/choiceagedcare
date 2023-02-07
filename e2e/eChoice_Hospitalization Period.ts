import { test, Page , expect} from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.use({
  viewport:{
    height: 2680,
    width : 1800
  }
});
test.beforeAll(async ({ browser }) => {
  // Create page once and sign in.
  page = await browser.newPage();
  await page.goto('/login');
  await page.getByRole('button', { name: 'Visit Site' }).click();
  await page.waitForLoadState();
  await page.getByLabel('Username *').click();
  await page.getByLabel('Username *').fill('diane57122');
  await page.getByLabel('Username *').press('Tab');
  await page.getByLabel('Password *').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForLoadState();
});

test.afterAll(async () => {
  await page.close();
});

test('Select Resident', async () => {
    await page.getByRole('button', { name: 'Residents' }).click();
    await page.getByRole('checkbox', { name: /Playwright Automation .*/ }).click({force:true});
    await page.waitForTimeout(8000);
});

test('Hospitalization Periods', async () => {
  //Generate Random Date
    function randomDate(date1, date2){
      function randomValueBetween(min, max) {
        return Math.random() * (max - min) + min;
      }
      var date1 = date1 || '01-01-2000'
      var date2 = date2 || new Date().toLocaleDateString()
      date1 = new Date(date1).getTime()
      date2 = new Date(date2).getTime()
      if( date1>date2){
          return new Date(randomValueBetween(date2,date1)).toLocaleDateString()   
      } else{
          return new Date(randomValueBetween(date1, date2)).toLocaleDateString()  

      }
    }
    //Format the date to YYYY-MM-DD
    function formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2) 
          month = '0' + month;
      if (day.length < 2) 
          day = '0' + day;

      return [year, month, day].join('-');
  }
  
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Hospitalisation Periods' }).click();
    await page.waitForTimeout(8000);
    // CHECK for Duplicate
    const checkEnable = await page.getByRole('button', { name: 'ADD HOSPITALISATION PERIOD' }).isVisible();
    if ((checkEnable == true))
    {
      await page.getByRole('button', { name: 'ADD HOSPITALISATION PERIOD' }).click();
      await page.getByRole('heading', { name: 'Add Hospitalisation Period' }).isVisible();
      await page.waitForTimeout(8000);
      await page.getByLabel('Date *').fill(formatDate(randomDate('2022-10-01', '2022-10-30')));
      await page.getByLabel('Notes').click();
      await page.getByLabel('Notes').fill('Add Hospitalization Period using playwright automation');
      await page.getByRole('button', { name: 'ADD' }).click();
      await page.getByRole('cell', { name: 'Add Hospitalization Period using playwright automation' }).isVisible();
      await page.waitForTimeout(8000);
    }
    else {
      await expect(page.getByRole('cell').nth(3)).toBeEmpty();
      //CEASE using RETURN button
      await page.getByRole('button', { name: 'RETURN FROM HOSPITALISATION' }).click();
      await page.getByLabel('Ceased At *').fill(formatDate(randomDate('2022-12-01', '2022-12-30')));
      await page.getByRole('button', { name: 'CEASE' }).click();
      await page.getByText('Successfully ceased hospitalisation period.').isVisible();
      await page.getByRole('cell', { name: / .* Diane Curtis/ }).isVisible();
      //DELETE RECORD
      await page.locator('#fade-button').first().click();
      await page.getByText('Delete').click();
      await page.getByRole('heading', { name: 'Delete Hospitalisation Period?' }).isVisible();
      await page.getByRole('button', { name: 'DELETE' }).click();
      await page.getByText('Successfully deleted Hospitalisation Period.').isVisible();
      await page.waitForTimeout(8000);
      //RE-ADD RECORD
      await page.getByRole('button', { name: 'ADD HOSPITALISATION PERIOD' }).click();
      await page.getByRole('heading', { name: 'Add Hospitalisation Period' }).isVisible();
      await page.waitForTimeout(8000);
      await page.getByLabel('Date *').fill(formatDate(randomDate('2022-10-01', '2022-10-30')));
      await page.getByLabel('Notes').click();
      await page.getByLabel('Notes').fill('Add Hospitalization Period using playwright automation');
      await page.getByRole('button', { name: 'ADD' }).click();
      await expect(page.getByRole('cell', { name: 'Add Hospitalization Period using playwright automation' })).toBeVisible();
    }
  //UPDATE RECORD
    await page.getByRole('row', { name:'Add Hospitalization Period using playwright automation' }).first().locator('#fade-button').click();
    await page.getByRole('menuitem', { name: 'Update' }).click();
    await page.getByRole('heading', { name: 'Update Hospitalisaton Period' }).isVisible();
    await page.getByLabel('Date *').fill(formatDate(randomDate('2022-11-01', '2022-11-30')));
    await page.getByLabel('Notes').click();
    await page.getByLabel('Notes').press('Meta+a');
    await page.getByLabel('Notes').fill('Update Hospitalization Period using playwright automation');
    await page.getByRole('button', { name: 'UPDATE' }).click();
    await page.getByRole('cell', { name: 'Update Hospitalization Period using playwright automation' }).isVisible();
    //CEASE RECORD from menu
    await page.getByRole('row', { name:'Update Hospitalization Period using playwright automation' }).first().locator('#fade-button').click();
    await page.getByRole('menuitem', { name: 'Cease' }).click();
    await page.getByRole('heading', { name: 'Cease Hospitalisation Period?' }).isVisible();
    await page.getByLabel('Ceased At *').fill(formatDate(randomDate('2023-01-01', '2023-01-30')));
    await page.getByRole('heading', { name: 'Cease Hospitalisation Period?' }).click();
    await (await page.waitForSelector('button', { state: 'visible' })).waitForElementState("visible");
    await page.getByRole('button', { name: 'CEASE' }).click();
    await page.getByText('Successfully ceased hospitalisation period.').isVisible();
    await (await page.waitForSelector('button', { state: 'visible' })).waitForElementState("visible");
    await expect(page.getByRole('button', { name: 'ADD HOSPITALISATION PERIOD' })).toBeVisible();
    await expect(page.getByRole('cell', { name: / .* Diane Curtis .*/ })).toBeVisible();
    //DELETE RECORD
    await page.getByRole('row', { name:'Update Hospitalization Period using playwright automation' }).first().locator('#fade-button').click();
    await page.getByText('Delete').click();
    await page.getByRole('heading', { name: 'Delete Hospitalisation Period?' }).isVisible();
    await page.getByRole('button', { name: 'DELETE' }).click();
    await page.getByText('Successfully deleted Hospitalisation Period.').click();
});