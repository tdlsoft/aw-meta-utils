import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, RefreshCw } from 'lucide-react';

const formatDateTime = (date) => {
  if (!date) return '—';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const formatDate = (date) => {
  if (!date) return '—';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
};

const KebabMenu = ({ businessCode, businessInfo, workspaceInfo, onResumeOnboarding, loading }) => {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const handleOpen = () => {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 144, // 144 = w-36
      });
    }
    setOpen((prev) => !prev);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleOpen}
        className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
          className="w-38 bg-white border border-gray-200 rounded-lg shadow-lg py-1"
        >
          <button
            onClick={() => { onResumeOnboarding({ businessCode, businessInfo, workspaceInfo }); setOpen(false); }}
            disabled={loading}
            className="w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing…' : 'Resume Onboarding'}
          </button>
        </div>
      )}
    </>
  );
};

const WhatsAppOnboardingHistory = ({ onboardingStatus, onConfigureNew, onCheckStatus, onResumeOnboarding, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastRefreshed, setLastRefreshed] = useState(() => new Date());

  useEffect(() => {
    onCheckStatus();
  }, []);

  const itemsPerPage = 5;
  const { businessCode, businessInfo = {} } = onboardingStatus || {};
  const workspaces = onboardingStatus?.workspaces || [];
  const totalPages = Math.ceil(workspaces.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = workspaces.slice(startIndex, startIndex + itemsPerPage);

  const handleRefresh = () => {
    onCheckStatus();
    setLastRefreshed(new Date());
  };
  
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Onboarding History</h2>
          <button
            onClick={handleRefresh}
            disabled={loading}
            title="Refresh"
            className="p-1.5 rounded-md hover:text-brand hover:bg-brand/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-sm">
            Last Refreshed: {formatDateTime(lastRefreshed)}
          </span>
        </div>
        <button
          onClick={onConfigureNew}
          className="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand-dark shadow-sm transition-all disabled:bg-gray-400"
        >
          Configure New Workspace
        </button>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold">Department Name</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Whatsapp Number</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Onboarded Date</th>
              <th className="px-6 py-3 text-right text-sm font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((ws, idx) => (
                <tr key={ws.workspaceId || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ws.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{`+${ws.metaPhoneNo?.code || ''} ${ws.metaPhoneNo?.phoneNo || ''}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ws.status === 'VERIFIED' || ws.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {ws.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(ws.createdAt ? new Date(ws.createdAt) : null)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {ws.status !== 'VERIFIED' && ws.status !== 'ACTIVE' && (
                      <KebabMenu
                        workspaceInfo={ws}
                        businessCode={businessCode}
                        businessInfo={businessInfo}
                        onResumeOnboarding={onResumeOnboarding}
                        loading={loading}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                  No workspaces found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + itemsPerPage, workspaces.length)}</span> of <span className="font-medium">{workspaces.length}</span> entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppOnboardingHistory;
