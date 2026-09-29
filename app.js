/**
 * Building the Intelligent Cloud-Native City
 * Frontend Application & Interaction Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Effect & Active Section Highlighting
  const navbar = document.getElementById('navbar');
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('main > section, header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navLinks');

  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbarWrapper.classList.add('scrolled');
    } else {
      navbarWrapper.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    document.querySelectorAll('section[id]').forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    if (currentSection) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close mobile menu when clicking nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Poster Lightbox Modal (High-Res Zoom & Inspect)
  const posterModal = document.getElementById('posterModal');
  const heroPoster = document.getElementById('heroPosterImage');
  const expandPosterBtn = document.getElementById('expandPosterBtn');
  const viewPosterQuick = document.getElementById('viewPosterQuick');
  const closePosterModal = document.getElementById('closePosterModal');
  const modalPosterImg = document.getElementById('modalPosterImg');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomResetBtn = document.getElementById('zoomResetBtn');

  let currentZoom = 1;

  const openPoster = () => {
    if (!posterModal) return;
    currentZoom = 1;
    applyZoom();
    posterModal.classList.add('open');
    posterModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closePoster = () => {
    if (!posterModal) return;
    posterModal.classList.remove('open');
    posterModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const applyZoom = () => {
    if (modalPosterImg) {
      modalPosterImg.style.transform = `scale(${currentZoom})`;
    }
    if (zoomResetBtn) {
      zoomResetBtn.textContent = `${Math.round(currentZoom * 100)}%`;
    }
  };

  if (heroPoster) heroPoster.addEventListener('click', openPoster);
  if (expandPosterBtn) expandPosterBtn.addEventListener('click', openPoster);
  if (viewPosterQuick) viewPosterQuick.addEventListener('click', openPoster);
  if (closePosterModal) closePosterModal.addEventListener('click', closePoster);

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      if (currentZoom < 2.5) {
        currentZoom += 0.25;
        applyZoom();
      }
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      if (currentZoom > 0.6) {
        currentZoom -= 0.25;
        applyZoom();
      }
    });
  }

  if (zoomResetBtn) {
    zoomResetBtn.addEventListener('click', () => {
      currentZoom = 1;
      applyZoom();
    });
  }

  // 3. Smart Underground Interactive Schematic Node Switcher
  const undergroundCards = document.querySelectorAll('.underground-card');
  const telemetryTitle = document.getElementById('telemetryTitle');
  const telemetryBadge = document.getElementById('telemetryBadge');
  const telemetryContent = document.getElementById('telemetryContent');

  const undergroundData = {
    utilities: {
      title: 'Intelligent Underground Utility Network',
      badge: 'TELEMETRY: OPTIMAL',
      metrics: [
        { label: 'Pipeline Network Health', fill: '98.4%', val: '98.4%' },
        { label: 'Autonomous Drone Inspections', fill: '100%', val: 'Continuous' },
        { label: 'Grid Reroute Latency', fill: '12%', val: '1.2 ms' }
      ]
    },
    storage: {
      title: 'Automated Goods Storage (Subterranean AS/RS)',
      badge: 'STORAGE ACTIVE: 84% OCCUPANCY',
      metrics: [
        { label: 'Robotic Retrieval Speed', fill: '95%', val: '4.2 min avg' },
        { label: 'Surface Truck Reduction', fill: '91%', val: '-91.2%' },
        { label: 'Parcel Handling Throughput', fill: '88%', val: '14,200 pkg/hr' }
      ]
    },
    transport: {
      title: 'Underground Transport & Storage Loop',
      badge: 'SPEED: 120 KM/H • ON SCHEDULE',
      metrics: [
        { label: 'Sub-Surface Transit Load', fill: '76%', val: '76.8% Cap' },
        { label: 'Surface Decibel Drop', fill: '96%', val: '-34 dB Noise' },
        { label: 'Headway Interval Precision', fill: '99%', val: '90 sec headway' }
      ]
    },
    water: {
      title: 'Rainwater Harvesting & Bio-Recycling',
      badge: 'WATER PURITY: 99.8% BIO-FILTERED',
      metrics: [
        { label: 'Cistern Reservoir Capacity', fill: '92%', val: '4.8M Liters' },
        { label: 'Storm Runoff Capture Rate', fill: '100%', val: '100% Captured' },
        { label: 'Green Space Greywater Offset', fill: '100%', val: 'Zero Municipal Drain' }
      ]
    }
  };

  undergroundCards.forEach(card => {
    const handleCardActivate = () => {
      undergroundCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const nodeKey = card.getAttribute('data-node');
      const data = undergroundData[nodeKey];

      if (data && telemetryTitle && telemetryBadge && telemetryContent) {
        telemetryTitle.textContent = data.title;
        telemetryBadge.textContent = data.badge;

        telemetryContent.innerHTML = data.metrics.map(m => `
          <div class="telemetry-metric">
            <span class="metric-label">${m.label}</span>
            <div class="meter-bar"><div class="meter-fill" style="width: ${m.fill};"></div></div>
            <span class="metric-val">${m.val}</span>
          </div>
        `).join('');
      }
    };

    card.addEventListener('click', handleCardActivate);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardActivate();
      }
    });
  });

  // 4. Join / Call to Action Modal & Form
  const joinModal = document.getElementById('joinModal');
  const openJoinModalBtn = document.getElementById('openJoinModal');
  const closeJoinModalBtn = document.getElementById('closeJoinModal');
  const joinForm = document.getElementById('joinForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  const openJoin = () => {
    if (!joinModal) return;
    joinModal.classList.add('open');
    joinModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeJoin = () => {
    if (!joinModal) return;
    joinModal.classList.remove('open');
    joinModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openJoinModalBtn) openJoinModalBtn.addEventListener('click', openJoin);
  if (closeJoinModalBtn) closeJoinModalBtn.addEventListener('click', closeJoin);

  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = joinForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Verifying & Registering...</span>';
      }

      setTimeout(() => {
        if (submitBtn) submitBtn.style.display = 'none';
        if (formSuccessMessage) formSuccessMessage.classList.add('visible');
        
        // Hide inputs cleanly
        joinForm.querySelectorAll('.form-group, .form-instructions').forEach(el => {
          el.style.display = 'none';
        });
      }, 700);
    });
  }

  // Close modals on background click or ESC key
  window.addEventListener('click', (e) => {
    if (e.target === posterModal) closePoster();
    if (e.target === joinModal) closeJoin();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePoster();
      closeJoin();
    }
  });

  // 5. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 6. Dynamic Year
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 7. ECOPULSE INTELLIGENT PLATFORM CONTROLLER
  // Connects Frontend to Node.js/Express + MongoDB Backend using VITE_API_URL
  // =========================================================================
  const initEcoPulse = () => {
    let api = (typeof window !== 'undefined' && window.EcoPulseAPI) ||
              (typeof globalThis !== 'undefined' && globalThis.EcoPulseAPI) || null;

    if (!api) {
      if (typeof window !== 'undefined') {
        window.__ecoPulseRetryCount = (window.__ecoPulseRetryCount || 0) + 1;
        if (window.__ecoPulseRetryCount <= 5) {
          setTimeout(initEcoPulse, 50);
          return;
        }
      }

      // Safe built-in fallback client so the UI never stalls or loops indefinitely
      const baseUrl = (typeof window !== 'undefined' && window.VITE_API_URL) || 'http://localhost:5000';
      api = {
        getBaseUrl: () => baseUrl,
        setBaseUrl: () => {},
        getHealth: async () => fetch(`${baseUrl}/api/health`).then(r => r.json()),
        getReports: async (p = {}) => {
          const qs = new URLSearchParams(p).toString();
          return fetch(`${baseUrl}/api/reports${qs ? '?' + qs : ''}`).then(r => r.json());
        },
        getReportById: async (id) => fetch(`${baseUrl}/api/reports/${encodeURIComponent(id)}`).then(r => r.json()),
        createReport: async (data) => fetch(`${baseUrl}/api/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(r => r.json()),
        updateReportStatus: async (id, status) => fetch(`${baseUrl}/api/reports/${encodeURIComponent(id)}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        }).then(r => r.json()),
        getStats: async () => fetch(`${baseUrl}/api/stats`).then(r => r.json()),
        getCollectionQueue: async () => fetch(`${baseUrl}/api/collection-queue`).then(r => r.json()),
        getAlerts: async () => fetch(`${baseUrl}/api/alerts`).then(r => r.json()),
        getInfrastructure: async () => fetch(`${baseUrl}/api/infrastructure`).then(r => r.json())
      };
      if (typeof window !== 'undefined') window.EcoPulseAPI = api;
    }

    // UI Elements Cache
    const elements = {
      apiStatusPill: document.getElementById('apiStatusPill'),
      apiPulseDot: document.getElementById('apiPulseDot'),
      apiStatusText: document.getElementById('apiStatusText'),
      apiUrlDisplay: document.getElementById('apiUrlDisplay'),
      refreshDataBtn: document.getElementById('refreshDataBtn'),
      
      // Stats
      statActiveIncidents: document.getElementById('statActiveIncidents'),
      statCleanedKg: document.getElementById('statCleanedKg'),
      statNatureHealth: document.getElementById('statNatureHealth'),
      statCo2Avoided: document.getElementById('statCo2Avoided'),
      envRecoveryRate: document.getElementById('envRecoveryRate'),
      envLandfillM3: document.getElementById('envLandfillM3'),
      envEnergyKwh: document.getElementById('envEnergyKwh'),
      
      // Alerts
      alertsContainer: document.getElementById('ecopulseAlertsContainer'),
      
      // Tabs
      tabBtns: document.querySelectorAll('.eco-tab-btn'),
      tabPanes: document.querySelectorAll('.ecopulse-tab-pane'),
      teamTabBadge: document.getElementById('teamTabBadge'),
      
      // Report Waste Form
      reportForm: document.getElementById('reportWasteForm'),
      wasteCategory: document.getElementById('wasteCategory'),
      wasteLocation: document.getElementById('wasteLocation'),
      wasteDescription: document.getElementById('wasteDescription'),
      wasteReporter: document.getElementById('wasteReporter'),
      wasteUrgent: document.getElementById('wasteUrgent'),
      submitWasteBtn: document.getElementById('submitWasteReportBtn'),
      quickFillDemoBtn: document.getElementById('quickFillDemoBtn'),
      successBanner: document.getElementById('reportSuccessBanner'),
      successId: document.getElementById('reportSuccessId'),
      viewInMyReportsBtn: document.getElementById('viewInMyReportsBtn'),
      reportAnotherBtn: document.getElementById('reportAnotherBtn'),
      
      // Live Priority Preview
      livePriorityBadge: document.getElementById('livePriorityBadge'),
      livePriorityFill: document.getElementById('livePriorityFill'),
      livePriorityFactors: document.getElementById('livePriorityFactors'),
      
      // My Reports
      myReportsList: document.getElementById('myReportsList'),
      myReportsSearch: document.getElementById('myReportsSearch'),
      refreshMyReportsBtn: document.getElementById('refreshMyReportsBtn'),
      
      // Team Dashboard
      teamReportsList: document.getElementById('teamReportsList'),
      teamSearchInput: document.getElementById('teamSearchInput'),
      teamStatusFilterBtns: document.querySelectorAll('.team-filter-btn'),
      refreshTeamReportsBtn: document.getElementById('refreshTeamReportsBtn'),
      
      // Priority Simulator & Queue
      simCategory: document.getElementById('simCategory'),
      simLocation: document.getElementById('simLocation'),
      simResultBadge: document.getElementById('simResultBadge'),
      collectionQueueList: document.getElementById('collectionQueueList'),
      
      // Recycling Advisor
      recyclingChips: document.querySelectorAll('.recycling-chip'),
      advItemTitle: document.getElementById('advItemTitle'),
      advBinBadge: document.getElementById('advBinBadge'),
      advDegradation: document.getElementById('advDegradation'),
      advCircularVal: document.getElementById('advCircularVal'),
      advEcoTip: document.getElementById('advEcoTip'),
      
      // Modal & Toast
      reportDetailModal: document.getElementById('reportDetailModal'),
      closeReportDetailModal: document.getElementById('closeReportDetailModal'),
      modalReportTitle: document.getElementById('modalReportTitle'),
      modalReportIdBadge: document.getElementById('modalReportIdBadge'),
      modalReportBody: document.getElementById('modalReportBody'),
      ecoToast: document.getElementById('ecoToast'),
      toastMessage: document.getElementById('toastMessage')
    };

    let allReports = [];
    let activeTeamStatusFilter = 'All';

    // Toast helper
    let toastTimeout;
    const showToast = (message, isSuccess = true) => {
      if (!elements.ecoToast || !elements.toastMessage) return;
      elements.toastMessage.textContent = message;
      elements.ecoToast.classList.add('show');
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        elements.ecoToast.classList.remove('show');
      }, 3500);
    };

    // 1. Connection Health Check
    const checkConnection = async () => {
      if (elements.apiUrlDisplay) {
        elements.apiUrlDisplay.textContent = `API: ${api.getBaseUrl() || 'Relative /api'}`;
      }
      try {
        const health = await api.getHealth();
        if (elements.apiStatusPill && elements.apiStatusText) {
          elements.apiStatusPill.className = 'conn-pill';
          elements.apiPulseDot.className = 'pulse-node green';
          elements.apiStatusText.textContent = `${health.database.toUpperCase()}: SYNCED`;
        }
      } catch (err) {
        if (elements.apiStatusPill && elements.apiStatusText) {
          elements.apiStatusPill.className = 'conn-pill connecting';
          elements.apiPulseDot.className = 'pulse-node yellow';
          elements.apiStatusText.textContent = 'CONNECTING TO ECOPULSE BACKEND...';
        }
      }
    };

    // 2. Fetch and Render Live Statistics (Feature 12)
    const fetchStats = async () => {
      try {
        const res = await api.getStats();
        if (res && res.success && res.data) {
          const { activeIncidents, environmentalImpact } = res.data;
          
          if (elements.statActiveIncidents) {
            elements.statActiveIncidents.textContent = activeIncidents;
          }
          if (elements.statCleanedKg) {
            elements.statCleanedKg.textContent = `${environmentalImpact.divertedKg} kg`;
          }
          if (elements.statNatureHealth) {
            elements.statNatureHealth.textContent = `${environmentalImpact.natureHealthIndex}%`;
          }
          if (elements.statCo2Avoided) {
            elements.statCo2Avoided.textContent = `${environmentalImpact.co2AvoidedKg} kg`;
          }
          if (elements.envRecoveryRate) {
            elements.envRecoveryRate.textContent = `${environmentalImpact.recyclingRate}%`;
          }
          if (elements.envLandfillM3) {
            elements.envLandfillM3.textContent = `${environmentalImpact.landfillSavedM3} m³`;
          }
          if (elements.envEnergyKwh) {
            elements.envEnergyKwh.textContent = `${environmentalImpact.cleanEnergyKwh} kWh`;
          }
        }
      } catch (err) {
        console.warn('[EcoPulse] Error fetching stats:', err.message);
      }
    };

    // 3. Fetch and Render Smart Alerts (Feature 8)
    const fetchAlerts = async () => {
      if (!elements.alertsContainer) return;
      try {
        const res = await api.getAlerts();
        if (res && res.success && res.data && res.data.length > 0) {
          elements.alertsContainer.innerHTML = res.data.map(alert => `
            <div class="eco-alert-card ${alert.type || 'info'}">
              <span class="alert-badge">${alert.category || 'Alert'}</span>
              <div style="flex: 1;">
                <div class="alert-title-row">
                  <h4 class="alert-title">${alert.title}</h4>
                </div>
                <p class="alert-desc">${alert.description}</p>
                ${alert.action ? `<div class="alert-action-line">▸ Action: ${alert.action}</div>` : ''}
              </div>
            </div>
          `).join('');
        }
      } catch (err) {
        console.warn('[EcoPulse] Error fetching alerts:', err.message);
      }
    };

    // 4. Fetch and Render Collection Queue (Feature 5)
    const fetchCollectionQueue = async () => {
      if (!elements.collectionQueueList) return;
      try {
        const res = await api.getCollectionQueue();
        if (res && res.success && res.data) {
          const queue = res.data;
          if (queue.length === 0) {
            elements.collectionQueueList.innerHTML = `
              <div style="text-align: center; padding: 30px; color: var(--green-soft);">
                ✓ All collection queues clear. Zero pending waste incidents in active sectors.
              </div>
            `;
            return;
          }

          elements.collectionQueueList.innerHTML = queue.map((item, idx) => `
            <div class="queue-item-card">
              <div class="queue-rank-badge">#${item.queuePosition || idx + 1}</div>
              <div class="queue-item-body">
                <div class="queue-item-title">${item.reportId}: ${item.category} at ${item.location}</div>
                <div class="queue-item-meta">
                  <span>Priority: <strong style="color: ${item.priority === 'Critical' ? '#f87171' : item.priority === 'High' ? '#fbbf24' : 'var(--cyan-neon)'};">${item.priority}</strong></span>
                  <span>Vehicle: <strong>${item.recommendedVehicle || 'Subterranean Vacuum Pod'}</strong></span>
                  <span>Payload: <strong>~${item.estimatedKg || 45} kg</strong></span>
                </div>
              </div>
              <div class="queue-eta-badge">
                ETA: ~${item.etaMinutes || 25} mins
              </div>
            </div>
          `).join('');
        }
      } catch (err) {
        console.warn('[EcoPulse] Error fetching queue:', err.message);
      }
    };

    // 5. Fetch and Render All Reports (Feeds My Reports and Team Dashboard)
    const fetchReports = async () => {
      try {
        const res = await api.getReports();
        if (res && res.success && res.data) {
          allReports = res.data;
          renderMyReports();
          renderTeamReports();

          // Update active count on team tab badge
          const unresolved = allReports.filter(r => r.status !== 'Resolved').length;
          if (elements.teamTabBadge) {
            elements.teamTabBadge.textContent = unresolved;
          }
        }
      } catch (err) {
        console.warn('[EcoPulse] Error fetching reports:', err.message);
        if (elements.myReportsList) {
          elements.myReportsList.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #f87171;">
              Could not retrieve reports from backend. Please verify server is running on port 5000.
            </div>
          `;
        }
      }
    };

    // Render My Reports (Citizen View - Feature 2)
    const renderMyReports = () => {
      if (!elements.myReportsList) return;
      const search = (elements.myReportsSearch?.value || '').toLowerCase().trim();
      
      let filtered = allReports;
      if (search) {
        filtered = filtered.filter(r => 
          r.reportId.toLowerCase().includes(search) || 
          r.location.toLowerCase().includes(search) || 
          r.category.toLowerCase().includes(search)
        );
      }

      if (filtered.length === 0) {
        elements.myReportsList.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: var(--text-dim);">
            No matching waste reports found. Submit your first report using the form above!
          </div>
        `;
        return;
      }

      elements.myReportsList.innerHTML = filtered.map(r => {
        const priorityClass = (r.priority || 'medium').toLowerCase();
        const statusClass = (r.status || 'pending').toLowerCase().replace(/\s+/g, '-');
        const formattedDate = new Date(r.createdAt).toLocaleString(undefined, {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        return `
          <div class="report-card-item" data-id="${r.reportId}" tabindex="0">
            <div class="report-card-header">
              <span class="report-id-text">${r.reportId}</span>
              <div class="report-meta-badges">
                <span class="priority-score-badge ${priorityClass}">${r.priority}</span>
                <span class="status-pill ${statusClass}">${r.status}</span>
              </div>
            </div>

            <div class="report-desc-text">
              <strong>${r.category}:</strong> ${r.description}
            </div>

            <div class="report-info-grid">
              <div><span class="report-info-label">Location:</span> ${r.location}</div>
              <div><span class="report-info-label">Submitted:</span> ${formattedDate}</div>
              <div><span class="report-info-label">Assigned:</span> ${r.assignedTeam || 'Automated Pod'}</div>
              <div><span class="report-info-label">Est. Weight:</span> ~${r.estimatedKg || 45} kg</div>
            </div>

            <button type="button" class="btn btn-sm btn-glass view-report-detail-btn" data-report-id="${r.reportId}" style="width: 100%;">
              View Incident Breakdown & Factors →
            </button>
          </div>
        `;
      }).join('');

      // Bind detail click events
      elements.myReportsList.querySelectorAll('.view-report-detail-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const reportId = btn.getAttribute('data-report-id');
          openReportDetailModal(reportId);
        });
      });
    };

    // Render Team Reports (Field Operations View - Feature 3)
    const renderTeamReports = () => {
      if (!elements.teamReportsList) return;
      const search = (elements.teamSearchInput?.value || '').toLowerCase().trim();

      let filtered = allReports;
      if (activeTeamStatusFilter !== 'All') {
        filtered = filtered.filter(r => r.status === activeTeamStatusFilter);
      }
      if (search) {
        filtered = filtered.filter(r => 
          r.reportId.toLowerCase().includes(search) || 
          r.location.toLowerCase().includes(search) || 
          r.category.toLowerCase().includes(search) ||
          (r.reportedBy && r.reportedBy.toLowerCase().includes(search))
        );
      }

      if (filtered.length === 0) {
        elements.teamReportsList.innerHTML = `
          <div style="text-align: center; padding: 40px; color: var(--text-dim);">
            No waste reports matching status '${activeTeamStatusFilter}'.
          </div>
        `;
        return;
      }

      elements.teamReportsList.innerHTML = filtered.map(r => {
        const priorityClass = (r.priority || 'medium').toLowerCase();
        const statusClass = (r.status || 'pending').toLowerCase().replace(/\s+/g, '-');
        const formattedDate = new Date(r.createdAt).toLocaleString(undefined, {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        // Determine step indicators
        const isPending = r.status === 'Pending';
        const isAssigned = r.status === 'Assigned';
        const isInProgress = r.status === 'In Progress';
        const isResolved = r.status === 'Resolved';

        // Action button based on current status
        let actionBtnHtml = '';
        if (isPending) {
          actionBtnHtml = `
            <button type="button" class="btn-transition-status to-assigned" data-action="status" data-id="${r.reportId}" data-target-status="Assigned">
              → Assign to Field Team
            </button>
          `;
        } else if (isAssigned) {
          actionBtnHtml = `
            <button type="button" class="btn-transition-status to-progress" data-action="status" data-id="${r.reportId}" data-target-status="In Progress">
              → Dispatch / Mark In Progress
            </button>
          `;
        } else if (isInProgress) {
          actionBtnHtml = `
            <button type="button" class="btn-transition-status to-resolved" data-action="status" data-id="${r.reportId}" data-target-status="Resolved">
              ✓ Mark Resolved (Cleaned & Recycled)
            </button>
          `;
        } else {
          actionBtnHtml = `
            <span style="font-size: 0.8rem; color: var(--green-soft); font-weight: 600;">
              ✓ Resolved & Logged in MongoDB
            </span>
          `;
        }

        return `
          <div class="report-card-item">
            <div class="report-card-header">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="report-id-text">${r.reportId}</span>
                <span class="priority-score-badge ${priorityClass}">${r.priority}</span>
                <span class="status-pill ${statusClass}">${r.status}</span>
              </div>
              <span style="font-size: 0.8rem; color: var(--text-dim);">${formattedDate}</span>
            </div>

            <div class="report-desc-text">
              <strong>${r.category} at ${r.location}:</strong> ${r.description}
            </div>

            <div class="report-info-grid">
              <div><span class="report-info-label">Reporter:</span> ${r.reportedBy || 'Citizen'}</div>
              <div><span class="report-info-label">Assigned Unit:</span> ${r.assignedTeam || 'Rapid Response Alpha'}</div>
              <div><span class="report-info-label">Est. Weight:</span> ~${r.estimatedKg || 45} kg</div>
              <div><span class="report-info-label">Diversion Rate:</span> ${r.diversionPotential || 75}%</div>
            </div>

            <!-- Lifecycle Stepper & Actions -->
            <div class="status-workflow-actions">
              <div class="stepper-nodes">
                <span class="step-node ${isPending ? 'current' : 'completed'}">1. Pending</span>
                <span style="color: var(--text-dim);">▸</span>
                <span class="step-node ${isAssigned ? 'current' : (isInProgress || isResolved) ? 'completed' : ''}">2. Assigned</span>
                <span style="color: var(--text-dim);">▸</span>
                <span class="step-node ${isInProgress ? 'current' : isResolved ? 'completed' : ''}">3. In Progress</span>
                <span style="color: var(--text-dim);">▸</span>
                <span class="step-node ${isResolved ? 'completed current' : ''}">4. Resolved</span>
              </div>

              <div>
                ${actionBtnHtml}
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Bind status update buttons
      elements.teamReportsList.querySelectorAll('button[data-action="status"]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const reportId = btn.getAttribute('data-id');
          const newStatus = btn.getAttribute('data-target-status');

          btn.disabled = true;
          btn.textContent = 'Updating MongoDB...';

          try {
            await api.updateReportStatus(reportId, newStatus);
            showToast(`Report ${reportId} status updated to '${newStatus}' in MongoDB!`);
            
            // Refresh state across all views
            await Promise.all([
              fetchReports(),
              fetchStats(),
              fetchCollectionQueue(),
              fetchAlerts()
            ]);
          } catch (err) {
            alert(`Failed to update status: ${err.message}`);
            btn.disabled = false;
          }
        });
      });
    };

    // Open Report Details Modal
    const openReportDetailModal = (reportId) => {
      const report = allReports.find(r => r.reportId === reportId);
      if (!report || !elements.reportDetailModal) return;

      elements.modalReportTitle.textContent = `${report.category} Incident`;
      elements.modalReportIdBadge.textContent = report.reportId;

      const priorityClass = (report.priority || 'medium').toLowerCase();
      const statusClass = (report.status || 'pending').toLowerCase().replace(/\s+/g, '-');
      const factors = report.priorityFactors && report.priorityFactors.length > 0
        ? report.priorityFactors.map(f => `<div class="priority-factor-item">${f}</div>`).join('')
        : '<div class="priority-factor-item">Calculated by EcoPulse Priority Matrix</div>';

      elements.modalReportBody.innerHTML = `
        <div style="display: flex; gap: 10px; margin-bottom: 16px;">
          <span class="priority-score-badge ${priorityClass}">${report.priority} Priority</span>
          <span class="status-pill ${statusClass}">${report.status}</span>
        </div>

        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 16px; margin-bottom: 18px;">
          <h4 style="font-size: 0.95rem; color: #fff; margin-bottom: 6px;">Location & Description</h4>
          <p style="font-size: 0.85rem; color: var(--cyan-neon); margin-bottom: 6px;">📍 ${report.location}</p>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">${report.description}</p>
        </div>

        <div style="margin-bottom: 18px;">
          <h4 style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 8px;">Deterministic Priority Factors (Rule Engine):</h4>
          <div class="priority-factors-list">
            ${factors}
          </div>
        </div>

        <div class="report-info-grid" style="margin-bottom: 16px;">
          <div><span class="report-info-label">Assigned Unit:</span> ${report.assignedTeam || 'Rapid Response Alpha'}</div>
          <div><span class="report-info-label">Est. Weight:</span> ~${report.estimatedKg || 45} kg</div>
          <div><span class="report-info-label">Diversion Rate:</span> ${report.diversionPotential || 75}%</div>
          <div><span class="report-info-label">Created:</span> ${new Date(report.createdAt).toLocaleString()}</div>
        </div>

        <div style="text-align: right; margin-top: 14px;">
          <button type="button" class="btn btn-sm btn-outline" id="closeDetailModalBtn">Close Details</button>
        </div>
      `;

      elements.reportDetailModal.classList.add('open');
      elements.reportDetailModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const closeBtn = document.getElementById('closeDetailModalBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeReportDetail);
      }
    };

    const closeReportDetail = () => {
      if (!elements.reportDetailModal) return;
      elements.reportDetailModal.classList.remove('open');
      elements.reportDetailModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (elements.closeReportDetailModal) {
      elements.closeReportDetailModal.addEventListener('click', closeReportDetail);
    }

    // 6. Live Transparent Priority Preview Logic (Feature 4)
    const updateLivePriorityPreview = () => {
      const cat = elements.wasteCategory?.value || 'Overflowing Bin';
      const loc = elements.wasteLocation?.value || 'Main Market Road';
      const desc = elements.wasteDescription?.value || '';
      const isUrgent = elements.wasteUrgent?.checked || false;

      let score = 0;
      const factors = [];

      // Category rule
      const lowerCat = cat.toLowerCase();
      if (lowerCat.includes('hazard') || lowerCat.includes('e-waste')) {
        score += 40;
        factors.push('Severe Category Hazard: Toxic/E-Waste Contamination Risk (+40 pts)');
      } else if (lowerCat.includes('water') || lowerCat.includes('nature')) {
        score += 35;
        factors.push('Ecological Sensitivity: Direct River/Park Biosphere Threat (+35 pts)');
      } else if (lowerCat.includes('overflow') || lowerCat.includes('bin')) {
        score += 30;
        factors.push('Public Receptacle Spill: Sidewalk Obstruction & Health Hazard (+30 pts)');
      } else if (lowerCat.includes('organic') || lowerCat.includes('food')) {
        score += 25;
        factors.push('Rapid Degradation Risk: Vector & Odor Propagation (+25 pts)');
      } else if (lowerCat.includes('construction') || lowerCat.includes('debris')) {
        score += 20;
        factors.push('Structural Obstruction: Heavy Material Debris (+20 pts)');
      } else {
        score += 15;
        factors.push('Standard Dry Recyclable / Packaging Accumulation (+15 pts)');
      }

      // Location rule
      const lowerLoc = loc.toLowerCase();
      if (lowerLoc.includes('market') || lowerLoc.includes('main market')) {
        score += 20;
        factors.push('High Foot-Traffic Commercial Zone: Main Market Road (+20 pts)');
      } else if (lowerLoc.includes('school') || lowerLoc.includes('hospital')) {
        score += 25;
        factors.push('Vulnerable Population Zone: School/Medical Perimeter (+25 pts)');
      } else if (lowerLoc.includes('park') || lowerLoc.includes('lake') || lowerLoc.includes('corridor')) {
        score += 20;
        factors.push('Protected Nature Zone: Green Space Bio-Integrity (+20 pts)');
      } else if (lowerLoc.includes('metro') || lowerLoc.includes('station')) {
        score += 18;
        factors.push('Mass Transit Hub: High Commuter Flow Area (+18 pts)');
      } else {
        score += 10;
        factors.push('Standard Municipal District (+10 pts)');
      }

      // Keyword rule
      if (/\b(fire|chemical|toxic|acid|leak|danger)\b/i.test(desc)) {
        score += 25;
        factors.push('Critical Keyword Detection: Chemical/Combustion Risk (+25 pts)');
      } else if (/\b(stench|smell|rats|flies|spill)\b/i.test(desc)) {
        score += 15;
        factors.push('Urgency Keyword: Bio-Sanitation / Active Spill (+15 pts)');
      }

      if (isUrgent) {
        score += 15;
        factors.push('Citizen Urgency Flag Applied (+15 pts)');
      }

      score = Math.min(100, Math.max(10, score));

      let priorityText = 'MEDIUM PRIORITY';
      let priorityClass = 'medium';

      if (score >= 75) {
        priorityText = 'CRITICAL PRIORITY';
        priorityClass = 'critical';
      } else if (score >= 50) {
        priorityText = 'HIGH PRIORITY';
        priorityClass = 'high';
      } else if (score >= 30) {
        priorityText = 'MEDIUM PRIORITY';
        priorityClass = 'medium';
      } else {
        priorityText = 'LOW PRIORITY';
        priorityClass = 'low';
      }

      if (elements.livePriorityBadge) {
        elements.livePriorityBadge.textContent = `${priorityText} (Score: ${score}/100)`;
        elements.livePriorityBadge.className = `priority-score-badge ${priorityClass}`;
      }
      if (elements.livePriorityFill) {
        elements.livePriorityFill.style.width = `${score}%`;
      }
      if (elements.livePriorityFactors) {
        elements.livePriorityFactors.innerHTML = factors.map(f => `<div class="priority-factor-item">${f}</div>`).join('');
      }
    };

    // Bind inputs to live priority update
    elements.wasteCategory?.addEventListener('change', updateLivePriorityPreview);
    elements.wasteLocation?.addEventListener('input', updateLivePriorityPreview);
    elements.wasteDescription?.addEventListener('input', updateLivePriorityPreview);
    elements.wasteUrgent?.addEventListener('change', updateLivePriorityPreview);

    // Location preset chips
    document.querySelectorAll('.preset-chip[data-loc]').forEach(chip => {
      chip.addEventListener('click', () => {
        if (elements.wasteLocation) {
          elements.wasteLocation.value = chip.getAttribute('data-loc');
          updateLivePriorityPreview();
        }
      });
    });

    // EXACT DEMO FLOW 1-Click Fill Helper
    if (elements.quickFillDemoBtn) {
      elements.quickFillDemoBtn.addEventListener('click', () => {
        if (elements.wasteCategory) elements.wasteCategory.value = 'Overflowing Bin';
        if (elements.wasteLocation) elements.wasteLocation.value = 'Main Market Road';
        if (elements.wasteDescription) elements.wasteDescription.value = 'Central fruit & vegetable market public bin overflowing onto pedestrian path. Rapid spill accumulating.';
        if (elements.wasteReporter) elements.wasteReporter.value = 'Alex Rivera';
        updateLivePriorityPreview();
        showToast('Demo scenario populated: Overflowing Bin at Main Market Road (High Priority)!');
      });
    }

    // 7. Handle Waste Report Submission (Feature 1)
    if (elements.reportForm) {
      elements.reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const category = elements.wasteCategory?.value;
        const location = elements.wasteLocation?.value;
        const description = elements.wasteDescription?.value;
        const reportedBy = elements.wasteReporter?.value || 'Citizen Demo';
        const urgencyFlag = elements.wasteUrgent?.checked || false;

        if (!category || !location || !description) {
          alert('Please fill in all required fields.');
          return;
        }

        const submitBtn = elements.submitWasteBtn;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `
            <span>Submitting to MongoDB...</span>
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          `;
        }

        try {
          const res = await api.createReport({
            category,
            location,
            description,
            reportedBy,
            urgencyFlag
          });

          if (res && res.success && res.data) {
            const report = res.data;

            // Show success banner with reportId EP-XXXX
            if (elements.successBanner && elements.successId) {
              elements.successId.textContent = report.reportId;
              elements.successBanner.style.display = 'block';
              elements.successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            showToast(`Report ${report.reportId} successfully registered in MongoDB!`);

            // Refresh data across the entire platform
            await Promise.all([
              fetchReports(),
              fetchStats(),
              fetchCollectionQueue(),
              fetchAlerts()
            ]);
          }
        } catch (err) {
          alert(`Failed to submit report: ${err.message}`);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
              <span>Submit Waste Report to EcoPulse</span>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            `;
          }
        }
      });
    }

    // View In My Reports CTA
    if (elements.viewInMyReportsBtn) {
      elements.viewInMyReportsBtn.addEventListener('click', () => {
        elements.myReportsCard?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (elements.reportAnotherBtn) {
      elements.reportAnotherBtn.addEventListener('click', () => {
        if (elements.successBanner) elements.successBanner.style.display = 'none';
        if (elements.wasteDescription) elements.wasteDescription.value = '';
        updateLivePriorityPreview();
      });
    }

    // Search and filter in My Reports
    elements.myReportsSearch?.addEventListener('input', renderMyReports);
    elements.refreshMyReportsBtn?.addEventListener('click', fetchReports);

    // Search and filter in Team Dashboard
    elements.teamSearchInput?.addEventListener('input', renderTeamReports);
    elements.refreshTeamReportsBtn?.addEventListener('click', fetchReports);

    elements.teamStatusFilterBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.teamStatusFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTeamStatusFilter = btn.getAttribute('data-filter-status') || 'All';
        renderTeamReports();
      });
    });

    // 8. Tabs Navigation
    elements.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        elements.tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const targetTab = btn.getAttribute('data-eco-tab');
        const targetPane = document.getElementById(`pane-${targetTab}`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });

    // 9. Interactive Priority Simulator (Feature 4 Sandbox)
    const updateSimResult = () => {
      const cat = elements.simCategory?.value || '';
      const loc = elements.simLocation?.value || '';
      let score = 0;

      if (cat.includes('Hazardous')) score += 40;
      else if (cat.includes('Waterway')) score += 35;
      else if (cat.includes('Overflowing')) score += 30;
      else if (cat.includes('Organic')) score += 25;
      else score += 15;

      if (loc.includes('Hospital')) score += 25;
      else if (loc.includes('Main Market')) score += 20;
      else if (loc.includes('Central Park')) score += 20;
      else score += 10;

      let label = 'MEDIUM PRIORITY';
      let style = 'background: rgba(0, 180, 216, 0.2); border: 1px solid var(--primary-blue); color: var(--cyan-neon);';

      if (score >= 75) {
        label = 'CRITICAL PRIORITY';
        style = 'background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #f87171;';
      } else if (score >= 50) {
        label = 'HIGH PRIORITY';
        style = 'background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #fbbf24;';
      }

      if (elements.simResultBadge) {
        elements.simResultBadge.textContent = `${label} (Score: ${score}/100)`;
        elements.simResultBadge.setAttribute('style', `${style} font-size: 0.85rem;`);
      }
    };

    elements.simCategory?.addEventListener('change', updateSimResult);
    elements.simLocation?.addEventListener('change', updateSimResult);

    // 10. Smart Recycling Advisor (Feature 7)
    const advisorData = {
      'pet-bottle': {
        title: 'PET Plastic Beverage Container',
        bin: 'Blue Dry Recyclables',
        binClass: 'blue',
        degradation: '450 Years in Landfill',
        circularVal: 'High (3D Filament & Textile Yarn)',
        ecoTip: 'Empty liquids and crush before discarding. Automated optical sorting in subterranean vacuum ducts will direct this to the regional polymer extrusion plant.'
      },
      'battery': {
        title: 'Lithium-Ion Battery Pack',
        bin: 'Red Hazardous Waste Depots',
        binClass: 'red',
        degradation: '500+ Years (Toxic Heavy Metal Leaching)',
        circularVal: 'Critical (Cobalt, Lithium & Nickel Reclaim)',
        ecoTip: 'Never dispose in curbside bins. Fire hazard if compacted. Deposit at designated municipal e-waste kiosks with terminal insulator tape.'
      },
      'organic': {
        title: 'Organic Produce & Food Scraps',
        bin: 'Green Compostable Stream',
        binClass: 'green',
        degradation: '2 to 6 Weeks in Bio-Digester',
        circularVal: 'High (Biogas & Nutrient Bio-Fertilizer)',
        ecoTip: 'Feed into localized pneumatic bio-digesters. Methane is scrubbed to power urban micro-turbines and provide natural park fertilizer.'
      },
      'cardboard': {
        title: 'Corrugated Cardboard Packaging',
        bin: 'Blue Dry Recyclables',
        binClass: 'blue',
        degradation: '2 Months (Dry) / 100% Recyclable',
        circularVal: 'Very High (Up to 7 Recycling Lifecycles)',
        ecoTip: 'Flatten boxes completely to optimize pneumatic chute airflow and prevent jamming in subterranean vacuum conduits.'
      },
      'ewaste': {
        title: 'Printed Circuit Boards & Cables',
        bin: 'Red Hazardous / Tech Reclamation',
        binClass: 'red',
        degradation: 'Non-Degradable Glass-Epoxy Matrix',
        circularVal: 'Precious Metals (Gold, Silver, Palladium)',
        ecoTip: 'Transport to Tech Hub Civic Depot. Hydrometallurgical zero-emission recovery extracts rare minerals for next-gen sensors.'
      },
      'glass': {
        title: 'Glass Bottles & Food Jars',
        bin: 'Blue Dry Recyclables',
        binClass: 'blue',
        degradation: '1,000,000 Years (Infinitely Recyclable)',
        circularVal: 'Infinite (Zero Degradation in Remelting)',
        ecoTip: 'Rinse cleanly. 100% circular cullet saves 30% furnace melting energy compared to virgin silica sand.'
      }
    };

    elements.recyclingChips.forEach(chip => {
      chip.addEventListener('click', () => {
        elements.recyclingChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.getAttribute('data-item');
        const item = advisorData[key];
        if (item && elements.advItemTitle && elements.advBinBadge && elements.advDegradation && elements.advCircularVal && elements.advEcoTip) {
          elements.advItemTitle.textContent = item.title;
          elements.advBinBadge.textContent = item.bin;
          elements.advBinBadge.className = `advisor-bin-badge ${item.binClass}`;
          elements.advDegradation.textContent = item.degradation;
          elements.advCircularVal.textContent = item.circularVal;
          elements.advEcoTip.innerHTML = `<strong>City Eco Tip:</strong> ${item.ecoTip}`;
        }
      });
    });

    // 11. Refresh Live Data Button Handler
    elements.refreshDataBtn?.addEventListener('click', async () => {
      elements.refreshDataBtn.classList.add('spinning');
      await Promise.all([
        checkConnection(),
        fetchStats(),
        fetchReports(),
        fetchCollectionQueue(),
        fetchAlerts(),
        fetchInfrastructure()
      ]);
      showToast('Live telemetry synchronized from MongoDB database.');
      setTimeout(() => elements.refreshDataBtn.classList.remove('spinning'), 500);
    });

    // 12. Fetch Connected Infrastructure & Underground Systems (Focus Areas 1, 2, 3, 4, 5)
    const fetchInfrastructure = async () => {
      try {
        const res = await api.getInfrastructure();
        if (res && res.success) {
          const { undergroundTransportation, undergroundWasteManagement, aiIntegration, connectedInfrastructure } = res;

          // Transit metrics
          const line1Speed = document.getElementById('line1Speed');
          const line1Headway = document.getElementById('line1Headway');
          const line1Pods = document.getElementById('line1Pods');
          const line2Throughput = document.getElementById('line2Throughput');
          const line2Pods = document.getElementById('line2Pods');

          if (line1Speed) line1Speed.textContent = undergroundTransportation.lines[0]?.speed || '120 km/h';
          if (line1Headway) line1Headway.textContent = `${undergroundTransportation.lines[0]?.headwaySec || 90} sec`;
          if (line1Pods) line1Pods.textContent = `${undergroundTransportation.lines[0]?.activePods || 32} Active`;
          if (line2Throughput) line2Throughput.textContent = `${undergroundTransportation.lines[1]?.throughputParcelsPerHour?.toLocaleString() || '14,200'} pkg/hr`;
          if (line2Pods) line2Pods.textContent = `${undergroundTransportation.lines[1]?.activePods || 48} Active`;

          // Pneumatic waste metrics
          const vacuumAirspeed = document.getElementById('vacuumAirspeed');
          const vacuumPressure = document.getElementById('vacuumPressure');
          const siloOccupancy = document.getElementById('siloOccupancy');
          if (vacuumAirspeed) vacuumAirspeed.textContent = undergroundWasteManagement.conduits[0]?.airSpeed || '75 km/h';
          if (vacuumPressure) vacuumPressure.textContent = `${undergroundWasteManagement.conduits[0]?.vacuumPressureKPa || 78.4} kPa`;
          if (siloOccupancy) siloOccupancy.textContent = `${undergroundWasteManagement.conduits[1]?.currentOccupancyTonnes || 46.2} / 120 T`;

          // AI Integration
          const aiRoute = document.getElementById('aiRecommendedTubeRoute');
          if (aiRoute && aiIntegration.dispatchOptimization) {
            aiRoute.textContent = `Route Vector: ${aiIntegration.dispatchOptimization.leastCongestionRoutingTube}`;
          }

          // Ecosystem Health Pill
          const ecoPill = document.getElementById('ecosystemHealthPill');
          if (ecoPill && connectedInfrastructure) {
            ecoPill.textContent = `ECOSYSTEM SYNC: ${connectedInfrastructure.ecosystemHealth || '99.4%'}`;
          }
        }
      } catch (err) {
        console.warn('[EcoPulse] Error fetching infrastructure:', err.message);
      }
    };

    // Pneumatic Evacuation Pulse Simulator (Focus 2)
    const triggerPneumaticPulseBtn = document.getElementById('triggerPneumaticPulseBtn');
    const tubeCarrierPod = document.getElementById('tubeCarrierPod');
    const pneumaticLogText = document.getElementById('pneumaticLogText');

    if (triggerPneumaticPulseBtn) {
      triggerPneumaticPulseBtn.addEventListener('click', () => {
        triggerPneumaticPulseBtn.disabled = true;
        if (pneumaticLogText) {
          pneumaticLogText.textContent = 'Evacuating waste slug at 75 km/h via sub-surface pneumatic conduit...';
          pneumaticLogText.style.color = 'var(--cyan-neon)';
        }

        if (tubeCarrierPod) {
          tubeCarrierPod.classList.add('evacuating');
        }

        showToast('Pneumatic pulse triggered: Waste evacuated underground into sealed compactor silo (Zero surface disruption)!');

        setTimeout(() => {
          if (tubeCarrierPod) {
            tubeCarrierPod.classList.remove('evacuating');
          }
          if (pneumaticLogText) {
            pneumaticLogText.textContent = '✓ Evacuation cycle complete: Deposited in Silo Compactor 4. Zero surface odor emitted.';
            pneumaticLogText.style.color = 'var(--green-soft)';
          }
          triggerPneumaticPulseBtn.disabled = false;
        }, 1800);
      });
    }

    // System-Wide Ecosystem Sync (Focus 5)
    const syncEcosystemBtn = document.getElementById('syncEcosystemBtn');
    if (syncEcosystemBtn) {
      syncEcosystemBtn.addEventListener('click', async () => {
        syncEcosystemBtn.classList.add('spinning');
        const cards = document.querySelectorAll('.connected-layer-card');
        cards.forEach(c => {
          c.style.borderColor = 'var(--cyan-neon)';
          c.style.boxShadow = '0 0 20px rgba(0, 242, 254, 0.4)';
        });

        await fetchInfrastructure();

        setTimeout(() => {
          cards.forEach(c => {
            c.style.borderColor = '';
            c.style.boxShadow = '';
          });
          syncEcosystemBtn.classList.remove('spinning');
          showToast('Connected Infrastructure: All 5 layers synchronized with Cloud OS & MongoDB backend!');
        }, 800);
      });
    }

    // Close modal on escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeReportDetail();
    });

    // Initial Platform Telemetry Load
    checkConnection();
    fetchStats();
    fetchReports();
    fetchCollectionQueue();
    fetchAlerts();
    fetchInfrastructure();
    updateLivePriorityPreview();
  };

  // Launch EcoPulse OS Controller
  initEcoPulse();
});

