export function initWebVitals(report = () => {}) {
  try {
    const metrics = {};
    const observers = [];
    const add = (type, handler, opts) => {
      try {
        const po = new PerformanceObserver(handler)
        po.observe({ type, buffered: true, ...opts })
        observers.push(po)
      } catch (err) {
        if (import.meta?.env?.DEV) {
          // 某些浏览器/环境不支持对应的 PerformanceObserver 类型
          console.debug('[web-vitals] observer unsupported:', type, err?.message)
        }
      }
    };
    // LCP
    add('largest-contentful-paint', (list) => {
      const last = list.getEntries().at(-1);
      if (last) metrics.lcp = Math.round(last.startTime);
    });
    // CLS
    let cls = 0;
    add('layout-shift', (list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) cls += e.value;
      metrics.cls = Number(cls.toFixed(3));
    });
    // INP approx (event timing)
    add('event', (list) => {
      let max = metrics.inp || 0;
      for (const e of list.getEntries()) if (e.name === 'event') max = Math.max(max, e.duration || 0);
      metrics.inp = Math.round(max);
    }, { durationThreshold: 40 });

    const flush = () => {
      report({ t: Date.now(), ...metrics });
      observers.forEach((po) => {
        try { po.disconnect(); } catch (err) {
          if (import.meta?.env?.DEV) console.debug('[web-vitals] disconnect failed:', err?.message)
        }
      });
    };
    addEventListener('pagehide', flush, { once: true });
  } catch (err) {
    if (import.meta?.env?.DEV) console.debug('[web-vitals] init disabled:', err?.message)
  }
}
