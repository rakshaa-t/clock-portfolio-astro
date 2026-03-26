export const E = {
  expo: "cubic-bezier(0.16,1,0.3,1)",
  quart: "cubic-bezier(0.25,1,0.5,1)",
  spring: "cubic-bezier(0.175,0.885,0.32,1.1)",
  back: "cubic-bezier(0.34,1.56,0.64,1)",
  inQuart: "cubic-bezier(0.5,0,0.75,0)",
  material: "cubic-bezier(0.4,0,0.2,1)",
};

export const DEVICES = {
  iphone: { w: 280, h: 606, radius: 40, bezelR: 36, pad: 4, island: true, homeBar: true, status: true, viewport: { w: 393, h: 852 }, minScale: 0.7, maxScale: 1.2 },
  ipad: { w: 520, h: 380, radius: 24, bezelR: 20, pad: 4, island: false, homeBar: true, status: true, viewport: { w: 768, h: 1024 }, minScale: 0.7, maxScale: 1.5 },
  macbook: { w: 680, h: 420, radius: 20, bezelR: 16, pad: 4, island: false, homeBar: false, status: false, viewport: { w: 1280, h: 800 }, minScale: 0.7, maxScale: 1.6 },
};
