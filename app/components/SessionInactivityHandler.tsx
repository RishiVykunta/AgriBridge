"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { logout, touchSession } from "@/app/actions/auth";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const TOUCH_INTERVAL = 15 * 60 * 1000;    // 15 minutes
const TAB_COUNT_KEY = "agribridge_tabs_open";
const SESSION_CLAIM_KEY = "agribridge_session_claimed";

export default function SessionInactivityHandler() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTouchRef = useRef<number>(Date.now());

  const handleLogout = useCallback(async () => {
    console.log("Session terminating. Logging out...");
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    // Clear claim and count just in case
    sessionStorage.removeItem(SESSION_CLAIM_KEY);
    localStorage.removeItem(TAB_COUNT_KEY);
    
    router.push("/login?message=" + encodeURIComponent("You have been logged out."));
    router.refresh();
  }, [router]);

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);

    const now = Date.now();
    if (now - lastTouchRef.current > TOUCH_INTERVAL) {
      lastTouchRef.current = now;
      touchSession().then(res => {
        if (!res.success) {
          console.warn("Session touch failed.");
        }
      });
    }
  }, [handleLogout]);

  useEffect(() => {
    // 1. Tab Management: Increment count
    let count = parseInt(localStorage.getItem(TAB_COUNT_KEY) || "0", 10);
    localStorage.setItem(TAB_COUNT_KEY, (count + 1).toString());

    // 2. Session Claim: Mark this tab as "having access" if we were logged in
    // This isn't perfect but helps HomeHeader know if it should show the user
    if (!sessionStorage.getItem(SESSION_CLAIM_KEY)) {
      // If we're on a non-login page and no claim exists, we might want to check the session
      // For now, we just claim it on first load if we want to allow the tab to see the session
      sessionStorage.setItem(SESSION_CLAIM_KEY, "true");
    }

    // 3. Inactivity Listeners
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    const eventHandler = () => resetInactivityTimer();
    events.forEach(event => window.addEventListener(event, eventHandler));

    // 4. Tab Close / Visibility Change
    const handleUnload = () => {
      let currentCount = parseInt(localStorage.getItem(TAB_COUNT_KEY) || "1", 10);
      const newCount = Math.max(0, currentCount - 1);
      localStorage.setItem(TAB_COUNT_KEY, newCount.toString());

      if (newCount === 0) {
        // Last tab closing! Use sendBeacon for high reliability
        navigator.sendBeacon("/api/auth/logout");
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    // 5. Cross-tab Logout Sync
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TAB_COUNT_KEY && e.newValue === "0") {
        // Someone else triggered a total logout
        router.refresh();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Initial timeout
    timeoutRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => window.removeEventListener(event, eventHandler));
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [handleLogout, resetInactivityTimer, router]);

  return null;
}
