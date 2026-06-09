import React, { useEffect, useCallback, useState } from 'react';
import { WhatsAppOnboarding } from 'meta-onboarding';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FlaskConical, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// TODO: modify below constants as per you backend API config
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ONBOARDING_API_PATH = '/v1/mock-signwave/business/onboard';
const GET_ONBOARDING_STATUS_API_PATH = '/v1/mock-signwave/business/:businessCode/onboarding-status';
const AUTH_TOKEN = sessionStorage.getItem('auth_token');

export default function MetaOnboardingPage() {

  const navigate = useNavigate();
  const [businessInfo, setBusinessInfo] = React.useState(null);

  useEffect(() => {
    // Fetch business info on mount (replace with actual API call)
    async function fetchBusinessInfo() {
      // TODO: call API to get business profile Info response as below
      // TODO: Generate businessCode and ensure its unique
      const businessInfo = {
        companyName: 'TP1',
        businessCode: 'SW_TP_1',
        website: 'https://tp1.com',
        email: 'sw_tp_1@gmail.com',
        phoneCode: '91',
        phoneNo: '1234567772',
        companySize: 'SMALL',
      };
      setBusinessInfo(businessInfo);
    }
    fetchBusinessInfo();
  }, []);


  const triggerOnboardingFlow = useCallback(async (onboardDataPayload) => {
    try {
      // TODO: Implement this APIs in your backend and call Appwizer API as
      // documented in shared doc. 
      // Forward request payload as is to AppWizer API and send back Appwizer 
      // API response as is to the UI
      // Use same authenthication mechanism of HMAC signature as used while 
      // sending a message 
      const url = `${API_BASE_URL}${ONBOARDING_API_PATH}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify(onboardDataPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMessage = errorData?.error?.message || errorData?.message || response.statusText;

        if (errorData?.error?.details && Array.isArray(errorData.error.details)) {
          errorMessage += '\n' + errorData.error.details.map(d => `- ${d}`).join('\n');
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      return responseData.data || responseData;
    } catch (error) {
      console.error('Onboarding flow error:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const getOnboardingStatus = useCallback(async (businessCode) => {
    try {
      // TODO: Implement this APIs in your backend and call Appwizer API as
      // documented in shared doc. 
      // Forward request payload as is to AppWizer API and send back Appwizer 
      // API response as is to the UI
      // Use same authenthication mechanism of HMAC signature as used while 
      // sending a message 
      const url = `${API_BASE_URL}${GET_ONBOARDING_STATUS_API_PATH.replace(':businessCode', businessCode)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMessage = errorData?.error?.message || errorData?.message || response.statusText;

        if (errorData?.error?.details && Array.isArray(errorData.error.details)) {
          errorMessage += '\n' + errorData.error.details.map(d => `- ${d}`).join('\n');
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      return responseData.data || responseData;
    } catch (error) {
      console.error(`[WhatsApp get Onboarding status]`, error);
      return { success: false, error: error.message };
    }
    
  }, []);

  return (
    <>
      <Helmet>
        <title>Test Onboarding - WA Campaign Hub</title>
      </Helmet>
      <div className="min-h-screen bg-[#f4f7f9] p-3 sm:p-4 lg:p-5 lg:ml-64 font-sans flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-7xl mx-auto w-full flex-1"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="p-2 bg-brand/10 rounded-lg">
                  <FlaskConical className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">WhatsApp Onboarding</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Registration flow for Meta</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 flex-1">
              {businessInfo && (
              // TODO: Include this main onboarding component in your page to trigger onboarding flow
              <WhatsAppOnboarding
                  businessCode={businessInfo.businessCode}
                  businessInfo={businessInfo}
                  isSelfManagedBilling={false}
                  onTriggerOnboardingFlow={triggerOnboardingFlow}
                  getOnboardingStatus={getOnboardingStatus}
                  onBack={() => navigate('/')}
                  onCancel={() => navigate('/')}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
