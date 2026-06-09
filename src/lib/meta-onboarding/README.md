# WhatsApp Business & Workspace Registration SDK

## Overview

A complete, production-ready SDK for managing WhatsApp Business Account registration with support for both **Meta** and **AiSensy** Business Service Providers (BSPs). This includes tenant registration, workspace creation, configuration management, and status verification.

**Title:** WhatsApp Business & Workspace Registration Flow

---

## What's Included

### 1. **SDK Classes** (`src/sdk.js`)

#### `MetaOnboardingSDK`
- Original Meta embedded signup handler
- Manages Facebook SDK loading and login flow
- Handles Meta exchange code generation

#### `WhatsAppBusinessRegistrationSDK` ⭐ NEW
- Complete registration flow management
- Dual BSP support (Meta + AiSensy)
- Step-by-step tenant → workspace → config → status flow
- Error handling and state management
- Event callbacks at each step

### 2. **React Component** (`src/RegistrationFlow.jsx`)

Complete UI component featuring:
- **Step 1**: Business Information Form
  - Business code, name, email, phone, address
  - Self-managed billing toggle (Meta vs AiSensy)
- **Step 2**: Workspace Creation
  - Workspace naming and setup
- **Step 3**: Meta/AiSensy Configuration
  - Automatic BSP detection
  - Conditional signup flow
- **Step 4**: Success Verification
  - Status display
  - Business details review

Features:
- Progress indicator
- Form validation
- Error/success messaging
- Back navigation
- Loading states
- Responsive design (Tailwind CSS)

### 3. **Documentation**

| Document | Purpose |
|----------|---------|
| `REGISTRATION_FLOW.md` | Complete flow architecture and SDK reference |
| `USAGE_EXAMPLES.jsx` | 5 different implementation examples |
| `TESTING_GUIDE.md` | Unit, integration, and E2E testing patterns |
| `BACKEND_IMPLEMENTATION.md` | Backend endpoint specifications |
| `README.md` | This file |

### 4. **Exports** (`src/index.js`)

All new classes and components are exported for easy importing:

```javascript
import {
  MetaOnboardingSDK,
  createMetaOnboardingSDK,
  WhatsAppBusinessRegistrationSDK,
  createWhatsAppBusinessRegistrationSDK,
  WhatsAppRegistrationFlow,
} from 'meta-onboarding';
```

---

## Quick Start

### Basic Usage (Ready-to-Use Component)

```jsx
import WhatsAppRegistrationFlow from 'meta-onboarding';

export default function OnboardingPage() {
  return (
    <WhatsAppRegistrationFlow 
      apiBaseURL={import.meta.env.VITE_API_BASE_URL}
    />
  );
}
```

### Advanced Usage (Manual SDK)

```javascript
import { WhatsAppBusinessRegistrationSDK } from 'meta-onboarding';

const sdk = new WhatsAppBusinessRegistrationSDK(
  {
    onTenantCreated: (data) => console.log('Tenant:', data),
    onWorkspaceCreated: (data) => console.log('Workspace:', data),
    onMetaConfigReady: (config) => console.log('Config:', config),
    onStatusUpdated: (status) => console.log('Status:', status),
    onError: (err) => console.error('Error:', err),
  },
  { apiBaseURL: '/api' }
);

// Step 1: Register tenant
const tenant = await sdk.registerTenant({
  businessCode: 'TP1',
  businessName: 'My Business',
  businessEmail: 'admin@business.com',
  phoneNumber: '+1234567890',
  businessAddress: '123 Main St',
  isSelfManagedBilling: false  // Use AiSensy
});

// Step 2: Create workspace
const workspace = await sdk.createWorkspace({
  businessId: tenant.businessId,
  workspaceName: 'Production'
});

// Step 3: Get configuration
const config = await sdk.getMetaConfiguration(
  tenant.businessId,
  workspace.workspaceId
);

// Step 4: Launch appropriate signup
if (config.bspType === 'Meta') {
  await sdk.launchMetaSignup(config);
} else {
  await sdk.launchAiSensySignup(config.embeddedSignupUrl);
}

// Step 5: Verify status
const status = await sdk.checkWorkspaceStatus(
  tenant.businessId,
  workspace.workspaceId
);
```

---

## Architecture

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend SDK                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │   WhatsAppBusinessRegistrationSDK                     │  │
│  │  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌────────┐  │  │
│  │  │Register │  │ Create   │  │  Get   │  │ Check  │  │  │
│  │  │ Tenant  │→ │Workspace │→ │Config  │→ │Status  │  │  │
│  │  └─────────┘  └──────────┘  └────────┘  └────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                 ┌─────────▼──────────┐
                 │  Backend APIs      │
                 │ (Express/Node.js)  │
                 └─────────┬──────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────▼───────┐  ┌─────▼──────┐  ┌──────▼──────┐
    │  Database  │  │  Smart     │  │  Meta /     │
    │  (MySQL)   │  │  Notifier  │  │  AiSensy    │
    └────────────┘  └────────────┘  │  APIs       │
                                     └─────────────┘
```

### Sequence Flow

```
1. User fills business info
   ↓
2. SDK calls POST /client-apis/business
   ↓
3. Backend creates tenant + calls Smart Notifier
   ↓
4. SDK stores tenant data and calls POST /client-apis/business/{id}/workspace
   ↓
5. Backend creates workspace + calls Smart Notifier
   ↓
6. SDK calls POST /client-apis/business/{id}/workspace/{id}/meta/configure
   ↓
7. Backend returns Meta AppId OR AiSensy signup URL
   ↓
8. SDK launches appropriate signup flow
   ↓
9. User completes signup (Meta or AiSensy)
   ↓
10. SDK polls GET /client-apis/business/{id}/workspace/{id}/status
   ↓
11. Status becomes ACTIVE
   ↓
12. Registration complete!
```

---

## Key Features

### ✅ Dual BSP Support
- **Meta** (isSelfManagedBilling=true)
- **AiSensy** (isSelfManagedBilling=false)

### ✅ Complete State Management
- Automatic tenant/workspace tracking
- Easy session reset
- Context-aware error handling

### ✅ Production-Ready
- Comprehensive error handling
- Full TypeScript JSDoc annotations
- Event callbacks for all steps
- Form validation
- Loading states

### ✅ Developer Experience
- Simple API
- Flexible integration options
- Detailed documentation
- Multiple code examples
- Testing guides

### ✅ Security
- JWT token-based authentication
- Input validation
- Encrypted secret storage
- CORS-compatible

---

## File Structure

```
whatsapputil-frontend/
├── src/
│   └── lib/
│       └── meta-onboarding/
│           ├── README.md (THIS FILE)
│           ├── REGISTRATION_FLOW.md
│           ├── USAGE_EXAMPLES.jsx
│           ├── TESTING_GUIDE.md
│           ├── BACKEND_IMPLEMENTATION.md
│           ├── package.json
│           └── src/
│               ├── index.js (exports)
│               ├── sdk.js (🆕 WhatsAppBusinessRegistrationSDK)
│               ├── RegistrationFlow.jsx (🆕 React component)
│               ├── loader.js (existing)
```

---

## API Endpoints Required

The backend must implement these endpoints:

### 1. Register Tenant
```
POST /client-apis/business
```
Creates a new business/tenant with billing preference.

### 2. Create Workspace
```
POST /client-apis/business/{businessId}/workspace
```
Creates a workspace within a business.

### 3. Get Configuration
```
POST /client-apis/business/{businessId}/workspace/{workspaceId}/meta/configure
```
Returns Meta AppId/ConfigId OR AiSensy signup URL.

### 4. Check Status
```
GET /client-apis/business/{businessId}/workspace/{workspaceId}/status
```
Returns current workspace status (ACTIVE/INACTIVE).

See `BACKEND_IMPLEMENTATION.md` for full specifications.

---

## Configuration

### Environment Variables

```env
# .env or .env.local
VITE_API_BASE_URL=http://localhost:3001/api
```

### SDK Initialization

```javascript
const sdk = new WhatsAppBusinessRegistrationSDK(
  handlers,
  {
    apiBaseURL: '/api'  // Override default
  }
);
```

---

## Handler Callbacks

All callbacks are optional and receive structured data:

```javascript
const handlers = {
  onTenantCreated: (tenantData) => {
    // Called after successful tenant registration
    // tenantData: { businessId, bspType, isSelfManagedBilling, ... }
  },

  onWorkspaceCreated: (workspaceData) => {
    // Called after successful workspace creation
    // workspaceData: { workspaceId, status, ... }
  },

  onMetaConfigReady: (config) => {
    // Called when configuration is ready
    // config: { bspType, metaAppId?, embeddedSignupUrl?, ... }
  },

  onStatusUpdated: (status) => {
    // Called when status check completes
    // status: { status: 'ACTIVE' | 'INACTIVE', ... }
  },

  onError: (error) => {
    // Called on any error
    // error: Error object with descriptive message
  },

  onCancel: () => {
    // Called when user cancels signup
  }
};
```

---

## Examples

### Example 1: Basic Component Integration
See `USAGE_EXAMPLES.jsx` - `BasicRegistrationExample`

### Example 2: Custom UI Integration
See `USAGE_EXAMPLES.jsx` - `CustomRegistrationExample`

### Example 3: Multi-Tenant Management
See `USAGE_EXAMPLES.jsx` - `MultiTenantExample`

### Example 4: Conditional BSP Handling
See `USAGE_EXAMPLES.jsx` - `ConditionalFlowExample`

### Example 5: Error Handling & Recovery
See `USAGE_EXAMPLES.jsx` - `ErrorHandlingExample`

---

## Testing

### Run Tests

```bash
npm run test:unit           # Unit tests
npm run test:integration    # Integration tests
npm run test:component      # Component tests
npm run test:e2e           # End-to-end tests
npm run test:coverage      # Coverage report
```

### Test Examples

See `TESTING_GUIDE.md` for:
- Unit test examples
- Integration test examples
- Component test examples
- E2E test examples
- Test data fixtures
- Mocking strategies

---

## Common Use Cases

### Case 1: Registering with Meta (Self-Managed)
```javascript
const result = await sdk.registerTenant({
  businessCode: 'TP1',
  businessName: 'Tech Partner',
  // ... other fields
  isSelfManagedBilling: true  // Uses Meta
});
```

### Case 2: Registering with AiSensy (Managed)
```javascript
const result = await sdk.registerTenant({
  businessCode: 'AW1',
  businessName: 'App Wizer',
  // ... other fields
  isSelfManagedBilling: false  // Uses AiSensy
});
```

### Case 3: Skip Tenant Step (Already Registered)
```javascript
const workspace = await sdk.createWorkspace({
  businessId: 'existing-biz-id',
  workspaceName: 'New Workspace'
});
```

### Case 4: Get Config for Both BSPs
```javascript
const config = await sdk.getMetaConfiguration(bizId, wsId);

if (config.bspType === 'Meta') {
  // Use config.metaAppId and config.metaConfigId
} else {
  // Use config.embeddedSignupUrl
}
```

---

## Error Handling

The SDK provides comprehensive error handling with descriptive messages:

```javascript
sdk._onError = (error) => {
  console.error('Registration Error:', error.message);
  // Errors include:
  // - Validation errors (missing fields)
  // - Network errors (API failures)
  // - Configuration errors (missing ID)
  // - Signup errors (user cancelled)
};
```

---

## Performance Considerations

- **API Calls**: Minimal network requests (one per step)
- **State Management**: Efficient memory usage with reset capability
- **UI Rendering**: React component optimized with Tailwind CSS
- **Polling**: Status check uses 3-second intervals (configurable)

---

## Security Best Practices

✅ Do:
- Store JWT tokens securely
- Validate all user inputs
- Use HTTPS for API calls
- Keep API keys in environment variables
- Log security events
- Implement rate limiting

❌ Don't:
- Expose API keys in frontend code
- Log sensitive data
- Trust client-side validation alone
- Cache sensitive configuration
- Skip CORS configuration

---

## Troubleshooting

### Issue: "Business ID is required"
**Solution**: Ensure tenant is registered before creating workspace. Call `registerTenant()` first.

### Issue: Meta popup not opening
**Solution**: Check `appId` and `configId` are valid. Verify Facebook SDK loaded. Check popup blocker.

### Issue: Status remains INACTIVE
**Solution**: Wait for signup to complete. Retry status check. Verify backend webhook processing.

### Issue: API calls failing with 401
**Solution**: Verify JWT token is valid and stored in sessionStorage. Check token expiration.

---

## Migration Guide

### From Old Meta SDK

Before:
```javascript
import { MetaOnboardingSDK } from 'meta-onboarding';
```

After (still works):
```javascript
// Old code still works!
import { MetaOnboardingSDK } from 'meta-onboarding';

// New code:
import { WhatsAppBusinessRegistrationSDK } from 'meta-onboarding';
```

Both SDKs coexist. You can migrate gradually.

---

## Support & Documentation

| Resource | Link |
|----------|------|
| Flow Architecture | `REGISTRATION_FLOW.md` |
| Usage Examples | `USAGE_EXAMPLES.jsx` |
| Testing | `TESTING_GUIDE.md` |
| Backend Setup | `BACKEND_IMPLEMENTATION.md` |
| JSDoc Reference | `src/sdk.js` |

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 13+, Chrome Mobile Latest

---

## Dependencies

- `react` (^18.0)
- `axios` (for API calls, already in project)
- `tailwind` CSS (for styling)

---

## Version History

### v2.0.0 (Latest) 🆕
- Added `WhatsAppBusinessRegistrationSDK`
- Added `WhatsAppRegistrationFlow` component
- Dual BSP support (Meta + AiSensy)
- Complete documentation suite

### v1.0.0
- Original `MetaOnboardingSDK`
- Meta embedded signup only

---

## License

Same as parent project

---

## Next Steps

1. **Implement Backend**: Follow `BACKEND_IMPLEMENTATION.md`
2. **Configure Environment**: Set `VITE_API_BASE_URL`
3. **Integrate Component**: Add `WhatsAppRegistrationFlow` to your routes
4. **Test Flow**: Use examples from `USAGE_EXAMPLES.jsx`
5. **Deploy**: Run tests and deploy to production
6. **Monitor**: Set up logging and error tracking

---

## Support

For issues:
1. Check troubleshooting section above
2. Review documentation
3. Check browser console for errors
4. Verify environment variables
5. Test with `TESTING_GUIDE.md` examples

---

## Contributing

When adding features:
1. Update JSDoc comments
2. Add unit tests
3. Update documentation
4. Test all BSP types
5. Check TypeScript compatibility

---

**Ready to implement?** Start with the backend setup in `BACKEND_IMPLEMENTATION.md` →
