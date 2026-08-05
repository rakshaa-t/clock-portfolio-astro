import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const TABS = [
  { id: "853:454", label: "All", x: 0 },
  { id: "853:455", label: "Clients", x: 42.25 },
  { id: "853:459", label: "Experiments", x: 115.5 },
  { id: "853:461", label: "Live", x: 226.75 },
  { id: "853:463", label: "Mobile", x: 280 },
] as const;

const ACTIVE_COLOR = "#000000";
const INACTIVE_OPACITY = 0.44;

type TabFilterProps = {
  onChange?: (label: (typeof TABS)[number]["label"]) => void;
  ink?: string;
};

export default function TabFilter({
  onChange,
  ink = ACTIVE_COLOR,
}: TabFilterProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const onChangeRef = useRef(onChange);
  const prefersReducedMotion = useReducedMotion();

  onChangeRef.current = onChange;

  const handleSelect = (index: number) => {
    if (index === activeIndexRef.current) return;

    activeIndexRef.current = index;
    setActiveIndex(index);
    onChangeRef.current?.(TABS[index].label);
  };

  return (
    <div className="tab-filter" data-node-id="853:501">
      <div className="tab-filter__group" data-node-id="853:490">
        <div className="tab-filter__labels" role="tablist" data-node-id="853:457">
          {TABS.map((tab, index) => (
            <motion.button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              className="tab-filter__label"
              style={{
                left: tab.x,
                color: ink,
                opacity: index === activeIndex ? 1 : INACTIVE_OPACITY,
              }}
              data-node-id={tab.id}
              onClick={() => handleSelect(index)}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              transition={{ scale: { duration: 0.1, ease: "easeOut" } }}
            >
              <span className="tab-filter__label-text">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
