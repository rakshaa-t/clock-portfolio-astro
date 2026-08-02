import { useState } from 'react';
import { DialRoot, DialTimeline, useDialKit, useDialTimeline } from 'dialkit';
import 'dialkit/styles.css';

const LINKS = ['Index', 'Selected work', 'About', 'Contact'];

/* ─────────────────────────────────────────────────────────
 * MENU LAB — OPENING STORYBOARD
 *
 *    0ms   panel rises into view
 *  120ms   close mark settles into place
 *  180ms   navigation rows reveal in sequence
 *
 * DialKit is the authoring surface: use the dock to scrub these clips,
 * tune their values, then copy the final settings into the production menu.
 * ───────────────────────────────────────────────────────── */
export function MenuLab() {
  const [isOpen, setIsOpen] = useState(false);

  const timeline = useDialTimeline(
    'Menu opening',
    {
      panel: {
        at: 0,
        duration: 0.45,
        from: { opacity: 0, y: -28, scaleY: 0.96 },
        to: { opacity: 1, y: 0, scaleY: 1 },
        transition: { type: 'spring', visualDuration: 0.45, bounce: 0.04 },
      },
      closeMark: {
        at: 0.12,
        duration: 0.32,
        from: { opacity: 0, rotate: -24, scale: 0.72 },
        to: { opacity: 1, rotate: 0, scale: 1 },
        transition: { type: 'spring', visualDuration: 0.32, bounce: 0.12 },
      },
      navRows: {
        at: 0.18,
        duration: 0.5,
        from: { opacity: 0, y: 32 },
        to: { opacity: 1, y: 0 },
        transition: { type: 'spring', visualDuration: 0.5, bounce: 0.03 },
      },
    },
    { autoplay: false },
  );

  const controls = useDialKit(
    'Menu surface',
    {
      panel: {
        inset: [20, 0, 96, 4],
        radius: [18, 0, 48, 1],
        borderOpacity: [0.18, 0, 1, 0.01],
        background: '#111111',
      },
      navigation: {
        size: [44, 24, 84, 1],
        rowGap: [8, 0, 32, 1],
        rowDelay: [70, 0, 240, 5],
        tracking: [-0.04, -0.1, 0.04, 0.005],
      },
      actions: {
        replay: { type: 'action', label: 'Replay opening' },
      },
    },
    {
      id: 'showcase-menu-lab',
      persist: true,
      onAction: (action) => {
        if (action === 'actions.replay') {
          setIsOpen(true);
          timeline.replay();
        }
      },
    },
  );

  const openMenu = () => {
    setIsOpen(true);
    timeline.replay();
  };

  const panel = timeline.panel.current;
  const closeMark = timeline.closeMark.current;
  const navRows = timeline.navRows.current;

  return (
    <main className="menu-lab" style={{ '--lab-panel-bg': controls.panel.background } as React.CSSProperties}>
      <header className="menu-lab__header">
        <span>Menu motion study</span>
        <span>DialKit / authoring only</span>
      </header>

      <section className="menu-lab__stage" aria-label="Menu interaction preview">
        <p className="menu-lab__note">
          Tune the opening in the timeline dock, then use the surface panel to
          adjust the menu’s geometry and type.
        </p>

        <button className="menu-lab__trigger" type="button" onClick={openMenu}>
          <span>Menu</span>
          <i aria-hidden="true" />
        </button>

        <div
          className="menu-lab__scrim"
          data-open={isOpen}
          onClick={() => setIsOpen(false)}
        />

        <aside
          className="menu-lab__panel"
          aria-hidden={!isOpen}
          data-open={isOpen}
          style={{
            borderRadius: controls.panel.radius,
            borderColor: `rgb(255 255 255 / ${controls.panel.borderOpacity})`,
            inset: controls.panel.inset,
            opacity: panel.opacity,
            transform: `translateY(${panel.y}px) scaleY(${panel.scaleY})`,
          }}
        >
          <div className="menu-lab__panel-bar">
            <span>Index / 2026</span>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close menu">
              <span
                className="menu-lab__close-mark"
                style={{
                  opacity: closeMark.opacity,
                  transform: `rotate(${closeMark.rotate}deg) scale(${closeMark.scale})`,
                }}
              />
            </button>
          </div>

          <nav className="menu-lab__links" aria-label="Menu preview">
            {LINKS.map((link, index) => (
              <a
                href="#menu-lab"
                key={link}
                style={{
                  fontSize: controls.navigation.size,
                  letterSpacing: `${controls.navigation.tracking}em`,
                  marginTop: index === 0 ? 0 : controls.navigation.rowGap,
                  opacity: navRows.opacity,
                  transform: `translateY(${navRows.y + index * 4}px)`,
                  transitionDelay: `${index * controls.navigation.rowDelay}ms`,
                }}
              >
                <span>{link}</span>
                <small>0{index + 1}</small>
              </a>
            ))}
          </nav>

          <footer className="menu-lab__footer">
            <span>Scroll to tune</span>
            <span>Esc to close</span>
          </footer>
        </aside>
      </section>

      <DialRoot position="bottom-right" theme="dark" />
      <DialTimeline theme="dark" />
    </main>
  );
}
