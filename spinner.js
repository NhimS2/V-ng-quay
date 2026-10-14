/**
 * CS2 Knife Spinner Engine - Enhanced Two-Stage Spin Edition
 * Stage 1: Spin Knife Type (Uses Vanilla knife image)
 * Stage 2: Spin Knife Skin for the selected Knife Type
 */

class CS2SpinnerEngine {
  constructor(knivesData = []) {
    this.knives = [...knivesData];
    this.activeKnives = [...knivesData];
    this.stage = 1; // 1: Knife Type, 2: Knife Skin, 3: Case Quantity
    this.isSkinStage = false;
    this.isSpinning = false;
    this.mode = 'roller'; // 'roller' or 'wheel'
    this.suspenseLevel = 'high'; // 'normal', 'high', 'ultra'
    this.oddsMode = 'realistic'; // 'realistic', 'equal', 'custom'

    // Tape Roller properties
    this.tapeContainer = document.getElementById('tapeItems');
    this.cardWidth = 190; // Card width + gap
    this.rollerItems = [];
    this.rollerTargetIndex = 0;
    this.rollerCurrentX = 0;
    this.rollerAnimId = null;

    // Wheel Canvas properties
    this.wheelCanvas = document.getElementById('wheelCanvas');
    this.wheelCtx = this.wheelCanvas ? this.wheelCanvas.getContext('2d') : null;
    this.wheelRotation = 0;
    this.wheelVelocity = 0;
    this.loadedImages = {};
    this.wheelAnimId = null;
    this.lastFlapperSector = -1;

    // Preload knife images for Wheel canvas
    this.preloadImages();
  }

  getItemImage(item) {
    if (!item) return '';
    return item.vanillaImage || item.imageSrc || '';
  }

  preloadImages() {
    const list = this.activeKnives.length > 0 ? this.activeKnives : this.knives;
    list.forEach(k => {
      const src = this.getItemImage(k);
      if (!src || this.loadedImages[k.id]) return;
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.loadedImages[k.id] = img;
        if (this.mode === 'wheel' && !this.isSpinning) this.drawWheel();
      };
    });
  }

  setItems(items, stage = 1) {
    this.stage = (typeof stage === 'number') ? stage : (stage ? 2 : 1);
    this.isSkinStage = (this.stage === 2);
    this.knives = [...items];
    this.activeKnives = [...items];
    this.preloadImages();
    if (this.mode === 'wheel') {
      this.drawWheel();
    } else if (this.activeKnives.length > 0) {
      this.prepareRoller(this.activeKnives[0]);
    }
  }

  setMode(mode) {
    if (this.isSpinning) return;
    this.mode = mode;
    if (mode === 'wheel') {
      this.drawWheel();
    } else if (this.activeKnives.length > 0) {
      this.prepareRoller(this.activeKnives[0]);
    }
  }

  setSuspenseLevel(level) {
    this.suspenseLevel = level;
  }

  setOddsMode(oddsMode) {
    this.oddsMode = oddsMode;
  }

  setActiveKnives(activeList) {
    this.activeKnives = activeList.length > 0 ? activeList : [...this.knives];
    this.preloadImages();
    if (this.mode === 'wheel') {
      this.drawWheel();
    } else if (this.activeKnives.length > 0) {
      this.prepareRoller(this.activeKnives[0]);
    }
  }

  // Calculate probability weight for knife type or knife skin
  getKnifeWeight(item) {
    if (this.oddsMode === 'equal') return 100;
    if (this.oddsMode === 'custom' && item.customWeight) return item.customWeight;
    
    // Realistic CS2 Rarity weights based on tier
    switch (item.tier) {
      case 'S+': return 3;   // Ultra rare
      case 'S':  return 7;   // Very rare
      case 'A':  return 15;  // Rare
      case 'B':  return 32;  // Uncommon
      case 'C':  return 55;  // Common
      default:   return 20;
    }
  }

  // Pick winner based on weights
  pickWinner() {
    const list = this.activeKnives.length > 0 ? this.activeKnives : this.knives;
    if (!list || list.length === 0) return null;

    const totalWeight = list.reduce((sum, k) => sum + this.getKnifeWeight(k), 0);
    let rand = Math.random() * totalWeight;

    for (const item of list) {
      const w = this.getKnifeWeight(item);
      if (rand <= w) {
        return item;
      }
      rand -= w;
    }
    return list[0];
  }

  // Find Holy Grail item for near-miss tease
  getTeaseKnife() {
    const list = this.activeKnives.length > 0 ? this.activeKnives : this.knives;
    const sPlusKnives = list.filter(k => k.tier === 'S+');
    if (sPlusKnives.length > 0) {
      return sPlusKnives[Math.floor(Math.random() * sPlusKnives.length)];
    }
    const sKnives = list.filter(k => k.tier === 'S');
    if (sKnives.length > 0) {
      return sKnives[Math.floor(Math.random() * sKnives.length)];
    }
    return list[0];
  }

  /* =========================================================================
   * MODE 1: HORIZONTAL CS2 CASE TAPE ROLLER
   * ========================================================================= */
  prepareRoller(winnerKnife) {
    if (!this.tapeContainer) return;
    this.tapeContainer.innerHTML = '';
    this.rollerItems = [];

    const totalItems = 75;
    const targetIndex = 62; // Winner landing position
    this.rollerTargetIndex = targetIndex;

    const available = this.activeKnives.length > 0 ? this.activeKnives : this.knives;
    if (!available || available.length === 0) return;

    for (let i = 0; i < totalItems; i++) {
      let item;
      if (i === targetIndex) {
        item = winnerKnife;
      } else if (i === targetIndex - 1 && (this.suspenseLevel === 'high' || this.suspenseLevel === 'ultra')) {
        // High tension: place an ultra-legendary item right next to the winner!
        item = this.getTeaseKnife();
      } else if (i === targetIndex + 1 && Math.random() < 0.5) {
        item = this.getTeaseKnife();
      } else {
        item = available[Math.floor(Math.random() * available.length)];
      }

      this.rollerItems.push(item);

      const card = document.createElement('div');
      const tierClass = (item.tier || 'a').toLowerCase().replace('+', '-plus');
      card.className = `knife-card tier-${tierClass}`;
      card.dataset.index = i;
      
      const imgPath = this.getItemImage(item);
      
      let title = item.name;
      let subtitle = item.vnName || '★ Vanilla Type';
      let priceText = item.skinsCount ? `${item.skinsCount} Skins` : 'Loại Dao';
      let badgeText = item.tier || '★';

      if (this.stage === 2) {
        title = item.fullName || item.name;
        subtitle = item.vnName || item.name || 'Skin';
        priceText = item.priceVND || 'Skin Finish';
        badgeText = item.tier || '★';
      } else if (this.stage === 3) {
        title = item.name;
        subtitle = item.caseName ? item.caseName : (item.subtitle || item.tag || 'Thử Thách Hòm');
        priceText = item.casesCount ? (item.casesCount === 999 ? 'Vô Cực' : `${item.casesCount} Hòm`) : 'Chat Chọn';
        badgeText = item.tag || item.tier || '★';
      }

      card.innerHTML = `
        <div class="card-rarity-bar" style="background: ${item.accent || '#ffd700'}"></div>
        <div class="card-badge">${badgeText}</div>
        <div class="card-img-wrap">
          <img src="${imgPath}" alt="${title}" loading="lazy" />
        </div>
        <div class="card-info">
          <div class="card-knife-name" title="${title}">${title}</div>
          <div class="card-skin-name">${subtitle}</div>
          <div class="card-price">${priceText}</div>
        </div>
      `;
      this.tapeContainer.appendChild(card);
    }

    // Reset position to starting point
    this.rollerCurrentX = 0;
    this.tapeContainer.style.transform = `translateX(0px)`;
  }

  spinRoller(onComplete) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const winner = this.pickWinner();
    this.prepareRoller(winner);

    window.cs2Sound.playSpinStart();

    const viewportWidth = this.tapeContainer.parentElement.clientWidth;
    const centerOffset = viewportWidth / 2;
    const cardFullWidth = this.cardWidth; // 190px (card + margin)

    let subOffset = (Math.random() - 0.5) * (cardFullWidth * 0.65);
    if (this.suspenseLevel === 'ultra') {
      // Tease: stop just barely across the edge from the previous card!
      subOffset = -(cardFullWidth * 0.38) + (Math.random() * 15);
    }

    const targetCardCenterX = (this.rollerTargetIndex * cardFullWidth) + (cardFullWidth / 2);
    const finalDistance = targetCardCenterX - centerOffset + subOffset;

    // Spin Duration based on suspense setting
    let duration = 6500;
    if (this.suspenseLevel === 'normal') duration = 4800;
    if (this.suspenseLevel === 'ultra') duration = 8800;

    const startTime = performance.now();
    let lastCrossedIndex = 0;

    const easeOutCS = (t) => {
      return 1 - Math.pow(1 - t, 4.6);
    };

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCS(progress);

      const currentX = finalDistance * easedProgress;
      this.tapeContainer.style.transform = `translateX(-${currentX}px)`;

      // Tick sound when needle crosses card boundary
      const needleWorldPos = currentX + centerOffset;
      const currentCardIndex = Math.floor(needleWorldPos / cardFullWidth);

      if (currentCardIndex > lastCrossedIndex && currentCardIndex < this.rollerItems.length) {
        lastCrossedIndex = currentCardIndex;
        const speedRatio = 1 - progress;
        window.cs2Sound.playTick(speedRatio);

        // Near end suspense: pulse heartbeat
        if (progress > 0.88 && currentCardIndex === this.rollerTargetIndex - 1) {
          window.cs2Sound.playHeartbeat();
        }
      }

      // Needle vibration effect
      const needle = document.querySelector('.tape-needle');
      if (needle && progress < 0.95) {
        const jitter = Math.sin(progress * 80) * (1 - progress) * 3;
        needle.style.transform = `translateX(-50%) rotate(${jitter}deg)`;
      } else if (needle) {
        needle.style.transform = `translateX(-50%) rotate(0deg)`;
      }

      if (progress < 1) {
        this.rollerAnimId = requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        // Winner card highlight
        const cards = this.tapeContainer.querySelectorAll('.knife-card');
        const winCard = cards[this.rollerTargetIndex];
        if (winCard) {
          winCard.classList.add('winner-glow');
        }

        // Play unbox fanfare
        window.cs2Sound.playGoldUnbox();
        window.cs2Sound.playCheer();
        this.triggerCelebration();

        if (onComplete) onComplete(winner);
      }
    };

    this.rollerAnimId = requestAnimationFrame(animate);
  }

  /* =========================================================================
   * MODE 2: ROTARY WHEEL WITH FLAPPER PHYSICS
   * ========================================================================= */
  drawWheel() {
    if (!this.wheelCanvas || !this.wheelCtx) return;
    const ctx = this.wheelCtx;
    const canvas = this.wheelCanvas;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 18;

    ctx.clearRect(0, 0, width, height);

    const items = this.activeKnives.length > 0 ? this.activeKnives : this.knives;
    const totalSlices = items.length;
    if (totalSlices === 0) return;
    const sliceAngle = (Math.PI * 2) / totalSlices;

    // Draw Outer Shadow & Metallic Ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
    ctx.fillStyle = '#0f1115';
    ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
    ctx.shadowBlur = 25;
    ctx.fill();

    // Outer Gold Rim
    const rimGrad = ctx.createLinearGradient(0, 0, width, height);
    rimGrad.addColorStop(0, '#ffd700');
    rimGrad.addColorStop(0.3, '#b8860b');
    rimGrad.addColorStop(0.7, '#fff2a1');
    rimGrad.addColorStop(1, '#996515');
    ctx.lineWidth = 10;
    ctx.strokeStyle = rimGrad;
    ctx.stroke();
    ctx.restore();

    // Draw Slices
    for (let i = 0; i < totalSlices; i++) {
      const item = items[i];
      const startAngle = this.wheelRotation + i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Alternating slice background gradients with rarity tints
      const isAlt = i % 2 === 0;
      const sliceGrad = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, radius);
      if (item.tier === 'S+') {
        sliceGrad.addColorStop(0, '#2e1505');
        sliceGrad.addColorStop(1, isAlt ? '#451a03' : '#3c1502');
      } else if (item.tier === 'S') {
        sliceGrad.addColorStop(0, '#201625');
        sliceGrad.addColorStop(1, isAlt ? '#2d1238' : '#240d2d');
      } else {
        sliceGrad.addColorStop(0, '#15171e');
        sliceGrad.addColorStop(1, isAlt ? '#1c202a' : '#14171f');
      }
      ctx.fillStyle = sliceGrad;
      ctx.fill();

      // Slice Divider lines
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Outer Rarity Arc Edge
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 2, startAngle, endAngle);
      ctx.strokeStyle = item.accent || '#ffd700';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Draw Item Image & Text inside slice
      ctx.save();
      const midAngle = startAngle + sliceAngle / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate(midAngle);

      // Image
      const img = this.loadedImages[item.id];
      if (img && img.complete) {
        const imgSize = Math.min(radius * 0.28, 68);
        ctx.drawImage(img, radius * 0.52, -imgSize / 2, imgSize, imgSize);
      }

      // Title Text
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 12px Outfit, "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      
      const rawTitle = (this.stage === 3) ? item.name : item.name.replace(' Knife', '');
      const displayTitle = rawTitle.length > 14 ? rawTitle.substring(0, 12) + '..' : rawTitle;
      const titleY = (this.stage === 3 && (item.caseShortName || item.caseName)) ? -5 : 0;
      ctx.fillText(displayTitle, radius * 0.50, titleY);

      // Case Name for Stage 3
      if (this.stage === 3 && (item.caseShortName || item.caseName)) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 9px Outfit, "Segoe UI", sans-serif';
        const caseLabel = item.caseShortName || item.caseName;
        const displayCase = caseLabel.length > 12 ? caseLabel.substring(0, 10) + '..' : caseLabel;
        ctx.fillText(displayCase, radius * 0.50, 9);
      }

      // Tier Star / Tag Icon
      ctx.fillStyle = item.accent || '#ffd700';
      ctx.font = 'bold 10px sans-serif';
      const badgeText = (this.stage === 3 && item.tag) ? item.tag : (item.tier || '★');
      ctx.fillText(badgeText, radius * 0.90, -14);

      ctx.restore();
      ctx.restore();
    }

    // Outer Rim Studs / Bulbs
    for (let i = 0; i < totalSlices * 2; i++) {
      const studAngle = (Math.PI * 2 / (totalSlices * 2)) * i + this.wheelRotation * 0.2;
      const sx = centerX + Math.cos(studAngle) * (radius + 6);
      const sy = centerY + Math.sin(studAngle) * (radius + 6);

      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 === 0 ? '#ffd700' : '#ffffff';
      ctx.fill();
    }

    // Center Golden CS2 Hub
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 52, 0, Math.PI * 2);
    const centerGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 52);
    centerGrad.addColorStop(0, '#ffd700');
    centerGrad.addColorStop(0.7, '#d4af37');
    centerGrad.addColorStop(1, '#855909');
    ctx.fillStyle = centerGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fff2a1';
    ctx.stroke();

    // Center Star Symbol ★
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0f1115';
    ctx.font = 'bold 30px "Segoe UI Symbol", sans-serif';
    ctx.fillText('★', centerX, centerY + 2);
    ctx.restore();
  }

  spinWheel(onComplete) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    const winner = this.pickWinner();
    const items = this.activeKnives.length > 0 ? this.activeKnives : this.knives;
    const totalSlices = items.length;
    const sliceAngle = (Math.PI * 2) / totalSlices;

    const winnerIndex = items.findIndex(k => k.id === winner.id);
    const pointerAngle = -Math.PI / 2;
    
    const fullTurns = 7 + Math.floor(Math.random() * 3);
    const targetSliceMid = winnerIndex * sliceAngle + sliceAngle / 2;
    
    const currentRot = this.wheelRotation % (Math.PI * 2);
    let delta = pointerAngle - (currentRot + targetSliceMid);
    while (delta < 0) delta += Math.PI * 2;
    
    let suspenseJitter = (Math.random() - 0.5) * (sliceAngle * 0.6);
    if (this.suspenseLevel === 'ultra') {
      suspenseJitter = -(sliceAngle * 0.44) + (Math.random() * 0.05);
    }

    const totalTargetRotation = this.wheelRotation + fullTurns * Math.PI * 2 + delta + suspenseJitter;
    const startRot = this.wheelRotation;
    const rotationDistance = totalTargetRotation - startRot;

    let duration = 6500;
    if (this.suspenseLevel === 'normal') duration = 4500;
    if (this.suspenseLevel === 'ultra') duration = 8500;

    const startTime = performance.now();
    window.cs2Sound.playSpinStart();

    const easeOutCS = (t) => 1 - Math.pow(1 - t, 4.4);

    const animateWheel = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCS(progress);

      this.wheelRotation = startRot + rotationDistance * easedProgress;
      this.drawWheel();

      const currentAngle = (pointerAngle - this.wheelRotation) % (Math.PI * 2);
      const normalizedAngle = currentAngle < 0 ? currentAngle + Math.PI * 2 : currentAngle;
      const currentSector = Math.floor(normalizedAngle / sliceAngle);

      if (currentSector !== this.lastFlapperSector) {
        this.lastFlapperSector = currentSector;
        const speedRatio = 1 - progress;
        window.cs2Sound.playTick(speedRatio);

        const flapper = document.getElementById('wheelFlapper');
        if (flapper) {
          flapper.style.transform = `translateX(-50%) rotate(${Math.sin(progress * 40) * 15}deg)`;
        }
      }

      if (progress < 1) {
        this.wheelAnimId = requestAnimationFrame(animateWheel);
      } else {
        this.isSpinning = false;
        const flapper = document.getElementById('wheelFlapper');
        if (flapper) flapper.style.transform = 'translateX(-50%) rotate(0deg)';

        window.cs2Sound.playGoldUnbox();
        window.cs2Sound.playCheer();
        this.triggerCelebration();

        if (onComplete) onComplete(winner);
      }
    };

    this.wheelAnimId = requestAnimationFrame(animateWheel);
  }

  /* =========================================================================
   * CELEBRATION & CONFETTI PARTICLE SYSTEM
   * ========================================================================= */
  triggerCelebration() {
    const canvas = document.getElementById('fxCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 600);

    const particles = [];
    const colors = ['#ffd700', '#ff2a85', '#00f0ff', '#ffffff', '#ff9900', '#00ff88'];

    for (let i = 0; i < 180; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 300,
        y: canvas.height / 2 - 100,
        vx: (Math.random() - 0.5) * 22,
        vy: -Math.random() * 18 - 4,
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 15,
        gravity: 0.35,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.008
      });
    }

    const renderParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        requestAnimationFrame(renderParticles);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    renderParticles();
  }
}

window.CS2SpinnerEngine = CS2SpinnerEngine;
