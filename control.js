/**
 * CS2 Knife Spinner Deluxe - Streamer Control Deck
 * Real-Time Remote Director & Full Settings Dashboard
 * Communicates bidirectionally via BroadcastChannel ('cs2_sync_channel')
 */

class CS2ControlDeck {
  constructor() {
    this.knives = (window.CS2_KNIVES_DATA && Array.isArray(window.CS2_KNIVES_DATA) && window.CS2_KNIVES_DATA.length > 0)
      ? window.CS2_KNIVES_DATA
      : [];

    // Fallback if window.CS2_KNIVES_DATA hasn't loaded yet
    if (this.knives.length === 0) {
      this.knives = [
        { id: "butterfly", folder: "Butterfly", name: "Butterfly Knife", vnName: "Dao Butterfly", tier: "S+", skinsCount: 25 },
        { id: "karambit", folder: "Karambit", name: "Karambit", vnName: "Dao Karambit", tier: "S+", skinsCount: 25 },
        { id: "m9_bayonet", folder: "M9 Bayonet", name: "M9 Bayonet", vnName: "Dao M9 Bayonet", tier: "S+", skinsCount: 25 },
        { id: "skeleton", folder: "Skeleton", name: "Skeleton Knife", vnName: "Dao Skeleton", tier: "S", skinsCount: 19 },
        { id: "talon", folder: "Talon", name: "Talon Knife", vnName: "Dao Talon", tier: "S", skinsCount: 19 },
        { id: "kukri", folder: "Kukri", name: "Kukri Knife", vnName: "Dao Kukri", tier: "A", skinsCount: 13 },
        { id: "stiletto", folder: "Stiletto", name: "Stiletto Knife", vnName: "Dao Stiletto", tier: "A", skinsCount: 19 },
        { id: "nomad", folder: "Nomad", name: "Nomad Knife", vnName: "Dao Nomad", tier: "A", skinsCount: 19 },
        { id: "ursus", folder: "Ursus", name: "Ursus Knife", vnName: "Dao Ursus", tier: "A", skinsCount: 19 },
        { id: "bayonet", folder: "Bayonet", name: "Bayonet", vnName: "Dao Bayonet", tier: "A", skinsCount: 25 },
        { id: "classic", folder: "Classic", name: "Classic Knife", vnName: "Dao Classic", tier: "B", skinsCount: 13 },
        { id: "flip", folder: "Flip", name: "Flip Knife", vnName: "Dao Flip", tier: "B", skinsCount: 25 },
        { id: "paracord", folder: "Paracord", name: "Paracord Knife", vnName: "Dao Paracord", tier: "B", skinsCount: 19 },
        { id: "bowie", folder: "Bowie", name: "Bowie Knife", vnName: "Dao Bowie", tier: "B", skinsCount: 25 },
        { id: "huntsman", folder: "Huntsman", name: "Huntsman Knife", vnName: "Dao Huntsman", tier: "B", skinsCount: 25 },
        { id: "falchion", folder: "Falchion", name: "Falchion Knife", vnName: "Dao Falchion", tier: "B", skinsCount: 25 },
        { id: "survival", folder: "Survival", name: "Survival Knife", vnName: "Dao Survival", tier: "C", skinsCount: 19 },
        { id: "gut", folder: "Gut", name: "Gut Knife", vnName: "Dao Gut", tier: "C", skinsCount: 25 },
        { id: "navaja", folder: "Navaja", name: "Navaja Knife", vnName: "Dao Navaja", tier: "C", skinsCount: 19 },
        { id: "shadow_daggers", folder: "Shadow Daggers", name: "Shadow Daggers", vnName: "Dao Shadow Daggers", tier: "C", skinsCount: 25 }
      ];
    }

    // Enabled knives set
    this.enabledKnifeIds = new Set(this.knives.map(k => k.id));
    const savedEnabled = localStorage.getItem('cs2_enabled_knives');
    if (savedEnabled) {
      try {
        const parsed = JSON.parse(savedEnabled);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.enabledKnifeIds = new Set(parsed);
        }
      } catch (e) {}
    }

    // App state mirrored from viewer
    this.viewerState = {
      currentStage: 1,
      isSpinning: false,
      isFinale: false,
      revealActive: false,
      broadcastMode: localStorage.getItem('cs2_broadcast_mode') || 'video',
      spinnerMode: localStorage.getItem('cs2_spinner_mode') || 'roller',
      suspenseLevel: localStorage.getItem('cs2_suspense_level') || 'ultra',
      oddsMode: localStorage.getItem('cs2_odds_mode') || 'equal',
      volume: localStorage.getItem('cs2_audio_volume') !== null ? parseFloat(localStorage.getItem('cs2_audio_volume')) : 0.8,
      isMuted: localStorage.getItem('cs2_audio_muted') === 'true',
      selectedKnife: null,
      selectedSkin: null,
      selectedQuantity: null,
      openedCases: 0
    };

    // Collection inventory
    this.collection = this.loadCollection();
    this.collectionView = 'cards'; // 'cards' or 'table'
    this.isConnected = false;

    this.initSyncChannel();
    this.bindNavigation();
    this.bindDeckControls();
    this.bindSettingsControls();
    this.bindKnivesManager();
    this.bindCollectionControls();
    this.bindManualAddModal();

    // Initial renders
    this.renderDeckMonitor();
    this.renderKnivesManager();
    this.renderCollection();

    // Request state from viewer page
    this.pingViewer();
  }

  // =========================================================================
  // 1. BROADCAST CHANNEL REAL-TIME SYNCHRONIZATION
  // =========================================================================

  initSyncChannel() {
    try {
      this.channel = new BroadcastChannel('cs2_sync_channel');
      this.channel.onmessage = (event) => {
        const msg = event.data;
        if (!msg || !msg.type) return;

        if (msg.type === 'STATE_UPDATE') {
          this.onViewerStateUpdate(msg.payload);
        } else if (msg.type === 'COLLECTION_UPDATED') {
          this.collection = this.loadCollection();
          this.renderCollection();
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel error in control deck:', e);
    }
  }

  send(type, payload = {}) {
    if (!this.channel) return;
    try {
      this.channel.postMessage({ type, ...payload });
    } catch (e) {
      console.warn('Error sending broadcast:', e);
    }
  }

  pingViewer() {
    this.send('REQUEST_STATE');
    setTimeout(() => {
      if (!this.isConnected) {
        this.updateSyncBadge(false);
      }
    }, 1500);
  }

  updateSyncBadge(connected) {
    this.isConnected = connected;
    const badge = document.getElementById('syncStatusBadge');
    const text = document.getElementById('syncStatusText');
    if (!badge || !text) return;

    if (connected) {
      badge.className = 'sync-badge connected';
      text.textContent = '🟢 ĐÃ KẾT NỐI MÀN HÌNH VIEWER (TRỰC TIẾP)';
    } else {
      badge.className = 'sync-badge disconnected';
      text.textContent = '🟡 ĐANG CHỜ MÀN HÌNH VIEWER... (CHẠY CÙNG TAB)';
    }
  }

  onViewerStateUpdate(payload) {
    this.updateSyncBadge(true);
    if (!payload) return;

    this.viewerState = {
      ...this.viewerState,
      ...payload
    };

    if (Array.isArray(payload.enabledKnifeIds)) {
      this.enabledKnifeIds = new Set(payload.enabledKnifeIds);
      this.renderKnivesManager();
    }

    this.renderDeckMonitor();
    this.renderSettingsSync(payload);
  }

  // =========================================================================
  // 2. NAVIGATION TABS
  // =========================================================================

  bindNavigation() {
    const tabs = document.querySelectorAll('.c-nav-tab');
    const panes = document.querySelectorAll('.c-pane');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.dataset.tab;
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');

        // Play feedback sound if available
        if (window.cs2Sound && window.cs2Sound.playButtonClick) {
          window.cs2Sound.playButtonClick();
        }
      });
    });

    const openViewerBtn = document.getElementById('openViewerBtn');
    if (openViewerBtn) {
      openViewerBtn.addEventListener('click', () => {
        window.open('index.html', 'CS2_VIEWER_WINDOW');
        this.pingViewer();
      });
    }
  }

  // =========================================================================
  // 3. TAB 1: DIRECTOR DECK (REMOTE SPINS & STATE MONITOR)
  // =========================================================================

  bindDeckControls() {
    const mainActionBtn = document.getElementById('remoteMainActionBtn');
    if (mainActionBtn) {
      mainActionBtn.addEventListener('click', () => {
        if (this.viewerState.isSpinning) return;

        if (window.cs2Sound && window.cs2Sound.playButtonClick) {
          window.cs2Sound.playButtonClick();
        }

        if (this.viewerState.revealActive) {
          this.send('CONTINUE_REVEAL');
        } else if (this.viewerState.isFinale) {
          this.send('RESET_HUNT');
        } else {
          this.send('START_SPIN', { stage: this.viewerState.currentStage || 1 });
        }
      });
    }

    const resetBtn = document.getElementById('remoteResetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn thiết lập lại toàn bộ kèo từ Vòng 1?')) {
          if (window.cs2Sound && window.cs2Sound.playButtonClick) {
            window.cs2Sound.playButtonClick();
          }
          this.send('RESET_HUNT');
        }
      });
    }

    // Quick Broadcast Switcher (Video vs Stream)
    const btnVideo = document.getElementById('btnModeVideo');
    const btnStream = document.getElementById('btnModeStream');

    if (btnVideo) {
      btnVideo.addEventListener('click', () => {
        this.send('SET_BROADCAST_MODE', { mode: 'video' });
        localStorage.setItem('cs2_broadcast_mode', 'video');
        btnVideo.classList.add('active');
        if (btnStream) btnStream.classList.remove('active');
      });
    }

    if (btnStream) {
      btnStream.addEventListener('click', () => {
        this.send('SET_BROADCAST_MODE', { mode: 'stream' });
        localStorage.setItem('cs2_broadcast_mode', 'stream');
        btnStream.classList.add('active');
        if (btnVideo) btnVideo.classList.remove('active');
      });
    }

    // Quick Spinner Switcher (Roller vs Wheel)
    const btnRoller = document.getElementById('btnSpinRoller');
    const btnWheel = document.getElementById('btnSpinWheel');

    if (btnRoller) {
      btnRoller.addEventListener('click', () => {
        this.send('SET_SPINNER_MODE', { mode: 'roller' });
        localStorage.setItem('cs2_spinner_mode', 'roller');
        btnRoller.classList.add('active');
        if (btnWheel) btnWheel.classList.remove('active');
      });
    }

    if (btnWheel) {
      btnWheel.addEventListener('click', () => {
        this.send('SET_SPINNER_MODE', { mode: 'wheel' });
        localStorage.setItem('cs2_spinner_mode', 'wheel');
        btnWheel.classList.add('active');
        if (btnRoller) btnRoller.classList.remove('active');
      });
    }
  }

  renderDeckMonitor() {
    const s = this.viewerState;

    // Stage Pill
    const stagePill = document.getElementById('deckStagePill');
    if (stagePill) {
      if (s.isFinale) {
        stagePill.textContent = '🏆 HOÀN THÀNH: NHIỆM VỤ HÔM NAY';
        stagePill.style.borderColor = '#00ff88';
        stagePill.style.color = '#00ff88';
      } else if (s.currentStage === 3) {
        stagePill.textContent = 'VÒNG 3: CHỌN HÒM & SỐ LƯỢNG';
        stagePill.style.borderColor = '#ffd700';
        stagePill.style.color = '#ffd700';
      } else if (s.currentStage === 2) {
        stagePill.textContent = 'VÒNG 2: CHỌN LỚP ÁO / SKIN';
        stagePill.style.borderColor = '#d946ef';
        stagePill.style.color = '#d946ef';
      } else {
        stagePill.textContent = 'VÒNG 1: CHỌN LOẠI DAO';
        stagePill.style.borderColor = '#ffd700';
        stagePill.style.color = '#ffd700';
      }
    }

    // Slot 1
    const dmsSlot1 = document.getElementById('dmsSlot1');
    const dmsVal1 = document.getElementById('dmsVal1');
    const dmsSub1 = document.getElementById('dmsSub1');
    if (dmsSlot1 && dmsVal1 && dmsSub1) {
      dmsSlot1.className = `dms-box ${s.currentStage === 1 && !s.isFinale ? 'active-slot' : ''} ${s.selectedKnife ? 'completed-slot' : ''}`;
      if (s.selectedKnife) {
        dmsVal1.textContent = s.selectedKnife.name;
        dmsSub1.textContent = `${s.selectedKnife.tier} • ${s.selectedKnife.vnName || 'Vanilla'}`;
      } else {
        dmsVal1.textContent = s.currentStage === 1 ? 'Đang chờ quay...' : 'Chưa có';
        dmsSub1.textContent = `${this.enabledKnifeIds.size} Dòng Dao CS2`;
      }
    }

    // Slot 2
    const dmsSlot2 = document.getElementById('dmsSlot2');
    const dmsVal2 = document.getElementById('dmsVal2');
    const dmsSub2 = document.getElementById('dmsSub2');
    if (dmsSlot2 && dmsVal2 && dmsSub2) {
      dmsSlot2.className = `dms-box ${s.currentStage === 2 && !s.isFinale ? 'active-slot' : ''} ${s.selectedSkin ? 'completed-slot' : ''}`;
      if (s.selectedSkin) {
        dmsVal2.textContent = s.selectedSkin.name;
        dmsSub2.textContent = `${s.selectedSkin.tier} • ${s.selectedSkin.category || 'Skin Finish'}`;
      } else {
        dmsVal2.textContent = s.currentStage === 2 ? 'Đang chờ quay...' : 'Khóa';
        dmsSub2.textContent = s.currentStage >= 2 ? 'Sẵn sàng chọn Skin' : 'Chờ Vòng 1';
      }
    }

    // Slot 3
    const dmsSlot3 = document.getElementById('dmsSlot3');
    const dmsVal3 = document.getElementById('dmsVal3');
    const dmsSub3 = document.getElementById('dmsSub3');
    if (dmsSlot3 && dmsVal3 && dmsSub3) {
      dmsSlot3.className = `dms-box ${s.currentStage === 3 && !s.isFinale ? 'active-slot' : ''} ${s.isFinale ? 'completed-slot' : ''}`;
      if (s.selectedQuantity) {
        dmsVal3.textContent = s.selectedQuantity.name;
        dmsSub3.textContent = `${s.selectedQuantity.caseName || 'Hòm'} (${s.selectedQuantity.count} hòm)`;
      } else {
        dmsVal3.textContent = s.currentStage === 3 ? 'Đang chờ quay...' : 'Khóa';
        dmsSub3.textContent = s.currentStage >= 3 ? 'Sẵn sàng chọn Hòm' : 'Chờ Vòng 2';
      }
    }

    // Remote Main Action Button
    const mainBtn = document.getElementById('remoteMainActionBtn');
    const btnIcon = document.getElementById('remoteBtnIcon');
    const btnText = document.getElementById('remoteBtnText');

    if (mainBtn && btnIcon && btnText) {
      if (s.isSpinning) {
        mainBtn.disabled = true;
        btnIcon.textContent = '⏳';
        btnText.textContent = `ĐANG QUAY VÒNG ${s.currentStage || 1} TRÊN MÀN VIEWER...`;
      } else if (s.revealActive) {
        mainBtn.disabled = false;
        btnIcon.textContent = '➔';
        btnText.textContent = 'TIẾP TỤC BƯỚC TIẾP THEO (TRÊN MÀN VIEWER)';
      } else if (s.isFinale) {
        mainBtn.disabled = false;
        btnIcon.textContent = '🔄';
        btnText.textContent = 'KÈO ĐÃ HOÀN TẤT - BẤM ĐỂ BẮT ĐẦU KÈO MỚI';
      } else {
        mainBtn.disabled = false;
        btnIcon.textContent = '⚡';
        btnText.textContent = `KÍCH HOẠT QUAY VÒNG ${s.currentStage || 1} (TRÊN MÀN VIEWER)`;
      }
    }

    // Quick mode buttons sync
    const btnVideo = document.getElementById('btnModeVideo');
    const btnStream = document.getElementById('btnModeStream');
    if (btnVideo && btnStream) {
      const isVideo = (s.broadcastMode === 'video');
      btnVideo.classList.toggle('active', isVideo);
      btnStream.classList.toggle('active', !isVideo);
    }

    const btnRoller = document.getElementById('btnSpinRoller');
    const btnWheel = document.getElementById('btnSpinWheel');
    if (btnRoller && btnWheel) {
      const isRoller = (s.spinnerMode === 'roller');
      btnRoller.classList.toggle('active', isRoller);
      btnWheel.classList.toggle('active', !isRoller);
    }

    // Live Session Stats Strip Update
    const deckStatCount = document.getElementById('deckStatCount');
    const deckStatTotalValue = document.getElementById('deckStatTotalValue');
    const deckStatTopKnife = document.getElementById('deckStatTopKnife');
    const deckStatProgress = document.getElementById('deckStatProgress');

    if (deckStatCount) deckStatCount.textContent = s.openedCases || 0;
    
    const distinctKnives = new Set(this.collection.map(c => c.knifeId)).size;
    if (deckStatProgress) deckStatProgress.textContent = `${distinctKnives} / 20`;

    const totalVND = this.collection.reduce((sum, item) => {
      const num = parseInt((item.priceVND || '0').replace(/\./g, '').replace(/đ/g, '').trim()) || 0;
      return sum + num;
    }, 0);
    if (deckStatTotalValue) deckStatTotalValue.textContent = totalVND.toLocaleString('vi-VN') + ' ₫';

    if (deckStatTopKnife) {
      if (s.selectedSkin) {
        deckStatTopKnife.textContent = `${s.selectedKnife?.name || ''} | ${s.selectedSkin.name}`;
      } else if (this.collection.length > 0) {
        deckStatTopKnife.textContent = this.collection[0].fullName;
      } else {
        deckStatTopKnife.textContent = 'Chưa có';
      }
    }
  }

  // =========================================================================
  // 4. TAB 2: CÀI ĐẶT HỆ THỐNG (SETTINGS)
  // =========================================================================

  bindSettingsControls() {
    // Restore saved settings values to UI on load
    const savedSuspense = this.viewerState.suspenseLevel;
    const radSuspense = document.querySelector(`input[name="suspenseOpt"][value="${savedSuspense}"]`);
    if (radSuspense) radSuspense.checked = true;

    const savedOdds = this.viewerState.oddsMode;
    const radOdds = document.querySelector(`input[name="oddsOpt"][value="${savedOdds}"]`);
    if (radOdds) radOdds.checked = true;

    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
      volumeSlider.value = this.viewerState.volume;
    }

    const muteBtn = document.getElementById('toggleMuteBtn');
    if (muteBtn) {
      muteBtn.textContent = this.viewerState.isMuted ? '🔇 Đã Tắt Âm Thanh' : '🔊 Đang Bật Âm Thanh';
    }

    // Suspense radios
    document.querySelectorAll('input[name="suspenseOpt"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const level = e.target.value;
        this.viewerState.suspenseLevel = level;
        this.send('SET_SUSPENSE', { level });
        try { localStorage.setItem('cs2_suspense_level', level); } catch(err){}
      });
    });

    // Odds radios
    document.querySelectorAll('input[name="oddsOpt"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const mode = e.target.value;
        this.viewerState.oddsMode = mode;
        this.send('SET_ODDS', { mode });
        try { localStorage.setItem('cs2_odds_mode', mode); } catch(err){}
      });
    });

    // Audio Mute toggle
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        this.viewerState.isMuted = !this.viewerState.isMuted;
        muteBtn.textContent = this.viewerState.isMuted ? '🔇 Đã Tắt Âm Thanh' : '🔊 Đang Bật Âm Thanh';
        try { localStorage.setItem('cs2_audio_muted', this.viewerState.isMuted ? 'true' : 'false'); } catch(err){}
        this.send('SET_AUDIO', {
          isMuted: this.viewerState.isMuted,
          volume: this.viewerState.volume
        });
      });
    }

    // Audio Volume Slider
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        const vol = parseFloat(e.target.value);
        this.viewerState.volume = vol;
        try { localStorage.setItem('cs2_audio_volume', vol.toString()); } catch(err){}
        this.send('SET_AUDIO', {
          isMuted: this.viewerState.isMuted,
          volume: vol
        });
      });
    }

    // Save All Settings Button
    const saveBtn = document.getElementById('deckSaveSettingsBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const checkedSuspense = document.querySelector('input[name="suspenseOpt"]:checked')?.value || this.viewerState.suspenseLevel;
        const checkedOdds = document.querySelector('input[name="oddsOpt"]:checked')?.value || this.viewerState.oddsMode;
        const currentVol = volumeSlider ? parseFloat(volumeSlider.value) : this.viewerState.volume;
        const currentMuted = this.viewerState.isMuted;

        try {
          localStorage.setItem('cs2_suspense_level', checkedSuspense);
          localStorage.setItem('cs2_odds_mode', checkedOdds);
          localStorage.setItem('cs2_audio_volume', currentVol.toString());
          localStorage.setItem('cs2_audio_muted', currentMuted ? 'true' : 'false');
          localStorage.setItem('cs2_knife_collection', JSON.stringify(this.collection));
          localStorage.setItem('cs2_enabled_knives', JSON.stringify(Array.from(this.enabledKnifeIds)));
        } catch (e) {
          console.warn('Storage save error:', e);
        }

        this.send('SET_SUSPENSE', { level: checkedSuspense });
        this.send('SET_ODDS', { mode: checkedOdds });
        this.send('SET_AUDIO', { isMuted: currentMuted, volume: currentVol });
        this.send('SET_ENABLED_KNIVES', { enabledIds: Array.from(this.enabledKnifeIds) });
        this.send('COLLECTION_UPDATED');

        this.showToast('✔ ĐÃ LƯU TOÀN BỘ CÀI ĐẶT & BỘ SƯU TẬP VÀO TRÌNH DUYỆT!');
      });
    }
  }

  showToast(message, duration = 3000) {
    let toast = document.getElementById('deckToastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'deckToastNotification';
      toast.className = 'cs-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  renderSettingsSync(payload) {
    if (payload.suspenseLevel) {
      const rad = document.querySelector(`input[name="suspenseOpt"][value="${payload.suspenseLevel}"]`);
      if (rad) rad.checked = true;
    }
    if (payload.oddsMode) {
      const rad = document.querySelector(`input[name="oddsOpt"][value="${payload.oddsMode}"]`);
      if (rad) rad.checked = true;
    }
    if (typeof payload.volume === 'number') {
      const slider = document.getElementById('volumeSlider');
      if (slider) slider.value = payload.volume;
    }
    if (typeof payload.isMuted === 'boolean') {
      const muteBtn = document.getElementById('toggleMuteBtn');
      if (muteBtn) {
        muteBtn.textContent = payload.isMuted ? '🔇 Đã Tắt Âm Thanh' : '🔊 Đang Bật Âm Thanh';
      }
    }
  }

  // =========================================================================
  // 5. TAB 3: QUẢN LÝ KHO DAO (20 LOẠI DAO CS2)
  // =========================================================================

  bindKnivesManager() {
    const btnSelectAll = document.getElementById('btnSelectAllKnives');
    const btnDeselectAll = document.getElementById('btnDeselectAllKnives');

    if (btnSelectAll) {
      btnSelectAll.addEventListener('click', () => {
        this.enabledKnifeIds = new Set(this.knives.map(k => k.id));
        this.onKnivesSelectionChanged();
      });
    }

    if (btnDeselectAll) {
      btnDeselectAll.addEventListener('click', () => {
        // Keep at least Karambit or first knife
        const firstId = this.knives[0]?.id || 'karambit';
        this.enabledKnifeIds = new Set([firstId]);
        this.onKnivesSelectionChanged();
      });
    }
  }

  renderKnivesManager() {
    const grid = document.getElementById('controlKnivesGrid');
    const countBadge = document.getElementById('ctrlKnivesCount');
    if (!grid) return;

    if (countBadge) {
      countBadge.textContent = this.enabledKnifeIds.size;
    }

    grid.innerHTML = this.knives.map(knife => {
      const isChecked = this.enabledKnifeIds.has(knife.id);
      const vanillaImg = knife.vanillaImage || `assets/${knife.folder}/Vanilla.png`;
      const tierClass = `tier-${(knife.tier || 'a').toLowerCase().replace('+', '-plus')}`;

      return `
        <label class="km-card ${isChecked ? 'active' : 'disabled'}">
          <input type="checkbox" class="km-checkbox" data-id="${knife.id}" ${isChecked ? 'checked' : ''} />
          <img class="km-thumb" src="${vanillaImg}" alt="${knife.name}" onerror="this.src='assets/Karambit/Vanilla.png'" />
          <div class="km-info">
            <div class="km-name">${knife.name} <span class="km-tier-badge ${tierClass}">${knife.tier}</span></div>
            <div class="km-sub">${knife.vnName || '★ Vanilla'} • ${knife.skinsCount || 13} Skins</div>
          </div>
        </label>
      `;
    }).join('');

    // Bind checkboxes
    grid.querySelectorAll('.km-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          this.enabledKnifeIds.add(id);
        } else {
          if (this.enabledKnifeIds.size <= 1) {
            alert('Cần giữ ít nhất 1 loại dao trong vòng quay!');
            e.target.checked = true;
            return;
          }
          this.enabledKnifeIds.delete(id);
        }
        this.onKnivesSelectionChanged();
      });
    });
  }

  onKnivesSelectionChanged() {
    const arr = Array.from(this.enabledKnifeIds);
    try {
      localStorage.setItem('cs2_enabled_knives', JSON.stringify(arr));
    } catch (e) {}

    this.send('SET_ENABLED_KNIVES', { enabledIds: arr });
    this.renderKnivesManager();
  }

  // =========================================================================
  // 6. TAB 4: BỘ SƯU TẬP DAO (COLLECTION MANAGEMENT)
  // =========================================================================

  loadCollection() {
    try {
      const data = localStorage.getItem('cs2_knife_collection');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Could not read collection from localStorage:', e);
      return [];
    }
  }

  saveCollection() {
    try {
      localStorage.setItem('cs2_knife_collection', JSON.stringify(this.collection));
    } catch (e) {
      console.error('Error saving collection to localStorage:', e);
    }
    this.send('COLLECTION_UPDATED');
    this.renderCollection();
  }

  getWearInfo(floatVal) {
    const f = parseFloat(floatVal);
    if (f < 0.07) return { tag: 'FN', name: 'Factory New', color: '#10b981' };
    if (f < 0.15) return { tag: 'MW', name: 'Minimal Wear', color: '#3b82f6' };
    if (f < 0.38) return { tag: 'FT', name: 'Field-Tested', color: '#f59e0b' };
    if (f < 0.45) return { tag: 'WW', name: 'Well-Worn', color: '#f97316' };
    return { tag: 'BS', name: 'Battle-Scarred', color: '#ef4444' };
  }

  bindCollectionControls() {
    // View mode toggle (Cards vs Table)
    const viewCardsBtn = document.getElementById('viewCardsBtn');
    const viewTableBtn = document.getElementById('viewTableBtn');
    const container = document.getElementById('collectionItemsContainer');

    if (viewCardsBtn) {
      viewCardsBtn.addEventListener('click', () => {
        this.collectionView = 'cards';
        viewCardsBtn.classList.add('active');
        if (viewTableBtn) viewTableBtn.classList.remove('active');
        if (container) {
          container.className = 'collection-items-wrap view-cards';
        }
        this.renderCollection();
      });
    }

    if (viewTableBtn) {
      viewTableBtn.addEventListener('click', () => {
        this.collectionView = 'table';
        viewTableBtn.classList.add('active');
        if (viewCardsBtn) viewCardsBtn.classList.remove('active');
        if (container) {
          container.className = 'collection-items-wrap view-table';
        }
        this.renderCollection();
      });
    }

    // Export Backup JSON
    const exportBtn = document.getElementById('exportCollBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.collection, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `cs2_knife_collection_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
      });
    }

    // Import Backup JSON
    const importInput = document.getElementById('importCollFile');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported)) {
              if (confirm(`Tìm thấy ${imported.length} con dao trong file sao lưu. Bạn có muốn khôi phục vào Bộ Sưu Tập không?`)) {
                this.collection = imported;
                this.saveCollection();
                alert('Khôi phục Bộ Sưu Tập thành công!');
              }
            } else {
              alert('File sao lưu không đúng định dạng!');
            }
          } catch (err) {
            alert('Lỗi đọc file JSON: ' + err.message);
          }
          importInput.value = '';
        };
        reader.readAsText(file);
      });
    }

    // Clear All
    const clearBtn = document.getElementById('clearCollBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('CẢNH BÁO: Bạn có chắc muốn XÓA TOÀN BỘ dao trong Bộ Sưu Tập không? Hành động này không thể hoàn tác!')) {
          this.collection = [];
          this.saveCollection();
        }
      });
    }
  }

  renderCollection() {
    const totalKnives = this.collection.length;
    const distinctKnives = new Set(this.collection.map(c => c.knifeId)).size;
    const progressPercent = ((distinctKnives / 20) * 100).toFixed(0);

    const statTrakCount = this.collection.filter(c => c.isStatTrak).length;
    const totalVND = this.collection.reduce((sum, item) => {
      const num = parseInt((item.priceVND || '0').replace(/\./g, '').replace(/đ/g, '').trim()) || 0;
      return sum + num;
    }, 0);
    const totalUSD = this.collection.reduce((sum, item) => {
      const num = parseInt((item.priceUSD || '0').replace(/\$/g, '').replace(/,/g, '').trim()) || 0;
      return sum + num;
    }, 0);

    // Update Header Stats
    const distinctEl = document.getElementById('collDistinctCount');
    const progressBar = document.getElementById('collProgressBar');
    const totalKnivesEl = document.getElementById('collTotalKnives');
    const statTrakEl = document.getElementById('collStatTrakCount');
    const totalVNDEl = document.getElementById('collTotalValue');
    const totalUSDEl = document.getElementById('collTotalUSD');
    const countBadge = document.getElementById('ctrlCollCount');

    if (distinctEl) distinctEl.textContent = `${distinctKnives} / 20`;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    if (totalKnivesEl) totalKnivesEl.textContent = `${totalKnives} con`;
    if (statTrakEl) statTrakEl.textContent = `${statTrakCount} StatTrak™`;
    if (totalVNDEl) totalVNDEl.textContent = totalVND.toLocaleString('vi-VN') + ' ₫';
    if (totalUSDEl) totalUSDEl.textContent = `$${totalUSD.toLocaleString()}`;
    if (countBadge) countBadge.textContent = totalKnives;

    // Render 20 Knives Checklist
    this.renderKnivesChecklist();

    // Render Collection Items
    const container = document.getElementById('collectionItemsContainer');
    if (!container) return;

    if (this.collection.length === 0) {
      container.innerHTML = `
        <div class="empty-coll-state" style="text-align: center; padding: 50px 20px; color: #94a3b8;">
          <div style="font-size: 48px; margin-bottom: 12px;">🗡️</div>
          <h3 style="color: #fff; font-family: var(--font-heading); margin-bottom: 6px;">BỘ SƯU TẬP ĐANG TRỐNG</h3>
          <p style="font-size: 14px; max-width: 450px; margin: 0 auto 20px;">
            Hãy quay dao hoặc bấm "Thêm Dao Đã Mở Vào BST" để bắt đầu ghi danh vào kho báu cá nhân của bạn!
          </p>
        </div>
      `;
      return;
    }

    if (this.collectionView === 'cards') {
      container.innerHTML = this.collection.map((item, index) => {
        const wear = this.getWearInfo(item.floatVal);
        return `
          <div class="coll-card ${item.isStatTrak ? 'is-stattrak' : ''}" data-id="${item.id}">
            <div class="cc-header">
              <span class="cc-tier tier-${(item.tier || 'a').toLowerCase().replace('+', '-plus')}">${item.tier}</span>
              ${item.isStatTrak ? '<span class="cc-stattrak-tag">★ StatTrak™</span>' : ''}
              <button class="cc-del-btn" data-index="${index}" title="Xóa dao này khỏi BST">✕</button>
            </div>
            <div class="cc-thumb-wrap">
              <img class="cc-thumb" src="${item.imageSrc}" alt="${item.fullName}" onerror="this.src='assets/Karambit/Vanilla.png'" />
            </div>
            <div class="cc-body">
              <div class="cc-knife-name">${item.knifeName}</div>
              <div class="cc-skin-name">${item.skinName}</div>
              
              <div class="cc-float-row">
                <span class="cc-wear-pill" style="color: ${wear.color}; border-color: ${wear.color};">${wear.tag}</span>
                <input type="number" class="cc-float-inline-input" data-id="${item.id}" step="0.0001" min="0" max="1" value="${item.floatVal}" title="Bấm để chỉnh sửa Float" />
              </div>

              <div class="cc-price-row">
                <span class="cc-price-vnd">${item.priceVND || '1.627.624 ₫'}</span>
                <span class="cc-date">${item.date || ''}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      // Table view
      container.innerHTML = `
        <table class="coll-table">
          <thead>
            <tr>
              <th>ẢNH</th>
              <th>LOẠI DAO & SKIN</th>
              <th>TIER</th>
              <th>STATTRAK</th>
              <th>FLOAT VALUE</th>
              <th>TÌNH TRẠNG</th>
              <th>GIÁ THỊ TRƯỜNG</th>
              <th>NGÀY MỞ</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            ${this.collection.map((item, index) => {
              const wear = this.getWearInfo(item.floatVal);
              return `
                <tr>
                  <td><img src="${item.imageSrc}" style="width: 50px; height: 36px; object-fit: contain;" /></td>
                  <td style="font-weight: 700; color: #fff;">${item.fullName}</td>
                  <td><span class="cc-tier tier-${(item.tier || 'a').toLowerCase().replace('+', '-plus')}">${item.tier}</span></td>
                  <td style="color: #fb923c; font-weight: 800;">${item.isStatTrak ? '★ StatTrak™' : '-'}</td>
                  <td>
                    <input type="number" class="cc-float-inline-input" data-id="${item.id}" step="0.0001" min="0" max="1" value="${item.floatVal}" />
                  </td>
                  <td style="color: ${wear.color}; font-weight: 700;">${wear.name} (${wear.tag})</td>
                  <td style="color: #ffd700; font-family: var(--font-mono); font-weight: 700;">${item.priceVND}</td>
                  <td style="color: #94a3b8; font-size: 12px;">${item.date || ''}</td>
                  <td>
                    <button class="cs-btn cs-btn-sm cs-btn-dark cc-del-btn" data-index="${index}">🗑️ Xóa</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    // Bind inline float inputs
    container.querySelectorAll('.cc-float-inline-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        const newFloat = parseFloat(e.target.value);
        if (isNaN(newFloat) || newFloat < 0 || newFloat > 1) {
          alert('Float value phải từ 0.0000 đến 1.0000');
          return;
        }
        const item = this.collection.find(c => c.id === id);
        if (item) {
          item.floatVal = newFloat.toFixed(4);
          this.saveCollection();
        }
      });
    });

    // Bind delete buttons
    container.querySelectorAll('.cc-del-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const item = this.collection[index];
        if (!item) return;

        if (confirm(`Xác nhận xóa dao [${item.fullName}] khỏi Bộ Sưu Tập?`)) {
          this.collection.splice(index, 1);
          this.saveCollection();
        }
      });
    });
  }

  renderKnivesChecklist() {
    const grid = document.getElementById('knivesChecklistGrid');
    if (!grid) return;

    const ownedKnifeIds = new Set(this.collection.map(c => c.knifeId));

    grid.innerHTML = this.knives.map(knife => {
      const isOwned = ownedKnifeIds.has(knife.id);
      const vanillaImg = knife.vanillaImage || `assets/${knife.folder}/Vanilla.png`;

      return `
        <div class="kcc-item ${isOwned ? 'owned' : 'unowned'}" title="${knife.name}: ${isOwned ? 'ĐÃ SỞ HỮU ✔' : 'Chưa sở hữu'}">
          <img class="kcc-thumb" src="${vanillaImg}" alt="${knife.name}" onerror="this.src='assets/Karambit/Vanilla.png'" />
          <div class="kcc-name">${knife.name}</div>
          <div class="kcc-status">${isOwned ? '✔ ĐÃ CÓ' : '🔒 KHÓA'}</div>
        </div>
      `;
    }).join('');
  }

  // =========================================================================
  // 7. MANUAL ADD MODAL
  // =========================================================================

  bindManualAddModal() {
    const modal = document.getElementById('manualAddModal');
    const openBtn = document.getElementById('openManualAddBtn');
    const closeBtn = document.getElementById('closeManualAddBtn');
    const form = document.getElementById('manualAddForm');
    const knifeSelect = document.getElementById('manualKnifeSelect');
    const skinSelect = document.getElementById('manualSkinSelect');

    if (!modal || !form || !knifeSelect || !skinSelect) return;

    // Populate knife options
    knifeSelect.innerHTML = this.knives.map(k => `
      <option value="${k.id}">${k.name} (${k.vnName || ''})</option>
    `).join('');

    const populateSkins = (knifeId) => {
      const knife = this.knives.find(k => k.id === knifeId);
      if (knife && Array.isArray(knife.skins) && knife.skins.length > 0) {
        skinSelect.innerHTML = knife.skins.map(s => `
          <option value="${s.name}" data-img="${s.imageSrc}" data-tier="${s.tier}" data-vnd="${s.priceVND}" data-usd="${s.priceUSD}">
            ${s.name} (${s.tier}) - ${s.priceVND || ''}
          </option>
        `).join('');
      } else {
        skinSelect.innerHTML = `
          <option value="Vanilla">Vanilla (Nguyên bản)</option>
          <option value="Doppler">Doppler</option>
          <option value="Fade">Fade</option>
          <option value="Tiger Tooth">Tiger Tooth</option>
          <option value="Marble Fade">Marble Fade</option>
        `;
      }
    };

    knifeSelect.addEventListener('change', () => {
      populateSkins(knifeSelect.value);
    });

    populateSkins(knifeSelect.value);

    // Open/Close
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('active');
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    modal.querySelector('.manual-add-backdrop')?.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Form submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const knifeId = knifeSelect.value;
      const knife = this.knives.find(k => k.id === knifeId);
      const selectedOption = skinSelect.selectedOptions[0];
      const skinName = selectedOption ? selectedOption.value : skinSelect.value;

      const floatVal = parseFloat(document.getElementById('manualFloatInput')?.value || '0.0150');
      const isStatTrak = !!document.getElementById('manualStatTrakChk')?.checked;
      const notes = document.getElementById('manualNotesInput')?.value || '';

      const tier = selectedOption?.dataset.tier || 'A';
      const priceVND = selectedOption?.dataset.vnd || '5.500.000 ₫';
      const priceUSD = selectedOption?.dataset.usd || '$220';
      const imageSrc = selectedOption?.dataset.img || knife?.vanillaImage || `assets/${knife?.folder}/Vanilla.png`;

      const wear = this.getWearInfo(floatVal);
      const newItem = {
        id: 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        knifeId: knifeId,
        knifeName: knife?.name || 'Knife',
        skinName: skinName,
        fullName: `${isStatTrak ? '★ StatTrak™ ' : '★ '}${knife?.name || 'Knife'} | ${skinName}`,
        tier: tier,
        imageSrc: imageSrc,
        floatVal: floatVal.toFixed(4),
        wearTag: wear.tag,
        wearName: wear.name,
        isStatTrak: isStatTrak,
        priceVND: priceVND,
        priceUSD: priceUSD,
        notes: notes,
        date: new Date().toLocaleDateString('vi-VN')
      };

      this.collection.unshift(newItem);
      this.saveCollection();

      modal.classList.remove('active');
      form.reset();
      populateSkins(knifeSelect.value);
      alert(`Đã thêm thành công [${newItem.fullName}] vào Bộ Sưu Tập!`);
    });
  }
}

// Bootstrap on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  window.controlDeck = new CS2ControlDeck();
});
