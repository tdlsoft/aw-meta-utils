/**
 * WhatsApp Business & Workspace Registration SDK
 * Manages the full registration flow for both Meta and AiSensy BSP types
 */
export class MetaBspOnboardingSdk {
  /**
   * @param {WhatsAppBusinessRegistrationHandlers} handlers
   */
  constructor(handlers = {}) {
    this.onTenantOnboardingStarted = handlers.onTenantOnboardingStarted ?? (() => {});
    this._onError = handlers.onError ?? ((err) => console.error('[whatsapp-registration]', err));
    this._onCancel = handlers.onCancel ?? (() => {});
  }

  /**
   * Launch signup flow (for any BSP type)
   * @param {string} embeddedSignupUrl
   * @returns {Promise<void>}
   */
  async launchSignup(embeddedSignupUrl) {
    if (!embeddedSignupUrl) {
      this._onError(new Error('AiSensy signup URL is required'));
      return;
    }

    await Promise.resolve(this.onTenantOnboardingStarted());

    // Open AiSensy signup in a popup or redirect
    const w = 600, h = 800;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(embeddedSignupUrl, 'aisensy-signup', `width=${w},height=${h},left=${left},top=${top}`);

    if (!popup) {
      this._onError(new Error('Failed to open AiSensy signup window'));
      return;
    }
  }

}
