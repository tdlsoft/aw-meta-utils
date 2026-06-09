# Meta WhatsApp Onboarding — Integration Guide

Reference implementation: `src/pages/MetaOnboardingPage.jsx`

---

## Step 1 — Add the library to your project

Copy the `src/lib/meta-onboarding` folder into your project, then add it as a local dependency in your `package.json`:

```json
"dependencies": {
  "meta-onboarding": "file:./src/lib/meta-onboarding"
}
```

Run `npm install` after adding it.

---

## Step 2 — Configure environment

Add the backend base URL to your `.env` file:

```env
VITE_API_BASE_URL=https://your-backend.com
```

Update the API path constants in your page to match your backend routes:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ONBOARDING_API_PATH = '/v1/your-service/business/onboard';
const GET_ONBOARDING_STATUS_API_PATH = '/v1/your-service/business/:businessCode/onboarding-status';
```

---

## Step 3 — Backend APIs to implement

Your backend acts as a proxy — receive the request from the frontend, forward it to the Appwizer API as-is, and return the Appwizer response as-is to the frontend. Use the same HMAC signature authentication as used for sending messages.

### POST `/business/onboard`

Triggers business registration and workspace creation.

**Request body forwarded to Appwizer:**
```json
{
  "businessCode": "ACME_01",
  "businessInfo": {
    "companyName": "Acme Corp",
    "website": "https://acme.com",
    "email": "admin@acme.com",
    "phone": { "code": 91, "number": "9876543210" },
    "timezone": "Asia/Calcutta GMT+05:30",
    "currency": "INR",
    "companySize": "SMALL",
    "isSelfManagedBilling": false
  },
  "workspaceInfo": {
    "name": "General 1",
    "metaPhoneNo": { "code": 91, "phoneNo": "9876543210" }
  }
}
```

**Response to return to frontend:**
```json
{
  "businessCode": "ACME_01",
  "bspType": "AiSensy",
  "status": "PENDING",
  "workspaceName": "General 1",
  "onboardingUrl": "https://..."
}
```

### GET `/business/:businessCode/onboarding-status`

Returns all workspaces for the business with their current status.

**Response to return to frontend:**
```json
{
  "businessCode": "ACME_01",
  "businessInfo": { ... },
  "workspaces": [
    {
      "workspaceId": "ws_123",
      "name": "General 1",
      "status": "ACTIVE",
      "metaPhoneNo": { "code": 91, "phoneNo": "9876543210" }
    }
  ]
}
```

Workspace `status` values: `PENDING` → `ACTIVE` → `VERIFIED`

---

## Step 4 — Frontend TODOs

### TODO 1 — Load real business info

Replace the hardcoded object in `fetchBusinessInfo()` with an API call that returns the logged-in business's profile. Make sure `businessCode` is unique and stable per business.

```js
const businessInfo = {
  companyName: '...',
  businessCode: '...',   // unique, e.g. derived from tenant ID
  website: '...',
  email: '...',
  phoneCode: '91',
  phoneNo: '...',
  companySize: 'SMALL',  // 'SMALL' | 'MEDIUM' | 'LARGE'
};
```

### TODO 2 — Implement `triggerOnboardingFlow`

Call `POST /business/onboard` with the payload provided by the component and return the response. The component calls this when the user submits the registration form.

### TODO 3 — Implement `getOnboardingStatus`

Call `GET /business/:businessCode/onboarding-status` and return the response. The component calls this on mount and after each signup action to refresh workspace status.

### TODO 4 — Mount the component

```jsx
import { WhatsAppOnboarding } from 'meta-onboarding';

{businessInfo && (
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
```

Render only after `businessInfo` is loaded to avoid the component initialising with empty data.
