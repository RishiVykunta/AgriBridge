"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { logout, touchSession } from "@/app/actions/auth";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const TOUCH_INTERVAL = 15 * 60 * 1000;    // 15 minutes

export default function SessionInactivityHandler() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTouchRef = useRef<number>(Date.now());

  const handleLogout = useCallback(async () => {
    console.log("Inactivity detected. Logging out...");
    await logout();
    router.push("/login?message=" + encodeURIComponent("You have been logged out due to inactivity."));
    router.refresh();
  }, [router]);

  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);

    // Only touch the session if at least TOUCH_INTERVAL has passed since last touch
    const now = Date.now();
    if (now - lastTouchRef.current > TOUCH_INTERVAL) {
      lastTouchRef.current = now;
      touchSession().then(res => {
        if (!res.success) {
          // If session is already gone/invalid, we could force logout but 
          // usually the next navigation will handle it.
          console.warn("Session touch failed.");
        }
      });
    }
  }, [handleLogout]);

  useEffect(() => {
    // Initial timer set
    timeoutRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT);

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    
    const eventHandler = () => {
      resetInactivityTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, eventHandler);
    });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => {
        window.removeEventListener(event, eventHandler);
      });
    };
  }, [handleLogout, resetInactivityTimer]);

  return null; // This component doesn't render anything
}
