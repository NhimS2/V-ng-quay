# update_app_coll.py
with open('app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update headerCollCount in renderCollection
old_stat_progress = '''    const statProgress = document.getElementById('statCollectionProgress');
    if (statProgress) statProgress.textContent = `${distinctKnives.size} / ${totalAvailableKnifeTypes}`;'''

new_stat_progress = '''    const statProgress = document.getElementById('statCollectionProgress');
    if (statProgress) statProgress.textContent = `${distinctKnives.size} / ${totalAvailableKnifeTypes}`;

    const headerCollCount = document.getElementById('headerCollCount');
    if (headerCollCount) headerCollCount.textContent = totalKnives;'''

assert old_stat_progress in code, "old_stat_progress not found"
code = code.replace(old_stat_progress, new_stat_progress, 1)

# 2. Add collectionModal event bindings in bindEvents
old_settings_bind = '''    // Settings Modal
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');'''

new_settings_bind = '''    // Dedicated Collection Modal (Bật tắt giống Setting)
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
    const settingsModal = document.getElementById('settingsModal');'''

assert old_settings_bind in code, "old_settings_bind not found"
code = code.replace(old_settings_bind, new_settings_bind, 1)

# 3. Add ESC key support for both settings and collection modal
old_close_settings_block = '''    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', closeSettings);
    if (settingsBackdrop) settingsBackdrop.addEventListener('click', closeSettings);'''

new_close_settings_block = '''    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', closeSettings);
    if (settingsBackdrop) settingsBackdrop.addEventListener('click', closeSettings);

    // Global ESC to close open modals
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (settingsModal && settingsModal.classList.contains('active')) closeSettings();
        if (collectionModal && collectionModal.classList.contains('active')) closeCollection();
      }
    });'''

assert old_close_settings_block in code, "old_close_settings_block not found"
code = code.replace(old_close_settings_block, new_close_settings_block, 1)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESS: app.js updated with collection modal logic!")
