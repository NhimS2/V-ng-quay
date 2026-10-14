/**
 * CS2 Knife Spinner Deluxe - Multi-Stage Spin & Knife Collection Tracker
 * Built for CS2 Case Opening Video Series
 */

// Fallback knife catalog for offline / file:// protocol
const FALLBACK_KNIVES = [
  { id: "butterfly", folder: "Butterfly", name: "Butterfly Knife", vnName: "Dao Butterfly", tier: "S+", accent: "#00ff88", weight: 3, skinsCount: 25, vanillaImage: "assets/Butterfly/Vanilla.png" },
  { id: "karambit", folder: "Karambit", name: "Karambit", vnName: "Dao Karambit", tier: "S+", accent: "#ff2a85", weight: 4, skinsCount: 25, vanillaImage: "assets/Karambit/Vanilla.png" },
  { id: "m9_bayonet", folder: "M9 Bayonet", name: "M9 Bayonet", vnName: "Dao M9 Bayonet", tier: "S+", accent: "#ffc83b", weight: 5, skinsCount: 25, vanillaImage: "assets/M9 Bayonet/Vanilla.png" },
  { id: "skeleton", folder: "Skeleton", name: "Skeleton Knife", vnName: "Dao Skeleton", tier: "S", accent: "#d946ef", weight: 6, skinsCount: 19, vanillaImage: "assets/Skeleton/Vanilla.png" },
  { id: "talon", folder: "Talon", name: "Talon Knife", vnName: "Dao Talon", tier: "S", accent: "#00f0ff", weight: 7, skinsCount: 19, vanillaImage: "assets/Talon/Vanilla.png" },
  { id: "kukri", folder: "Kukri", name: "Kukri Knife", vnName: "Dao Kukri", tier: "A", accent: "#f59e0b", weight: 10, skinsCount: 13, vanillaImage: "assets/Kukri/Vanilla.png" },
  { id: "stiletto", folder: "Stiletto", name: "Stiletto Knife", vnName: "Dao Stiletto", tier: "A", accent: "#06b6d4", weight: 10, skinsCount: 19, vanillaImage: "assets/Stiletto/Vanilla.png" },
  { id: "nomad", folder: "Nomad", name: "Nomad Knife", vnName: "Dao Nomad", tier: "A", accent: "#ec4899", weight: 10, skinsCount: 19, vanillaImage: "assets/Nomad/Vanilla.png" },
  { id: "ursus", folder: "Ursus", name: "Ursus Knife", vnName: "Dao Ursus", tier: "A", accent: "#3b82f6", weight: 10, skinsCount: 19, vanillaImage: "assets/Ursus/Vanilla.png" },
  { id: "bayonet", folder: "Bayonet", name: "Bayonet", vnName: "Dao Bayonet", tier: "A", accent: "#a855f7", weight: 12, skinsCount: 25, vanillaImage: "assets/Bayonet/Vanilla.png" },
  { id: "classic", folder: "Classic", name: "Classic Knife", vnName: "Dao Classic", tier: "B", accent: "#ef4444", weight: 15, skinsCount: 13, vanillaImage: "assets/Classic/Vanilla.png" },
  { id: "flip", folder: "Flip", name: "Flip Knife", vnName: "Dao Flip", tier: "B", accent: "#eab308", weight: 15, skinsCount: 25, vanillaImage: "assets/Flip/Vanilla.png" },
  { id: "paracord", folder: "Paracord", name: "Paracord Knife", vnName: "Dao Paracord", tier: "B", accent: "#dc2626", weight: 15, skinsCount: 19, vanillaImage: "assets/Paracord/Vanilla.png" },
  { id: "bowie", folder: "Bowie", name: "Bowie Knife", vnName: "Dao Bowie", tier: "B", accent: "#f43f5e", weight: 15, skinsCount: 25, vanillaImage: "assets/Bowie/Vanilla.png" },
  { id: "huntsman", folder: "Huntsman", name: "Huntsman Knife", vnName: "Dao Huntsman", tier: "B", accent: "#e11d48", weight: 15, skinsCount: 25, vanillaImage: "assets/Huntsman/Vanilla.png" },
  { id: "falchion", folder: "Falchion", name: "Falchion Knife", vnName: "Dao Falchion", tier: "B", accent: "#10b981", weight: 15, skinsCount: 25, vanillaImage: "assets/Falchion/Vanilla.png" },
  { id: "survival", folder: "Survival", name: "Survival Knife", vnName: "Dao Survival", tier: "C", accent: "#84cc16", weight: 22, skinsCount: 19, vanillaImage: "assets/Survival/Vanilla.png" },
  { id: "gut", folder: "Gut", name: "Gut Knife", vnName: "Dao Gut", tier: "C", accent: "#64748b", weight: 25, skinsCount: 25, vanillaImage: "assets/Gut/Vanilla.png" },
  { id: "navaja", folder: "Navaja", name: "Navaja Knife", vnName: "Dao Navaja", tier: "C", accent: "#78716c", weight: 25, skinsCount: 19, vanillaImage: "assets/Navaja/Vanilla.png" },
  { id: "shadow_daggers", folder: "Shadow Daggers", name: "Shadow Daggers", vnName: "Dao Shadow Daggers", tier: "C", accent: "#6b7280", weight: 25, skinsCount: 25, vanillaImage: "assets/Shadow Daggers/Vanilla.png" }
];

// =========================================================================
// VÒNG 3: MẪU THỬ THÁCH SỐ LƯỢNG HÒM (TỪ 5 - 20 HÒM)
// =========================================================================

// Mẫu thử thách Chế Độ Video (YouTube / TikTok - Dải số lượng từ 5 - 20 hòm + Ô Hiệu Ứng)
const VIDEO_QTY_TEMPLATES = [
  { id: "v5", count: 5, name: "5 Hòm", tag: "KHỞI ĐỘNG", tier: "A", accent: "#ef4444", desc: "5 Hòm - Căng thẳng từng phát mở, nhịp điệu hồi hộp" },
  { id: "v7", count: 7, name: "7 Hòm", tag: "CÂN NÃO", tier: "A", accent: "#f97316", desc: "7 Hòm - Thời lượng lý tưởng cho 1 tập video ngắn" },
  { id: "v8", count: 8, name: "8 Hòm", tag: "THỬ THÁCH", tier: "B", accent: "#f59e0b", desc: "8 Hòm - Nhịp điệu dồn dập, thử tài may mắn" },
  { id: "v10", count: 10, name: "10 Hòm", tag: "TIÊU CHUẨN", tier: "B", accent: "#eab308", desc: "10 Hòm - Mốc chuẩn mực, nhiều cơ hội nổ dao vàng" },
  { id: "v12", count: 12, name: "12 Hòm", tag: "HẤP DẪN", tier: "B", accent: "#84cc16", desc: "12 Hòm - Thử thách sức chịu đựng tới phút chót" },
  { id: "v15", count: 15, name: "15 Hòm", tag: "TẬP DÀI", tier: "A", accent: "#10b981", desc: "15 Hòm - Tập dài kịch tính, cơ hội nổ dao cực cao" },
  { id: "v18", count: 18, name: "18 Hòm", tag: "ĐẠI CHIẾN", tier: "S", accent: "#06b6d4", desc: "18 Hòm - Đại chiến mở hòm nặn dao căng thẳng" },
  { id: "v20", count: 20, name: "20 Hòm (MAX)", tag: "KHÔ MÁU", tier: "S+", accent: "#3b82f6", desc: "20 Hòm - Kịch khung tối đa, khô máu tới cùng!" },
  { id: "vx2", isModifier: true, modifierType: "multiply", modifierValue: 2, name: "x2", fullName: "Ô Nhân Đôi (x2)", tag: "NHÂN ĐÔI", tier: "S+", accent: "#8b5cf6", desc: "Trúng ô Nhân Đôi (x2)! Quay tiếp để nhân đôi số hòm!" },
  { id: "vins3", isModifier: true, modifierType: "add", modifierValue: 3, name: "+3 Bảo Hiểm", fullName: "Ô Bảo Hiểm (+3 Hòm)", tag: "BẢO HIỂM", tier: "A", accent: "#d946ef", desc: "Trúng ô Bảo Hiểm (+3)! Quay tiếp để cộng thêm 3 hòm!" },
  { id: "vins5", isModifier: true, modifierType: "add", modifierValue: 5, name: "+5 Bảo Hiểm", fullName: "Ô Bảo Hiểm (+5 Hòm)", tag: "BẢO HIỂM", tier: "S", accent: "#ec4899", desc: "Trúng ô Bảo Hiểm (+5)! Quay tiếp để cộng thêm 5 hòm!" }
];

// Mẫu thử thách Chế Độ Stream (Dành cho livestream - 5 - 20 hòm + Ô Hiệu Ứng)
const STREAM_QTY_TEMPLATES = [
  { id: "s5", count: 5, name: "5 Hòm", tag: "KHỞI ĐỘNG", tier: "A", accent: "#ef4444", desc: "5 Hòm - Cực căng! Liệu có phép màu?" },
  { id: "s8", count: 8, name: "8 Hòm", tag: "THỬ THÁCH", tier: "A", accent: "#f97316", desc: "8 Hòm mở nhanh kịch tính" },
  { id: "s10", count: 10, name: "10 Hòm", tag: "TIÊU CHUẨN", tier: "B", accent: "#f59e0b", desc: "10 Hòm cân não, áp lực vừa phải" },
  { id: "s12", count: 12, name: "12 Hòm", tag: "HẤP DẪN", tier: "B", accent: "#84cc16", desc: "12 Hòm mở đều tay, cơ hội trúng dao" },
  { id: "s15", count: 15, name: "15 Hòm", tag: "TẬP DÀI", tier: "A", accent: "#10b981", desc: "15 Hòm chuẩn mực streamer" },
  { id: "s18", count: 18, name: "18 Hòm", tag: "ĐẠI CHIẾN", tier: "S", accent: "#06b6d4", desc: "18 Hòm tự tin ra dao vàng" },
  { id: "s20", count: 20, name: "20 Hòm (MAX)", tag: "KHÔ MÁU", tier: "S+", accent: "#3b82f6", desc: "20 Hòm - Mức kịch khung, khô máu cùng khán giả" },
  { id: "sx2", isModifier: true, modifierType: "multiply", modifierValue: 2, name: "x2", fullName: "Ô Nhân Đôi (x2)", tag: "NHÂN ĐÔI", tier: "S+", accent: "#8b5cf6", desc: "Kèo x2 nhân đôi số hòm! Quay tiếp để xác định số hòm!" },
  { id: "sins3", isModifier: true, modifierType: "add", modifierValue: 3, name: "+3 Bảo Hiểm", fullName: "Ô Bảo Hiểm (+3 Hòm)", tag: "BẢO HIỂM", tier: "A", accent: "#d946ef", desc: "Bảo hiểm +3 hòm! Quay tiếp để cộng dồn!" },
  { id: "sins5", isModifier: true, modifierType: "add", modifierValue: 5, name: "+5 Bảo Hiểm", fullName: "Ô Bảo Hiểm (+5 Hòm)", tag: "BẢO HIỂM", tier: "S", accent: "#ec4899", desc: "Bảo hiểm +5 hòm! Quay tiếp để cộng dồn!" }
];

class CS2App {
  constructor() {
    this.knives = (window.CS2_KNIVES_DATA && Array.isArray(window.CS2_KNIVES_DATA) && window.CS2_KNIVES_DATA.length > 0)
      ? window.CS2_KNIVES_DATA
      : [...FALLBACK_KNIVES];
    this.enabledKnifeIds = new Set(this.knives.map(k => k.id));
    this.engine = null;
    
    // Broadcast mode setting: 'video' (default) or 'stream'
    this.broadcastMode = localStorage.getItem('cs2_broadcast_mode') || 'video';

    // 3-Stage "Săn Mục Tiêu" state
    this.currentStage = 1; // 1: Pick Knife Type, 2: Pick Skin, 3: Pick Case Quantity
    this.selectedKnife = null;
    this.selectedSkin = null;
    this.selectedQuantity = null;
    this.openedCases = 0;
    this.targetCases = 0;
    this.isHuntActive = false;
    this.lastWonSkin = null;
    this.lastWinnerStage1 = null;
    this.lastWinnerStage2 = null;
    this.lastWinnerStage3 = null;

    // Collection inventory state
    this.collection = this.loadCollection();
    this.collectionView = 'cards'; // 'cards' or 'table'

    // Stage 3 Modifiers Accumulator state
    this.stage3Modifiers = [];
    this.stage3IsShowingModifier = false;
    this.stage3AutoContinueTimer = null;

    // Session stats
    this.stats = {
      unboxedCount: 0,
      totalVND: 0,
      topKnife: null
    };

    this.init();
  }

  async init() {
    // Check if window.CS2_KNIVES_DATA loaded
    if (window.CS2_KNIVES_DATA && Array.isArray(window.CS2_KNIVES_DATA) && window.CS2_KNIVES_DATA.length > 0) {
      this.knives = window.CS2_KNIVES_DATA;
      this.enabledKnifeIds = new Set(this.knives.map(k => k.id));
    } else {
      try {
        const res = await fetch('assets/knives_data.json');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            this.knives = data;
            this.enabledKnifeIds = new Set(this.knives.map(k => k.id));
          }
        }
      } catch (e) {
        console.log('Using default fallback knives list:', e);
      }
    }

    // Initialize spinner engine with Stage 1 (Knife Types displaying Vanilla)
    this.engine = new window.CS2SpinnerEngine(this.getActiveKnivesList());
    
    this.bindEvents();
    this.renderKnivesManager();
    this.renderMainKnivesGrid();
    this.renderCollection();
    this.updateStatsUI();
    this.updateBadges();

    // Sync broadcast mode UI state
    this.setBroadcastMode(this.broadcastMode, false);

    // Check saved enabled knives from localStorage
    const savedEnabled = localStorage.getItem('cs2_enabled_knives');
    if (savedEnabled) {
      try {
        const parsed = JSON.parse(savedEnabled);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.enabledKnifeIds = new Set(parsed);
          this.updateBadges();
          this.renderKnivesManager();
          this.renderMainKnivesGrid();
        }
      } catch (e) {}
    }

    // Restore Spinner Mode (roller vs wheel)
    const savedSpinnerMode = localStorage.getItem('cs2_spinner_mode');
    if (savedSpinnerMode && (savedSpinnerMode === 'roller' || savedSpinnerMode === 'wheel')) {
      this.engine.setMode(savedSpinnerMode);
      const rollerEl = document.getElementById('rollerContainer');
      const wheelEl = document.getElementById('wheelContainer');
      if (rollerEl) rollerEl.style.display = savedSpinnerMode === 'roller' ? 'block' : 'none';
      if (wheelEl) wheelEl.style.display = savedSpinnerMode === 'wheel' ? 'flex' : 'none';
      document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === savedSpinnerMode);
      });
    }

    // Restore Suspense Level
    const savedSuspense = localStorage.getItem('cs2_suspense_level') || 'high';
    this.engine.setSuspenseLevel(savedSuspense);
    const suspRadio = document.querySelector(`input[name="suspenseRadio"][value="${savedSuspense}"]`);
    if (suspRadio) suspRadio.checked = true;
    const suspLabels = { 'ultra': '🔥 Cực Hồi Hộp', 'high': '⚡ Chuẩn CS2', 'normal': '⏱️ Mở Siêu Tốc' };
    const quickSuspEl = document.getElementById('quickSuspenseLabel');
    if (quickSuspEl) quickSuspEl.textContent = suspLabels[savedSuspense] || savedSuspense;

    // Restore Odds Mode
    const savedOdds = localStorage.getItem('cs2_odds_mode') || 'equal';
    this.engine.setOddsMode(savedOdds);
    const oddsRadio = document.querySelector(`input[name="oddsRadio"][value="${savedOdds}"]`);
    if (oddsRadio) oddsRadio.checked = true;
    const oddsLabels = { 'realistic': '🎲 Chuẩn CS2', 'equal': '⚖️ Đồng Đều' };
    const quickOddsEl = document.getElementById('quickOddsLabel');
    if (quickOddsEl) quickOddsEl.textContent = oddsLabels[savedOdds] || savedOdds;

    // Restore Audio Settings UI
    const volSlider = document.getElementById('modalVolumeSlider');
    const volPercent = document.getElementById('volPercent');
    const modalMuteBtn = document.getElementById('modalMuteBtn');
    if (volSlider && window.cs2Sound) {
      volSlider.value = window.cs2Sound.masterVolume ?? 0.8;
      if (volPercent) volPercent.textContent = `${Math.round(volSlider.value * 100)}%`;
    }
    if (modalMuteBtn && window.cs2Sound) {
      const isMuted = window.cs2Sound.isMuted;
      modalMuteBtn.innerHTML = isMuted ? '<i class="icon">🔇</i> Âm Thanh: ĐANG TẮT' : '<i class="icon">🔊</i> Âm Thanh: ĐANG BẬT';
      modalMuteBtn.className = isMuted ? 'cs-btn cs-btn-dark' : 'cs-btn cs-btn-gold';
    }

    // Initialize Streamer Control Deck sync channel
    this.initSyncChannel();

    // Prepare initial roller view for Stage 1
    this.setStage(1);
  }

  /* =========================================================================
   * STREAMER CONTROL DECK REAL-TIME SYNCHRONIZATION
   * ========================================================================= */
  initSyncChannel() {
    try {
      this.syncChannel = new BroadcastChannel('cs2_sync_channel');
      this.syncChannel.onmessage = (event) => {
        const msg = event.data;
        if (!msg || !msg.type) return;
        this.handleSyncCommand(msg);
      };
      // Broadcast initial state
      setTimeout(() => this.sendSyncState(), 300);
    } catch (e) {
      console.warn('BroadcastChannel error in app.js:', e);
    }
  }

  sendSyncState() {
    if (!this.syncChannel) return;
    try {
      const todayMissionSection = document.getElementById('todayMissionSection');
      const isFinale = todayMissionSection ? todayMissionSection.style.display === 'block' : false;
      const modal = document.getElementById('spinSpotlightModal');
      const revealArea = document.getElementById('winnerRevealCardArea');
      const revealActive = modal && modal.style.display !== 'none' && revealArea && revealArea.style.display === 'block';

      const payload = {
        currentStage: this.currentStage,
        isSpinning: !!this.engine?.isSpinning,
        isFinale: isFinale,
        revealActive: !!revealActive,
        broadcastMode: this.broadcastMode || 'video',
        spinnerMode: this.engine?.mode || 'roller',
        suspenseLevel: this.engine?.suspenseLevel || 'high',
        oddsMode: this.engine?.oddsMode || 'equal',
        volume: window.cs2Sound?.masterVolume ?? 0.8,
        isMuted: !!window.cs2Sound?.isMuted,
        enabledKnifeIds: Array.from(this.enabledKnifeIds || []),
        selectedKnife: this.selectedKnife ? {
          id: this.selectedKnife.id,
          name: this.selectedKnife.name,
          vnName: this.selectedKnife.vnName,
          tier: this.selectedKnife.tier,
          image: this.selectedKnife.vanillaImage || `assets/${this.selectedKnife.folder}/Vanilla.png`
        } : null,
        selectedSkin: this.selectedSkin ? {
          name: this.selectedSkin.name,
          category: this.selectedSkin.category,
          tier: this.selectedSkin.tier,
          image: this.selectedSkin.imageSrc
        } : null,
        selectedQuantity: this.selectedQuantity ? {
          name: this.selectedQuantity.name,
          count: this.selectedQuantity.count,
          caseName: this.selectedQuantity.caseName,
          caseImage: this.selectedQuantity.imageSrc
        } : null,
        openedCases: this.openedCases || 0,
        collectionCount: this.collection?.length || 0
      };

      this.syncChannel.postMessage({
        type: 'STATE_UPDATE',
        payload: payload
      });
    } catch (e) {
      console.warn('Failed to send state update:', e);
    }
  }

  handleSyncCommand(msg) {
    switch (msg.type) {
      case 'REQUEST_STATE':
        this.sendSyncState();
        break;

      case 'START_SPIN':
        if (this.engine?.isSpinning) return;
        this.startSpotlightSpin(msg.stage || this.currentStage || 1);
        break;

      case 'CONTINUE_REVEAL':
        this.handleRevealContinue();
        break;

      case 'RESET_HUNT':
        this.resetHuntFlow();
        break;

      case 'SET_BROADCAST_MODE':
        if (msg.mode && msg.mode !== this.broadcastMode) {
          this.setBroadcastMode(msg.mode);
        }
        break;

      case 'SET_SPINNER_MODE':
        if (msg.mode && !this.engine?.isSpinning) {
          const mode = msg.mode;
          const rollerEl = document.getElementById('rollerContainer');
          const wheelEl = document.getElementById('wheelContainer');
          if (rollerEl) rollerEl.style.display = mode === 'roller' ? 'block' : 'none';
          if (wheelEl) wheelEl.style.display = mode === 'wheel' ? 'flex' : 'none';
          document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
          });
          this.engine.setMode(mode);
          localStorage.setItem('cs2_spinner_mode', mode);
          this.sendSyncState();
        }
        break;

      case 'SET_ENABLED_KNIVES':
        if (Array.isArray(msg.enabledIds) && msg.enabledIds.length > 0) {
          this.enabledKnifeIds = new Set(msg.enabledIds);
          this.onKnivesSelectionChanged();
        }
        break;

      case 'SET_SUSPENSE':
        if (msg.level && this.engine) {
          this.engine.setSuspenseLevel(msg.level);
          const radio = document.querySelector(`input[name="suspenseRadio"][value="${msg.level}"]`);
          if (radio) radio.checked = true;
          this.sendSyncState();
        }
        break;

      case 'SET_ODDS':
        if (msg.mode && this.engine) {
          this.engine.setOddsMode(msg.mode);
          const radio = document.querySelector(`input[name="oddsRadio"][value="${msg.mode}"]`);
          if (radio) radio.checked = true;
          this.sendSyncState();
        }
        break;

      case 'SET_AUDIO':
        if (window.cs2Sound) {
          if (typeof msg.volume === 'number') {
            window.cs2Sound.setVolume(msg.volume);
          }
          if (typeof msg.isMuted === 'boolean' && window.cs2Sound.isMuted !== msg.isMuted) {
            window.cs2Sound.toggleMute();
          }
          this.sendSyncState();
        }
        break;

      case 'COLLECTION_UPDATED':
        this.collection = this.loadCollection();
        this.renderCollection();
        this.updateBadges();
        this.sendSyncState();
        break;
    }
  }

  /* =========================================================================
   * BROADCAST MODE MANAGEMENT (VIDEO SERIES VS LIVESTREAM)
   * ========================================================================= */
  getValidCasesForSelection(knife = this.selectedKnife, skin = this.selectedSkin) {
    if (!knife) return [];
    let rawCases = [];

    // If specific skin with cases
    if (skin && Array.isArray(skin.cases) && skin.cases.length > 0 && !skin.isSpecial) {
      rawCases = skin.cases;
    } else if (knife && Array.isArray(knife.skins)) {
      // For vanilla or special slots (Ra Gì Lấy Đó / Do Khán Giả Bình Luận),
      // or if skin has no cases, collect all unique cases of this knife!
      const caseMap = new Map();
      knife.skins.forEach(s => {
        (s.cases || []).forEach(c => {
          const key = c.name || c.id || c.file;
          if (key && !caseMap.has(key)) {
            caseMap.set(key, c);
          }
        });
      });
      rawCases = Array.from(caseMap.values());
    }

    if (rawCases.length === 0) {
      rawCases = [{ name: 'Fracture Case', file: 'Fracture.png', imageSrc: 'assets/Case/Fracture.png' }];
    }

    return rawCases.map(c => {
      const fileName = c.file || (c.name.endsWith('.png') ? c.name : `${c.name}.png`);
      return {
        id: c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        name: c.name,
        shortName: c.name.replace(/ Weapon Case$/i, '').replace(/ Case$/i, ''),
        file: fileName,
        imageSrc: c.imageSrc || `assets/Case/${fileName}`
      };
    });
  }

  getCaseQuantityItems(knife = this.selectedKnife, skin = this.selectedSkin) {
    const isVideo = this.broadcastMode === 'video';
    const templates = isVideo ? VIDEO_QTY_TEMPLATES : STREAM_QTY_TEMPLATES;
    const validCases = this.getValidCasesForSelection(knife, skin);

    const safeCases = validCases.length > 0 ? validCases : [
      { id: 'fracture', name: 'Fracture Case', shortName: 'Fracture', file: 'Fracture.png', imageSrc: 'assets/Case/Fracture.png' }
    ];

    const createItem = (c, tmpl, keySuffix) => {
      const isMod = !!tmpl.isModifier;
      return {
        id: `${c.id}_${tmpl.id}_${keySuffix}`,
        name: tmpl.name,
        fullName: isMod ? (tmpl.fullName || tmpl.name) : `${tmpl.name} (${c.name})`,
        casesCount: tmpl.count || 0,
        tag: tmpl.tag,
        tier: tmpl.tier,
        accent: tmpl.accent,
        imageSrc: c.imageSrc,
        caseName: c.name,
        caseShortName: c.shortName,
        subtitle: isMod ? (tmpl.desc || 'Ô Hiệu Ứng') : `Hòm ${c.name}`,
        desc: tmpl.desc,
        isModifier: isMod,
        modifierType: tmpl.modifierType || null,
        modifierValue: tmpl.modifierValue || 0
      };
    };

    const items = [];

    if (safeCases.length === 1) {
      const c = safeCases[0];
      templates.forEach((tmpl, idx) => {
        items.push(createItem(c, tmpl, idx));
      });
    } else if (safeCases.length === 2) {
      templates.forEach((tmpl, idx) => {
        if (tmpl.isModifier) {
          const c = safeCases[idx % safeCases.length];
          items.push(createItem(c, tmpl, idx));
        } else {
          safeCases.forEach((c, cIdx) => {
            items.push(createItem(c, tmpl, `${idx}_${cIdx}`));
          });
        }
      });
    } else {
      templates.forEach((tmpl, idx) => {
        const c = safeCases[idx % safeCases.length];
        items.push(createItem(c, tmpl, idx));
      });

      safeCases.forEach(c => {
        const hasCard = items.some(it => it.caseName === c.name && !it.isModifier);
        if (!hasCard) {
          items.push({
            id: `${c.id}_featured_5`,
            name: isVideo ? "5 Hòm" : "15 Hòm",
            fullName: `${isVideo ? "5 Hòm" : "15 Hòm"} (${c.name})`,
            casesCount: isVideo ? 5 : 15,
            tag: "CHUẨN VIDEO",
            tier: "A",
            accent: "#f97316",
            imageSrc: c.imageSrc,
            caseName: c.name,
            caseShortName: c.shortName,
            subtitle: `Hòm ${c.name}`,
            desc: `Mở ${c.name}`,
            isModifier: false,
            modifierType: null,
            modifierValue: 0
          });
        }
      });
    }

    return items;
  }

  setBroadcastMode(mode, save = true) {
    if (mode !== 'video' && mode !== 'stream') mode = 'video';
    this.broadcastMode = mode;
    if (save) {
      try {
        localStorage.setItem('cs2_broadcast_mode', mode);
      } catch (e) {}
    }

    const isVideo = mode === 'video';

    // 1. Header toggle button
    const toggleBtn = document.getElementById('broadcastModeToggleBtn');
    const pillText = document.getElementById('broadcastPillText');
    if (toggleBtn) {
      toggleBtn.className = `live-pill ${isVideo ? 'mode-video' : 'mode-stream'}`;
    }
    if (pillText) {
      pillText.textContent = isVideo ? '🎬 VIDEO READY' : '🔴 LIVE STREAM';
    }

    // 2. Stats bar Quick Tag
    const quickLabel = document.getElementById('quickBroadcastLabel');
    if (quickLabel) {
      quickLabel.textContent = isVideo ? '🎬 Video Series' : '🔴 Livestream';
    }

    // 3. Settings Modal Radio
    const radio = document.querySelector(`input[name="broadcastRadio"][value="${mode}"]`);
    if (radio) {
      radio.checked = true;
    }

    // 4. Hunt Dashboard Badge
    const hdhBadgeText = document.getElementById('hdhBadgeText');
    if (hdhBadgeText) {
      hdhBadgeText.textContent = isVideo
        ? 'DAILY GOALS'
        : ' DAILY GOALS';
    }
    // 5. Hunt Summary Banner Label
    const hsbLabelText = document.getElementById('hsbLabelText');
    if (hsbLabelText) {
      hsbLabelText.textContent = isVideo
        ? 'MỤC TIÊU TẬP VIDEO NÀY:'
        : 'MỤC TIÊU STREAM HIỆN TẠI:';
    }

    // 6. Mission Tracker Badges & Captions
    const hmtBadgeText = document.getElementById('hmtBadgeText');
    if (hmtBadgeText) {
      hmtBadgeText.textContent = isVideo
        ? '🎬 NHIỆM VỤ SĂN TRONG TẬP VIDEO'
        : '🔴 NHIỆM VỤ SĂN TRÊN LIVESTREAM';
    }

    const hmtTargetSubText = document.getElementById('hmtTargetSubText');
    if (hmtTargetSubText) {
      hmtTargetSubText.textContent = isVideo
        ? 'VŨ KHÍ MỤC TIÊU CỦA TẬP VIDEO HÔM NAY:'
        : 'VŨ KHÍ MỤC TIÊU CỦA BUỔI STREAM HÔM NAY:';
    }

    const hmtCountCaption = document.getElementById('hmtCountCaption');
    if (hmtCountCaption) {
      hmtCountCaption.textContent = isVideo
        ? 'SỐ HÒM ĐÃ MỞ TRONG TẬP NÀY'
        : 'SỐ HÒM ĐÃ MỞ TRÊN STREAM';
    }

    // 7. Update engine items if currently on Stage 3 or Stage 2
    if (this.currentStage === 3 && this.engine && !this.engine.isSpinning) {
      this.engine.setItems(this.getCaseQuantityItems(), 3);
    } else if (this.currentStage === 2 && this.selectedKnife && this.engine && !this.engine.isSpinning) {
      this.engine.setItems(this.getSkinsForSelectedKnife(this.selectedKnife), 2);
    }
    this.sendSyncState();
  }

  toggleBroadcastMode() {
    const nextMode = this.broadcastMode === 'video' ? 'stream' : 'video';
    this.setBroadcastMode(nextMode);
    window.cs2Sound.playButtonClick();
  }

  /* =========================================================================
   * 3-STAGE "SĂN MỤC TIÊU" SPIN FLOW (THE LOADOUT SETUP)
   * Vòng 1: Chọn Loại Dao (Knife Type Wheel)
   * Vòng 2: Chọn Skin / Họa Tiết (Skin / Finish Wheel + Special Slots)
   * Vòng 3: Số Lượng Hòm Cần Mở (Case Quantity Wheel)
   * ========================================================================= */
  getSkinsForSelectedKnife(knife) {
    if (!knife) return [];
    const rawSkins = (knife.skins && knife.skins.length > 0)
      ? [...knife.skins]
      : [{
          id: `${knife.id}_vanilla`,
          name: 'Vanilla',
          fullName: `${knife.name} | Vanilla`,
          imageSrc: knife.vanillaImage,
          tier: knife.tier || 'A',
          priceVND: '10.000.000 đ',
          priceUSD: '$400',
          cases: []
        }];

    // Cases from first skin
    const caseList = (rawSkins[0] && rawSkins[0].cases) ? rawSkins[0].cases : [];

    // Special Slots: "Ra Gì Lấy Đó" & "Do Khán Giả Bình Luận" / "Do Chat Quyết Định"
    const specialFirst = {
      id: `${knife.id}_special_first`,
      name: 'Ra Gì Lấy Đó',
      fullName: `${knife.name} | Ra Gì Lấy Đó`,
      vnName: 'Bất kỳ loại nào ra trước lấy loại đó!',
      tier: 'S+',
      accent: '#00ff88',
      imageSrc: knife.vanillaImage,
      priceVND: 'Tùy Ý Ra Gì Lấy Đó',
      priceUSD: 'Special',
      cases: caseList,
      isSpecial: true
    };

    const isVideo = this.broadcastMode === 'video';
    const specialAudience = {
      id: `${knife.id}_special_audience`,
      name: isVideo ? 'Do Khán Giả Bình Luận' : 'Do Chat Quyết Định',
      fullName: `${knife.name} | ${isVideo ? 'Do Khán Giả Bình Luận' : 'Do Chat Quyết Định'}`,
      vnName: isVideo ? 'Khán giả comment vote chọn skin cho tập này!' : 'Khán giả chat live vote chọn skin!',
      tier: 'S+',
      accent: '#00ff88',
      imageSrc: knife.vanillaImage,
      priceVND: isVideo ? 'Khán Giả Comment' : 'Chat Vote',
      priceUSD: isVideo ? 'Audience Choice' : 'Chat Choice',
      cases: caseList,
      isSpecial: true
    };

    return [...rawSkins, specialFirst, specialAudience];
  }

  setStage(stage, data = null) {
    this.currentStage = stage;

    // Stepper indicators
    const step1El = document.getElementById('step1Indicator');
    const step2El = document.getElementById('step2Indicator');
    const step3El = document.getElementById('step3Indicator');
    const step1Desc = document.getElementById('step1Desc');
    const step2Desc = document.getElementById('step2Desc');
    const step3Desc = document.getElementById('step3Desc');
    const resetWrap = document.getElementById('stepResetWrap');

    // Dashboard Slot elements
    const slotKnife = document.getElementById('slotKnife');
    const slotKnifeStatus = document.getElementById('slotKnifeStatus');
    const slotKnifeMystery = document.getElementById('slotKnifeMystery');
    const slotKnifeImgWrap = document.getElementById('slotKnifeImgWrap');
    const slotKnifeImg = document.getElementById('slotKnifeImg');
    const slotKnifeTitle = document.getElementById('slotKnifeTitle');
    const slotKnifeSub = document.getElementById('slotKnifeSub');

    const slotSkin = document.getElementById('slotSkin');
    const slotSkinStatus = document.getElementById('slotSkinStatus');
    const slotSkinMystery = document.getElementById('slotSkinMystery');
    const slotSkinImgWrap = document.getElementById('slotSkinImgWrap');
    const slotSkinImg = document.getElementById('slotSkinImg');
    const slotSkinTitle = document.getElementById('slotSkinTitle');
    const slotSkinSub = document.getElementById('slotSkinSub');

    const slotQuantity = document.getElementById('slotQuantity');
    const slotQuantityStatus = document.getElementById('slotQuantityStatus');
    const slotQuantityMystery = document.getElementById('slotQuantityMystery');
    const slotQuantityImgWrap = document.getElementById('slotQuantityImgWrap');
    const slotQuantityImg = document.getElementById('slotQuantityImg');
    const slotQuantityTitle = document.getElementById('slotQuantityTitle');
    const slotQuantitySub = document.getElementById('slotQuantitySub');

    const huntStatusText = document.getElementById('huntStatusText');
    const huntSummaryText = document.getElementById('huntSummaryText');
    const spinBtnText = document.getElementById('spinBtnText');
    const spinBtnIcon = document.getElementById('spinBtnIcon');
    const wheelCenterText = document.getElementById('wheelCenterText');
    const huntMissionTracker = document.getElementById('huntMissionTracker');

    if (stage === 1) {
      // RESET ALL SLOTS & STATE
      this.selectedKnife = null;
      this.selectedSkin = null;
      this.selectedQuantity = null;
      this.isHuntActive = false;
      this.openedCases = 0;
      if (huntMissionTracker) huntMissionTracker.style.display = 'none';

      // Stepper
      if (step1El) { step1El.className = 'stage-step active'; if (step1Desc) step1Desc.textContent = '20 Loại Dao CS2 (Hiển thị con dao Vanilla)'; }
      if (step2El) { step2El.className = 'stage-step'; if (step2Desc) step2Desc.textContent = 'Chờ quay Vòng 1 để chọn dao...'; }
      if (step3El) { step3El.className = 'stage-step'; if (step3Desc) step3Desc.textContent = 'Chờ quay Vòng 2 để chốt skin...'; }
      if (resetWrap) resetWrap.style.display = 'none';

      // Slot 1: Active with glowing gold border
      if (slotKnife) slotKnife.className = 'hunt-slot active slot-golden-glow';
      if (slotKnifeStatus) { slotKnifeStatus.className = 'slot-status-pill active'; slotKnifeStatus.textContent = 'ĐANG CHỜ QUAY'; }
      if (slotKnifeMystery) slotKnifeMystery.style.display = 'block';
      if (slotKnifeImgWrap) slotKnifeImgWrap.style.display = 'none';
      if (slotKnifeTitle) slotKnifeTitle.textContent = 'Chưa Chọn Loại Dao';
      if (slotKnifeSub) slotKnifeSub.textContent = '20 Dòng Dao CS2';

      // Slot 2: Locked
      if (slotSkin) {
        slotSkin.className = 'hunt-slot locked';
        slotSkin.classList.remove('slot-golden-glow');
      }
      if (slotSkinStatus) { slotSkinStatus.className = 'slot-status-pill locked'; slotSkinStatus.textContent = 'KHÓA'; }
      if (slotSkinMystery) slotSkinMystery.style.display = 'block';
      if (slotSkinImgWrap) slotSkinImgWrap.style.display = 'none';
      if (slotSkinTitle) slotSkinTitle.textContent = 'Chưa Chọn Skin';
      if (slotSkinSub) slotSkinSub.textContent = 'Mở khóa sau Vòng 1';

      // Slot 3: Locked
      if (slotQuantity) {
        slotQuantity.className = 'hunt-slot locked';
        slotQuantity.classList.remove('slot-golden-glow');
      }
      if (slotQuantityStatus) { slotQuantityStatus.className = 'slot-status-pill locked'; slotQuantityStatus.textContent = 'KHÓA'; }
      if (slotQuantityMystery) slotQuantityMystery.style.display = 'block';
      if (slotQuantityImgWrap) slotQuantityImgWrap.style.display = 'none';
      if (slotQuantityTitle) slotQuantityTitle.textContent = 'Chưa Có Số Lượng';
      if (slotQuantitySub) slotQuantitySub.textContent = 'Mở khóa sau Vòng 2';

      // Reset Start Bar & Dashboard & Mission Section
      const huntDashboard = document.getElementById('huntDashboard');
      if (huntDashboard) {
        huntDashboard.style.display = 'block';
        huntDashboard.classList.remove('hunt-dashboard-disintegrate', 'slots-charging-shake');
      }
      const huntStartBar = document.getElementById('huntStartBar');
      const startBtnText = document.getElementById('startBtnText');
      if (huntStartBar) huntStartBar.style.display = 'flex';
      if (startBtnText) startBtnText.textContent = 'SĂN MỤC TIÊU';
      const todayMissionSection = document.getElementById('todayMissionSection');
      if (todayMissionSection) {
        todayMissionSection.style.display = 'none';
        todayMissionSection.classList.remove('tms-epic-entrance');
      }

      // Headers & Button
      const isVideo = this.broadcastMode === 'video';
      if (huntStatusText) {
        huntStatusText.textContent = isVideo
          ? 'Quay để chọn Loại Dao tâm điểm cho tập video hôm nay!'
          : 'Bấm "QUAY VÒNG 1" để chọn Loại Dao tâm điểm cho buổi stream hôm nay!';
      }
      if (huntSummaryText) {
        huntSummaryText.textContent = isVideo
          ? 'Đang thiết lập kịch bản tập video... Bấm "QUAY VÒNG 1" để bắt đầu!'
          : 'Đang thiết lập kịch bản buổi stream... Bấm "QUAY VÒNG 1" để bắt đầu!';
      }
      if (spinBtnText) spinBtnText.textContent = 'QUAY CHỌN LOẠI DAO (VÒNG 1/3)';
      if (spinBtnIcon) spinBtnIcon.textContent = '⚡';
      if (wheelCenterText) wheelCenterText.textContent = 'VÒNG 1';

      // Load active knife types into engine
      this.engine.setItems(this.getActiveKnivesList(), 1);

    } else if (stage === 2) {
      if (data) this.selectedKnife = data;
      const knife = this.selectedKnife;
      if (!knife) return;

      // Stepper
      if (step1El) { step1El.className = 'stage-step completed'; if (step1Desc) step1Desc.textContent = `✔ Đã chốt: ${knife.name}`; }
      if (step2El) { step2El.className = 'stage-step active'; if (step2Desc) step2Desc.textContent = `Quay skin cho ${knife.name} (+ Ô đặc biệt)`; }
      if (step3El) { step3El.className = 'stage-step'; if (step3Desc) step3Desc.textContent = 'Chờ quay Vòng 2 để chốt skin...'; }
      if (resetWrap) resetWrap.style.display = 'flex';

      // Slot 1: Completed
      if (slotKnife) {
        slotKnife.className = 'hunt-slot completed';
        slotKnife.classList.remove('slot-golden-glow');
      }
      if (slotKnifeStatus) { slotKnifeStatus.className = 'slot-status-pill completed'; slotKnifeStatus.textContent = '✔ ĐÃ KHÓA'; }
      if (slotKnifeMystery) slotKnifeMystery.style.display = 'none';
      if (slotKnifeImgWrap) slotKnifeImgWrap.style.display = 'flex';
      if (slotKnifeImg) { slotKnifeImg.src = knife.vanillaImage || knife.imageSrc; slotKnifeImg.alt = knife.name; }
      if (slotKnifeTitle) slotKnifeTitle.textContent = knife.name;
      if (slotKnifeSub) slotKnifeSub.textContent = knife.vnName || '★ Đã Khóa';

      // Slot 2: Active with golden glow
      if (slotSkin) slotSkin.className = 'hunt-slot active slot-golden-glow';
      if (slotSkinStatus) { slotSkinStatus.className = 'slot-status-pill active'; slotSkinStatus.textContent = 'ĐANG CHỜ QUAY'; }
      if (slotSkinMystery) slotSkinMystery.style.display = 'block';
      if (slotSkinImgWrap) slotSkinImgWrap.style.display = 'none';
      if (slotSkinTitle) slotSkinTitle.textContent = `Chờ Quay Skin...`;
      if (slotSkinSub) slotSkinSub.textContent = `Của ${knife.name}`;

      // Slot 3: Locked
      if (slotQuantity) {
        slotQuantity.className = 'hunt-slot locked';
        slotQuantity.classList.remove('slot-golden-glow');
      }
      if (slotQuantityStatus) { slotQuantityStatus.className = 'slot-status-pill locked'; slotQuantityStatus.textContent = 'KHÓA'; }

      // Headers & Button
      if (huntStatusText) huntStatusText.textContent = `Đã chọn: ${knife.name}! Tiếp tục quay Vòng 2 để chốt Skin họa tiết!`;
      if (huntSummaryText) huntSummaryText.textContent = `Đã chọn [${knife.name}]! Quay Vòng 2 để chọn SKIN`;
      if (spinBtnText) spinBtnText.textContent = `✨ QUAY SKIN CHO ${knife.name.toUpperCase()} (VÒNG 2/3)`;
      if (spinBtnIcon) spinBtnIcon.textContent = '✨';
      if (wheelCenterText) wheelCenterText.textContent = 'VÒNG 2';

      // Load skins of selected knife into engine
      const skinsWithSpecials = this.getSkinsForSelectedKnife(knife);
      this.engine.setItems(skinsWithSpecials, 2);

    } else if (stage === 3) {
      if (data) this.selectedSkin = data;
      const knife = this.selectedKnife;
      const skin = this.selectedSkin;
      if (!knife || !skin) return;

      const validCases = this.getValidCasesForSelection(knife, skin);
      const caseNamesText = validCases.map(c => c.name).join(', ');

      // Stepper
      if (step1El) step1El.className = 'stage-step completed';
      if (step2El) { step2El.className = 'stage-step completed'; if (step2Desc) step2Desc.textContent = `✔ Đã chốt: ${skin.name}`; }
      if (step3El) {
        step3El.className = 'stage-step active';
        if (step3Desc) step3Desc.textContent = `Quay hòm hợp lệ & số lượng: ${caseNamesText}`;
      }
      if (resetWrap) resetWrap.style.display = 'flex';

      // Slot 2: Completed
      if (slotSkin) {
        slotSkin.className = 'hunt-slot completed';
        slotSkin.classList.remove('slot-golden-glow');
      }
      if (slotSkinStatus) { slotSkinStatus.className = 'slot-status-pill completed'; slotSkinStatus.textContent = '✔ ĐÃ KHÓA'; }
      if (slotSkinMystery) slotSkinMystery.style.display = 'none';
      if (slotSkinImgWrap) slotSkinImgWrap.style.display = 'flex';
      if (slotSkinImg) { slotSkinImg.src = skin.imageSrc || knife.vanillaImage; slotSkinImg.alt = skin.name; }
      if (slotSkinTitle) slotSkinTitle.textContent = skin.name;
      if (slotSkinSub) slotSkinSub.textContent = skin.isSpecial ? '🔥 Ô Đặc Biệt' : (skin.priceVND || 'Skin Finish');

      // Slot 3: Active with golden glow
      if (slotQuantity) slotQuantity.className = 'hunt-slot active slot-golden-glow';
      if (slotQuantityStatus) { slotQuantityStatus.className = 'slot-status-pill active'; slotQuantityStatus.textContent = 'ĐANG CHỜ QUAY'; }
      if (slotQuantityMystery) slotQuantityMystery.style.display = 'block';
      if (slotQuantityImgWrap) slotQuantityImgWrap.style.display = 'none';
      if (slotQuantityTitle) slotQuantityTitle.textContent = 'Chờ Quay Hòm & Số Lượng...';
      if (slotQuantitySub) slotQuantitySub.textContent = `Chỉ các hòm mở được ${knife.name}`;

      // Headers & Button
      const targetFull = `${knife.name} | ${skin.name}`;
      if (huntStatusText) {
        huntStatusText.textContent = `🎯 Mục tiêu: ${targetFull}! Vòng 3 sẽ chỉ quay các hòm có thể rơi ra: ${caseNamesText}!`;
      }
      if (huntSummaryText) {
        huntSummaryText.textContent = `🔥 SĂN MỤC TIÊU: [${targetFull}] - Đang chờ hòm & số lượng...`;
      }
      if (spinBtnText) spinBtnText.textContent = '🎲 QUAY HÒM & SỐ LƯỢNG (VÒNG 3/3)';
      if (spinBtnIcon) spinBtnIcon.textContent = '🎲';
      if (wheelCenterText) wheelCenterText.textContent = 'VÒNG 3';

      // Load ONLY valid case quantities into engine
      const stage3Items = this.getCaseQuantityItems(knife, skin);
      this.engine.setItems(stage3Items, 3);
    }
    this.sendSyncState();
  }

  handleSpin() {
    this.startSpotlightSpin(this.currentStage || 1);
  }

  /* =========================================================================
   * LIVE HUNT MISSION TRACKER ("ÁP LỰC MỤC TIÊU")
   * ========================================================================= */
  activateHuntMissionTracker() {
    this.isHuntActive = true;
    this.openedCases = 0;
    this.targetCases = (this.selectedQuantity && this.selectedQuantity.casesCount) ? this.selectedQuantity.casesCount : 30;

    const tracker = document.getElementById('huntMissionTracker');
    if (!tracker) return;
    tracker.style.display = 'block';

    // Populate Weapon Target Info
    const targetKnifeName = this.selectedKnife?.name || 'Knife';
    const targetSkinName = this.selectedSkin?.name || 'Skin';
    const fullName = `${targetKnifeName} | ${targetSkinName}`;

    const hmtTargetImg = document.getElementById('hmtTargetImg');
    const hmtTargetName = document.getElementById('hmtTargetName');
    if (hmtTargetImg) {
      hmtTargetImg.src = this.selectedSkin?.imageSrc || this.selectedKnife?.vanillaImage || '';
      hmtTargetImg.alt = fullName;
    }
    if (hmtTargetName) {
      hmtTargetName.textContent = fullName;
    }

    // Populate Cases that drop this knife
    const casesBadges = document.getElementById('hmtCasesBadges');
    if (casesBadges) {
      const cases = (this.selectedSkin && this.selectedSkin.cases && this.selectedSkin.cases.length > 0)
        ? this.selectedSkin.cases
        : ((this.selectedKnife && this.selectedKnife.skins && this.selectedKnife.skins[0]?.cases) ? this.selectedKnife.skins[0].cases : []);
      
      const chosenCaseName = this.selectedQuantity?.caseName;

      if (cases && cases.length > 0) {
        casesBadges.innerHTML = cases.map(c => {
          const isChosen = chosenCaseName && (chosenCaseName === c.name || chosenCaseName === c.shortName);
          const highlightStyle = isChosen
            ? 'style="border: 2px solid #ffd700; background: rgba(255, 215, 0, 0.22); box-shadow: 0 0 14px rgba(255, 215, 0, 0.5); font-weight: bold; color: #ffd700;"'
            : '';
          return `
            <span class="hmt-case-chip ${isChosen ? 'chosen-case-badge' : ''}" ${highlightStyle}>
              <img src="${c.imageSrc || `assets/Case/${c.file}`}" alt="${c.name}" />
              <span>${c.name}${isChosen ? ' ★ (ĐÃ CHỌN)' : ''}</span>
            </span>
          `;
        }).join('');
      } else {
        casesBadges.innerHTML = '<span class="hmt-case-chip">📦 Tất cả các hòm dao CS2</span>';
      }
    }

    // Set Pressure Pill text
    const pressurePill = document.getElementById('hmtPressurePill');
    if (pressurePill) {
      if (this.targetCases <= 3) {
        pressurePill.textContent = `⚡ 1 SHOT CỰC CĂNG (CHỈ ${this.targetCases} HÒM)`;
      } else if (this.targetCases <= 7) {
        pressurePill.textContent = `🔥 KÈO CÂN NÃO (${this.targetCases} HÒM)`;
      } else if (this.targetCases <= 15) {
        pressurePill.textContent = `⚔️ THỬ THÁCH ${this.targetCases} HÒM`;
      } else if (this.targetCases === 999) {
        pressurePill.textContent = '♾️ MỞ TỚI KHI RA DAO';
      } else {
        pressurePill.textContent = `⚔️ ĐẠI CHIẾN ${this.targetCases} HÒM`;
      }
    }

    // Update Counter UI
    this.updateHuntCounterUI();

    // Scroll smoothly to tracker
    tracker.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  updateHuntCounterUI() {
    const countCurr = document.getElementById('hmtCountCurr');
    const countMax = document.getElementById('hmtCountMax');
    const progressFill = document.getElementById('hmtProgressFill');
    const remainingText = document.getElementById('hmtRemainingText');
    const percentText = document.getElementById('hmtPercentText');

    const curr = this.openedCases;
    const max = this.targetCases;

    if (countCurr) countCurr.textContent = curr;
    if (countMax) countMax.textContent = max === 999 ? '∞' : max;

    if (max === 999) {
      if (progressFill) {
        progressFill.style.width = '100%';
        progressFill.classList.remove('danger');
      }
      if (remainingText) remainingText.textContent = `Đã mở: ${curr} hòm (Vô hạn)`;
      if (percentText) percentText.textContent = `KHÔNG GIỚI HẠN`;
      return;
    }

    const pct = Math.min(100, Math.round((curr / max) * 100));
    const remaining = Math.max(0, max - curr);

    if (progressFill) {
      progressFill.style.width = `${pct}%`;
      if (pct >= 80) progressFill.classList.add('danger');
      else progressFill.classList.remove('danger');
    }

    if (remainingText) {
      if (remaining === 0) remainingText.textContent = `⚠️ HẾT HÒM RỒI!`;
      else if (remaining === 1) remainingText.textContent = `🔥 HÒM CUỐI CÙNG! CỰC ÁP LỰC!`;
      else remainingText.textContent = `Còn lại: ${remaining} hòm`;
    }

    if (percentText) percentText.textContent = `${pct}% ĐÃ MỞ`;
  }

  incrementOpenedCases() {
    this.openedCases++;
    window.cs2Sound.playTick(1.2);
    this.updateHuntCounterUI();
    this.updateTodayMissionCounterUI();

    if (this.targetCases !== 999 && this.openedCases >= this.targetCases) {
      window.cs2Sound.playHeartbeat();
    }
  }

  decrementOpenedCases() {
    if (this.openedCases > 0) {
      this.openedCases--;
      window.cs2Sound.playButtonClick();
      this.updateHuntCounterUI();
      this.updateTodayMissionCounterUI();
    }
  }

  handleHuntWin() {
    window.cs2Sound.playGoldUnbox();
    window.cs2Sound.playCheer();

    // Increment overall unboxed count
    this.stats.unboxedCount++;
    this.updateStatsUI();

    // Show inspect modal for won target knife
    if (this.selectedSkin) {
      this.showWinnerModal(this.selectedSkin);
    }
  }

  handleHuntFail() {
    window.cs2Sound.playFail();
    const pressurePill = document.getElementById('hmtPressurePill');
    if (pressurePill) {
      pressurePill.textContent = '💀 TẠCH KÈO! CHÚC MAY MẮN LẦN SAU!';
      pressurePill.style.borderColor = '#ef4444';
      pressurePill.style.color = '#ef4444';
    }
    alert(`💀 R.I.P! Đã mở hết ${this.openedCases} hòm mà chưa ra mục tiêu!\nHãy thiết lập kèo mới để phục thù!`);
  }

  /* =========================================================================
   * WINNER INSPECT MODAL & CASES DISPLAY
   * ========================================================================= */
  /* =========================================================================
   * WINNER INSPECT MODAL & WEAR-BASED DYNAMIC MARKET PRICING
   * ========================================================================= */
  getSkinPricingForWear(skin, wearTag, isStatTrak = false) {
    if (!skin) {
      return { priceVND: '1.627.624 ₫', priceUSD: '$64', tier: 'C', wearName: 'Field-Tested', rawVND: 1627624, rawUSD: 64 };
    }

    // 1. Vanilla knife
    if (skin.isVanilla || (skin.availableWears && skin.availableWears.includes('Vanilla'))) {
      const v = skin.pricesByWear && skin.pricesByWear['Vanilla'];
      if (v) {
        return {
          priceVND: isStatTrak ? v.stPriceVND : v.priceVND,
          priceUSD: isStatTrak ? v.stPriceUSD : v.priceUSD,
          tier: skin.tier || 'B',
          wearName: 'Vanilla (Tiêu chuẩn)',
          rawVND: isStatTrak ? v.stPriceVNDRaw : v.priceVNDRaw,
          rawUSD: isStatTrak ? v.stPriceUSDRaw : v.priceUSDRaw
        };
      }
    }

    // 2. Wears: FN, MW, FT, WW, BS
    const tagUpper = (wearTag || 'ft').toUpperCase();
    const wearData = skin.pricesByWear && skin.pricesByWear[tagUpper];
    if (wearData) {
      const hasSTPrice = wearData.stPriceVND && wearData.stPriceVND !== 'No Recent Price';
      const vnd = isStatTrak ? (hasSTPrice ? wearData.stPriceVND : wearData.priceVND) : wearData.priceVND;
      const usd = isStatTrak ? (hasSTPrice ? wearData.stPriceUSD : wearData.priceUSD) : wearData.priceUSD;
      const rawVnd = isStatTrak ? (wearData.stPriceVNDRaw || wearData.priceVNDRaw) : wearData.priceVNDRaw;
      const rawUsd = isStatTrak ? (wearData.stPriceUSDRaw || wearData.priceUSDRaw) : wearData.priceUSDRaw;

      let tier = 'C';
      if (rawUsd >= 1200) tier = 'S+';
      else if (rawUsd >= 600) tier = 'S';
      else if (rawUsd >= 240) tier = 'A';
      else if (rawUsd >= 100) tier = 'B';

      return {
        priceVND: vnd,
        priceUSD: usd,
        tier,
        wearName: wearData.wearName || tagUpper,
        rawVND: rawVnd,
        rawUSD: rawUsd
      };
    }

    // Fallback
    return {
      priceVND: skin.priceVND || '1.627.624 ₫',
      priceUSD: skin.priceUSD || '$64',
      tier: skin.tier || 'C',
      wearName: 'Field-Tested',
      rawVND: skin.priceVNDRaw || 1627624,
      rawUSD: skin.priceUSDRaw || 64
    };
  }

  showWinnerModal(winnerSkin) {
    const modal = document.getElementById('winnerModal');
    if (!modal) return;

    this.lastWonSkin = winnerSkin;

    // Skin full image & name
    const imgPath = winnerSkin.imageSrc || this.engine.getItemImage(winnerSkin);
    document.getElementById('modalKnifeImg').src = imgPath;
    document.getElementById('modalKnifeName').textContent = winnerSkin.fullName || `${this.selectedKnife?.name} | ${winnerSkin.name}`;

    // Found in cases section
    const casesSection = document.getElementById('modalCasesSection');
    const casesGrid = document.getElementById('modalCasesGrid');
    const casesTitle = document.getElementById('modalCasesTitle');

    const cases = winnerSkin.cases || (this.selectedKnife?.skins?.find(s => s.name === winnerSkin.name)?.cases) || [];

    if (cases && cases.length > 0) {
      if (casesSection) casesSection.style.display = 'block';
      if (casesTitle) casesTitle.textContent = `Found in ${cases.length} ${cases.length > 1 ? 'cases' : 'case'}`;
      if (casesGrid) {
        casesGrid.innerHTML = cases.map(c => `
          <div class="case-card">
            <img class="case-img" src="${c.imageSrc || `assets/Case/${c.file}`}" alt="${c.name}" />
            <span class="case-name">${c.name}</span>
          </div>
        `).join('');
      }
    } else {
      if (casesSection) casesSection.style.display = 'none';
    }

    // Float Setup & Bounds
    const isVanilla = winnerSkin.isVanilla || (winnerSkin.availableWears && winnerSkin.availableWears.includes('Vanilla'));
    const floatRangeLabel = document.getElementById('modalFloatRangeLabel');
    const floatInput = document.getElementById('modalFloatInput');
    const wearButtonsContainer = document.getElementById('modalWearButtons');
    const stChk = document.getElementById('modalStatTrakChk');
    if (stChk) stChk.checked = false;

    let initialWearTag = 'ft';

    if (isVanilla) {
      if (floatRangeLabel) floatRangeLabel.textContent = 'Vanilla: Không áp dụng độ mòn Float';
      if (floatInput) {
        floatInput.value = '0.0000';
        floatInput.disabled = true;
      }
      if (wearButtonsContainer) wearButtonsContainer.style.display = 'none';
      const wearTagEl = document.getElementById('modalWearTag');
      if (wearTagEl) {
        wearTagEl.className = 'wear-tag';
        wearTagEl.textContent = 'Vanilla';
      }
      const wearPin = document.getElementById('modalWearPin');
      if (wearPin) wearPin.style.left = '0%';
      initialWearTag = 'Vanilla';
    } else {
      if (wearButtonsContainer) wearButtonsContainer.style.display = 'flex';
      if (floatInput) floatInput.disabled = false;

      const minF = winnerSkin.minFloat !== undefined && winnerSkin.minFloat !== null ? winnerSkin.minFloat : 0.00;
      const maxF = winnerSkin.maxFloat !== undefined && winnerSkin.maxFloat !== null ? winnerSkin.maxFloat : 1.00;
      if (floatRangeLabel) {
        floatRangeLabel.textContent = `Float Range: ${minF.toFixed(2)} - ${maxF.toFixed(2)}`;
      }

      // Configure wear buttons availability
      const avail = winnerSkin.availableWears || ['FN', 'MW', 'FT', 'WW', 'BS'];
      if (wearButtonsContainer) {
        wearButtonsContainer.querySelectorAll('.mwb-btn').forEach(btn => {
          const w = btn.dataset.wear.toUpperCase();
          if (avail.includes(w)) {
            btn.disabled = false;
            btn.style.display = 'block';
          } else {
            btn.disabled = true;
            btn.style.display = 'none';
          }
        });
      }

      // Generate realistic default float for won skin
      let defaultFloat = 0.2245;
      if (avail.includes('FT')) {
        defaultFloat = Math.max(minF, Math.min(maxF, 0.16 + Math.random() * 0.15));
        initialWearTag = 'ft';
      } else if (avail.includes('FN')) {
        defaultFloat = Math.max(minF, Math.min(maxF, 0.015 + Math.random() * 0.04));
        initialWearTag = 'fn';
      } else if (avail.includes('WW')) {
        defaultFloat = Math.max(minF, Math.min(maxF, 0.41 + Math.random() * 0.03));
        initialWearTag = 'ww';
      } else if (avail.includes('BS')) {
        defaultFloat = Math.max(minF, Math.min(maxF, 0.52 + Math.random() * 0.2));
        initialWearTag = 'bs';
      }

      if (floatInput) {
        floatInput.value = defaultFloat.toFixed(4);
        this.updateWearUI('modalFloatInput', 'modalWearTag', 'modalWearPin');
      }
      initialWearTag = this.getWearInfo(defaultFloat).tag;
    }

    // Render Steam Market Listings Table (Chuẩn Stash.clash.gg)
    this.renderMarketTable(winnerSkin, initialWearTag, false);

    // Update dynamic prices on modal
    this.updateModalMarketAndPrice(winnerSkin, initialWearTag, false);

    // Reset notes
    const episodeInput = document.getElementById('modalEpisodeNotes');
    if (episodeInput) episodeInput.value = `Tập ${this.stats.unboxedCount}`;

    // Reset save button status
    const saveSuccessMsg = document.getElementById('saveSuccessMsg');
    if (saveSuccessMsg) saveSuccessMsg.style.display = 'none';
    const saveBtn = document.getElementById('saveToCollectionBtn');
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = '➕ LƯU VÀO BỘ SƯU TẬP NGAY';
    }

    // Set accent glow
    const inspectCard = document.getElementById('inspectCard');
    if (inspectCard) {
      const accent = winnerSkin.accent || '#ffd700';
      inspectCard.style.boxShadow = `0 0 50px ${accent}66, inset 0 0 30px ${accent}22`;
      inspectCard.style.borderColor = accent;
    }

    modal.classList.add('active');
  }

  renderMarketTable(skin, activeWearTag, isStatTrak) {
    const table = document.getElementById('modalMarketTable');
    if (!table) return;

    const isVanilla = skin.isVanilla || (skin.availableWears && skin.availableWears.includes('Vanilla'));

    if (isVanilla) {
      const v = skin.pricesByWear?.['Vanilla'] || { priceVND: '3.810.000 ₫', priceUSD: '$150', stPriceVND: '4.760.000 ₫', stPriceUSD: '$187' };
      table.innerHTML = `
        <thead>
          <tr>
            <th>Phiên Bản Listing</th>
            <th class="mmw-price-col">Giá Thị Trường (Steam)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="mmw-row ${isStatTrak ? 'active stattrak-row' : ''}" data-wear="Vanilla" data-st="true">
            <td><span class="mmw-st-label">★ StatTrak™</span> Tiêu chuẩn</td>
            <td class="mmw-price-col">${v.stPriceVND} (${v.stPriceUSD})</td>
          </tr>
          <tr class="mmw-row ${!isStatTrak ? 'active' : ''}" data-wear="Vanilla" data-st="false">
            <td>Nguyên bản (Standard)</td>
            <td class="mmw-price-col">${v.priceVND} (${v.priceUSD})</td>
          </tr>
        </tbody>
      `;
    } else {
      const avail = skin.availableWears || ['FN', 'MW', 'FT', 'WW', 'BS'];
      const wears = skin.pricesByWear || {};

      let stRows = '';
      let stdRows = '';

      avail.forEach(w => {
        const d = wears[w];
        if (!d) return;

        const isRowActiveST = isStatTrak && (activeWearTag.toUpperCase() === w);
        const isRowActiveStd = !isStatTrak && (activeWearTag.toUpperCase() === w);

        stRows += `
          <tr class="mmw-row ${isRowActiveST ? 'active stattrak-row' : ''}" data-wear="${w.toLowerCase()}" data-st="true">
            <td><span class="mmw-st-label">★ StatTrak™</span> ${d.wearName}</td>
            <td class="mmw-price-col">${d.stPriceVND} (${d.stPriceUSD})</td>
          </tr>
        `;

        stdRows += `
          <tr class="mmw-row ${isRowActiveStd ? 'active' : ''}" data-wear="${w.toLowerCase()}" data-st="false">
            <td>${d.wearName}</td>
            <td class="mmw-price-col">${d.priceVND} (${d.priceUSD})</td>
          </tr>
        `;
      });

      table.innerHTML = `
        <thead>
          <tr>
            <th>★ StatTrak™ Market Listings</th>
            <th class="mmw-price-col">Giá Thị Trường</th>
          </tr>
        </thead>
        <tbody>
          ${stRows}
        </tbody>
        <thead>
          <tr>
            <th>Standard Market Listings</th>
            <th class="mmw-price-col">Giá Thị Trường</th>
          </tr>
        </thead>
        <tbody>
          ${stdRows}
        </tbody>
      `;
    }

    // Bind row click to select condition
    table.querySelectorAll('.mmw-row').forEach(row => {
      row.addEventListener('click', () => {
        const wear = row.dataset.wear;
        const st = row.dataset.st === 'true';

        const stChk = document.getElementById('modalStatTrakChk');
        if (stChk) stChk.checked = st;

        if (wear !== 'Vanilla') {
          const targetFloat = this.getStandardFloatForWear(wear, skin.minFloat, skin.maxFloat);
          const floatInput = document.getElementById('modalFloatInput');
          if (floatInput) {
            floatInput.value = targetFloat.toFixed(4);
            this.updateWearUI('modalFloatInput', 'modalWearTag', 'modalWearPin');
          }
        }

        this.updateModalMarketAndPrice(skin, wear, st);
      });
    });
  }

  getStandardFloatForWear(wearTag, minF = 0, maxF = 1) {
    const min = (minF !== null && minF !== undefined) ? minF : 0;
    const max = (maxF !== null && maxF !== undefined) ? maxF : 1;

    let f = 0.225;
    switch (wearTag.toLowerCase()) {
      case 'fn': f = Math.max(min, 0.035); break;
      case 'mw': f = Math.max(min, 0.105); break;
      case 'ft': f = Math.max(min, Math.min(max, 0.225)); break;
      case 'ww': f = Math.max(min, Math.min(max, 0.415)); break;
      case 'bs': f = Math.min(max, 0.650); break;
    }
    return Math.max(min, Math.min(max, f));
  }

  updateModalMarketAndPrice(winnerSkin, wearTag, isStatTrak) {
    if (!winnerSkin) return;

    const pricing = this.getSkinPricingForWear(winnerSkin, wearTag, isStatTrak);

    // Update main hero price display
    const priceVNDEl = document.getElementById('modalPriceVND');
    const priceUSDEl = document.getElementById('modalPriceUSD');
    const wearConditionEl = document.getElementById('modalPriceWearCondition');
    const tierBadge = document.getElementById('modalTierBadge');

    if (priceVNDEl) priceVNDEl.textContent = pricing.priceVND;
    if (priceUSDEl) priceUSDEl.textContent = `(${pricing.priceUSD})`;
    if (tierBadge) tierBadge.textContent = `Tier ${pricing.tier}`;

    if (wearConditionEl) {
      const tagUpper = (wearTag || 'FT').toUpperCase();
      const stPrefix = isStatTrak ? '★ StatTrak™ ' : '';
      wearConditionEl.textContent = `${stPrefix}${pricing.wearName} (${tagUpper})`;
      wearConditionEl.className = isStatTrak ? 'price-condition-pill stattrak' : 'price-condition-pill';
    }

    // Highlight active wear button
    document.querySelectorAll('#modalWearButtons .mwb-btn').forEach(btn => {
      if (btn.dataset.wear.toLowerCase() === wearTag.toLowerCase()) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Highlight active row in market table
    document.querySelectorAll('#modalMarketTable .mmw-row').forEach(row => {
      const rWear = row.dataset.wear.toLowerCase();
      const rST = row.dataset.st === 'true';
      if (rWear === wearTag.toLowerCase() && rST === isStatTrak) {
        row.classList.add('active');
        if (isStatTrak) row.classList.add('stattrak-row');
      } else {
        row.classList.remove('active');
        row.classList.remove('stattrak-row');
      }
    });
  }

  closeWinnerModal() {
    const modal = document.getElementById('winnerModal');
    if (modal) modal.classList.remove('active');
    this.setStage(1);
  }

  /* =========================================================================
   * FLOAT VALUE & WEAR LOGIC
   * ========================================================================= */
  getWearInfo(floatNum) {
    const f = parseFloat(floatNum);
    if (isNaN(f) || f < 0) return { tag: 'fn', name: 'Factory New', color: '#60a5fa' };
    if (f < 0.07) return { tag: 'fn', name: 'Factory New', color: '#60a5fa' };
    if (f < 0.15) return { tag: 'mw', name: 'Minimal Wear', color: '#4ade80' };
    if (f < 0.38) return { tag: 'ft', name: 'Field-Tested', color: '#facc15' };
    if (f < 0.45) return { tag: 'ww', name: 'Well-Worn', color: '#fb923c' };
    return { tag: 'bs', name: 'Battle-Scarred', color: '#f87171' };
  }

  updateWearUI(inputId, tagId, pinId) {
    const input = document.getElementById(inputId);
    const tag = document.getElementById(tagId);
    const pin = document.getElementById(pinId);
    if (!input) return;

    let floatVal = parseFloat(input.value);
    if (isNaN(floatVal)) floatVal = 0;
    floatVal = Math.max(0, Math.min(1, floatVal));

    const wear = this.getWearInfo(floatVal);
    if (tag) {
      tag.className = `wear-tag ${wear.tag}`;
      tag.textContent = wear.name;
    }
    if (pin) {
      pin.style.left = `${(floatVal * 100).toFixed(2)}%`;
    }
  }

  /* =========================================================================
   * COLLECTION TRACKER MANAGEMENT
   * ========================================================================= */
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
    this.renderCollection();
    this.updateStatsUI();
  }

  addToCollection(itemData) {
    const id = 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const wear = this.getWearInfo(itemData.floatVal);

    const knifeId = itemData.knifeId || this.selectedKnife?.id || 'knife';
    const knifeName = itemData.knifeName || this.selectedKnife?.name || 'Knife';
    const skinName = itemData.skinName || itemData.name || 'Skin';
    const fullName = itemData.fullName || `★ ${knifeName} | ${skinName}`;
    const imageSrc = itemData.imageSrc || '';

    const newKnife = {
      id,
      knifeId,
      knifeName,
      skinName,
      fullName,
      tier: itemData.tier || 'A',
      imageSrc,
      floatVal: parseFloat(itemData.floatVal || '0.0150').toFixed(4),
      wearTag: wear.tag,
      wearName: wear.name,
      isStatTrak: !!itemData.isStatTrak,
      priceVND: itemData.priceVND || '1.627.624 ₫',
      priceUSD: itemData.priceUSD || '$64',
      cases: itemData.cases || [],
      notes: itemData.notes || '',
      date: new Date().toLocaleDateString('vi-VN')
    };

    this.collection.unshift(newKnife);
    this.saveCollection();
    return newKnife;
  }

  updateCollectionItemFloat(itemId, newFloat) {
    const item = this.collection.find(i => i.id === itemId);
    if (!item) return;

    let f = parseFloat(newFloat);
    if (isNaN(f)) f = 0.015;
    f = Math.max(0, Math.min(1, f));

    item.floatVal = f.toFixed(4);
    const wear = this.getWearInfo(f);
    item.wearTag = wear.tag;
    item.wearName = wear.name;

    // Recalculate realistic market price for new float wear!
    const knife = this.knives.find(k => k.id === item.knifeId);
    const skin = knife?.skins?.find(s => s.name === item.skinName || s.fullName === item.fullName);
    if (skin) {
      const p = this.getSkinPricingForWear(skin, wear.tag, item.isStatTrak);
      item.priceVND = p.priceVND;
      item.priceUSD = p.priceUSD;
      item.tier = p.tier;
    }

    this.saveCollection();
  }

  updateCollectionItemNotes(itemId, newNotes) {
    const item = this.collection.find(i => i.id === itemId);
    if (!item) return;
    item.notes = newNotes;
    this.saveCollection();
  }

  deleteCollectionItem(itemId) {
    this.collection = this.collection.filter(i => i.id !== itemId);
    this.saveCollection();
  }

  renderCollection() {
    const container = document.getElementById('collectionItemsContainer');
    const distinctEl = document.getElementById('collDistinctCount');
    const totalEl = document.getElementById('collTotalKnives');
    const stCountEl = document.getElementById('collStatTrakCount');
    const valueEl = document.getElementById('collTotalValue');
    const usdEl = document.getElementById('collTotalUSD');
    const progressBar = document.getElementById('collProgressBar');
    const checklistGrid = document.getElementById('knivesChecklistGrid');

    // 1. Calculate stats
    const distinctKnives = new Set(this.collection.map(i => i.knifeId));
    const totalKnives = this.collection.length;
    const stCount = this.collection.filter(i => i.isStatTrak).length;

    let totalVNDVal = 0;
    this.collection.forEach(i => {
      const p = parseInt((i.priceVND || '0').replace(/\./g, '').replace(/đ/g, '').trim()) || 0;
      totalVNDVal += p;
    });
    const totalUSDVal = Math.round(totalVNDVal / 25400);

    const totalAvailableKnifeTypes = this.knives.length || 20;
    const progressPercent = Math.min(100, Math.round((distinctKnives.size / totalAvailableKnifeTypes) * 100));

    if (distinctEl) distinctEl.textContent = `${distinctKnives.size} / ${totalAvailableKnifeTypes} (${progressPercent}%)`;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    if (totalEl) totalEl.textContent = `${totalKnives} con dao`;
    if (stCountEl) stCountEl.textContent = `${stCount} StatTrak™`;
    if (valueEl) valueEl.textContent = `${totalVNDVal.toLocaleString('vi-VN')} đ`;
    if (usdEl) usdEl.textContent = `$${totalUSDVal.toLocaleString()}`;

    const statProgress = document.getElementById('statCollectionProgress');
    if (statProgress) statProgress.textContent = `${distinctKnives.size} / ${totalAvailableKnifeTypes}`;

    const headerCollCount = document.getElementById('headerCollCount');
    if (headerCollCount) headerCollCount.textContent = totalKnives;

    // 2. Render 20 Knives Checklist
    if (checklistGrid) {
      checklistGrid.innerHTML = this.knives.map(k => {
        const isOwned = distinctKnives.has(k.id);
        const countOwned = this.collection.filter(i => i.knifeId === k.id).length;
        const vanillaImg = k.vanillaImage || `assets/${k.folder}/Vanilla.png`;

        return `
          <div class="kcc-item ${isOwned ? 'owned' : ''}" title="${k.name}: ${isOwned ? `Đã có ${countOwned} con` : 'Chưa sở hữu'}">
            <img class="kcc-thumb" src="${vanillaImg}" alt="${k.name}" />
            <span class="kcc-name">${k.name.replace(' Knife', '')}</span>
            ${isOwned ? `<span class="kcc-check">✔ ${countOwned > 1 ? `x${countOwned}` : ''}</span>` : ''}
          </div>
        `;
      }).join('');
    }

    // 3. Render Collection items
    if (!container) return;

    if (this.collection.length === 0) {
      container.className = 'collection-items-wrap view-cards';
      container.innerHTML = `
        <div class="collection-empty-box">
          <div class="ce-icon">📦</div>
          <h3 class="ce-title">BỘ SƯU TẬP HIỆN ĐANG TRỐNG</h3>
          <p class="ce-desc">Hãy mở hòm / quay dao ở trên hoặc bấm nút "➕ Thêm Dao Đã Mở Vào BST" để ghi lại những con dao bạn nhận được trong series video!</p>
        </div>
      `;
      return;
    }

    if (this.collectionView === 'cards') {
      container.className = 'collection-items-wrap view-cards';
      container.innerHTML = this.collection.map(item => {
        const wear = this.getWearInfo(item.floatVal);
        const floatPct = (parseFloat(item.floatVal) * 100).toFixed(2);

        return `
          <div class="collection-card" data-id="${item.id}">
            <div class="cc-top">
              <span class="tier-pill" style="font-size: 11px; padding: 2px 8px;">Tier ${item.tier}</span>
              ${item.isStatTrak ? '<span class="stattrak-badge">StatTrak™</span>' : ''}
            </div>

            <div class="cc-img-wrap">
              <img class="cc-img" src="${item.imageSrc}" alt="${item.fullName}" />
            </div>

            <div class="cc-info">
              <span class="cc-fullname">${item.fullName}</span>
              <span class="cc-price">${item.priceVND} (${item.priceUSD})</span>
            </div>

            <!-- Inline Float Editor -->
            <div class="cc-float-row">
              <div class="cc-float-header">
                <span style="font-size: 11px; color: #94a3b8; font-weight: 700;">Float:</span>
                <input type="number" class="cc-float-input inline-float-edit" data-id="${item.id}" value="${item.floatVal}" step="0.0001" min="0" max="1" />
                <span class="wear-tag ${wear.tag}" style="font-size: 9px; padding: 2px 6px;">${wear.name}</span>
              </div>
              <div class="wear-bar-container">
                <div class="wear-bar-fill">
                  <div class="wb-segment wb-fn"></div>
                  <div class="wb-segment wb-mw"></div>
                  <div class="wb-segment wb-ft"></div>
                  <div class="wb-segment wb-ww"></div>
                  <div class="wb-segment wb-bs"></div>
                </div>
                <div class="wear-indicator-pin" style="left: ${floatPct}%;"></div>
              </div>
            </div>

            <!-- Cases Row -->
            ${item.cases && item.cases.length > 0 ? `
              <div class="cc-cases-row">
                <span style="font-size: 10px; color: #64748b;">Hòm:</span>
                ${item.cases.map(c => `
                  <div class="cc-case-pill" title="${c.name}">
                    <img class="cc-case-thumb" src="${c.imageSrc || `assets/Case/${c.file}`}" alt="${c.name}" />
                    <span>${c.name.replace(' Case', '').replace(' Weapon', '')}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <div class="cc-bottom">
              <input type="text" class="cs-input cc-notes inline-notes-edit" data-id="${item.id}" value="${item.notes || ''}" placeholder="Ghi chú tập video..." />
              <button class="cc-delete-btn" data-id="${item.id}" title="Xóa khỏi bộ sưu tập">🗑️</button>
            </div>
          </div>
        `;
      }).join('');

    } else {
      // Table view
      container.className = 'collection-items-wrap view-table';
      container.innerHTML = `
        <div class="collection-table-wrap">
          <table class="collection-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên Dao & Skin</th>
                <th>Phân Hạng</th>
                <th>Float Value</th>
                <th>Giá Trị</th>
                <th>Hòm Rơi</th>
                <th>Ghi Chú Series</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              ${this.collection.map(item => {
                const wear = this.getWearInfo(item.floatVal);
                return `
                  <tr data-id="${item.id}">
                    <td><img class="ct-thumb" src="${item.imageSrc}" alt="${item.fullName}" /></td>
                    <td>
                      <strong>${item.fullName}</strong>
                      ${item.isStatTrak ? '<span class="stattrak-badge" style="margin-left: 6px;">ST</span>' : ''}
                    </td>
                    <td><span class="tier-pill" style="font-size: 11px;">Tier ${item.tier}</span></td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <input type="number" class="cc-float-input inline-float-edit" data-id="${item.id}" value="${item.floatVal}" step="0.0001" min="0" max="1" style="width: 80px;" />
                        <span class="wear-tag ${wear.tag}" style="font-size: 9px;">${wear.name}</span>
                      </div>
                    </td>
                    <td style="color: var(--gold-primary); font-family: var(--font-mono); font-weight: 700;">${item.priceVND}</td>
                    <td>
                      <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                        ${(item.cases || []).map(c => `
                          <img style="width: 22px; height: 16px; object-fit: contain;" src="${c.imageSrc || `assets/Case/${c.file}`}" alt="${c.name}" title="${c.name}" />
                        `).join('')}
                      </div>
                    </td>
                    <td>
                      <input type="text" class="cs-input inline-notes-edit" data-id="${item.id}" value="${item.notes || ''}" placeholder="Tập video..." style="width: 140px; font-size: 11px;" />
                    </td>
                    <td>
                      <button class="cc-delete-btn" data-id="${item.id}" title="Xóa">🗑️</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Bind inline float edits
    container.querySelectorAll('.inline-float-edit').forEach(input => {
      input.addEventListener('change', (e) => {
        this.updateCollectionItemFloat(e.target.dataset.id, e.target.value);
      });
    });

    // Bind inline notes edits
    container.querySelectorAll('.inline-notes-edit').forEach(input => {
      input.addEventListener('change', (e) => {
        this.updateCollectionItemNotes(e.target.dataset.id, e.target.value);
      });
    });

    // Bind delete buttons
    container.querySelectorAll('.cc-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        if (confirm('Bạn có chắc muốn xóa con dao này khỏi bộ sưu tập?')) {
          this.deleteCollectionItem(id);
        }
      });
    });
  }

  /* =========================================================================
   * EVENT BINDINGS
   * ========================================================================= */

  /* =========================================================================
   * CINEMATIC SPOTLIGHT SPIN & REVEAL FLOW
   * ========================================================================= */
  startSpotlightSpin(stage = this.currentStage || 1) {
    if (this.engine && this.engine.isSpinning) return;

    this.currentStage = stage;
    const modal = document.getElementById('spinSpotlightModal');
    const spinnerArea = document.getElementById('spotlightSpinnerArea');
    const revealArea = document.getElementById('winnerRevealCardArea');
    const stageBadge = document.getElementById('spotlightStageBadge');
    const stageTitle = document.getElementById('spotlightStageTitle');
    const stageDesc = document.getElementById('spotlightStageDesc');

    if (!modal) return;

    modal.style.display = 'flex';
    modal.classList.remove('fading-out-backdrop');
    void modal.offsetWidth; // Force reflow
    modal.classList.add('active');

    if (spinnerArea) spinnerArea.style.display = 'flex';
    if (revealArea) revealArea.style.display = 'none';

    if (stage === 1) {
      if (stageBadge) stageBadge.textContent = 'VÒNG 1 / 3';
      if (stageTitle) stageTitle.textContent = 'QUAY CHỌN LOẠI DAO CS2';
      if (stageDesc) stageDesc.textContent = '20 Dòng Dao CS2...';
      this.engine.setItems(this.getActiveKnivesList(), 1);
    } else if (stage === 2) {
      const knifeName = this.selectedKnife?.name || 'Dao';
      if (stageBadge) stageBadge.textContent = 'VÒNG 2 / 3';
      if (stageTitle) stageTitle.textContent = `QUAY SKIN CHO ${knifeName.toUpperCase()}`;
      if (stageDesc) stageDesc.textContent = `Đang quay SKIN cho ${knifeName}...`;
      const skins = this.getSkinsForSelectedKnife(this.selectedKnife);
      this.engine.setItems(skins, 2);
    } else if (stage === 3) {
      const validCases = this.getValidCasesForSelection(this.selectedKnife, this.selectedSkin);
      const caseNames = validCases.map(c => c.name).join(', ');
      const comboText = this.getStage3ComboText();
      if (stageBadge) stageBadge.textContent = 'VÒNG 3 / 3';
      if (stageTitle) stageTitle.textContent = comboText ? `QUAY HÒM & SỐ LƯỢNG [Đang tích lũy: ${comboText}]` : 'QUAY HÒM & SỐ LƯỢNG MỞ';
      if (stageDesc) stageDesc.textContent = comboText ? `Chuỗi bổ trợ: ${comboText} • Đang quay tiếp để chốt số lượng hòm!` : `Chỉ các hòm có thể rơi ra dao: ${caseNames}`;
      const items = this.getCaseQuantityItems(this.selectedKnife, this.selectedSkin);
      this.engine.setItems(items, 3);
    }

    this.sendSyncState();

    // Auto spin right after opening
    setTimeout(() => {
      this.handleSpotlightSpinExecution(stage);
    }, 450);
  }

  handleSpotlightSpinExecution(stage) {
    if (stage === 1) {
      const onCompleteStage1 = (winnerKnife) => {
        this.lastWinnerStage1 = winnerKnife;
        window.cs2Sound.playGoldUnbox();
        window.cs2Sound.playCheer();
        this.showWinnerReveal(1, winnerKnife);
      };
      if (this.engine.mode === 'roller') {
        this.engine.spinRoller(onCompleteStage1);
      } else {
        this.engine.spinWheel(onCompleteStage1);
      }
    } else if (stage === 2) {
      const onCompleteStage2 = (winnerSkin) => {
        this.lastWinnerStage2 = winnerSkin;
        window.cs2Sound.playGoldUnbox();
        window.cs2Sound.playCheer();
        this.showWinnerReveal(2, winnerSkin);
      };
      if (this.engine.mode === 'roller') {
        this.engine.spinRoller(onCompleteStage2);
      } else {
        this.engine.spinWheel(onCompleteStage2);
      }
    } else if (stage === 3) {
      const onCompleteStage3 = (winnerQty) => {
        if (winnerQty.isModifier) {
          this.stage3Modifiers.push(winnerQty);
          window.cs2Sound.playGoldUnbox();
          window.cs2Sound.playCheer();
          this.showStage3ModifierReveal(winnerQty);
        } else {
          const finalWinner = this.computeFinalStage3Result(winnerQty, this.stage3Modifiers);
          this.lastWinnerStage3 = finalWinner;
          this.stage3Modifiers = [];
          this.stage3IsShowingModifier = false;
          window.cs2Sound.playGoldUnbox();
          window.cs2Sound.playCheer();
          this.showWinnerReveal(3, finalWinner);
        }
      };
      if (this.engine.mode === 'roller') {
        this.engine.spinRoller(onCompleteStage3);
      } else {
        this.engine.spinWheel(onCompleteStage3);
      }
    }
  }

  showWinnerReveal(stage, item) {
    const spinnerArea = document.getElementById('spotlightSpinnerArea');
    const revealArea = document.getElementById('winnerRevealCardArea');
    const revealCard = document.getElementById('revealCard');
    const revealBadge = document.getElementById('revealBadge');
    const revealRarityBar = document.getElementById('revealRarityBar');
    const revealCardImg = document.getElementById('revealCardImg');
    const revealTitle = document.getElementById('revealTitle');
    const revealSubtitle = document.getElementById('revealSubtitle');
    const revealCasesWrap = document.getElementById('revealCasesWrap');
    const revealCasesBadges = document.getElementById('revealCasesBadges');
    const revealBtnText = document.getElementById('revealBtnText');

    if (spinnerArea) spinnerArea.style.display = 'none';
    if (revealArea) revealArea.style.display = 'flex';
    if (revealCard) {
      revealCard.style.opacity = '1';
      if (stage !== 2) {
        revealCard.classList.remove('wide-cases', 'multi-row-cases');
      }
    }
    if (stage !== 2 && revealCasesBadges) {
      revealCasesBadges.style.gridTemplateColumns = '';
      revealCasesBadges.style.display = 'flex';
    }

    // Sync reveal card top rarity bar with tier color
    if (revealRarityBar) {
      const tierColor = this.engine?.getTierColor(item.tier) || '#ffd700';
      revealRarityBar.style.background = `linear-gradient(90deg, ${tierColor}, #ffffff, ${tierColor})`;
    }

    if (stage === 1) {
      if (revealBadge) revealBadge.textContent = '★ LOẠI DAO ĐÃ CHỌN (VÒNG 1)';
      if (revealCardImg) {
        revealCardImg.src = item.vanillaImage || item.imageSrc || '';
        revealCardImg.alt = item.name;
      }
      if (revealTitle) revealTitle.textContent = item.name;
      if (revealSubtitle) revealSubtitle.textContent = item.vnName || '20 Dòng Dao CS2';
      if (revealCasesWrap) revealCasesWrap.style.display = 'none';
      if (revealBtnText) revealBtnText.textContent = 'TIẾP TỤC  ';

    } else if (stage === 2) {
      const knife = this.selectedKnife;
      if (revealBadge) revealBadge.textContent = '★ SKIN ĐÃ CHỌN (VÒNG 2)';
      if (revealCardImg) {
        revealCardImg.src = item.imageSrc || knife?.vanillaImage || '';
        revealCardImg.alt = item.name;
      }
      if (revealTitle) revealTitle.textContent = `${knife?.name} | ${item.name}`;
      if (revealSubtitle) revealSubtitle.textContent = item.isSpecial ? '🔥 Ô Đặc Biệt' : (item.priceVND || 'Skin Finish');

      // Show related cases
      const validCases = this.getValidCasesForSelection(knife, item);
      if (revealCasesWrap && revealCasesBadges) {
        revealCasesWrap.style.display = 'block';
        const caseCount = validCases.length;

        // Widen the frame horizontally and arrange into at most 2 rows
        if (revealCard) {
          if (caseCount > 2) {
            revealCard.classList.add('wide-cases');
            if (caseCount > 4) {
              revealCard.classList.add('multi-row-cases');
              // Exactly at most 2 rows: cols = ceil(caseCount / 2)
              const cols = Math.min(6, Math.ceil(caseCount / 2));
              revealCasesBadges.style.display = 'grid';
              revealCasesBadges.style.gridTemplateColumns = `repeat(${cols}, minmax(100px, 1fr))`;
            } else {
              revealCard.classList.remove('multi-row-cases');
              revealCasesBadges.style.display = 'grid';
              revealCasesBadges.style.gridTemplateColumns = `repeat(${caseCount}, minmax(120px, 1fr))`;
            }
          } else {
            revealCard.classList.remove('wide-cases', 'multi-row-cases');
            revealCasesBadges.style.display = 'flex';
            revealCasesBadges.style.gridTemplateColumns = '';
          }
        }

        revealCasesBadges.innerHTML = validCases.map(c => `
          <div class="rc-case-card">
            <div class="rc-case-img-wrap">
              <img src="${c.imageSrc}" alt="${c.name}" onerror="this.src='assets/Case/Dreams & Nightmares.png'" />
            </div>
            <div class="rc-case-name">${c.name}</div>
          </div>
        `).join('');
      }
      if (revealBtnText) revealBtnText.textContent = 'TIẾP TỤC  ';

    } else if (stage === 3) {
      if (revealBadge) revealBadge.textContent = '★ NGÂN SÁCH ĐÃ CHỐT (VÒNG 3)';
      if (revealCardImg) {
        revealCardImg.src = item.imageSrc || 'assets/Case/Dreams & Nightmares.png';
        revealCardImg.alt = item.name;
      }
      if (revealTitle) {
        revealTitle.textContent = item.formula ? `${item.formula} = ${item.casesCount} Hòm` : item.name;
      }
      if (revealSubtitle) {
        revealSubtitle.textContent = item.caseName ? `Hòm ${item.caseName} • ${item.subtitle || ''}` : (item.subtitle || 'Số Lượng Hòm');
      }
      if (revealCasesWrap) revealCasesWrap.style.display = 'none';
      if (revealBtnText) revealBtnText.textContent = 'XEM NHIỆM VỤ NGÀY HÔM NAY';
    }
    this.sendSyncState();
  }

  handleRevealContinue() {
    if (this.currentStage === 3 && this.stage3IsShowingModifier) {
      this.continueStage3Spin();
      return;
    }
    if (this.currentStage === 1) {
      const winner = this.lastWinnerStage1;
      if (!winner) return;
      this.selectedKnife = winner;

      const slotKnife = document.getElementById('slotKnife');
      const imgSrc = winner.vanillaImage || winner.imageSrc;

      this.flyItemToSlot(imgSrc, slotKnife, () => {
        this.lockSlotKnife(winner);

        // Move golden glow from Slot 1 to Slot 2
        slotKnife.classList.remove('slot-golden-glow');
        const slotSkin = document.getElementById('slotSkin');
        if (slotSkin) {
          slotSkin.classList.remove('locked');
          slotSkin.classList.add('active', 'slot-golden-glow');
          const slotSkinStatus = document.getElementById('slotSkinStatus');
          if (slotSkinStatus) {
            slotSkinStatus.className = 'slot-status-pill active';
            slotSkinStatus.textContent = 'ĐANG CHỜ QUAY';
          }
        }

        // Stepper: step 1 done, step 2 active
        this.currentStage = 2;
        const step1El = document.getElementById('step1Indicator');
        const step1Desc = document.getElementById('step1Desc');
        const step2El = document.getElementById('step2Indicator');
        const step2Desc = document.getElementById('step2Desc');
        if (step1El) step1El.className = 'stage-step completed';
        if (step1Desc) step1Desc.textContent = `✔ Đã chốt: ${winner.name}`;
        if (step2El) step2El.className = 'stage-step active';
        if (step2Desc) step2Desc.textContent = `Quay skin cho ${winner.name}...`;

        const startBtnText = document.getElementById('startBtnText');
        if (startBtnText) startBtnText.textContent = `QUAY SKIN CHO ${winner.name.toUpperCase()} (VÒNG 2)`;

        // Automatically darken screen & spin Stage 2 after 750ms!
        setTimeout(() => {
          this.startSpotlightSpin(2);
        }, 750);
      });

    } else if (this.currentStage === 2) {
      const winner = this.lastWinnerStage2;
      if (!winner) return;
      this.selectedSkin = winner;

      const slotSkin = document.getElementById('slotSkin');
      const imgSrc = winner.imageSrc || this.selectedKnife?.vanillaImage;

      this.flyItemToSlot(imgSrc, slotSkin, () => {
        this.lockSlotSkin(winner);

        // Move golden glow from Slot 2 to Slot 3
        slotSkin.classList.remove('slot-golden-glow');
        const slotQuantity = document.getElementById('slotQuantity');
        if (slotQuantity) {
          slotQuantity.classList.remove('locked');
          slotQuantity.classList.add('active', 'slot-golden-glow');
          const slotQuantityStatus = document.getElementById('slotQuantityStatus');
          if (slotQuantityStatus) {
            slotQuantityStatus.className = 'slot-status-pill active';
            slotQuantityStatus.textContent = 'ĐANG CHỜ QUAY';
          }
        }

        // Stepper: step 2 done, step 3 active
        this.currentStage = 3;
        const step2El = document.getElementById('step2Indicator');
        const step2Desc = document.getElementById('step2Desc');
        const step3El = document.getElementById('step3Indicator');
        const step3Desc = document.getElementById('step3Desc');
        if (step2El) step2El.className = 'stage-step completed';
        if (step2Desc) step2Desc.textContent = `✔ Đã chốt: ${winner.name}`;
        if (step3El) step3El.className = 'stage-step active';
        if (step3Desc) step3Desc.textContent = `Quay hòm hợp lệ & số lượng...`;

        const startBtnText = document.getElementById('startBtnText');
        if (startBtnText) startBtnText.textContent = `QUAY HÒM & SỐ LƯỢNG (VÒNG 3)`;

        // Automatically darken screen & spin Stage 3 after 750ms!
        setTimeout(() => {
          this.startSpotlightSpin(3);
        }, 750);
      });

    } else if (this.currentStage === 3) {
      const winner = this.lastWinnerStage3;
      if (!winner) return;
      this.selectedQuantity = winner;

      const slotQuantity = document.getElementById('slotQuantity');
      const imgSrc = winner.imageSrc;

      this.flyItemToSlot(imgSrc, slotQuantity, () => {
        this.lockSlotQuantity(winner);

        slotQuantity.classList.remove('slot-golden-glow');

        // Stepper: step 3 done
        const step3El = document.getElementById('step3Indicator');
        const step3Desc = document.getElementById('step3Desc');
        if (step3El) step3El.className = 'stage-step completed';
        if (step3Desc) step3Desc.textContent = `✔ Đã chốt: ${winner.name} (${winner.caseName || ''})`;

        const huntStartBar = document.getElementById('huntStartBar');
        if (huntStartBar) huntStartBar.style.display = 'none';

        // HIỆU ỨNG RUNG DỒN DẬP -> BÙM! -> 3 VÒNG QUAY ẨN ĐI -> HIỆN NHIỆM VỤ HÔM NAY
        this.triggerFinalExplosionTransition();
      });
    }
  }

  flyItemToSlot(imgSrc, targetSlotEl, onComplete) {
    const revealImg = document.getElementById('revealCardImg');
    if (!revealImg || !targetSlotEl) {
      if (onComplete) onComplete();
      return;
    }

    const startRect = revealImg.getBoundingClientRect();
    const endRect = targetSlotEl.getBoundingClientRect();

    // Hide reveal card smoothly
    const revealCard = document.getElementById('revealCard');
    if (revealCard) revealCard.style.opacity = '0';

    // Fade modal backdrop so user sees slots underneath
    const modal = document.getElementById('spinSpotlightModal');
    if (modal) modal.classList.add('fading-out-backdrop');

    // Create flying clone ghost
    const ghost = document.createElement('img');
    ghost.src = imgSrc;
    ghost.className = 'flying-knife-ghost';
    ghost.style.left = `${startRect.left}px`;
    ghost.style.top = `${startRect.top}px`;
    ghost.style.width = `${startRect.width}px`;
    ghost.style.height = `${startRect.height}px`;
    ghost.style.transform = 'scale(1.2) translateY(-25px)';
    document.body.appendChild(ghost);

    // Play whoosh sound
    window.cs2Sound.playWhoosh();

    // Trigger trajectory after pop
    setTimeout(() => {
      const destWidth = 140;
      const destHeight = 100;
      const destX = endRect.left + (endRect.width - destWidth) / 2;
      const destY = endRect.top + (endRect.height - destHeight) / 2 - 10;

      ghost.style.left = `${destX}px`;
      ghost.style.top = `${destY}px`;
      ghost.style.width = `${destWidth}px`;
      ghost.style.height = `${destHeight}px`;
      ghost.style.transform = 'scale(1) rotate(-8deg)';
    }, 150);

    // Impact / Slam
    setTimeout(() => {
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);

      if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active', 'fading-out-backdrop');
      }
      if (revealCard) {
        revealCard.style.opacity = '1';
        revealCard.classList.remove('wide-cases', 'multi-row-cases');
      }

      // Slam impact on target slot
      targetSlotEl.classList.add('slot-impact-smash');
      document.body.classList.add('screen-shake');
      setTimeout(() => {
        targetSlotEl.classList.remove('slot-impact-smash');
        document.body.classList.remove('screen-shake');
      }, 600);

      // Play slam sound
      window.cs2Sound.playSlam();

      if (onComplete) onComplete();
    }, 650);
  }

  lockSlotKnife(knife) {
    const slotKnife = document.getElementById('slotKnife');
    const slotKnifeStatus = document.getElementById('slotKnifeStatus');
    const slotKnifeMystery = document.getElementById('slotKnifeMystery');
    const slotKnifeImgWrap = document.getElementById('slotKnifeImgWrap');
    const slotKnifeImg = document.getElementById('slotKnifeImg');
    const slotKnifeTitle = document.getElementById('slotKnifeTitle');
    const slotKnifeSub = document.getElementById('slotKnifeSub');

    if (slotKnife) slotKnife.className = 'hunt-slot completed';
    if (slotKnifeStatus) {
      slotKnifeStatus.className = 'slot-status-pill completed';
      slotKnifeStatus.textContent = '✔ ĐÃ KHÓA';
    }
    if (slotKnifeMystery) slotKnifeMystery.style.display = 'none';
    if (slotKnifeImgWrap) slotKnifeImgWrap.style.display = 'flex';
    if (slotKnifeImg) {
      slotKnifeImg.src = knife.vanillaImage || knife.imageSrc;
      slotKnifeImg.alt = knife.name;
    }
    if (slotKnifeTitle) slotKnifeTitle.textContent = knife.name;
    if (slotKnifeSub) slotKnifeSub.textContent = knife.vnName || '★ Vanilla Type';
  }

  lockSlotSkin(skin) {
    const slotSkin = document.getElementById('slotSkin');
    const slotSkinStatus = document.getElementById('slotSkinStatus');
    const slotSkinMystery = document.getElementById('slotSkinMystery');
    const slotSkinImgWrap = document.getElementById('slotSkinImgWrap');
    const slotSkinImg = document.getElementById('slotSkinImg');
    const slotSkinTitle = document.getElementById('slotSkinTitle');
    const slotSkinSub = document.getElementById('slotSkinSub');

    if (slotSkin) slotSkin.className = 'hunt-slot completed';
    if (slotSkinStatus) {
      slotSkinStatus.className = 'slot-status-pill completed';
      slotSkinStatus.textContent = '✔ ĐÃ KHÓA';
    }
    if (slotSkinMystery) slotSkinMystery.style.display = 'none';
    if (slotSkinImgWrap) slotSkinImgWrap.style.display = 'flex';
    if (slotSkinImg) {
      slotSkinImg.src = skin.imageSrc || this.selectedKnife?.vanillaImage;
      slotSkinImg.alt = skin.name;
    }
    if (slotSkinTitle) slotSkinTitle.textContent = skin.name;
    if (slotSkinSub) slotSkinSub.textContent = skin.isSpecial ? '🔥 Ô Đặc Biệt' : (skin.priceVND || 'Skin Finish');
  }

  lockSlotQuantity(qty) {
    const slotQuantity = document.getElementById('slotQuantity');
    const slotQuantityStatus = document.getElementById('slotQuantityStatus');
    const slotQuantityMystery = document.getElementById('slotQuantityMystery');
    const slotQuantityImgWrap = document.getElementById('slotQuantityImgWrap');
    const slotQuantityImg = document.getElementById('slotQuantityImg');
    const slotQuantityTitle = document.getElementById('slotQuantityTitle');
    const slotQuantitySub = document.getElementById('slotQuantitySub');

    if (slotQuantity) slotQuantity.className = 'hunt-slot completed';
    if (slotQuantityStatus) {
      slotQuantityStatus.className = 'slot-status-pill completed';
      slotQuantityStatus.textContent = '✔ ĐÃ KHÓA';
    }
    if (slotQuantityMystery) slotQuantityMystery.style.display = 'none';
    if (slotQuantityImgWrap) slotQuantityImgWrap.style.display = 'flex';
    if (slotQuantityImg) {
      slotQuantityImg.src = qty.imageSrc || 'assets/Case/Dreams & Nightmares.png';
      slotQuantityImg.alt = qty.name;
    }
    if (slotQuantityTitle) {
      slotQuantityTitle.textContent = qty.formula ? `${qty.formula} (${qty.casesCount} Hòm)` : qty.name;
    }
    if (slotQuantitySub) {
      slotQuantitySub.textContent = qty.caseName ? `Hòm ${qty.caseName}` : (qty.subtitle || qty.tag || 'Số Lượng Hòm');
    }
  }

  triggerFinalExplosionTransition() {
    const huntDashboard = document.getElementById('huntDashboard');
    if (!huntDashboard) {
      this.showTodayMissionFinale(true);
      return;
    }

    // 1. Dừng một nhịp ngắn (400ms) để người xem nhìn rõ cả 3 ô đã khóa kết quả trọn vẹn
    setTimeout(() => {
      // Bắt đầu hiệu ứng rung dồn dập trên cả 3 ô + âm thanh rumble
      huntDashboard.classList.add('slots-charging-shake');
      document.body.classList.add('screen-shake');
      window.cs2Sound.playRumble(1.3);

      // 2. Sau 1.3s: BÙM! (Nổ chớp sáng, rung cực mạnh, âm thanh nổ sấm sét)
      setTimeout(() => {
        huntDashboard.classList.remove('slots-charging-shake');
        document.body.classList.remove('screen-shake');

        // Flash chớp sáng shockwave nổ tung màn hình
        const flash = document.getElementById('explosionFlashOverlay');
        if (flash) {
          flash.style.display = 'block';
          flash.className = 'explosion-flash-overlay';
          setTimeout(() => {
            flash.style.display = 'none';
          }, 850);
        }

        // Rung toàn màn hình cực mạnh theo tiếng nổ
        document.body.classList.add('screen-shake-intense');
        setTimeout(() => {
          document.body.classList.remove('screen-shake-intense');
        }, 850);

        // Phát âm thanh nổ hoành tráng (Explosion + Gold Case victory fanfare)
        window.cs2Sound.playExplosion();
        window.cs2Sound.playGoldUnbox();

        // 3. 3 Vòng quay tan biến ("Bùm 3 vòng quay ẩn đi")
        huntDashboard.classList.add('hunt-dashboard-disintegrate');

        setTimeout(() => {
          huntDashboard.style.display = 'none';
          huntDashboard.classList.remove('hunt-dashboard-disintegrate');

          // 4. "Và hiện ra nhiệm vụ hôm nay" với hiệu ứng phóng to bùng nổ cực đỉnh
          this.showTodayMissionFinale(true);
        }, 380);

      }, 1300);
    }, 450);
  }

  showTodayMissionFinale(isEpic = false) {
    const missionSection = document.getElementById('todayMissionSection');
    if (!missionSection) return;

    missionSection.style.display = 'block';
    if (isEpic) {
      missionSection.classList.remove('tms-epic-entrance');
      void missionSection.offsetWidth; // Force reflow
      missionSection.classList.add('tms-epic-entrance');
      window.cs2Sound.playCheer();
    }

    const knife = this.selectedKnife;
    const skin = this.selectedSkin;
    const qty = this.selectedQuantity;
    const targetFullName = `${knife?.name} | ${skin?.name}`;
    const caseNameStr = qty?.caseName ? ` [Hòm ${qty.caseName}]` : '';

    const tmsBadgeText = document.getElementById('tmsBadgeText');
    if (tmsBadgeText) {
      tmsBadgeText.textContent = this.broadcastMode === 'video'
        ? '🎬 NHIỆM VỤ TẬP VIDEO HÔM NAY'
        : '🔴 NHIỆM VỤ LIVESTREAM HÔM NAY';
    }

    const formulaStr = qty?.formula ? `${qty.formula} (${qty.casesCount} Hòm)` : (qty?.name || '');
    const tmsMissionText = document.getElementById('tmsMissionText');
    if (tmsMissionText) {
      tmsMissionText.textContent = `SĂN [${targetFullName}] TRONG [${formulaStr}]${caseNameStr}!`;
    }

    const tmsTargetWeaponImg = document.getElementById('tmsTargetWeaponImg');
    const tmsTargetWeaponName = document.getElementById('tmsTargetWeaponName');
    if (tmsTargetWeaponImg) {
      tmsTargetWeaponImg.src = skin?.imageSrc || knife?.vanillaImage || '';
      tmsTargetWeaponImg.alt = targetFullName;
    }
    if (tmsTargetWeaponName) {
      tmsTargetWeaponName.textContent = targetFullName;
    }

    const tmsDropCasesList = document.getElementById('tmsDropCasesList');
    if (tmsDropCasesList) {
      const validCases = this.getValidCasesForSelection(knife, skin);
      tmsDropCasesList.innerHTML = validCases.map(c => `
        <span class="rc-case-chip ${qty?.caseName === c.name ? 'highlight-won' : ''}" style="${qty?.caseName === c.name ? 'border-color: #ffd700; color: #ffd700; font-weight: bold;' : ''}">
          <img src="${c.imageSrc}" alt="${c.name}" />
          <span>${c.name}${qty?.caseName === c.name ? ' ★' : ''}</span>
        </span>
      `).join('');
    }

    const tmsTargetCaseImg = document.getElementById('tmsTargetCaseImg');
    const tmsTargetCaseName = document.getElementById('tmsTargetCaseName');
    const tmsPressureTag = document.getElementById('tmsPressureTag');
    if (tmsTargetCaseImg) {
      tmsTargetCaseImg.src = qty?.imageSrc || '';
      tmsTargetCaseImg.alt = qty?.name || 'Hòm';
    }
    if (tmsTargetCaseName) {
      tmsTargetCaseName.textContent = `${formulaStr} (${qty?.caseName || 'Hòm Hợp Lệ'})`;
    }
    if (tmsPressureTag) {
      tmsPressureTag.textContent = qty?.tag || '⚡ THỬ THÁCH SĂN DAO';
    }

    this.targetCases = qty?.casesCount || 7;
    this.openedCases = 0;
    this.updateTodayMissionCounterUI();

    missionSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.sendSyncState();
  }

  updateTodayMissionCounterUI() {
    const countCurr = document.getElementById('tmsCountCurr');
    const countMax = document.getElementById('tmsCountMax');
    const progressFill = document.getElementById('tmsProgressFill');
    const remainingText = document.getElementById('tmsRemainingText');
    const percentText = document.getElementById('tmsPercentText');

    const curr = this.openedCases;
    const max = this.targetCases || 7;
    const isInfinite = (max === 999);

    if (countCurr) countCurr.textContent = curr;
    if (countMax) countMax.textContent = isInfinite ? '∞' : max;

    if (isInfinite) {
      if (progressFill) progressFill.style.width = '100%';
      if (remainingText) remainingText.textContent = `♾️ Mở đến khi ra dao vàng!`;
      if (percentText) percentText.textContent = `ĐÃ MỞ ${curr} HÒM`;
      return;
    }

    const pct = Math.min(100, Math.round((curr / max) * 100));
    const remaining = Math.max(0, max - curr);

    if (progressFill) {
      progressFill.style.width = `${pct}%`;
      if (pct >= 80) progressFill.classList.add('danger');
      else progressFill.classList.remove('danger');
    }

    if (remainingText) {
      if (remaining === 0) remainingText.textContent = `⚠️ HẾT HÒM RỒI!`;
      else if (remaining === 1) remainingText.textContent = `🔥 HÒM CUỐI CÙNG! CỰC ÁP LỰC!`;
      else remainingText.textContent = `Còn lại: ${remaining} hòm`;
    }

    if (percentText) percentText.textContent = `${pct}% ĐÃ MỞ`;
  }

  resetHuntFlow() {
    this.selectedKnife = null;
    this.selectedSkin = null;
    this.selectedQuantity = null;
    this.currentStage = 1;
    this.lastWinnerStage1 = null;
    this.lastWinnerStage2 = null;
    this.lastWinnerStage3 = null;
    this.openedCases = 0;
    this.stage3Modifiers = [];
    this.stage3IsShowingModifier = false;
    if (this.stage3AutoContinueTimer) {
      clearTimeout(this.stage3AutoContinueTimer);
      this.stage3AutoContinueTimer = null;
    }

    const slotKnife = document.getElementById('slotKnife');
    const slotKnifeStatus = document.getElementById('slotKnifeStatus');
    const slotKnifeMystery = document.getElementById('slotKnifeMystery');
    const slotKnifeImgWrap = document.getElementById('slotKnifeImgWrap');
    const slotKnifeTitle = document.getElementById('slotKnifeTitle');
    const slotKnifeSub = document.getElementById('slotKnifeSub');

    if (slotKnife) {
      slotKnife.className = 'hunt-slot active slot-golden-glow';
    }
    if (slotKnifeStatus) {
      slotKnifeStatus.className = 'slot-status-pill active';
      slotKnifeStatus.textContent = 'ĐANG CHỜ QUAY';
    }
    if (slotKnifeMystery) slotKnifeMystery.style.display = 'block';
    if (slotKnifeImgWrap) slotKnifeImgWrap.style.display = 'none';
    if (slotKnifeTitle) slotKnifeTitle.textContent = 'Chưa Chọn Loại Dao';
    if (slotKnifeSub) slotKnifeSub.textContent = '20 Dòng Dao CS2 (Vanilla)';

    const slotSkin = document.getElementById('slotSkin');
    const slotSkinStatus = document.getElementById('slotSkinStatus');
    const slotSkinMystery = document.getElementById('slotSkinMystery');
    const slotSkinImgWrap = document.getElementById('slotSkinImgWrap');
    const slotSkinTitle = document.getElementById('slotSkinTitle');
    const slotSkinSub = document.getElementById('slotSkinSub');

    if (slotSkin) {
      slotSkin.className = 'hunt-slot locked';
      slotSkin.classList.remove('slot-golden-glow');
    }
    if (slotSkinStatus) {
      slotSkinStatus.className = 'slot-status-pill locked';
      slotSkinStatus.textContent = 'KHÓA';
    }
    if (slotSkinMystery) slotSkinMystery.style.display = 'block';
    if (slotSkinImgWrap) slotSkinImgWrap.style.display = 'none';
    if (slotSkinTitle) slotSkinTitle.textContent = 'Chưa Chọn Skin';
    if (slotSkinSub) slotSkinSub.textContent = 'Mở khóa sau Vòng 1';

    const slotQuantity = document.getElementById('slotQuantity');
    const slotQuantityStatus = document.getElementById('slotQuantityStatus');
    const slotQuantityMystery = document.getElementById('slotQuantityMystery');
    const slotQuantityImgWrap = document.getElementById('slotQuantityImgWrap');
    const slotQuantityTitle = document.getElementById('slotQuantityTitle');
    const slotQuantitySub = document.getElementById('slotQuantitySub');

    if (slotQuantity) {
      slotQuantity.className = 'hunt-slot locked';
      slotQuantity.classList.remove('slot-golden-glow');
    }
    if (slotQuantityStatus) {
      slotQuantityStatus.className = 'slot-status-pill locked';
      slotQuantityStatus.textContent = 'KHÓA';
    }
    if (slotQuantityMystery) slotQuantityMystery.style.display = 'block';
    if (slotQuantityImgWrap) slotQuantityImgWrap.style.display = 'none';
    if (slotQuantityTitle) slotQuantityTitle.textContent = 'Chưa Có Số Lượng';
    if (slotQuantitySub) slotQuantitySub.textContent = 'Mở khóa sau Vòng 2';

    const step1El = document.getElementById('step1Indicator');
    const step1Desc = document.getElementById('step1Desc');
    const step2El = document.getElementById('step2Indicator');
    const step2Desc = document.getElementById('step2Desc');
    const step3El = document.getElementById('step3Indicator');
    const step3Desc = document.getElementById('step3Desc');
    if (step1El) step1El.className = 'stage-step active';
    if (step1Desc) step1Desc.textContent = '20 Loại Dao CS2 (Hiển thị con dao Vanilla)';
    if (step2El) step2El.className = 'stage-step';
    if (step2Desc) step2Desc.textContent = 'Chờ quay Vòng 1 để chọn dao...';
    if (step3El) step3El.className = 'stage-step';
    if (step3Desc) step3Desc.textContent = 'Chờ quay Vòng 2 để chốt skin...';

    // Restore 3-slot hunt dashboard
    const huntDashboard = document.getElementById('huntDashboard');
    if (huntDashboard) {
      huntDashboard.style.display = 'block';
      huntDashboard.classList.remove('hunt-dashboard-disintegrate', 'slots-charging-shake');
    }

    const huntStartBar = document.getElementById('huntStartBar');
    const startBtnText = document.getElementById('startBtnText');
    if (huntStartBar) huntStartBar.style.display = 'flex';
    if (startBtnText) startBtnText.textContent = 'SĂN MỤC TIÊU';

    const todayMissionSection = document.getElementById('todayMissionSection');
    if (todayMissionSection) {
      todayMissionSection.style.display = 'none';
      todayMissionSection.classList.remove('tms-epic-entrance');
    }

    const modal = document.getElementById('spinSpotlightModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active', 'fading-out-backdrop');
    }

    this.engine.setItems(this.getActiveKnivesList(), 1);
    this.sendSyncState();
  }

  /* =========================================================================
   * STAGE 3 MODIFIERS & RE-SPIN LOGIC
   * ========================================================================= */
  getStage3ComboText() {
    if (!this.stage3Modifiers || this.stage3Modifiers.length === 0) return '';
    return this.stage3Modifiers.map(m => {
      if (m.modifierType === 'multiply') return `x${m.modifierValue || 2}`;
      if (m.modifierType === 'add') return `+${m.modifierValue || 3}`;
      return m.name;
    }).join(' ');
  }

  computeFinalStage3Result(baseQty, modifiers = []) {
    const baseCount = baseQty.casesCount || parseInt(baseQty.name) || 10;
    const multipliers = modifiers.filter(m => m.modifierType === 'multiply');
    const additions = modifiers.filter(m => m.modifierType === 'add');

    let multFactor = 1;
    let multFormulaParts = '';
    multipliers.forEach(m => {
      const val = m.modifierValue || 2;
      multFactor *= val;
      multFormulaParts += `x${val}`;
    });

    let addSum = 0;
    let addFormulaParts = '';
    additions.forEach(m => {
      const val = m.modifierValue || 3;
      addSum += val;
      addFormulaParts += `+${val}`;
    });

    const finalTotal = (baseCount * multFactor) + addSum;
    const hasModifiers = modifiers.length > 0;
    const formula = hasModifiers ? `${baseCount}${multFormulaParts}${addFormulaParts}` : null;

    return {
      ...baseQty,
      isModifier: false,
      casesCount: finalTotal,
      formula: formula,
      name: hasModifiers ? `${formula} (${finalTotal} Hòm)` : `${baseCount} Hòm`,
      title: hasModifiers ? `${formula} = ${finalTotal} Hòm` : `${baseCount} Hòm`,
      subtitle: hasModifiers 
        ? `Đã tích lũy combo: ${modifiers.map(m => m.name).join(' + ')}` 
        : (baseQty.caseName ? `Hòm ${baseQty.caseName}` : 'Số Lượng Hòm'),
      tag: hasModifiers ? `🔥 COMBO ${formula}` : baseQty.tag
    };
  }

  showStage3ModifierReveal(winnerQty) {
    this.stage3IsShowingModifier = true;
    const spinnerArea = document.getElementById('spotlightSpinnerArea');
    const revealArea = document.getElementById('winnerRevealCardArea');
    const revealCard = document.getElementById('revealCard');
    const revealBadge = document.getElementById('revealBadge');
    const revealCardImg = document.getElementById('revealCardImg');
    const revealTitle = document.getElementById('revealTitle');
    const revealSubtitle = document.getElementById('revealSubtitle');
    const revealCasesWrap = document.getElementById('revealCasesWrap');
    const revealBtnText = document.getElementById('revealBtnText');

    if (spinnerArea) spinnerArea.style.display = 'none';
    if (revealArea) revealArea.style.display = 'flex';
    if (revealCard) revealCard.style.opacity = '1';

    if (revealBadge) revealBadge.textContent = '⚡ Ô BỔ TRỢ ĐẶC BIỆT (VÒNG 3)';
    if (revealCardImg) {
      revealCardImg.src = winnerQty.imageSrc || 'assets/Case/Dreams & Nightmares.png';
      revealCardImg.alt = winnerQty.name;
    }
    if (revealTitle) revealTitle.textContent = winnerQty.name;
    const comboStr = this.getStage3ComboText();
    if (revealSubtitle) {
      revealSubtitle.innerHTML = `Trúng ô bổ trợ! Chuỗi đang tích lũy: <b style="color:#ffd700; font-size:16px;">[ ${comboStr} ]</b><br><span style="color:#aaa;">Quay tiếp một lần nữa cho đến khi ra số lượng hòm cụ thể!</span>`;
    }
    if (revealCasesWrap) revealCasesWrap.style.display = 'none';
    if (revealBtnText) revealBtnText.textContent = `QUAY TIẾP SỐ LƯỢNG HÒM (${comboStr}) ➔`;

    this.sendSyncState();

    if (this.stage3AutoContinueTimer) clearTimeout(this.stage3AutoContinueTimer);
    this.stage3AutoContinueTimer = setTimeout(() => {
      if (this.stage3IsShowingModifier) {
        this.continueStage3Spin();
      }
    }, 2600);
  }

  continueStage3Spin() {
    this.stage3IsShowingModifier = false;
    if (this.stage3AutoContinueTimer) {
      clearTimeout(this.stage3AutoContinueTimer);
      this.stage3AutoContinueTimer = null;
    }

    const spinnerArea = document.getElementById('spotlightSpinnerArea');
    const revealArea = document.getElementById('winnerRevealCardArea');
    if (revealArea) revealArea.style.display = 'none';
    if (spinnerArea) spinnerArea.style.display = 'flex';

    const stageTitle = document.getElementById('spotlightStageTitle');
    if (stageTitle) {
      stageTitle.textContent = `QUAY HÒM & SỐ LƯỢNG [Đang tích lũy: ${this.getStage3ComboText()}]`;
    }
    const stageDesc = document.getElementById('spotlightStageDesc');
    if (stageDesc) {
      stageDesc.textContent = `Chuỗi bổ trợ: ${this.getStage3ComboText()} • Đang quay tiếp để chốt số lượng...`;
    }

    this.sendSyncState();

    setTimeout(() => {
      this.handleSpotlightSpinExecution(3);
    }, 450);
  }

  saveAllSettings() {
    try {
      const broadcastChecked = document.querySelector('input[name="broadcastRadio"]:checked');
      if (broadcastChecked) {
        localStorage.setItem('cs2_broadcast_mode', broadcastChecked.value);
        this.broadcastMode = broadcastChecked.value;
      }

      const suspenseChecked = document.querySelector('input[name="suspenseRadio"]:checked');
      if (suspenseChecked) {
        localStorage.setItem('cs2_suspense_level', suspenseChecked.value);
        if (this.engine) this.engine.setSuspenseLevel(suspenseChecked.value);
      }

      const oddsChecked = document.querySelector('input[name="oddsRadio"]:checked');
      if (oddsChecked) {
        localStorage.setItem('cs2_odds_mode', oddsChecked.value);
        if (this.engine) this.engine.setOddsMode(oddsChecked.value);
      }

      if (this.engine?.mode) {
        localStorage.setItem('cs2_spinner_mode', this.engine.mode);
      }

      if (window.cs2Sound) {
        localStorage.setItem('cs2_audio_volume', String(window.cs2Sound.masterVolume));
        localStorage.setItem('cs2_audio_muted', String(window.cs2Sound.isMuted));
      }

      if (this.enabledKnifeIds) {
        localStorage.setItem('cs2_enabled_knives', JSON.stringify(Array.from(this.enabledKnifeIds)));
      }

      this.saveCollection();
      this.sendSyncState();
      window.cs2Sound?.playButtonClick();
      this.showToast('✔ ĐÃ LƯU TOÀN BỘ CÀI ĐẶT & BỘ SƯU TẬP!');
    } catch (e) {
      console.error('Failed to save settings:', e);
      this.showToast('❌ Lỗi khi lưu cài đặt!');
    }
  }

  showToast(msg) {
    let toast = document.getElementById('csAppToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'csAppToast';
      toast.className = 'cs-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  bindEvents() {
    // Mode Switcher (Roller vs Wheel)
    const modeTabs = document.querySelectorAll('.mode-tab');
    modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (this.engine.isSpinning) return;
        window.cs2Sound.playButtonClick();
        const mode = tab.dataset.mode;
        modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.getElementById('rollerContainer').style.display = mode === 'roller' ? 'block' : 'none';
        document.getElementById('wheelContainer').style.display = mode === 'wheel' ? 'flex' : 'none';

        this.engine.setMode(mode);
        localStorage.setItem('cs2_spinner_mode', mode);
        this.sendSyncState();
      });
    });

    // Broadcast Mode Toggle Button (Header)
    const broadcastToggleBtn = document.getElementById('broadcastModeToggleBtn');
    if (broadcastToggleBtn) {
      broadcastToggleBtn.addEventListener('click', () => {
        this.toggleBroadcastMode();
      });
    }

    // Secret hotkey to toggle header controls and stats on viewer screen (F8 or Ctrl+H)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'h') || e.key === 'F8') {
        const headerActions = document.getElementById('mainHeaderActions');
        const statsStrip = document.getElementById('mainStatsStrip');
        if (headerActions) {
          const isHidden = headerActions.style.display === 'none';
          headerActions.style.display = isHidden ? 'flex' : 'none';
        }
        if (statsStrip) {
          const isHidden = statsStrip.style.display === 'none';
          statsStrip.style.display = isHidden ? 'flex' : 'none';
        }
      }
    });

    // Start Spin Flow Button (Main Dashboard Trigger)
    const startSpinFlowBtn = document.getElementById('startSpinFlowBtn');
    if (startSpinFlowBtn) {
      startSpinFlowBtn.addEventListener('click', () => {
        if (this.engine && this.engine.isSpinning) return;
        window.cs2Sound.playButtonClick();
        this.startSpotlightSpin(this.currentStage || 1);
      });
    }

    // Reveal Continue Button
    const revealContinueBtn = document.getElementById('revealContinueBtn');
    if (revealContinueBtn) {
      revealContinueBtn.addEventListener('click', () => {
        this.handleRevealContinue();
      });
    }

    // Today Mission Counter & Action Buttons
    const tmsPlusBtn = document.getElementById('tmsPlusBtn');
    if (tmsPlusBtn) {
      tmsPlusBtn.addEventListener('click', () => this.incrementOpenedCases());
    }

    const tmsMinusBtn = document.getElementById('tmsMinusBtn');
    if (tmsMinusBtn) {
      tmsMinusBtn.addEventListener('click', () => this.decrementOpenedCases());
    }

    const tmsWinBtn = document.getElementById('tmsWinBtn');
    if (tmsWinBtn) {
      tmsWinBtn.addEventListener('click', () => this.handleHuntWin());
    }

    const tmsFailBtn = document.getElementById('tmsFailBtn');
    if (tmsFailBtn) {
      tmsFailBtn.addEventListener('click', () => this.handleHuntFail());
    }

    const tmsNewHuntBtn = document.getElementById('tmsNewHuntBtn');
    if (tmsNewHuntBtn) {
      tmsNewHuntBtn.addEventListener('click', () => {
        window.cs2Sound.playButtonClick();
        this.resetHuntFlow();
      });
    }

    // Spin Buttons
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) spinBtn.addEventListener('click', () => this.handleSpin());

    const wheelCenterBtn = document.getElementById('wheelCenterBtn');
    if (wheelCenterBtn) wheelCenterBtn.addEventListener('click', () => this.handleSpin());

    // Reset Stage button
    const resetStageBtn = document.getElementById('resetStageBtn');
    if (resetStageBtn) {
      resetStageBtn.addEventListener('click', () => {
        if (this.engine.isSpinning) return;
        window.cs2Sound.playButtonClick();
        this.resetHuntFlow();
      });
    }

    // Reset Hunt from Dashboard button
    const resetHuntBtn = document.getElementById('resetHuntBtn');
    if (resetHuntBtn) {
      resetHuntBtn.addEventListener('click', () => {
        if (this.engine.isSpinning) return;
        window.cs2Sound.playButtonClick();
        this.resetHuntFlow();
      });
    }

    // Live Hunt Mission Tracker Buttons
    const hmtPlusBtn = document.getElementById('hmtPlusBtn');
    if (hmtPlusBtn) {
      hmtPlusBtn.addEventListener('click', () => this.incrementOpenedCases());
    }

    const hmtMinusBtn = document.getElementById('hmtMinusBtn');
    if (hmtMinusBtn) {
      hmtMinusBtn.addEventListener('click', () => this.decrementOpenedCases());
    }

    const hmtWinBtn = document.getElementById('hmtWinBtn');
    if (hmtWinBtn) {
      hmtWinBtn.addEventListener('click', () => this.handleHuntWin());
    }

    const hmtFailBtn = document.getElementById('hmtFailBtn');
    if (hmtFailBtn) {
      hmtFailBtn.addEventListener('click', () => this.handleHuntFail());
    }

    const hmtNewHuntBtn = document.getElementById('hmtNewHuntBtn');
    if (hmtNewHuntBtn) {
      hmtNewHuntBtn.addEventListener('click', () => {
        window.cs2Sound.playButtonClick();
        this.setStage(1);
      });
    }

    // Next Roll button on Modal
    const modalNextRollBtn = document.getElementById('modalNextRollBtn');
    if (modalNextRollBtn) {
      modalNextRollBtn.addEventListener('click', () => {
        this.closeWinnerModal();
        this.setStage(1);
      });
    }

    // Modal Close
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.closeWinnerModal());

    // Live float wear update on Modal
    const modalFloatInput = document.getElementById('modalFloatInput');
    const modalStatTrakChk = document.getElementById('modalStatTrakChk');

    const onModalConditionChange = () => {
      if (!this.lastWonSkin) return;
      this.updateWearUI('modalFloatInput', 'modalWearTag', 'modalWearPin');
      const floatVal = parseFloat(modalFloatInput?.value || '0.225');
      const isVanilla = this.lastWonSkin.isVanilla || (this.lastWonSkin.availableWears && this.lastWonSkin.availableWears.includes('Vanilla'));
      const wearTag = isVanilla ? 'Vanilla' : this.getWearInfo(floatVal).tag;
      const isStatTrak = !!modalStatTrakChk?.checked;
      this.updateModalMarketAndPrice(this.lastWonSkin, wearTag, isStatTrak);
    };

    if (modalFloatInput) {
      modalFloatInput.addEventListener('input', onModalConditionChange);
      modalFloatInput.addEventListener('change', onModalConditionChange);
    }

    if (modalStatTrakChk) {
      modalStatTrakChk.addEventListener('change', onModalConditionChange);
    }

    // Quick Wear Condition Selector Buttons on Modal (FN, MW, FT, WW, BS)
    document.querySelectorAll('#modalWearButtons .mwb-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!this.lastWonSkin) return;
        const wearTag = btn.dataset.wear;
        const targetFloat = this.getStandardFloatForWear(wearTag, this.lastWonSkin.minFloat, this.lastWonSkin.maxFloat);
        if (modalFloatInput) {
          modalFloatInput.value = targetFloat.toFixed(4);
        }
        onModalConditionChange();
      });
    });

    // Save to Collection Button on Modal
    const saveToCollBtn = document.getElementById('saveToCollectionBtn');
    if (saveToCollBtn) {
      saveToCollBtn.addEventListener('click', () => {
        if (!this.lastWonSkin) return;
        window.cs2Sound.playButtonClick();

        const floatVal = document.getElementById('modalFloatInput')?.value || '0.2245';
        const isStatTrak = !!document.getElementById('modalStatTrakChk')?.checked;
        const notes = document.getElementById('modalEpisodeNotes')?.value || '';

        const isVanilla = this.lastWonSkin.isVanilla || (this.lastWonSkin.availableWears && this.lastWonSkin.availableWears.includes('Vanilla'));
        const wearTag = isVanilla ? 'Vanilla' : this.getWearInfo(floatVal).tag;
        const pricing = this.getSkinPricingForWear(this.lastWonSkin, wearTag, isStatTrak);

        this.addToCollection({
          knifeId: this.selectedKnife?.id,
          knifeName: this.selectedKnife?.name,
          skinName: this.lastWonSkin.name,
          fullName: this.lastWonSkin.fullName || `★ ${this.selectedKnife?.name} | ${this.lastWonSkin.name}`,
          tier: pricing.tier,
          imageSrc: this.lastWonSkin.imageSrc,
          floatVal,
          isStatTrak,
          priceVND: pricing.priceVND,
          priceUSD: pricing.priceUSD,
          cases: this.lastWonSkin.cases,
          notes
        });

        const saveSuccessMsg = document.getElementById('saveSuccessMsg');
        if (saveSuccessMsg) saveSuccessMsg.style.display = 'inline-block';
        saveToCollBtn.disabled = true;
        saveToCollBtn.innerHTML = '✔ ĐÃ LƯU VÀO BỘ SƯU TẬP';
      });
    }

    // Collection View Switcher (Cards vs Table)
    const viewCardsBtn = document.getElementById('viewCardsBtn');
    const viewTableBtn = document.getElementById('viewTableBtn');
    if (viewCardsBtn && viewTableBtn) {
      viewCardsBtn.addEventListener('click', () => {
        viewCardsBtn.classList.add('active');
        viewTableBtn.classList.remove('active');
        this.collectionView = 'cards';
        this.renderCollection();
      });
      viewTableBtn.addEventListener('click', () => {
        viewTableBtn.classList.add('active');
        viewCardsBtn.classList.remove('active');
        this.collectionView = 'table';
        this.renderCollection();
      });
    }

    // Export Collection JSON
    const exportCollBtn = document.getElementById('exportCollBtn');
    if (exportCollBtn) {
      exportCollBtn.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.collection, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `cs2_knife_collection_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      });
    }

    // Import Collection JSON
    const importCollFile = document.getElementById('importCollFile');
    if (importCollFile) {
      importCollFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (Array.isArray(imported)) {
              if (confirm(`Tìm thấy ${imported.length} con dao trong file backup. Bạn có muốn khôi phục vào bộ sưu tập?`)) {
                this.collection = imported;
                this.saveCollection();
                alert('Khôi phục bộ sưu tập thành công!');
              }
            } else {
              alert('File JSON không hợp lệ!');
            }
          } catch (err) {
            alert('Lỗi đọc file JSON: ' + err.message);
          }
        };
        reader.readAsText(file);
      });
    }

    // Clear Collection
    const clearCollBtn = document.getElementById('clearCollBtn');
    if (clearCollBtn) {
      clearCollBtn.addEventListener('click', () => {
        if (confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa TOÀN BỘ dao trong bộ sưu tập?')) {
          this.collection = [];
          this.saveCollection();
        }
      });
    }

    // Manual Add Knife Modal
    this.bindManualAddModal();

    // Dedicated Collection Modal (Bật tắt giống Setting)
    const openCollectionBtn = document.getElementById('openCollectionBtn');
    const collectionModal = document.getElementById('collectionModal');
    const closeCollectionBtn = document.getElementById('closeCollectionBtn');
    const collectionBackdrop = document.querySelector('.collection-backdrop');
    const statCollectionCell = document.getElementById('statCollectionCell');

    const openCollection = () => {
      window.cs2Sound.playButtonClick();
      if (collectionModal) collectionModal.classList.add('active');
    };

    const closeCollection = () => {
      if (collectionModal) {
        window.cs2Sound.playButtonClick();
        collectionModal.classList.remove('active');
      }
    };

    if (openCollectionBtn && collectionModal) openCollectionBtn.addEventListener('click', openCollection);
    if (statCollectionCell && collectionModal) statCollectionCell.addEventListener('click', openCollection);
    if (closeCollectionBtn) closeCollectionBtn.addEventListener('click', closeCollection);
    if (collectionBackdrop) collectionBackdrop.addEventListener('click', closeCollection);

    // Settings Modal
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const settingsBackdrop = document.querySelector('.settings-backdrop');

    if (openSettingsBtn && settingsModal) {
      openSettingsBtn.addEventListener('click', () => {
        window.cs2Sound.playButtonClick();
        settingsModal.classList.add('active');
      });
    }

    const closeSettings = () => {
      if (settingsModal) {
        window.cs2Sound.playButtonClick();
        settingsModal.classList.remove('active');
      }
    };

    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        this.saveAllSettings();
        closeSettings();
      });
    }
    if (settingsBackdrop) settingsBackdrop.addEventListener('click', closeSettings);

    // Global ESC to close open modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (settingsModal && settingsModal.classList.contains('active')) closeSettings();
        if (collectionModal && collectionModal.classList.contains('active')) closeCollection();
      }
    });

    // Settings Navigation Tabs
    const setNavTabs = document.querySelectorAll('.set-nav-tab');
    setNavTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        window.cs2Sound.playButtonClick();
        setNavTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetPaneId = tab.dataset.tab;
        document.querySelectorAll('.set-tab-pane').forEach(p => p.classList.remove('active'));
        const targetPane = document.getElementById(targetPaneId);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Radio: Broadcast Mode (Video vs Livestream)
    document.querySelectorAll('input[name="broadcastRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.setBroadcastMode(e.target.value);
        localStorage.setItem('cs2_broadcast_mode', e.target.value);
        window.cs2Sound.playButtonClick();
      });
    });

    // Radio: Suspense Level
    document.querySelectorAll('input[name="suspenseRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.engine.setSuspenseLevel(e.target.value);
        localStorage.setItem('cs2_suspense_level', e.target.value);
        const labels = { 'ultra': '🔥 Cực Hồi Hộp', 'high': '⚡ Chuẩn CS2', 'normal': '⏱️ Mở Siêu Tốc' };
        const quickEl = document.getElementById('quickSuspenseLabel');
        if (quickEl) quickEl.textContent = labels[e.target.value] || e.target.value;
        this.sendSyncState();
      });
    });

    // Radio: Odds Mode
    document.querySelectorAll('input[name="oddsRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.engine.setOddsMode(e.target.value);
        localStorage.setItem('cs2_odds_mode', e.target.value);
        this.renderKnivesManager();
        const labels = { 'realistic': '🎲 Chuẩn CS2', 'equal': '⚖️ Đồng Đều' };
        const quickEl = document.getElementById('quickOddsLabel');
        if (quickEl) quickEl.textContent = labels[e.target.value] || e.target.value;
        this.sendSyncState();
      });
    });

    // Audio Controls
    const modalMuteBtn = document.getElementById('modalMuteBtn');
    if (modalMuteBtn) {
      modalMuteBtn.addEventListener('click', () => {
        const isMuted = window.cs2Sound.toggleMute();
        modalMuteBtn.innerHTML = isMuted ? '<i class="icon">🔇</i> Âm Thanh: ĐANG TẮT' : '<i class="icon">🔊</i> Âm Thanh: ĐANG BẬT';
        modalMuteBtn.className = isMuted ? 'cs-btn cs-btn-dark' : 'cs-btn cs-btn-gold';
      });
    }

    const testSoundBtn = document.getElementById('testSoundBtn');
    if (testSoundBtn) {
      testSoundBtn.addEventListener('click', () => window.cs2Sound.playGoldUnbox());
    }

    const modalVolumeSlider = document.getElementById('modalVolumeSlider');
    const volPercent = document.getElementById('volPercent');
    if (modalVolumeSlider) {
      modalVolumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        window.cs2Sound.setVolume(val);
        if (volPercent) volPercent.textContent = `${Math.round(val * 100)}%`;
      });
    }

    // Select/Deselect All Knives
    const selectAllBtn = document.getElementById('selectAllBtn');
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        this.knives.forEach(k => this.enabledKnifeIds.add(k.id));
        this.onKnivesSelectionChanged();
      });
    }
    const deselectAllBtn = document.getElementById('deselectAllBtn');
    if (deselectAllBtn) {
      deselectAllBtn.addEventListener('click', () => {
        this.enabledKnifeIds.clear();
        if (this.knives.length > 0) this.enabledKnifeIds.add(this.knives[0].id);
        this.onKnivesSelectionChanged();
      });
    }

    // Fullscreen Toggle
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
          fullscreenBtn.innerHTML = '<i class="icon">⛶</i> Thu nhỏ';
        } else {
          document.exitFullscreen().catch(() => {});
          fullscreenBtn.innerHTML = '<i class="icon">⛶</i> Toàn màn hình';
        }
      });
    }

    // Spacebar shortcut
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        const winnerModal = document.getElementById('winnerModal');
        const settingsModal = document.getElementById('settingsModal');
        const manualModal = document.getElementById('manualAddModal');

        if (winnerModal && winnerModal.classList.contains('active')) {
          this.closeWinnerModal();
        } else if ((settingsModal && settingsModal.classList.contains('active')) || (manualModal && manualModal.classList.contains('active'))) {
          // Do nothing if in settings / manual modal
        } else {
          this.handleSpin();
        }
      }
    });
  }

  /* =========================================================================
   * MANUAL ADD KNIFE MODAL LOGIC
   * ========================================================================= */
  bindManualAddModal() {
    const openBtn = document.getElementById('openManualAddBtn');
    const modal = document.getElementById('manualAddModal');
    const closeBtn = document.getElementById('closeManualAddBtn');
    const backdrop = document.getElementById('manualAddBackdrop');
    const knifeSelect = document.getElementById('manualKnifeSelect');
    const skinSelect = document.getElementById('manualSkinSelect');
    const floatInput = document.getElementById('manualFloatInput');
    const form = document.getElementById('manualAddForm');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        window.cs2Sound.playButtonClick();
        this.populateManualKnifeSelect();
        modal.classList.add('active');
      });
    }

    const closeModal = () => {
      if (modal) modal.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    if (knifeSelect) {
      knifeSelect.addEventListener('change', () => {
        const knifeId = knifeSelect.value;
        const knife = this.knives.find(k => k.id === knifeId);
        this.populateManualSkinSelect(knife);
      });
    }

    if (floatInput) {
      floatInput.addEventListener('input', () => {
        this.updateWearUI('manualFloatInput', 'manualWearTag', 'manualWearPin');
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const knifeId = knifeSelect.value;
        const knife = this.knives.find(k => k.id === knifeId);
        if (!knife) return;

        const skinId = skinSelect.value;
        const skin = knife.skins?.find(s => s.id === skinId) || { name: 'Vanilla', fullName: `${knife.name} | Vanilla`, imageSrc: knife.vanillaImage, tier: knife.tier, cases: [] };

        const floatVal = floatInput.value || '0.0250';
        const isStatTrak = !!document.getElementById('manualStatTrakChk')?.checked;
        const notes = document.getElementById('manualNotesInput')?.value || '';

        const isVanilla = skin.isVanilla || (skin.availableWears && skin.availableWears.includes('Vanilla'));
        const wearTag = isVanilla ? 'Vanilla' : this.getWearInfo(floatVal).tag;
        const pricing = this.getSkinPricingForWear(skin, wearTag, isStatTrak);

        this.addToCollection({
          knifeId: knife.id,
          knifeName: knife.name,
          skinName: skin.name,
          fullName: skin.fullName || `★ ${knife.name} | ${skin.name}`,
          tier: pricing.tier,
          imageSrc: skin.imageSrc || knife.vanillaImage,
          floatVal,
          isStatTrak,
          priceVND: pricing.priceVND,
          priceUSD: pricing.priceUSD,
          cases: skin.cases || [],
          notes
        });

        window.cs2Sound.playCheer();
        closeModal();
        alert(`Đã thêm ${skin.fullName || knife.name} vào bộ sưu tập!`);
      });
    }
  }

  populateManualKnifeSelect() {
    const knifeSelect = document.getElementById('manualKnifeSelect');
    if (!knifeSelect) return;

    knifeSelect.innerHTML = this.knives.map(k => `
      <option value="${k.id}">${k.name} (${k.vnName || ''})</option>
    `).join('');

    if (this.knives.length > 0) {
      this.populateManualSkinSelect(this.knives[0]);
    }
  }

  populateManualSkinSelect(knife) {
    const skinSelect = document.getElementById('manualSkinSelect');
    if (!skinSelect || !knife) return;

    const skins = knife.skins || [{ id: `${knife.id}_vanilla`, name: 'Vanilla', fullName: `${knife.name} | Vanilla` }];
    skinSelect.innerHTML = skins.map(s => `
      <option value="${s.id}">${s.name} - Tier ${s.tier || knife.tier} (${s.priceVND || ''})</option>
    `).join('');
  }

  /* =========================================================================
   * DATA RENDERING HELPERS
   * ========================================================================= */
  getActiveKnivesList() {
    return this.knives.filter(k => this.enabledKnifeIds.has(k.id));
  }

  updateBadges() {
    const activeCount = this.enabledKnifeIds.size;
    const b1 = document.getElementById('activeCountBadge');
    const b2 = document.getElementById('modalActiveCount');
    if (b1) b1.textContent = activeCount;
    if (b2) b2.textContent = activeCount;
  }

  onKnivesSelectionChanged() {
    this.updateBadges();
    if (this.currentStage === 1) {
      this.engine.setActiveKnives(this.getActiveKnivesList());
    }
    this.renderKnivesManager();
    this.renderMainKnivesGrid();
    try {
      localStorage.setItem('cs2_enabled_knives', JSON.stringify(Array.from(this.enabledKnifeIds)));
    } catch (e) {}
    this.sendSyncState();
  }

  recordWinner(winnerSkin) {
    this.stats.unboxedCount++;
    const rawPrice = parseInt((winnerSkin.priceVND || '0').replace(/\./g, '').replace(/đ/g, '').trim()) || 0;
    this.stats.totalVND += rawPrice;

    if (!this.stats.topKnife || rawPrice > (parseInt((this.stats.topKnife.priceVND || '0').replace(/\./g, '').replace(/đ/g, '').trim()) || 0)) {
      this.stats.topKnife = winnerSkin;
    }

    this.updateStatsUI();
  }

  updateStatsUI() {
    const sc = document.getElementById('statCount');
    const st = document.getElementById('statTotalValue');
    const sk = document.getElementById('statTopKnife');
    if (sc) sc.textContent = this.stats.unboxedCount;
    if (st) st.textContent = `${this.stats.totalVND.toLocaleString('vi-VN')} đ`;
    if (sk) sk.textContent = this.stats.topKnife ? (this.stats.topKnife.fullName || this.stats.topKnife.name) : 'Chưa có';
  }

  renderMainKnivesGrid() {
    const grid = document.getElementById('mainKnivesGrid');
    if (!grid) return;

    grid.innerHTML = this.knives.map(knife => {
      const vanillaImg = knife.vanillaImage || `assets/${knife.folder}/Vanilla.png`;
      const skinsCount = knife.skinsCount || (knife.skins ? knife.skins.length : 13);

      return `
        <div class="main-knife-card" data-id="${knife.id}" title="Bấm để chọn dao này cho bước 2">
          <div class="mkc-img-wrap">
            <img class="mkc-img" src="${vanillaImg}" alt="${knife.name}" loading="lazy" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 2px; overflow: hidden;">
            <span class="mkc-name">${knife.name}</span>
            <span style="font-size: 11px; color: #94a3b8;">${knife.vnName || ''} • <strong style="color: var(--gold-primary);">${skinsCount} Skins</strong></span>
          </div>
        </div>
      `;
    }).join('');

    // Allow clicking knife to quick-jump to Stage 2 with that knife!
    grid.querySelectorAll('.main-knife-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (this.engine.isSpinning) return;
        const id = card.dataset.id;
        const knife = this.knives.find(k => k.id === id);
        if (knife) {
          window.cs2Sound.playButtonClick();
          this.setStage(2, knife);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }
      });
    });
  }

  renderKnivesManager() {
    const list = document.getElementById('knivesManagerList');
    if (!list) return;

    const totalWeight = this.knives
      .filter(k => this.enabledKnifeIds.has(k.id))
      .reduce((sum, k) => sum + this.engine.getKnifeWeight(k), 0);

    list.innerHTML = this.knives.map(knife => {
      const isChecked = this.enabledKnifeIds.has(knife.id);
      const weight = this.engine.getKnifeWeight(knife);
      const percent = isChecked && totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(2) : '0.00';
      const vanillaImg = knife.vanillaImage || `assets/${knife.folder}/Vanilla.png`;

      return `
        <div class="knife-manage-row ${isChecked ? 'active' : 'disabled'}">
          <label class="knife-checkbox-label">
            <input type="checkbox" class="knife-toggle-chk" data-id="${knife.id}" ${isChecked ? 'checked' : ''} />
            <img class="knife-manage-thumb" src="${vanillaImg}" alt="${knife.name}" />
            <div class="knife-manage-info">
              <div class="km-name">${knife.name} <span class="km-badge tier-${(knife.tier || 'a').toLowerCase().replace('+', '-plus')}">${knife.tier}</span></div>
              <div class="km-skin">${knife.vnName || '★ Vanilla Type'} - ${knife.skinsCount || 13} Skins</div>
            </div>
          </label>
          <div class="knife-odds-badge">
            <span class="odds-val">${percent}%</span>
          </div>
        </div>
      `;
    }).join('');

    // Bind checkboxes
    list.querySelectorAll('.knife-toggle-chk').forEach(chk => {
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
}

// Bootstrap on DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  window.app = new CS2App();
});
