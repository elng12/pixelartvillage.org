/* Dedicated worker: compute K-Means palette on small ImageData */

function sqrDist(p, q) {
  const dr = p[0] - q[0];
  const dg = p[1] - q[1];
  const db = p[2] - q[2];
  return dr * dr + dg * dg + db * db;
}

function initPlusPlus(samples, k) {
  const centroids = [];
  centroids.push(samples[Math.floor(Math.random() * samples.length)]);
  while (centroids.length < k) {
    const distances = samples.map((s) => {
      let best = Infinity;
      for (let c = 0; c < centroids.length; c++) best = Math.min(best, sqrDist(s, centroids[c]));
      return best;
    });
    const sum = distances.reduce((a, b) => a + b, 0) || 1;
    let r = Math.random() * sum;
    let idx = 0;
    for (; idx < distances.length - 1; idx++) {
      r -= distances[idx];
      if (r <= 0) break;
    }
    centroids.push(samples[idx]);
  }
  return centroids.map((c) => c.slice());
}

function iterate(samples, centroids, iters) {
  // 早停阈值：质心本次迭代的总位移平方和低于该值则视为收敛
  const TOL = 0.5; // 可调，小值更严格
  for (let it = 0; it < iters; it++) {
    const sums = Array.from({ length: centroids.length }, () => [0, 0, 0, 0]);
    for (let i = 0; i < samples.length; i++) {
      const s = samples[i];
      let best = 0,
        bestDist = Infinity;
      for (let c = 0; c < centroids.length; c++) {
        const dist = sqrDist(s, centroids[c]);
        if (dist < bestDist) {
          bestDist = dist;
          best = c;
        }
      }
      sums[best][0] += s[0];
      sums[best][1] += s[1];
      sums[best][2] += s[2];
      sums[best][3]++;
    }
    let shift = 0;
    for (let c = 0; c < centroids.length; c++) {
      const cnt = sums[c][3] || 1;
      const nr = Math.round(sums[c][0] / cnt);
      const ng = Math.round(sums[c][1] / cnt);
      const nb = Math.round(sums[c][2] / cnt);
      const dr = nr - centroids[c][0];
      const dg = ng - centroids[c][1];
      const db = nb - centroids[c][2];
      shift += dr * dr + dg * dg + db * db;
      centroids[c][0] = nr;
      centroids[c][1] = ng;
      centroids[c][2] = nb;
    }
    if (shift <= TOL) break;
  }
  return centroids;
}

self.onmessage = (e) => {
  try {
    const { id, data, /* width, height, */ k } = e.data;
    const arr = new Uint8ClampedArray(data);
    const samples = [];
    for (let i = 0; i < arr.length; i += 4) {
      const a = arr[i + 3];
      if (a === 0) continue;
      samples.push([arr[i], arr[i + 1], arr[i + 2]]);
    }
    if (samples.length === 0) {
      self.postMessage({ id, ok: true, centroids: [[0, 0, 0]] });
      return;
    }
    const iters = Math.max(4, Math.min(12, 2 + Math.floor(k / 2)));
    const restarts = Math.min(4, 1 + Math.floor(k / 8));
    let best = null;
    let bestScore = Infinity;
    for (let r = 0; r < restarts; r++) {
      const init = initPlusPlus(samples, k);
      const cents = iterate(samples, init, iters);
      let score = 0;
      for (let i = 0; i < samples.length; i++) {
        const s = samples[i];
        let d = Infinity;
        for (let c = 0; c < cents.length; c++) d = Math.min(d, sqrDist(s, cents[c]));
        score += d;
      }
      if (score < bestScore) {
        bestScore = score;
        best = cents;
      }
    }
    self.postMessage({ id, ok: true, centroids: best });
  } catch (err) {
    self.postMessage({ ok: false, error: err?.message || String(err) });
  }
};
