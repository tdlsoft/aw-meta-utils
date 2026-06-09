import React from 'react';

const TIMEZONES = [
  "Asia/Calcutta GMT+05:30",
  "UTC GMT+00:00",
  "America/New_York GMT-05:00",
  "Europe/London GMT+00:00",
  "Asia/Dubai GMT+04:00",
  "Asia/Singapore GMT+08:00",
  "America/Los_Angeles GMT-08:00"
];

const WhatsAppSignup = ({
  currentStep,
  formData,
  handleFormChange,
  handleConsolidatedOnboard,
  handleLaunchMetaSignup,
  handleLaunchAiSensySignup,
  handleCheckStatus,
  onCancel,
  onNavigateToHistory,
  loading,
  metaConfig,
  tenantData,
  workspaceData,
  workspaceStatus
}) => {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-gray-800">WhatsApp Business Registration</h2>
      {/* <div className="mb-8 flex justify-between">
        {['Business Info', 'Signup'].map(
          (label, idx) => {
            const steps = ['business-info', 'signup-action'];
            const isActive = steps.indexOf(currentStep) >= idx;
            const isCompleted = steps.indexOf(currentStep) > idx;

            return (
              <div key={label} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold ${isCompleted
                    ? 'bg-green-500 text-white shadow-sm'
                    : isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/30'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <p className="text-sm text-center text-gray-600">{label}</p>
              </div>
            );
          }
        )}
      </div> */}
      {/* Step 1: Business Information */}
      {currentStep === 'business-info' && (
        <form onSubmit={handleConsolidatedOnboard} className="space-y-6">
          {/* Group 1: Business Information */}
          <div className="p-2 border border-gray-200 rounded-xl bg-white shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100">Business Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Business Name *</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleFormChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Business Code *</label>
                <input type="text" name="businessCode" value={formData.businessCode} onChange={handleFormChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Business Email *</label>
                <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleFormChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Business Phone *</label>
                <div className="flex gap-2">
                  <input type="text" name="phoneCode" value={formData.phoneCode} onChange={handleFormChange} className="w-20 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800" required />
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800" required />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleFormChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Timezone</label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800"
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div> */}
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Currency</label>
                <input type="text" name="currency" value={formData.currency} onChange={handleFormChange} placeholder="INR" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Company Size</label>
                <select name="companySize" value={formData.companySize} onChange={handleFormChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800">
                  <option value="SMALL">Small</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LARGE">Large</option>
                </select>
              </div>
            </div> */}
          </div>

          {/* Group 2: Workspace Create */}
          <div className="p-2 border border-gray-200 rounded-xl bg-white shadow-sm space-y-2">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Department Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Department Name *</label>
                <label className="block text-sm font-normal text-gray-400 mb-1">You can configure separate WhatsApp Number for each department</label>
                <input type="text" name="workspaceName" value={formData.workspaceName} onChange={handleFormChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number *</label>
                <label className="block text-sm font-normal text-gray-400 mb-1">&nbsp;</label>
                <div className="flex gap-2">
                  <input type="text" name="metaPhoneCode" value={formData.metaPhoneCode} onChange={handleFormChange} className="w-20 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800" required />
                  <input type="tel" name="metaPhoneNumber" value={formData.metaPhoneNumber} onChange={handleFormChange} className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/30 transition-all text-sm text-gray-800" required />
                </div>
              </div>
            </div>
          </div>

          {/* <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-70">
            <input
              type="checkbox"
              id="billing"
              name="isSelfManagedBilling"
              checked={formData.isSelfManagedBilling}
              disabled={true}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
            />
            <label htmlFor="billing" className="ml-3 text-sm text-gray-700 cursor-not-allowed">
              <span className="font-semibold">Self-Managed Billing (Meta)</span>
              <p className="text-xs text-gray-500 mt-1">
                {formData.isSelfManagedBilling
                  ? 'Direct Meta Billing'
                  : 'AiSensy Managed Billing (Default)'}
              </p>
            </label>
          </div> */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 shadow-sm transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark shadow-sm transition-all disabled:bg-gray-400">
              {loading ? 'Creating Tenant...' : 'Create Business Account'}
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Signup Action */}
      {currentStep === 'signup-action' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-center mb-2">Connect WhatsApp Account</h2>

          {/* {metaConfig?.onboardingUrl && (
            <div className="w-full h-[600px] border border-gray-200 rounded-xl overflow-hidden shadow-inner bg-white mb-4">
              <iframe 
                src={metaConfig.onboardingUrl} 
                className="w-full h-full" 
                title="WhatsApp Onboarding"
                allow="geolocation; microphone; camera"
              />
            </div>
          )} */}

          <div className="p-8 bg-brand/5 rounded-xl border border-brand/10 text-center">
            <p className="text-gray-700 mb-4 font-medium">
              {metaConfig?.onboardingUrl
                ? "Please complete the connection flow in the section above."
                : "To finish your setup, please complete the connection flow in the signup window."}
            </p>

            <button
              type="button"
              onClick={() => metaConfig?.bspType === 'Meta' ? handleLaunchMetaSignup() : handleLaunchAiSensySignup()}
              disabled={loading}
              className="w-full px-6 py-4 bg-brand text-white font-bold rounded-xl hover:bg-brand-dark shadow-lg transition-all mb-4"
            >
              {loading ? 'Opening...' : `Launch Signup in Popup`}
            </button>

            <div className="border-t border-brand/10 pt-4 mt-2">
              <p className="text-sm text-gray-600 mb-4">
                Already finished the signup? Click View Status below to check onboarding status.
              </p>
              <button
                type="button"
                onClick={onNavigateToHistory}
                disabled={loading}
                className="w-full px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#128C7E] shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : 'View Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppSignup;