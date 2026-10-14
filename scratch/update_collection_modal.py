# update_collection_modal.py
import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add button in header-actions right before openSettingsBtn
old_header_btn = '''        <!-- Dedicated Settings Button -->
        <button id="openSettingsBtn" class="cs-btn cs-btn-sm cs-btn-gold">'''

new_header_btn = '''        <!-- Dedicated Collection Button (Toggle like Settings) -->
        <button id="openCollectionBtn" class="cs-btn cs-btn-sm cs-btn-purple" title="Mở Bộ sưu tập dao CS2">
          <i class="icon">🏆</i> BỘ SƯU TẬP (<span id="headerCollCount">0</span>)
        </button>

        <!-- Dedicated Settings Button -->
        <button id="openSettingsBtn" class="cs-btn cs-btn-sm cs-btn-gold">'''

assert old_header_btn in html, "old_header_btn not found"
html = html.replace(old_header_btn, new_header_btn, 1)

# Make statCollectionProgress cell clickable
old_stat_cell = '''      <div class="stat-cell">
        <span class="stat-label">TIẾN ĐỘ BỘ SƯU TẬP:</span>
        <span class="stat-value gold-text" id="statCollectionProgress">0 / 20</span>
      </div>'''

new_stat_cell = '''      <div class="stat-cell" id="statCollectionCell" style="cursor: pointer;" title="Bấm để mở Bộ sưu tập dao CS2">
        <span class="stat-label">TIẾN ĐỘ BỘ SƯU TẬP:</span>
        <span class="stat-value gold-text" id="statCollectionProgress">0 / 20</span>
      </div>'''

assert old_stat_cell in html, "old_stat_cell not found"
html = html.replace(old_stat_cell, new_stat_cell, 1)

# Hide 20 knife types section
old_mks = '<section class="main-knives-section" style="margin-top: 24px;">'
new_mks = '<section class="main-knives-section" id="mainKnivesSection" style="margin-top: 24px; display: none;">'
assert old_mks in html, "old_mks not found"
html = html.replace(old_mks, new_mks, 1)

# Extract collection section block and wrap in collectionModal
# Find collectionSection
start_marker = '      <!-- ======================================================================\r\n           KNIFE COLLECTION TRACKER (BỘ SƯU TẬP DAO CS2 - PHỤC VỤ VIDEO SERIES)\r\n           ====================================================================== -->\r\n      <section class="collection-section" id="collectionSection">'
crlf = True
if start_marker not in html:
    start_marker = '      <!-- ======================================================================\n           KNIFE COLLECTION TRACKER (BỘ SƯU TẬP DAO CS2 - PHỤC VỤ VIDEO SERIES)\n           ====================================================================== -->\n      <section class="collection-section" id="collectionSection">'
    crlf = False

assert start_marker in html, "start_marker not found"

end_marker = '      </section>\r\n\r\n      <!-- ======================================================================\r\n           20 KNIFE TYPES SHOWCASE / BỘ KHO DAO CS2'
if end_marker not in html:
    end_marker = '      </section>\n\n      <!-- ======================================================================\n           20 KNIFE TYPES SHOWCASE / BỘ KHO DAO CS2'
assert end_marker in html, "end_marker not found"

start_pos = html.find(start_marker)
end_pos = html.find(end_marker) + len('      </section>')

coll_section_content = html[start_pos:end_pos].strip()

# Remove it from main
nl = '\r\n' if crlf else '\n'
html = html[:start_pos] + html[end_pos + len(nl):]

# Create collection modal
collection_modal_html = f'''  <!-- ========================================================================
       DEDICATED COLLECTION MODAL (BẬT TẮT GIỐNG SETTING)
       ======================================================================== -->
  <div id="collectionModal" class="settings-modal collection-modal">
    <div class="settings-backdrop collection-backdrop"></div>
    <div class="settings-window collection-window">
      <!-- Collection Header -->
      <div class="settings-header">
        <div class="sh-title-group">
          <div class="sh-icon" style="background: rgba(168, 85, 247, 0.15); border-color: rgba(168, 85, 247, 0.4); color: #c084fc;">🏆</div>
          <div>
            <h2 class="sh-title">BỘ SƯU TẬP DAO CS2</h2>
            <p class="sh-subtitle">Quản lý kho dao cá nhân, thông số Float và tiến độ sưu tập</p>
          </div>
        </div>
        <button id="closeCollectionBtn" class="settings-close-btn" title="Đóng">&times;</button>
      </div>

      <!-- Collection Content Body -->
      <div class="collection-modal-body">
{coll_section_content}
      </div>
    </div>
  </div>
'''

if crlf:
    collection_modal_html = collection_modal_html.replace('\n', '\r\n')

# Insert collection modal right before settingsModal
settings_marker = '  <!-- ========================================================================\r\n       DEDICATED SETTINGS MODAL'
if settings_marker not in html:
    settings_marker = '  <!-- ========================================================================\n       DEDICATED SETTINGS MODAL'
assert settings_marker in html, "settings_marker not found"

html = html.replace(settings_marker, collection_modal_html + nl + settings_marker, 1)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("SUCCESS: index.html updated!")
