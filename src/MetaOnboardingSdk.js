import { loadFacebookSDK } from './loader';
import CryptoJS from 'crypto-js';

const FB_API_VERSION = 'v21.0';

/**
 * @typedef {Object} MetaOnboardingHandlers
 * @property {(exchangeCode: string) => void | Promise<void>} onSuccess
 *   Called with the exchange_code returned by Meta after a successful signup.
 * @property {(error: Error) => void} [onError]
 *   Called when an error occurs (SDK load failure, invalid config, FB.login error).
 * @property {() => void} [onCancel]
 *   Called when the user closes the Meta signup dialog without completing it.
 */

/**
 * @typedef {Object} MetaOnboardingLaunchParams
 * @property {string} appId    Facebook App ID — obtained from your backend.
 * @property {string} configId Embedded Signup config ID — obtained from your backend.
 */

/**
 * @typedef {Object} WhatsAppBusinessRegistrationHandlers
 * @property {(tenantData: Object) => void | Promise<void>} onTenantCreated
 *   Called after successful tenant registration.
 * @property {(workspaceData: Object) => void | Promise<void>} onWorkspaceCreated
 *   Called after successful workspace creation.
 * @property {(config: Object) => void | Promise<void>} onMetaConfigReady
 *   Called when Meta configuration data is ready (embeddedSignupUrl or metaAppId/configId).
 * @property {(status: Object) => void | Promise<void>} onStatusUpdated
 *   Called when workspace status is checked.
 * @property {(error: Error) => void} [onError]
 *   Called when an error occurs at any step.
 * @property {() => void} [onCancel]
 *   Called when the user cancels the flow.
 */

/**
 * @typedef {Object} TenantRegistrationParams
 * @property {string} businessCode  Unique business code (e.g., 'TP1', 'AW1').
 * @property {string} businessName  Business display name.
 * @property {string} businessEmail Business email.
 * @property {string} phoneNumber   Business phone number.
 * @property {string} businessAddress Business address.
 * @property {string} website Optional business website.
 * @property {string} isSelfManagedBilling Whether tenant manages its own billing.
 * @property {string} [parentBusinessId] Parent business ID for child tenants (AiSensy only).
 * @property {string} [bspType]  BSP type: 'Meta' or 'AiSensy' (optional - determined by isSelfManagedBilling).
 */

/**
 * @typedef {Object} WorkspaceCreationParams
 * @property {string} businessId    Business ID from tenant registration.
 * @property {string} workspaceName Workspace display name.
 */

export class MetaOnboardingSdk {
  /** @param {MetaOnboardingHandlers} handlers */
  constructor(handlers = {}) {
    this.onTenantOnboardingStarted = handlers.onTenantOnboardingStarted ?? (() => {});
    this._onError = handlers.onError ?? ((err) => console.error('[meta-onboarding]', err));
    this._onCancel = handlers.onCancel ?? (() => { });
  }

  /**
   * Loads the FB SDK and launches the Meta Embedded Signup popup.
   * Config (appId, configId) is supplied by the caller — fetch it from your
   * backend before calling launch().
   *
   * @param {MetaOnboardingLaunchParams} params
   * @returns {Promise<void>}
   */
  async launchSignup({ appId, configId, bspType = 'Meta' } = {}) {
    if (!appId || !configId) {
      this._onError(new Error('[meta-onboarding] launchSignup() requires { appId, configId }'));
      return;
    }

    let FB;
    try {
      FB = await loadFacebookSDK();
    } catch (err) {
      this._onError(err);
      return;
    }

    FB.init({
      appId,
      autoLogAppEvents: true,
      xfbml: true,
      version: FB_API_VERSION,
    });

    return new Promise((resolve) => {
      FB.login(
        (response) => {
          const code = response?.authResponse?.code;

          if (code) {
            Promise.resolve(
              this._onSuccess({
                exchangeCode: code,
                bspType,
              })
            ).finally(resolve);
          } else {
            this._onCancel();
            resolve();
          }
        },
        {
          config_id: configId,
          response_type: 'code',
          override_default_response_type: true,
          extras: {
            sessionInfoVersion: '3',
            setup: {},
            featureType: '',
            bspType, // optional custom tracking
          },
        }
      );
    });
  }
}

