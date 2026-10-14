# update_html.py
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

crlf = '\r\n' in html
nl = '\r\n' if crlf else '\n'

# 1. Update Slot 1 to include slot-golden-glow
old_slot1 = '<div class="hunt-slot active" id="slotKnife" data-stage="1">'
new_slot1 = '<div class="hunt-slot active slot-golden-glow" id="slotKnife" data-stage="1">'
assert old_slot1 in html, "old_slot1 not found"
html = html.replace(old_slot1, new_slot1, 1)

# 2. Add Start Bar right after hunt-slots-grid closing tag
old_slots_end = '        </div>' + nl + nl + '        <!-- Target Banner Display When Ready -->'
new_slots_end = '''        </div>

        <!-- Centered Action Start Bar -->
        <div class="hunt-start-bar" id="huntStartBar">
          <button id="startSpinFlowBtn" class="cs-btn cs-btn-giant cs-btn-spin-gold">
            <span class="btn-shine"></span>
            <span class="spin-btn-icon">⚡</span>
            <span class="spin-btn-text" id="startBtnText">BẮT ĐẦU SĂN MỤC TIÊU</span>
          </button>
        </div>

        <!-- Target Banner Display When Ready -->'''
if crlf:
    new_slots_end = new_slots_end.replace('\n', '\r\n')

assert old_slots_end in html, "old_slots_end not found"
html = html.replace(old_slots_end, new_slots_end, 1)

# 3. Add Today's Mission section right after huntDashboard closing tag
old_hd_end = '      </section>' + nl + nl + '      <!-- 3-STAGE SPIN STEPPER NAVIGATION -->'
new_hd_end = '''      </section>

      <!-- ======================================================================
           TODAY\'S MISSION SHOWCASE (KẾT THÚC VÒNG 3)
           ====================================================================== -->
      <section class="today-mission-section" id="todayMissionSection" style="display: none;">
        <div class="tms-card">
          <div class="tms-header">
            <div class="tms-badge">
              <span class="live-dot"></span>
              <span id="tmsBadgeText">🎯 NHIỆM VỤ TẬP VIDEO HÔM NAY</span>
            </div>
            <div class="tms-sub">KÈO MỞ HÒM ĐÃ KHÓA • SĂN DAO MỤC TIÊU!</div>
          </div>

          <div class="tms-mission-banner">
            <span class="tms-mission-label">MỤC TIÊU CẦN ĐẠT ĐƯỢC:</span>
            <h2 class="tms-mission-target" id="tmsMissionText">SĂN MỤC TIÊU TRONG HÒM!</h2>
          </div>

          <div class="tms-duo-showcase">
            <!-- Left: Weapon Target -->
            <div class="tms-col tms-col-weapon">
              <div class="tms-box-title">VŨ KHÍ MỤC TIÊU</div>
              <div class="tms-img-halo">
                <img id="tmsTargetWeaponImg" src="" alt="Target Weapon" />
              </div>
              <h3 class="tms-item-name" id="tmsTargetWeaponName">Tên Dao | Skin</h3>
              <div class="tms-cases-drop" id="tmsDropCasesList">
                <!-- Cases chips -->
              </div>
            </div>

            <!-- Center: VS / IN indicator -->
            <div class="tms-col-vs">
              <span class="vs-text">TRONG</span>
              <span class="vs-arrow">➔</span>
            </div>

            <!-- Right: Case & Quantity -->
            <div class="tms-col tms-col-cases">
              <div class="tms-box-title">NGÂN SÁCH MỞ HÒM</div>
              <div class="tms-img-halo">
                <img id="tmsTargetCaseImg" src="" alt="Target Case" />
              </div>
              <h3 class="tms-item-name" id="tmsTargetCaseName">Số Lượng Hòm</h3>
              <div class="tms-tag-badge" id="tmsPressureTag">⚡ ÁP LỰC CĂNG THẲNG</div>
            </div>
          </div>

          <!-- Live Counter & Progress Zone -->
          <div class="tms-counter-zone">
            <div class="tms-counter-bar">
              <button id="tmsMinusBtn" class="hmt-btn-counter" title="Giảm 1 hòm">-</button>
              <div class="hmt-counter-display">
                <div class="hmt-count-numbers">
                  <span class="hmt-count-curr" id="tmsCountCurr">0</span>
                  <span class="hmt-count-slash">/</span>
                  <span class="hmt-count-max" id="tmsCountMax">7</span>
                </div>
                <span class="hmt-count-caption" id="tmsCountCaption">SỐ HÒM ĐÃ MỞ TRONG TẬP NÀY</span>
              </div>
              <button id="tmsPlusBtn" class="hmt-btn-counter hmt-btn-plus" title="Mở thêm 1 hòm">+</button>
            </div>

            <!-- Dynamic Progress Bar -->
            <div class="hmt-progress-container">
              <div class="hmt-progress-track">
                <div class="hmt-progress-fill" id="tmsProgressFill" style="width: 0%;"></div>
              </div>
              <div class="hmt-progress-meta">
                <span id="tmsRemainingText">Còn lại: 7 hòm</span>
                <span id="tmsPercentText">0% ĐÃ MỞ</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="tms-actions">
            <button id="tmsWinBtn" class="cs-btn cs-btn-gold hmt-action-btn">
              🎉 ĐÃ TRÚNG DAO THÀNH CÔNG! (WIN)
            </button>
            <button id="tmsFailBtn" class="cs-btn cs-btn-dark hmt-action-btn hmt-btn-fail">
              💀 THẤT BẠI (HẾT HÒM - TẠCH KÈO)
            </button>
            <button id="tmsNewHuntBtn" class="cs-btn cs-btn-dark hmt-action-btn">
              🔄 THIẾT LẬP LẠI KÈO MỚI
            </button>
          </div>
        </div>
      </section>

      <!-- 3-STAGE SPIN STEPPER NAVIGATION -->'''
if crlf:
    new_hd_end = new_hd_end.replace('\n', '\r\n')

assert old_hd_end in html, "old_hd_end not found"
html = html.replace(old_hd_end, new_hd_end, 1)

# 4. Wrap roller & wheel & reveal card into spinSpotlightModal
old_spinners_block = '''      <!-- MODE 1: HORIZONTAL ROLLER -->
      <div id="rollerContainer" class="roller-stage">
        <div class="roller-viewport-frame">
          <!-- Top Needle Marker -->
          <div class="tape-needle top-needle">
            <div class="needle-triangle"></div>
            <div class="needle-beam"></div>
          </div>

          <!-- Bottom Needle Marker -->
          <div class="tape-needle bottom-needle">
            <div class="needle-triangle"></div>
          </div>

          <!-- Vertical Guide Line -->
          <div class="center-target-line"></div>

          <!-- The Running Tape -->
          <div class="tape-track">
            <div id="tapeItems" class="tape-items-strip">
              <!-- Dynamically populated knife cards -->
            </div>
          </div>

          <!-- Edge Gradient Masks -->
          <div class="vignette-mask left-mask"></div>
          <div class="vignette-mask right-mask"></div>
        </div>
      </div>

      <!-- MODE 2: ROTARY WHEEL -->
      <div id="wheelContainer" class="wheel-stage" style="display: none;">
        <div class="wheel-wrapper">
          <!-- Top Flapper Needle -->
          <div id="wheelFlapper" class="wheel-pointer">
            <div class="pointer-arrow"></div>
          </div>

          <!-- Canvas Wheel -->
          <canvas id="wheelCanvas" width="560" height="560"></canvas>

          <!-- Center Spin Trigger -->
          <button id="wheelCenterBtn" class="wheel-center-disc" title="Bấm để quay">
            <div class="disc-inner">
              <span class="disc-star">★</span>
              <span class="disc-text" id="wheelCenterText">SPIN 1</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Action Spin Bar -->
      <div class="action-panel">
        <button id="spinBtn" class="cs-btn cs-btn-giant cs-btn-spin">
          <span class="btn-shine"></span>
          <span class="spin-btn-icon" id="spinBtnIcon">⚡</span>
          <span class="spin-btn-text" id="spinBtnText">QUAY CHỌN LOẠI DAO (VÒNG 1/3)</span>
        </button>
      </div>'''

new_spinners_block = '''      <!-- Action Spin Bar (Hidden in normal flow, accessed via Spotlight) -->
      <div class="action-panel" style="display: none;">
        <button id="spinBtn" class="cs-btn cs-btn-giant cs-btn-spin">
          <span class="btn-shine"></span>
          <span class="spin-btn-icon" id="spinBtnIcon">⚡</span>
          <span class="spin-btn-text" id="spinBtnText">QUAY CHỌN LOẠI DAO (VÒNG 1/3)</span>
        </button>
      </div>

      <!-- ======================================================================
           CINEMATIC SPOTLIGHT MODAL (TỐI NỀN & SÂN KHẤU VÒNG QUAY)
           ====================================================================== -->
      <div id="spinSpotlightModal" class="spotlight-modal" style="display: none;">
        <div class="spotlight-backdrop"></div>
        <div class="spotlight-stage-box">
          <!-- Spotlight Stage Header -->
          <div class="spotlight-header">
            <div class="spotlight-badge" id="spotlightStageBadge">VÒNG 1 / 3</div>
            <h2 class="spotlight-title" id="spotlightStageTitle">QUAY CHỌN LOẠI DAO CS2</h2>
            <p class="spotlight-desc" id="spotlightStageDesc">Đang quay tìm vũ khí tâm điểm cho buổi mở hòm...</p>
          </div>

          <!-- Spinner Area (Active during spin) -->
          <div id="spotlightSpinnerArea" class="spotlight-spinner-area">
            <!-- MODE 1: HORIZONTAL ROLLER -->
            <div id="rollerContainer" class="roller-stage">
              <div class="roller-viewport-frame">
                <!-- Top Needle Marker -->
                <div class="tape-needle top-needle">
                  <div class="needle-triangle"></div>
                  <div class="needle-beam"></div>
                </div>

                <!-- Bottom Needle Marker -->
                <div class="tape-needle bottom-needle">
                  <div class="needle-triangle"></div>
                </div>

                <!-- Vertical Guide Line -->
                <div class="center-target-line"></div>

                <!-- The Running Tape -->
                <div class="tape-track">
                  <div id="tapeItems" class="tape-items-strip">
                    <!-- Dynamically populated knife cards -->
                  </div>
                </div>

                <!-- Edge Gradient Masks -->
                <div class="vignette-mask left-mask"></div>
                <div class="vignette-mask right-mask"></div>
              </div>
            </div>

            <!-- MODE 2: ROTARY WHEEL -->
            <div id="wheelContainer" class="wheel-stage" style="display: none;">
              <div class="wheel-wrapper">
                <!-- Top Flapper Needle -->
                <div id="wheelFlapper" class="wheel-pointer">
                  <div class="pointer-arrow"></div>
                </div>

                <!-- Canvas Wheel -->
                <canvas id="wheelCanvas" width="560" height="560"></canvas>

                <!-- Center Spin Trigger -->
                <button id="wheelCenterBtn" class="wheel-center-disc" title="Bấm để quay">
                  <div class="disc-inner">
                    <span class="disc-star">★</span>
                    <span class="disc-text" id="wheelCenterText">SPIN 1</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Winner Reveal Showcase Card (Active when spin stops) -->
          <div id="winnerRevealCardArea" class="winner-reveal-area" style="display: none;">
            <div class="reveal-card" id="revealCard">
              <div class="reveal-rarity-bar" id="revealRarityBar"></div>
              <div class="reveal-badge" id="revealBadge">★ ĐÃ CHỌN</div>
              
              <div class="reveal-img-container">
                <div class="reveal-glow-ring"></div>
                <img id="revealCardImg" class="reveal-card-img" src="" alt="Winner" />
              </div>

              <div class="reveal-details">
                <h3 class="reveal-title" id="revealTitle">Survival Knife</h3>
                <p class="reveal-subtitle" id="revealSubtitle">Dao Sinh Tồn Survival</p>
                
                <!-- Related Cases Container (for Stage 2) -->
                <div class="reveal-cases-wrap" id="revealCasesWrap" style="display: none;">
                  <span class="rc-label">📦 HÒM CÓ THỂ MỞ RA:</span>
                  <div class="rc-badges" id="revealCasesBadges"></div>
                </div>

                <div class="reveal-action-wrap">
                  <button id="revealContinueBtn" class="cs-btn cs-btn-gold reveal-btn">
                    <span id="revealBtnText">TIẾP TỤC</span>
                    <span class="reveal-btn-arrow">➔</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>'''

if crlf:
    old_spinners_block = old_spinners_block.replace('\n', '\r\n')
    new_spinners_block = new_spinners_block.replace('\n', '\r\n')

assert old_spinners_block in html, "old_spinners_block not found"
html = html.replace(old_spinners_block, new_spinners_block, 1)

# 5. Bump cache busters in script tags to v10
html = html.replace('?v=20261013_v9', '?v=20261014_v10')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Successfully updated index.html! New file length:', len(html))
