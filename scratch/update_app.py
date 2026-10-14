# scratch/update_app.py
import re

with open('app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add constructor properties
old_constr = '''    this.isHuntActive = false;
    this.lastWonSkin = null;'''

new_constr = '''    this.isHuntActive = false;
    this.lastWonSkin = null;
    this.lastWinnerStage1 = null;
    this.lastWinnerStage2 = null;
    this.lastWinnerStage3 = null;'''

assert old_constr in code, "old_constr not found"
code = code.replace(old_constr, new_constr, 1)

# 2. Add spotlight spin methods, flyItemToSlot, and showcase reveal methods
methods_to_insert = '''
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
      if (stageDesc) stageDesc.textContent = '20 Dòng Dao CS2 (Hiển thị con dao Vanilla tâm điểm)...';
      this.engine.setItems(this.getActiveKnivesList(), 1);
    } else if (stage === 2) {
      const knifeName = this.selectedKnife?.name || 'Dao';
      if (stageBadge) stageBadge.textContent = 'VÒNG 2 / 3';
      if (stageTitle) stageTitle.textContent = `QUAY SKIN CHO ${knifeName.toUpperCase()}`;
      if (stageDesc) stageDesc.textContent = `Đang quay chọn SKIN cho ${knifeName}...`;
      const skins = this.getSkinsForSelectedKnife(this.selectedKnife);
      this.engine.setItems(skins, 2);
    } else if (stage === 3) {
      const validCases = this.getValidCasesForSelection(this.selectedKnife, this.selectedSkin);
      const caseNames = validCases.map(c => c.name).join(', ');
      if (stageBadge) stageBadge.textContent = 'VÒNG 3 / 3';
      if (stageTitle) stageTitle.textContent = 'QUAY HÒM & SỐ LƯỢNG MỞ';
      if (stageDesc) stageDesc.textContent = `Chỉ các hòm có thể rơi ra dao: ${caseNames}`;
      const items = this.getCaseQuantityItems(this.selectedKnife, this.selectedSkin);
      this.engine.setItems(items, 3);
    }

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
    }
  }

  showWinnerReveal(stage, item) {
    const spinnerArea = document.getElementById('spotlightSpinnerArea');
    const revealArea = document.getElementById('winnerRevealCardArea');
    const revealCard = document.getElementById('revealCard');
    const revealBadge = document.getElementById('revealBadge');
    const revealCardImg = document.getElementById('revealCardImg');
    const revealTitle = document.getElementById('revealTitle');
    const revealSubtitle = document.getElementById('revealSubtitle');
    const revealCasesWrap = document.getElementById('revealCasesWrap');
    const revealCasesBadges = document.getElementById('revealCasesBadges');
    const revealBtnText = document.getElementById('revealBtnText');

    if (spinnerArea) spinnerArea.style.display = 'none';
    if (revealArea) revealArea.style.display = 'flex';
    if (revealCard) revealCard.style.opacity = '1';

    if (stage === 1) {
      if (revealBadge) revealBadge.textContent = '★ LOẠI DAO ĐÃ CHỌN (VÒNG 1)';
      if (revealCardImg) {
        revealCardImg.src = item.vanillaImage || item.imageSrc || '';
        revealCardImg.alt = item.name;
      }
      if (revealTitle) revealTitle.textContent = item.name;
      if (revealSubtitle) revealSubtitle.textContent = item.vnName || '20 Dòng Dao CS2 (Vanilla)';
      if (revealCasesWrap) revealCasesWrap.style.display = 'none';
      if (revealBtnText) revealBtnText.textContent = 'TIẾP TỤC ';

    } else if (stage === 2) {
      const knife = this.selectedKnife;
      if (revealBadge) revealBadge.textContent = '★ LỚP ÁO ĐÃ CHỌN (VÒNG 2)';
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
      if (revealBadge) revealBadge.textContent = '★ NGÂN SÁCH (VÒNG 3)';
      if (revealCardImg) {
        revealCardImg.src = item.imageSrc || 'assets/Case/Dreams & Nightmares.png';
        revealCardImg.alt = item.name;
      }
      if (revealTitle) revealTitle.textContent = item.name;
      if (revealSubtitle) revealSubtitle.textContent = item.caseName ? `Hòm ${item.caseName}` : (item.subtitle || 'Số Lượng Hòm');
      if (revealCasesWrap) revealCasesWrap.style.display = 'none';
      if (revealBtnText) revealBtnText.textContent = 'XEM NHIỆM VỤ NGÀY HÔM NAY';
    }
  }

  handleRevealContinue() {
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

        // SHOW "NHIỆM VỤ NGÀY HÔM NAY"!
        this.showTodayMissionFinale();
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
      if (revealCard) revealCard.style.opacity = '1';

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
    if (slotQuantityTitle) slotQuantityTitle.textContent = qty.name;
    if (slotQuantitySub) slotQuantitySub.textContent = qty.caseName ? `Hòm ${qty.caseName}` : (qty.subtitle || qty.tag || 'Số Lượng Hòm');
  }

  showTodayMissionFinale() {
    const missionSection = document.getElementById('todayMissionSection');
    if (!missionSection) return;

    missionSection.style.display = 'block';

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

    const tmsMissionText = document.getElementById('tmsMissionText');
    if (tmsMissionText) {
      tmsMissionText.textContent = `SĂN [${targetFullName}] TRONG [${qty?.name}]${caseNameStr}!`;
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
      tmsTargetCaseName.textContent = `${qty?.name} (${qty?.caseName || 'Hòm Hợp Lệ'})`;
    }
    if (tmsPressureTag) {
      tmsPressureTag.textContent = qty?.tag || '⚡ THỬ THÁCH SĂN DAO';
    }

    this.targetCases = qty?.casesCount || 7;
    this.openedCases = 0;
    this.updateTodayMissionCounterUI();

    missionSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    const huntStartBar = document.getElementById('huntStartBar');
    const startBtnText = document.getElementById('startBtnText');
    if (huntStartBar) huntStartBar.style.display = 'flex';
    if (startBtnText) startBtnText.textContent = 'SĂN MỤC TIÊU';

    const todayMissionSection = document.getElementById('todayMissionSection');
    if (todayMissionSection) todayMissionSection.style.display = 'none';

    const modal = document.getElementById('spinSpotlightModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('active', 'fading-out-backdrop');
    }

    this.engine.setItems(this.getActiveKnivesList(), 1);
  }
'''

# Place methods_to_insert before bindEvents
target_marker = '  bindEvents() {'
assert target_marker in code, "bindEvents marker not found"
code = code.replace(target_marker, methods_to_insert + '\n  bindEvents() {', 1)

# 3. Update bindEvents with new buttons
old_binds = '''    // Spin Buttons
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn) spinBtn.addEventListener('click', () => this.handleSpin());'''

new_binds = '''    // Start Spin Flow Button (Main Dashboard Trigger)
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
    if (spinBtn) spinBtn.addEventListener('click', () => this.handleSpin());'''

assert old_binds in code, "old_binds not found"
code = code.replace(old_binds, new_binds, 1)

# 4. Update incrementOpenedCases & decrementOpenedCases to call updateTodayMissionCounterUI
old_inc = '''  incrementOpenedCases() {
    this.openedCases++;
    window.cs2Sound.playTick(1.2);
    this.updateHuntCounterUI();'''

new_inc = '''  incrementOpenedCases() {
    this.openedCases++;
    window.cs2Sound.playTick(1.2);
    this.updateHuntCounterUI();
    this.updateTodayMissionCounterUI();'''

assert old_inc in code, "old_inc not found"
code = code.replace(old_inc, new_inc, 1)

old_dec = '''  decrementOpenedCases() {
    if (this.openedCases > 0) {
      this.openedCases--;
      window.cs2Sound.playButtonClick();
      this.updateHuntCounterUI();
    }
  }'''

new_dec = '''  decrementOpenedCases() {
    if (this.openedCases > 0) {
      this.openedCases--;
      window.cs2Sound.playButtonClick();
      this.updateHuntCounterUI();
      this.updateTodayMissionCounterUI();
    }
  }'''

assert old_dec in code, "old_dec not found"
code = code.replace(old_dec, new_dec, 1)

# 5. Make resetHuntBtn and resetStageBtn call resetHuntFlow
old_reset_hunt = '''    // Reset Hunt from Dashboard button
    const resetHuntBtn = document.getElementById('resetHuntBtn');
    if (resetHuntBtn) {
      resetHuntBtn.addEventListener('click', () => {
        if (this.engine.isSpinning) return;
        window.cs2Sound.playButtonClick();
        this.setStage(1);
      });
    }'''

new_reset_hunt = '''    // Reset Hunt from Dashboard button
    const resetHuntBtn = document.getElementById('resetHuntBtn');
    if (resetHuntBtn) {
      resetHuntBtn.addEventListener('click', () => {
        if (this.engine.isSpinning) return;
        window.cs2Sound.playButtonClick();
        this.resetHuntFlow();
      });
    }'''

assert old_reset_hunt in code, "old_reset_hunt not found"
code = code.replace(old_reset_hunt, new_reset_hunt, 1)

old_reset_stage = '''    // Reset Stage button
    const resetStageBtn = document.getElementById('resetStageBtn');
    if (resetStageBtn) {
      resetStageBtn.addEventListener('click', () => {
        if (this.engine.isSpinning) return;
        window.cs2Sound.playButtonClick();
        this.setStage(1);
      });
    }'''

new_reset_stage = '''    // Reset Stage button
    const resetStageBtn = document.getElementById('resetStageBtn');
    if (resetStageBtn) {
      resetStageBtn.addEventListener('click', () => {
        if (this.engine.isSpinning) return;
        window.cs2Sound.playButtonClick();
        this.resetHuntFlow();
      });
    }'''

assert old_reset_stage in code, "old_reset_stage not found"
code = code.replace(old_reset_stage, new_reset_stage, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Successfully updated app.js! Length:', len(code))
