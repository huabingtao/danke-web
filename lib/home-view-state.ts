"use client";
import { useLayoutEffect, useState, useSyncExternalStore } from 'react';

const EXPANDED_KEY = 'home-categories-expanded';
const SCROLL_KEY = 'home-scroll-y';
let expandedMemory = false;
let scrollMemory = 0;
let restoring = true;
function subscribe(callback: () => void) {
  window.addEventListener('home-state-change', callback);
  return () => window.removeEventListener('home-state-change', callback);
}
function readExpanded() {
  try { return sessionStorage.getItem(EXPANDED_KEY) === 'true'; } catch { return expandedMemory; }
}
function readScroll() {
  try { return Math.max(0, Number(sessionStorage.getItem(SCROLL_KEY)) || 0); } catch { return scrollMemory; }
}
export function saveHomePosition() {
  if (restoring) return;
  scrollMemory = window.scrollY;
  try { sessionStorage.setItem(SCROLL_KEY, String(scrollMemory)); } catch {}
}
export function pauseHomePosition() { saveHomePosition(); restoring = true; }
export function useHomeExpanded() {
  const expanded = useSyncExternalStore(subscribe, readExpanded, () => false);
  const toggle = () => {
    expandedMemory = !expanded;
    try { sessionStorage.setItem(EXPANDED_KEY, String(expandedMemory)); } catch {}
    window.dispatchEvent(new Event('home-state-change'));
  };
  return { expanded, toggle };
}
export function useHomeScrollRestoration() {
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    restoring = true;
    const savedY = readScroll();
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        const id = window.location.hash.slice(1);
        const anchor = id ? document.getElementById(id) : null;
        if (anchor) anchor.scrollIntoView({ block: 'start' });
        else window.scrollTo(0, savedY);
        restoring = false;
        setReady(true);
      });
    });
    const leaving = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!link || link.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname !== '/') pauseHomePosition();
    };
    window.addEventListener('scroll', saveHomePosition, { passive: true });
    window.addEventListener('pagehide', saveHomePosition);
    document.addEventListener('click', leaving, true);
    return () => {
      cancelAnimationFrame(first); cancelAnimationFrame(second);
      window.removeEventListener('scroll', saveHomePosition);
      window.removeEventListener('pagehide', saveHomePosition);
      document.removeEventListener('click', leaving, true);
    };
  }, []);
  return ready;
}
