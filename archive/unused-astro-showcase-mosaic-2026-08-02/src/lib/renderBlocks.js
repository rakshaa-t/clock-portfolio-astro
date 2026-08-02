/** Shared rich-body block renderer for notes + showcase story layouts. */

export function renderBlock(block, sectionId) {
  if (block.type === 'text') {
    if (sectionId) return `<div id="section-${sectionId}">${block.html}</div>`;
    return block.html;
  }
  if (block.type === 'code') {
    return `<div style="position:relative"><div class="note-code">${block.html}</div></div>`;
  }
  if (block.type === 'image') {
    let html = `<div class="note-img">`;
    if (block.src) {
      html += `<img src="${block.src}" alt="${block.caption || ''}" loading="lazy">`;
    }
    html += `</div>`;
    if (block.caption) html += `<div class="note-img-caption">${block.caption}</div>`;
    return html;
  }
  if (block.type === 'video') {
    return `<video class="note-video" loop muted playsinline style="width:100%;border-radius:12px;margin:8px 0 16px;box-shadow:0 2px 12px rgba(0,0,0,0.06)"><source src="${block.src}" type="video/mp4"></video>`;
  }
  if (block.type === 'callout') return `<div class="note-callout">${block.html}</div>`;
  return '';
}
