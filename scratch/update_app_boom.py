# update_app_boom.py
with open('app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update setStage(1)
old_stage1_reset = '''      // Reset Start Bar & Mission Section
      const huntStartBar = document.getElementById('huntStartBar');
      const startBtnText = document.getElementById('startBtnText');
      if (huntStartBar) huntStartBar.style.display = 'flex';
      if (startBtnText) startBtnText.textContent = 'SĂN MỤC TIÊU';
      const todayMissionSection = document.getElementById('todayMissionSection');
      if (todayMissionSection) todayMissionSection.style.display = 'none';'''

new_stage1_reset = '''      // Reset Start Bar & Dashboard & Mission Section
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
      }'''

assert old_stage1_reset in code, "old_stage1_reset not found"
code = code.replace(old_stage1_reset, new_stage1_reset, 1)

# 2. Update handleRevealContinue stage 3 callback
old_s3_call = '''        const huntStartBar = document.getElementById('huntStartBar');
        if (huntStartBar) huntStartBar.style.display = 'none';

        // SHOW "NHIỆM VỤ NGÀY HÔM NAY"!
        this.showTodayMissionFinale();'''

new_s3_call = '''        const huntStartBar = document.getElementById('huntStartBar');
        if (huntStartBar) huntStartBar.style.display = 'none';

        // HIỆU ỨNG RUNG DỒN DẬP -> BÙM! -> 3 VÒNG QUAY ẨN ĐI -> HIỆN NHIỆM VỤ HÔM NAY
        this.triggerFinalExplosionTransition();'''

assert old_s3_call in code, "old_s3_call not found"
code = code.replace(old_s3_call, new_s3_call, 1)

# 3. Add triggerFinalExplosionTransition and update showTodayMissionFinale
explosion_method = '''  triggerFinalExplosionTransition() {
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

'''

target_show_mission = '  showTodayMissionFinale() {'
new_show_mission = '  showTodayMissionFinale(isEpic = false) {'

assert target_show_mission in code, "target_show_mission not found"
code = code.replace(target_show_mission, explosion_method + new_show_mission, 1)

# Inside showTodayMissionFinale, add isEpic handling
old_mission_display = '''  showTodayMissionFinale(isEpic = false) {
    const missionSection = document.getElementById('todayMissionSection');
    if (!missionSection) return;

    missionSection.style.display = 'block';'''

new_mission_display = '''  showTodayMissionFinale(isEpic = false) {
    const missionSection = document.getElementById('todayMissionSection');
    if (!missionSection) return;

    missionSection.style.display = 'block';
    if (isEpic) {
      missionSection.classList.remove('tms-epic-entrance');
      void missionSection.offsetWidth; // Force reflow
      missionSection.classList.add('tms-epic-entrance');
      window.cs2Sound.playCheer();
    }'''

assert old_mission_display in code, "old_mission_display not found"
code = code.replace(old_mission_display, new_mission_display, 1)

# 4. Update resetHuntFlow
old_reset_hunt_flow = '''    const huntStartBar = document.getElementById('huntStartBar');
    const startBtnText = document.getElementById('startBtnText');
    if (huntStartBar) huntStartBar.style.display = 'flex';
    if (startBtnText) startBtnText.textContent = 'SĂN MỤC TIÊU';

    const todayMissionSection = document.getElementById('todayMissionSection');
    if (todayMissionSection) todayMissionSection.style.display = 'none';'''

new_reset_hunt_flow = '''    // Restore 3-slot hunt dashboard
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
    }'''

assert old_reset_hunt_flow in code, "old_reset_hunt_flow not found"
code = code.replace(old_reset_hunt_flow, new_reset_hunt_flow, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: app.js updated with explosion transition!")
