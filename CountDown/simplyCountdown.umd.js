!(function (e, n) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = n())
    : "function" == typeof define && define.amd
    ? define("simplyCountdown", n)
    : ((e =
        "undefined" != typeof globalThis
          ? globalThis
          : e || self).simplyCountdown = n());
})(this, function () {
  "use strict";
  const e = (e, n, t, o, s, a) => {
      const l = document.createElement("div");
      l.className = `${e} ${a.sectionClass}`;
      const r = document.createElement("div"),
        d = document.createElement("span"),
        i = document.createElement("span");
      return (
        (d.className = `${n} ${a.amountClass}`),
        (i.className = `${t} ${a.wordClass}`),
        (d.textContent = String(o)),
        (i.textContent = s),
        r.appendChild(d),
        r.appendChild(i),
        l.appendChild(r),
        l
      );
    },
    n = {
      year: 2024,
      month: 12,
      day: 25,
      hours: 0,
      minutes: 0,
      seconds: 0,
      words: {
        days: { lambda: (e, n) => (n > 1 ? e + "s" : e), root: "day" },
        hours: { lambda: (e, n) => (n > 1 ? e + "s" : e), root: "hour" },
        minutes: { lambda: (e, n) => (n > 1 ? e + "s" : e), root: "minute" },
        seconds: { lambda: (e, n) => (n > 1 ? e + "s" : e), root: "second" },
      },
      plural: !0,
      inline: !1,
      inlineSeparator: ", ",
      enableUtc: !1,
      onEnd: () => {},
      refresh: 1e3,
      inlineClass: "simply-countdown-inline",
      sectionClass: "simply-section",
      amountClass: "simply-amount",
      wordClass: "simply-word",
      zeroPad: !1,
      countUp: !1,
      removeZeroUnits: !1,
      onStop: () => {},
      onResume: () => {},
      onUpdate: () => {},
    };
  function t(e, n, t) {
    return !t.removeZeroUnits || 0 !== e.value || n.some((e) => 0 !== e.value);
  }
  function o(e, n, o) {
    const s = e
      .filter((o, s) => t(o, e.slice(0, s), n))
      .map((e) =>
        (function (e, n) {
          return `${
            n.zeroPad ? String(e.value).padStart(2, "0") : e.value
          } ${n.words[e.word].lambda(n.words[e.word].root, e.value)}`;
        })(e, n)
      )
      .join(n.inlineSeparator);
    o.innerHTML = s;
  }
  function s(e, n, o) {
    e.forEach((s, a) => {
      "seconds" === s.word || t(s, e.slice(0, a), n)
        ? (((e, n, t) => {
            const o = e.querySelector(".simply-amount"),
              s = e.querySelector(".simply-word");
            o && (o.textContent = String(n)), s && (s.textContent = t);
          })(
            o[s.word],
            n.zeroPad ? String(s.value).padStart(2, "0") : s.value,
            n.words[s.word].lambda(n.words[s.word].root, s.value)
          ),
          (o[s.word].style.display = ""))
        : (o[s.word].style.display = "none");
    });
  }
  const a = (n, t) => {
      let a = { isPaused: !1, interval: null, targetDate: new Date() };
      const l = (e) =>
        e.enableUtc
          ? new Date(
              Date.UTC(
                e.year,
                e.month - 1,
                e.day,
                e.hours,
                e.minutes,
                e.seconds
              )
            )
          : new Date(e.year, e.month - 1, e.day, e.hours, e.minutes, e.seconds);
      a.targetDate = l(t);
      let r = null;
      t.inline &&
        ((r = document.createElement("span")),
        (r.className = t.inlineClass),
        n.appendChild(r));
      const d = t.inline
          ? null
          : ((n, t) => {
              const o = "simply-amount",
                s = "simply-word",
                a = e("simply-section simply-days-section", o, s, 0, "day", t),
                l = e(
                  "simply-section simply-hours-section",
                  o,
                  s,
                  0,
                  "hour",
                  t
                ),
                r = e(
                  "simply-section simply-minutes-section",
                  o,
                  s,
                  0,
                  "minute",
                  t
                ),
                d = e(
                  "simply-section simply-seconds-section",
                  o,
                  s,
                  0,
                  "second",
                  t
                );
              return (
                n.appendChild(a),
                n.appendChild(l),
                n.appendChild(r),
                n.appendChild(d),
                { days: a, hours: l, minutes: r, seconds: d }
              );
            })(n, {
              sectionClass: t.sectionClass,
              amountClass: t.amountClass,
              wordClass: t.wordClass,
            }),
        i = () => {
          const e = t.enableUtc
            ? new Date(
                Date.UTC(
                  new Date().getUTCFullYear(),
                  new Date().getUTCMonth(),
                  new Date().getUTCDate(),
                  new Date().getUTCHours(),
                  new Date().getUTCMinutes(),
                  new Date().getUTCSeconds()
                )
              )
            : new Date();
          let n = t.countUp
            ? e.getTime() - a.targetDate.getTime()
            : a.targetDate.getTime() - e.getTime();
          n <= 0 &&
            !t.countUp &&
            ((n = 0),
            null !== a.interval && clearInterval(a.interval),
            t.onEnd && t.onEnd());
          const l = Math.floor(n / 864e5);
          n -= 1e3 * l * 60 * 60 * 24;
          const i = Math.floor(n / 36e5);
          n -= 1e3 * i * 60 * 60;
          const u = Math.floor(n / 6e4);
          n -= 1e3 * u * 60;
          const c = Math.floor(n / 1e3);
          if (t.inline && r) {
            o(
              [
                { value: l, word: "days" },
                { value: i, word: "hours" },
                { value: u, word: "minutes" },
                { value: c, word: "seconds" },
              ],
              t,
              r
            );
          } else if (d) {
            s(
              [
                { value: l, word: "days" },
                { value: i, word: "hours" },
                { value: u, word: "minutes" },
                { value: c, word: "seconds" },
              ],
              t,
              d
            );
          }
        },
        u = () => {
          (a.interval = setInterval(i, t.refresh)), i();
        };
      u();
      const c = new MutationObserver((e) => {
        e.forEach((e) => {
          e.removedNodes.forEach((e) => {
            e === n &&
              (null !== a.interval && clearInterval(a.interval),
              c.disconnect());
          });
        });
      });
      return (
        n.parentNode && c.observe(n.parentNode, { childList: !0 }),
        {
          stopCountdown: () => {
            var e;
            null !== a.interval &&
              (clearInterval(a.interval), (a.interval = null)),
              (a.isPaused = !0),
              null == (e = t.onStop) || e.call(t);
          },
          resumeCountdown: () => {
            var e;
            a.isPaused &&
              (u(), (a.isPaused = !1), null == (e = t.onResume) || e.call(t));
          },
          updateCountdown: (e) => {
            var n;
            Object.assign(t, e),
              (void 0 === e.year &&
                void 0 === e.month &&
                void 0 === e.day &&
                void 0 === e.hours &&
                void 0 === e.minutes &&
                void 0 === e.seconds) ||
                (a.targetDate = l(t)),
              null == (n = t.onUpdate) || n.call(t, e),
              a.isPaused || (a.interval && clearInterval(a.interval), u());
          },
          getState: () => ({ ...a }),
        }
      );
    },
    l = (e) => {
      const n = e;
      return (
        (n.stopCountdown = () => e.forEach((e) => e.stopCountdown())),
        (n.resumeCountdown = () => e.forEach((e) => e.resumeCountdown())),
        (n.updateCountdown = (n) => e.forEach((e) => e.updateCountdown(n))),
        (n.getState = () => e.map((e) => e.getState())),
        n
      );
    },
    r = (e, t = n) => {
      const o = { ...n, ...t };
      if ("string" == typeof e) {
        const n = document.querySelectorAll(e),
          t = Array.from(n).map((e) => a(e, o));
        return 1 === t.length ? t[0] : l(t);
      }
      if (((e) => e instanceof NodeList)(e)) {
        const n = Array.from(e).map((e) => a(e, o));
        return 1 === n.length ? n[0] : l(n);
      }
      return a(e, o);
    };
  return (
    "function" == typeof define && define.amd
      ? define(function () {
          return r;
        })
      : "object" == typeof module && module.exports
      ? (module.exports = r)
      : (window.simplyCountdown = r),
    r
  );
});
//# sourceMappingURL=simplyCountdown.umd.js.map
simplyCountdown(".simply-countdown", {
  year: 2025, // Target year (required)
  month: 8, // Target month [1-12] (required)
  day: 2, // Target day [1-31] (required)
  hours: 8, // Target hour [0-23], default: 0
  words: {
    days: {
      root: "Hari",
      lambda: (root, n) => (n > 0 ? root + "" : root),
    },
    hours: {
      root: "Jam",
      lambda: (root, n) => (n > 0 ? root + "" : root),
    },
    minutes: {
      root: "Menit",
      lambda: (root, n) => (n > 0 ? root + "" : root),
    },
    seconds: {
      root: "Detik",
      lambda: (root, n) => (n > 0 ? root + "" : root),
    },
  },
});
