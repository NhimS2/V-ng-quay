import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update init() to load enabled knives from localStorage and initSyncChannel()
init_target = """    // Prepare initial roller view for Stage 1
    this.setStage(1);
  }"""

init_replacement = """    // Check saved enabled knives from localStorage
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
        oddsMode: this.engine?.oddsMode || 'realistic',
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
  }"""

if init_target in content:
    content = content.replace(init_target, init_replacement, 1)
    print("Injected initSyncChannel & sync methods.")
else:
    print("Warning: init_target not found!")

# 2. Add sendSyncState() to setBroadcastMode
bm_target = """    } else if (this.currentStage === 2 && this.selectedKnife && this.engine && !this.engine.isSpinning) {
      this.engine.setItems(this.getSkinsForSelectedKnife(this.selectedKnife), 2);
    }
  }"""

bm_replacement = """    } else if (this.currentStage === 2 && this.selectedKnife && this.engine && !this.engine.isSpinning) {
      this.engine.setItems(this.getSkinsForSelectedKnife(this.selectedKnife), 2);
    }
    this.sendSyncState();
  }"""

if bm_target in content:
    content = content.replace(bm_target, bm_replacement, 1)
    print("Added sendSyncState() to setBroadcastMode.")

# 3. Add sendSyncState() to setStage
stage_target = """      const stage3Items = this.getCaseQuantityItems(knife, skin);
      this.engine.setItems(stage3Items, 3);
    }
  }"""

stage_replacement = """      const stage3Items = this.getCaseQuantityItems(knife, skin);
      this.engine.setItems(stage3Items, 3);
    }
    this.sendSyncState();
  }"""

if stage_target in content:
    content = content.replace(stage_target, stage_replacement, 1)
    print("Added sendSyncState() to setStage.")

# 4. Add sendSyncState() to startSpotlightSpin and showWinnerReveal
sss_target = """    // Auto spin right after opening
    setTimeout(() => {
      this.handleSpotlightSpinExecution(stage);
    }, 450);
  }"""

sss_replacement = """    this.sendSyncState();

    // Auto spin right after opening
    setTimeout(() => {
      this.handleSpotlightSpinExecution(stage);
    }, 450);
  }"""

if sss_target in content:
    content = content.replace(sss_target, sss_replacement, 1)
    print("Added sendSyncState() to startSpotlightSpin.")

# 5. Add sendSyncState() to showWinnerReveal
swr_target = """      if (revealBtnText) revealBtnText.textContent = 'XEM NHIỆM VỤ NGÀY HÔM NAY ➔';
    }
  }"""

swr_replacement = """      if (revealBtnText) revealBtnText.textContent = 'XEM NHIỆM VỤ NGÀY HÔM NAY ➔';
    }
    this.sendSyncState();
  }"""

if swr_target in content:
    content = content.replace(swr_target, swr_replacement, 1)
    print("Added sendSyncState() to showWinnerReveal.")

# 6. Add sendSyncState() to showTodayMissionFinale
stmf_target = """    missionSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }"""

stmf_replacement = """    missionSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.sendSyncState();
  }"""

if stmf_target in content:
    content = content.replace(stmf_target, stmf_replacement, 1)
    print("Added sendSyncState() to showTodayMissionFinale.")

# 7. Add sendSyncState() and localStorage saving to onKnivesSelectionChanged
oksc_target = """  onKnivesSelectionChanged() {
    this.updateBadges();
    if (this.currentStage === 1) {
      this.engine.setActiveKnives(this.getActiveKnivesList());
    }
    this.renderKnivesManager();
    this.renderMainKnivesGrid();
  }"""

oksc_replacement = """  onKnivesSelectionChanged() {
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
  }"""

if oksc_target in content:
    content = content.replace(oksc_target, oksc_replacement, 1)
    print("Updated onKnivesSelectionChanged with localStorage and sendSyncState.")

# 8. Add sendSyncState() to resetHuntFlow
rhf_target = """    this.engine.setItems(this.getActiveKnivesList(), 1);
  }"""

rhf_replacement = """    this.engine.setItems(this.getActiveKnivesList(), 1);
    this.sendSyncState();
  }"""

if rhf_target in content:
    content = content.replace(rhf_target, rhf_replacement, 1)
    print("Added sendSyncState() to resetHuntFlow.")

# 9. Add secret hotkey for emergency toggle of header-actions (F8 or Ctrl+H) in bindEvents()
be_target = """    // Start Spin Flow Button (Main Dashboard Trigger)
    const startSpinFlowBtn = document.getElementById('startSpinFlowBtn');"""

be_replacement = """    // Secret hotkey to toggle header controls on viewer screen (F8 or Ctrl+H)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'h') || e.key === 'F8') {
        const headerActions = document.getElementById('mainHeaderActions');
        if (headerActions) {
          const isHidden = headerActions.style.display === 'none';
          headerActions.style.display = isHidden ? 'flex' : 'none';
        }
      }
    });

    // Start Spin Flow Button (Main Dashboard Trigger)
    const startSpinFlowBtn = document.getElementById('startSpinFlowBtn');"""

if be_target in content:
    content = content.replace(be_target, be_replacement, 1)
    print("Added emergency toggle hotkey to bindEvents.")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved app.js successfully.")
