"use client";

import { Button } from "@/components/ui/button";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { CircleCheckIcon, XIcon, AlertCircleIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface UseProgressTimerProps {
  duration: number;
  interval?: number;
  onComplete?: () => void;
}

function useProgressTimer({ duration, interval = 100, onComplete }: UseProgressTimerProps) {
  const [progress, setProgress] = useState(duration);
  const timerRef = useRef<number | null>(null);
  const timerState = useRef({
    startTime: 0,
    remaining: duration,
    isPaused: false,
  });

  const cleanup = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setProgress(duration);
    timerState.current = {
      startTime: 0,
      remaining: duration,
      isPaused: false,
    };
  }, [duration, cleanup]);

  const start = useCallback(() => {
    const state = timerState.current;
    state.startTime = Date.now();
    state.isPaused = false;

    timerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - state.startTime;
      const remaining = Math.max(0, state.remaining - elapsedTime);

      setProgress(remaining);
      
      if (remaining <= 0) {
        cleanup();
        onComplete?.();
      }
    }, interval);
  }, [interval, cleanup, onComplete]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    progress,
    start,
    reset,
  };
}

interface CustomToastProps {
  status: "success" | "error";
  title: string;
  description: string;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CustomToast({ status, title, description, open, onOpenChange }: CustomToastProps) {
  const toastDuration = 5000;
  const { progress, start, reset } = useProgressTimer({
    duration: toastDuration,
    onComplete: () => onOpenChange(false),
  });

  useEffect(() => {
    if (open) {
      reset();
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const isSuccess = status === "success";
  const icon = isSuccess ? <CircleCheckIcon className="mt-0.5 shrink-0 text-emerald-500" size={16} aria-hidden="true" /> : <AlertCircleIcon className="mt-0.5 shrink-0 text-red-500" size={16} aria-hidden="true" />;
  const progressBarColor = isSuccess ? "bg-emerald-500" : "bg-red-500";

  return (
    <RadixToastProvider swipeDirection="left">
      <Toast open={open}>
        <div className="flex w-full justify-between gap-3">
          {icon}
          <div className="flex grow flex-col gap-3">
            <div className="space-y-1">
              <ToastTitle>{title}</ToastTitle>
              <ToastDescription>{description}</ToastDescription>
            </div>
          </div>
          <ToastClose asChild>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              aria-label="Close notification"
            >
              <XIcon
                size={16}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </ToastClose>
        </div>
        <div className="contents" aria-hidden="true">
          <div
            className={`pointer-events-none absolute bottom-0 left-0 h-1 w-full ${progressBarColor}`}
            style={{
              width: `${(progress / toastDuration) * 100}%`,
              transition: "width 100ms linear",
            }}
          />
        </div>
      </Toast>
      <ToastViewport className="sm:right-auto sm:left-0" />
    </RadixToastProvider>
  );
}