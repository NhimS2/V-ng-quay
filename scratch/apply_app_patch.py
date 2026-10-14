import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Constructor additions
t1 = """    // Collection inventory state
    this.collection = this.loadCollection();
    this.collectionView = 'cards'; // 'cards' or 'table'

    // Session stats
    this.stats = {
      unboxedCount: 0,
      totalVND: 0,
      topKnife: null
    };

    this.init();"""

r1 = """    // Collection inventory state
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

    this.init();"""

assert t1 in content, "Target 1 (Constructor) not found"
content = content.replace(t1, r1, 1)
print("1. Constructor updated.")

# 2. init() restoration
t2 = """    // Check saved enabled knives from localStorage
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

    // Initialize Streamer Control Deck sync channel"""

r2 = """    // Check saved enabled knives from localStorage
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
    const savedOdds = localStorage.getItem('cs2_odds_mode') || 'realistic';
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

    // Initialize Streamer Control Deck sync channel"""

assert t2 in content, "Target 2 (init restoration) not found"
content = content.replace(t2, r2, 1)
print("2. init() restoration updated.")

# 3. startSpotlightSpin Stage 3
t3 = """    } else if (stage === 3) {
      const validCases = this.getValidCasesForSelection(this.selectedKnife, this.selectedSkin);
      const caseNames = validCases.map(c => c.name).join(', ');
      if (stageBadge) stageBadge.textContent = 'VÒNG 3 / 3';
      if (stageTitle) stageTitle.textContent = 'QUAY HÒM & SỐ LƯỢNG MỞ';
      if (stageDesc) stageDesc.textContent = `Chỉ các hòm có thể rơi ra dao: ${caseNames}`;
      const items = this.getCaseQuantityItems(this.selectedKnife, this.selectedSkin);
      this.engine.setItems(items, 3);
    }"""

r3 = """    } else if (stage === 3) {
      const validCases = this.getValidCasesForSelection(this.selectedKnife, this.selectedSkin);
      const caseNames = validCases.map(c => c.name).join(', ');
      const comboText = this.getStage3ComboText();
      if (stageBadge) stageBadge.textContent = 'VÒNG 3 / 3';
      if (stageTitle) stageTitle.textContent = comboText ? `QUAY HÒM & SỐ LƯỢNG [Đang tích lũy: ${comboText}]` : 'QUAY HÒM & SỐ LƯỢNG MỞ';
      if (stageDesc) stageDesc.textContent = comboText ? `Chuỗi bổ trợ: ${comboText} • Đang quay tiếp để chốt số lượng hòm!` : `Chỉ các hòm có thể rơi ra dao: ${caseNames}`;
      const items = this.getCaseQuantityItems(this.selectedKnife, this.selectedSkin);
      this.engine.setItems(items, 3);
    }"""

assert t3 in content, "Target 3 (startSpotlightSpin Stage 3) not found"
content = content.replace(t3, r3, 1)
print("3. startSpotlightSpin Stage 3 updated.")

# 4. handleSpotlightSpinExecution Stage 3 modifier check
t4 = """    } else if (stage === 3) {
      const onCompleteStage3 = (winnerQty) => {
        this.lastWinnerStage3 = winnerQty;
        window.cs2Sound.playGoldUnbox();
        window.cs2Sound.playCheer();
        this.showWinnerReveal(3, winnerQty);
      };
      if (this.engine.mode === 'roller') {
        this.engine.spinRoller(onCompleteStage3);
      } else {
        this.engine.spinWheel(onCompleteStage3);
      }
    }"""

r4 = """    } else if (stage === 3) {
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
    }"""

assert t4 in content, "Target 4 (handleSpotlightSpinExecution Stage 3) not found"
content = content.replace(t4, r4, 1)
print("4. handleSpotlightSpinExecution Stage 3 updated.")

# 5. showWinnerReveal Stage 3
t5 = """    } else if (stage === 3) {
      if (revealBadge) revealBadge.textContent = '★ NGÂN SÁCH (VÒNG 3)';
      if (revealCardImg) {
        revealCardImg.src = item.imageSrc || 'assets/Case/Dreams & Nightmares.png';
        revealCardImg.alt = item.name;
      }
      if (revealTitle) revealTitle.textContent = item.name;
      if (revealSubtitle) revealSubtitle.textContent = item.caseName ? `Hòm ${item.caseName}` : (item.subtitle || 'Số Lượng Hòm');
      if (revealCasesWrap) revealCasesWrap.style.display = 'none';
      if (revealBtnText) revealBtnText.textContent = 'XEM NHIỆM VỤ NGÀY HÔM NAY';
    }"""

r5 = """    } else if (stage === 3) {
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
    }"""

assert t5 in content, "Target 5 (showWinnerReveal Stage 3) not found"
content = content.replace(t5, r5, 1)
print("5. showWinnerReveal Stage 3 updated.")

# 6. handleRevealContinue
t6 = """  handleRevealContinue() {
    if (this.currentStage === 1) {"""

r6 = """  handleRevealContinue() {
    if (this.currentStage === 3 && this.stage3IsShowingModifier) {
      this.continueStage3Spin();
      return;
    }
    if (this.currentStage === 1) {"""

assert t6 in content, "Target 6 (handleRevealContinue) not found"
content = content.replace(t6, r6, 1)
print("6. handleRevealContinue updated.")

# 7. lockSlotQuantity
t7 = """    if (slotQuantityTitle) slotQuantityTitle.textContent = qty.name;
    if (slotQuantitySub) slotQuantitySub.textContent = qty.caseName ? `Hòm ${qty.caseName}` : (qty.subtitle || qty.tag || 'Số Lượng Hòm');"""

r7 = """    if (slotQuantityTitle) {
      slotQuantityTitle.textContent = qty.formula ? `${qty.formula} (${qty.casesCount} Hòm)` : qty.name;
    }
    if (slotQuantitySub) {
      slotQuantitySub.textContent = qty.caseName ? `Hòm ${qty.caseName}` : (qty.subtitle || qty.tag || 'Số Lượng Hòm');
    }"""

assert t7 in content, "Target 7 (lockSlotQuantity) not found"
content = content.replace(t7, r7, 1)
print("7. lockSlotQuantity updated.")

# 8. showTodayMissionFinale
t8 = """    const tmsMissionText = document.getElementById('tmsMissionText');
    if (tmsMissionText) {
      tmsMissionText.textContent = `SĂN [${targetFullName}] TRONG [${qty?.name}]${caseNameStr}!`;
    }"""

r8 = """    const formulaStr = qty?.formula ? `${qty.formula} (${qty.casesCount} Hòm)` : (qty?.name || '');
    const tmsMissionText = document.getElementById('tmsMissionText');
    if (tmsMissionText) {
      tmsMissionText.textContent = `SĂN [${targetFullName}] TRONG [${formulaStr}]${caseNameStr}!`;
    }"""

assert t8 in content, "Target 8 (showTodayMissionFinale missionText) not found"
content = content.replace(t8, r8, 1)
print("8. showTodayMissionFinale missionText updated.")

t8_2 = """    if (tmsTargetCaseName) {
      tmsTargetCaseName.textContent = `${qty?.name} (${qty?.caseName || 'Hòm Hợp Lệ'})`;
    }"""

r8_2 = """    if (tmsTargetCaseName) {
      tmsTargetCaseName.textContent = `${formulaStr} (${qty?.caseName || 'Hòm Hợp Lệ'})`;
    }"""

assert t8_2 in content, "Target 8_2 (showTodayMissionFinale targetCaseName) not found"
content = content.replace(t8_2, r8_2, 1)
print("8_2. showTodayMissionFinale targetCaseName updated.")

# 9. resetHuntFlow
t9 = """  resetHuntFlow() {
    this.selectedKnife = null;
    this.selectedSkin = null;
    this.selectedQuantity = null;
    this.currentStage = 1;
    this.lastWinnerStage1 = null;
    this.lastWinnerStage2 = null;
    this.lastWinnerStage3 = null;
    this.openedCases = 0;"""

r9 = """  resetHuntFlow() {
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
    }"""

assert t9 in content, "Target 9 (resetHuntFlow) not found"
content = content.replace(t9, r9, 1)
print("9. resetHuntFlow updated.")

# 10. bindEvents modeTabs, radios, saveSettingsBtn
t10 = """        this.engine.setMode(mode);
      });
    });"""

r10 = """        this.engine.setMode(mode);
        localStorage.setItem('cs2_spinner_mode', mode);
        this.sendSyncState();
      });
    });"""

assert t10 in content, "Target 10 (modeTabs persistence) not found"
content = content.replace(t10, r10, 1)
print("10. modeTabs persistence updated.")

t11 = """    // Radio: Broadcast Mode (Video vs Livestream)
    document.querySelectorAll('input[name="broadcastRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.setBroadcastMode(e.target.value);
        window.cs2Sound.playButtonClick();
      });
    });

    // Radio: Suspense Level
    document.querySelectorAll('input[name="suspenseRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.engine.setSuspenseLevel(e.target.value);
        const labels = { 'ultra': '🔥 Cực Hồi Hộp', 'high': '⚡ Chuẩn CS2', 'normal': '⏱️ Mở Siêu Tốc' };
        const quickEl = document.getElementById('quickSuspenseLabel');
        if (quickEl) quickEl.textContent = labels[e.target.value] || e.target.value;
      });
    });

    // Radio: Odds Mode
    document.querySelectorAll('input[name="oddsRadio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.engine.setOddsMode(e.target.value);
        this.renderKnivesManager();
        const labels = { 'realistic': '🎲 Chuẩn CS2', 'equal': '⚖️ Đồng Đều' };
        const quickEl = document.getElementById('quickOddsLabel');
        if (quickEl) quickEl.textContent = labels[e.target.value] || e.target.value;
      });
    });"""

r11 = """    // Radio: Broadcast Mode (Video vs Livestream)
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
    });"""

assert t11 in content, "Target 11 (radios persistence) not found"
content = content.replace(t11, r11, 1)
print("11. Radios persistence updated.")

t12 = """    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', closeSettings);
    if (settingsBackdrop) settingsBackdrop.addEventListener('click', closeSettings);"""

r12 = """    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener('click', () => {
        this.saveAllSettings();
        closeSettings();
      });
    }
    if (settingsBackdrop) settingsBackdrop.addEventListener('click', closeSettings);"""

assert t12 in content, "Target 12 (saveSettingsBtn) not found"
content = content.replace(t12, r12, 1)
print("12. saveSettingsBtn updated.")

# 13. Add Helper Methods before bindEvents()
helper_methods = """  /* =========================================================================
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

"""

t13 = """    this.engine.setItems(this.getActiveKnivesList(), 1);
    this.sendSyncState();
  }

  bindEvents() {"""

r13 = """    this.engine.setItems(this.getActiveKnivesList(), 1);
    this.sendSyncState();
  }

""" + helper_methods + """  bindEvents() {"""

assert t13 in content, "Target 13 (before bindEvents) not found"
content = content.replace(t13, r13, 1)
print("13. Helper methods added before bindEvents().")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully written modified app.js!")
