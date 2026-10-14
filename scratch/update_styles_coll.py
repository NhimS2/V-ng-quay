# update_styles_coll.py
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

coll_styles = '''
/* =========================================================================
 * DEDICATED COLLECTION MODAL & HEADER BUTTON (TOGGLE LIKE SETTINGS)
 * ========================================================================= */
.collection-modal {
  z-index: 125 !important;
}

.collection-window {
  width: 1180px !important;
  max-width: 96vw !important;
  max-height: 90vh !important;
  display: flex !important;
  flex-direction: column !important;
  border-color: rgba(168, 85, 247, 0.4) !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(168, 85, 247, 0.25) !important;
}

.collection-modal-body {
  overflow-y: auto !important;
  padding: 16px 24px 28px !important;
  flex: 1 !important;
}

.collection-modal-body .collection-section {
  margin-top: 0 !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
}

/* Purple Header Button for Collection */
.cs-btn-purple {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(147, 51, 234, 0.38) 100%) !important;
  border: 1.5px solid rgba(192, 132, 252, 0.45) !important;
  color: #f3e8ff !important;
  font-family: var(--font-heading) !important;
  font-weight: 800 !important;
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
  cursor: pointer !important;
}

.cs-btn-purple:hover {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.45) 0%, rgba(147, 51, 234, 0.65) 100%) !important;
  border-color: #d8b4fe !important;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.5) !important;
  color: #ffffff !important;
  transform: translateY(-1px) !important;
}

.stat-cell-clickable {
  transition: background 0.2s ease, transform 0.2s ease;
}

.stat-cell-clickable:hover {
  background: rgba(255, 215, 0, 0.08);
  border-radius: 8px;
  transform: translateY(-1px);
}
'''

css = css + '\n' + coll_styles

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("SUCCESS: styles.css updated!")
