import { MetaOnboardingSdk } from './MetaOnboardingSdk';
import { MetaBspOnboardingSdk } from './MetaBspOnboardingSdk';

/**
 * Convenience factory for MetaOnboardingSdk
 * @param {MetaOnboardingHandlers} handlers
 */
const createMetaOnboardingSdk = (handlers) => {
  return new MetaOnboardingSdk(handlers);
};

/**
 * Convenience factory for MetaBspOnboardingSdk
 * @param {MetaBspOnboardingHandlers} handlers
 * @param {Object} config
 */
const createMetaBspOnboardingSdk = (handlers) => {
  return new MetaBspOnboardingSdk(handlers);
};

export function getWhatsAppOnboardingSdk (isSelfManagedBilling = false, handlers) {
  if (isSelfManagedBilling) {
    return createMetaOnboardingSdk(handlers);
  }
  return createMetaBspOnboardingSdk(handlers);
};
