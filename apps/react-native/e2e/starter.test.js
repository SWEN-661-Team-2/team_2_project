describe('CareConnect App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display the welcome screen on launch', async () => {
    await expect(element(by.id('welcome_title'))).toBeVisible();
  });

  it('should navigate to login screen after tapping continue', async () => {
    await element(by.id('welcome_continue_button')).tap();
    await expect(element(by.text('CareConnect'))).toBeVisible();
  });

  it('should allow typing in email and password fields', async () => {
    await element(by.id('welcome_continue_button')).tap();
    await element(by.id('login_email')).typeText('test@example.com');
    await element(by.id('login_password')).typeText('password123');
    await expect(element(by.id('login_email'))).toHaveText('test@example.com');
    await element(by.id('login_password')).tapReturnKey();
    await element(by.label('Sign In')).tap();
    await expect(element(by.text('Active Patients'))).toBeVisible();
  });

});
