import React, { useState, useCallback } from 'react';
import { getWhatsAppOnboardingSdk } from './sdkProvider';
import WhatsAppOnboardingHistory from './WhatsAppOnboardingHistory';
import WhatsAppSignup from './WhatsAppSignup';

const TIMEZONES = [
  "Asia/Calcutta GMT+05:30",
  "UTC GMT+00:00",
  "America/New_York GMT-05:00",
  "Europe/London GMT+00:00",
  "Asia/Dubai GMT+04:00",
  "Asia/Singapore GMT+08:00",
  "America/Los_Angeles GMT-08:00"
];
/**
 * WhatsAppOnboarding (Parent Controller)
 * 
 * Supports:
 * 1. Consolidated Onboard (Recommended for AiSensy)
 * 2. Step-by-step flow (Standard for both Meta and AiSensy)
 * 3. Onboarding History (Workspace List)
 * Logic and state orchestration for the WhatsApp onboarding flow.
 */
export const WhatsAppOnboarding = ({ businessCode, businessInfo, isSelfManagedBilling, onTriggerOnboardingFlow, getOnboardingStatus }) => {
  // Start with a loading state to check for existing workspaces
  const [currentStep, setCurrentStep] = useState('loading');
  const [formData, setFormData] = useState({
    businessCode: businessCode,
    businessName: businessInfo.companyName || businessCode || '',
    website: businessInfo.website || 'https://example.com',
    businessEmail: businessInfo.email || '',
    phoneCode: businessInfo.phoneCode || '91',
    phoneNumber: businessInfo.phoneNo || '1234567890',
    timezone: 'Asia/Calcutta GMT+05:30',
    currency: 'INR',
    companySize: businessInfo.companySize || 'SMALL',
    isSelfManagedBilling: isSelfManagedBilling,
    parentBusinessId: '',  // For child tenants
    workspaceName: 'General 1',
    metaPhoneCode: '91',
    metaPhoneNumber: '1234567830',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tenantData, setTenantData] = useState(null);
  const [workspaceData, setWorkspaceData] = useState(null);
  const [metaConfig, setMetaConfig] = useState(null);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [workspaceStatus, setWorkspaceStatus] = useState(null);

  // Initialize SDK
  const sdkRef = React.useRef(null);

  const fetchInitialStatus = useCallback(async () => {
    setLoading(true);
    try {
      const responseData = await getOnboardingStatus(businessCode);
      console.log("Initial onboarding status response data:", responseData);

      // Determine if we have a valid response and where the actual data resides
      const dataPayload = responseData?.data || (responseData?.workspaces ? responseData : null);
      const isSuccessful = !!dataPayload;

      if (isSuccessful) {
        setOnboardingStatus(dataPayload);
        // If workspaces exist, show history; otherwise show signup form
        setCurrentStep(dataPayload.workspaces?.length > 0 ? 'history' : 'business-info');
      } else {
        setCurrentStep('business-info');
      }
    } catch (err) {
      setCurrentStep('business-info');
    } finally {
      setLoading(false);
    }
  }, [businessCode, getOnboardingStatus]);

  React.useEffect(() => {
    sdkRef.current = getWhatsAppOnboardingSdk(isSelfManagedBilling, {
      onTenantOnboardingStarted: () => {
        console.log('Tenant onboarding started:', businessCode);
        setSuccess(`Tenant onboarding started: ${businessCode}`);
      },
      onError: (err) => {
        console.error('Error in onboarding flow:', err);
        setError(err);
        setLoading(false);
      },
      onCancel: () => {
        console.log('Onboarding flow cancelled by user');
        setSuccess('Operation cancelled');
      },
    });

    fetchInitialStatus();
  }, [getOnboardingStatus, fetchInitialStatus]);

  // Clear alerts whenever the active view changes
  React.useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [currentStep]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  /**
   * Shared: calls onTriggerOnboardingFlow and handles the result.
   * Both handleConsolidatedOnboard and handleResumeOnboarding delegate here.
   * @param {Object} payload - The full onboarding payload
   * @param {string} fallbackWorkspaceName - Used when result.workspaceName is absent
   */
  const executeOnboardingFlow = async (payload, fallbackWorkspaceName = '') => {
    const result = await onTriggerOnboardingFlow(payload);
    setLoading(false);

    const isSuccessful = !!(result && (result.success === true || result.businessCode || result.onboardingUrl));

    if (isSuccessful) {
      setTenantData({ businessCode: result.businessCode, bspType: result.bspType, status: result.status });
      setWorkspaceData({ name: result.workspaceName || fallbackWorkspaceName, onboardingUrl: result.onboardingUrl });
      setMetaConfig({
        onboardingUrl: result.onboardingUrl,
        bspType: result.bspType,
        metaAppId: result.metaAppId,
        metaConfigId: result.metaConfigId,
      });

      if (result.onboardingUrl || (result.metaAppId && result.metaConfigId)) {
        setCurrentStep('signup-action');
        if (result.bspType === 'AiSensy' && result.onboardingUrl) {
          handleLaunchAiSensySignup(result.onboardingUrl);
        } else if (result.metaAppId && result.metaConfigId) {
          handleLaunchMetaSignup();
        }
      } else {
        fetchInitialStatus();
      }
    } else {
      setError(result?.error || 'Onboarding failed');
    }
  };

  /**
   * Consolidated Onboard Flow — builds payload from form state.
   */
  const handleConsolidatedOnboard = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (
      !formData.businessCode || !formData.businessName || !formData.businessEmail ||
      !formData.phoneNumber || !formData.phoneCode ||
      !formData.workspaceName || !formData.metaPhoneCode || !formData.metaPhoneNumber
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      await executeOnboardingFlow({
        businessCode: formData.businessCode,
        businessInfo: {
          companyName: formData.businessName,
          website: formData.website || undefined,
          email: formData.businessEmail,
          phone: { code: parseInt(formData.phoneCode, 10), number: formData.phoneNumber },
          timezone: formData.timezone || undefined,
          currency: formData.currency || undefined,
          companySize: formData.companySize || undefined,
          parentBusinessId: formData.parentBusinessId || undefined,
          isSelfManagedBilling: formData.isSelfManagedBilling,
        },
        workspaceInfo: {
          name: formData.workspaceName,
          metaPhoneNo: { code: parseInt(formData.metaPhoneCode, 10), phoneNo: formData.metaPhoneNumber },
        },
      }, formData.workspaceName);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to initiate onboarding flow');
    }
  };

  /**
   * Step 3: Get Meta Configuration
   */
  const handleGetMetaConfig = async () => {
    setLoading(true);
    setError(null);

    const result = await sdkRef.current.getMetaConfiguration(
      tenantData.businessId,
      workspaceData.workspaceId
    );

    setLoading(false);

    if (result.success) {
      setMetaConfig(result);
    } else {
      setError(result.error || 'Failed to get Meta configuration');
    }
  };

  /**
   * Launch Meta Signup
   */
  const handleLaunchMetaSignup = async () => {
    if (metaConfig?.appId && metaConfig?.configId) {
      setLoading(true);
      await sdkRef.current.launchSignup({
        appId: metaConfig.appId,
        configId: metaConfig.configId,
      });
      setLoading(false);
      // Check status after signup
      setTimeout(() => handleCheckStatus(), 2000);
    } else {
      setError('Meta configuration data is missing');
    }
  };

  /**
   * Launch AiSensy Signup
   */
  const handleLaunchAiSensySignup = async (url) => {
    const signupUrl = url || metaConfig?.onboardingUrl;
    if (signupUrl) {
      setLoading(true);
      await sdkRef.current.launchSignup(signupUrl);
      setLoading(false);
    } else {
      setError('AiSensy signup URL is missing');
    }
  };

  /**
   * Step 4: Check Workspace Status
   */
  const handleCheckStatus = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const responseData = await getOnboardingStatus(businessCode);
    setLoading(false);
    console.log("Onboarding status response data:", responseData);

    const dataPayload = responseData?.data || (responseData?.workspaces ? responseData : null);
    const isSuccessful = !!dataPayload;

    if (isSuccessful) {
      setOnboardingStatus(dataPayload);
      if (dataPayload.workspaces?.some(ws => ws.status === 'VERIFIED')) {
        fetchInitialStatus(); // Refresh list and set step to history
      } else {
        setSuccess('Status checked: Setup is still pending completion.');
      }
    } else {
      setError(responseData?.error || 'Failed to check status');
    }
  };

  /**
   * Resume Onboarding from history — builds payload from props + the selected workspace row.
   * @param {Object} ws - Workspace row from WhatsAppOnboardingHistory
   */
  const handleResumeOnboarding = async ({ businessCode, businessInfo, workspaceInfo }) => {
    setLoading(true);
    setError(null);

    console.log('Resuming onboarding for:', businessCode, workspaceInfo);

    try {
      await executeOnboardingFlow({
        businessCode,
        businessInfo: {
          companyName: businessInfo.companyName,
          website: businessInfo.website || undefined,
          email: businessInfo.email,
          phone: businessInfo.phone,
          companySize: businessInfo.companySize || undefined,
          isSelfManagedBilling,
        },
        workspaceInfo: { name: workspaceInfo.name, metaPhoneNo: workspaceInfo.metaPhoneNo },
      }, workspaceInfo.name);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to resume onboarding');
    }
  };

  /**
   * Reset Flow
   */
  const handleRegisterAnotherWorkspace = () => {
    setCurrentStep('business-info');
    setFormData((prev) => ({
      ...prev,
      workspaceName: '',
      metaPhoneNumber: '1234567830',
    }));
    // We keep tenantData as the business is already registered
    setWorkspaceData(null);
    setMetaConfig(null);
    setWorkspaceStatus(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="w-full">
      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Error</p>
          <div className="text-sm mt-1">
            {Array.isArray(error) ? (
              error.map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-1' : ''}>
                  {line}
                </p>
              ))
            ) : (
              <p>{error}</p>
            )}
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          <p className="font-bold">Success</p>
          <p>{success}</p>
        </div>
      )}

      {currentStep === 'loading' && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
      )}

      {currentStep === 'history' ? (
        <WhatsAppOnboardingHistory
          onboardingStatus={onboardingStatus}
          onConfigureNew={() => setCurrentStep('business-info')}
          onCheckStatus={handleCheckStatus}
          onResumeOnboarding={handleResumeOnboarding}
          loading={loading}
        />
      ) : (
        <WhatsAppSignup
          currentStep={currentStep}
          formData={formData}
          handleFormChange={handleFormChange}
          handleConsolidatedOnboard={handleConsolidatedOnboard}
          handleLaunchMetaSignup={handleLaunchMetaSignup}
          handleLaunchAiSensySignup={handleLaunchAiSensySignup}
          handleCheckStatus={handleCheckStatus}
          onCancel={() => setCurrentStep('history')}
          onNavigateToHistory={() => setCurrentStep('history')}
          loading={loading}
          metaConfig={metaConfig}
          tenantData={tenantData}
          workspaceData={workspaceData}
          workspaceStatus={workspaceStatus}
        />
      )}
    </div>
  );
};
