/**
 * EcoPulse Central API Utility
 * Connects Frontend to Node.js + Express + MongoDB Backend
 * Fully compatible with standard browser scripts and modern Vite bundlers.
 */

(function () {
  'use strict';

  // Dynamic API Base URL resolution
  function getBaseUrl() {
    // 1. Explicit window.VITE_API_URL override
    if (typeof window !== 'undefined' && window.VITE_API_URL) {
      return String(window.VITE_API_URL).replace(/\/$/, '');
    }

    // 2. Window environment object (window.__ENV__)
    if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__.VITE_API_URL) {
      return String(window.__ENV__.VITE_API_URL).replace(/\/$/, '');
    }

    // 3. Safe dynamic Vite environment variable inspection without parse-time SyntaxError in classic scripts
    try {
      const getViteEnv = new Function("try { return import.meta.env.VITE_API_URL; } catch (e) { return null; }");
      const metaUrl = getViteEnv();
      if (metaUrl) return String(metaUrl).replace(/\/$/, '');
    } catch (e) {}

    // 4. Session / Local storage saved override
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('ECOPULSE_API_URL') || localStorage.getItem('VITE_API_URL');
        if (stored) return String(stored).replace(/\/$/, '');
      } catch (e) {}
    }

    // 5. Default to port 5000 when served on localhost, 127.0.0.1, or local file
    if (typeof window !== 'undefined' && (!window.location.hostname || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')) {
      return 'http://localhost:5000';
    }

    // 6. Production fallback: the API is served from the same origin
    return '';
  }

  let currentBaseUrl = getBaseUrl();

  async function request(endpoint, options) {
    options = options || {};
    if (!currentBaseUrl) {
      currentBaseUrl = getBaseUrl();
    }
    const url = currentBaseUrl ? `${currentBaseUrl}${endpoint}` : endpoint;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const config = Object.assign({}, options, {
      headers: Object.assign({}, defaultHeaders, options.headers || {})
    });

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(function () { return null; });

      if (!response.ok) {
        const errorMsg = (data && data.message) || ('HTTP Error ' + response.status + ': ' + response.statusText);
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.warn('[EcoPulseAPI] Request to ' + url + ' failed:', err.message);
      throw err;
    }
  }

  const EcoPulseAPI = {
    getBaseUrl: function () {
      return currentBaseUrl || getBaseUrl();
    },
    setBaseUrl: function (url) {
      currentBaseUrl = (url || '').replace(/\/$/, '');
      if (typeof window !== 'undefined') {
        window.VITE_API_URL = currentBaseUrl;
        try {
          sessionStorage.setItem('ECOPULSE_API_URL', currentBaseUrl);
        } catch (e) {}
      }
    },

    // 1. Health check
    getHealth: async function () {
      return request('/api/health');
    },

    // 2. Fetch all waste reports with optional filters
    getReports: async function (params) {
      params = params || {};
      const query = new URLSearchParams();
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.priority && params.priority !== 'All') query.append('priority', params.priority);
      if (params.reportedBy) query.append('reportedBy', params.reportedBy);
      if (params.search) query.append('search', params.search);

      const qs = query.toString() ? ('?' + query.toString()) : '';
      return request('/api/reports' + qs);
    },

    // 3. Fetch single report by ID or reportId
    getReportById: async function (id) {
      return request('/api/reports/' + encodeURIComponent(id));
    },

    // 4. Create new waste report
    createReport: async function (reportData) {
      return request('/api/reports', {
        method: 'POST',
        body: JSON.stringify(reportData)
      });
    },

    // 5. Update report status (Pending -> Assigned -> In Progress -> Resolved)
    updateReportStatus: async function (id, status) {
      return request('/api/reports/' + encodeURIComponent(id) + '/status', {
        method: 'PATCH',
        body: JSON.stringify({ status: status })
      });
    },

    // 6. Get live city statistics
    getStats: async function () {
      return request('/api/stats');
    },

    // 7. Get smart collection queue
    getCollectionQueue: async function () {
      return request('/api/collection-queue');
    },

    // 8. Get smart alerts
    getAlerts: async function () {
      return request('/api/alerts');
    },

    // 9. Get connected infrastructure & underground smart grid telemetry
    getInfrastructure: async function () {
      return request('/api/infrastructure');
    }
  };

  // Attach explicitly to all global targets
  if (typeof window !== 'undefined') {
    window.EcoPulseAPI = EcoPulseAPI;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.EcoPulseAPI = EcoPulseAPI;
  }
  if (typeof self !== 'undefined') {
    self.EcoPulseAPI = EcoPulseAPI;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EcoPulseAPI;
  }
})();
