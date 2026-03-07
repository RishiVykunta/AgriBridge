"use client";

import { useState } from "react";

type Props = {
  id: string;
  name: string;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
  placeholder?: string;
  label: string;
  className?: string;
};

export function PasswordField({
  id,
  name,
  required = true,
  minLength,
  autoComplete = "current-password",
  placeholder,
  label,
  className = "",
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`w-full rounded-lg border border-zinc-300 py-2 pr-10 pl-3 text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
          aria-describedby={`${id}-toggle-desc`}
        />
        <button
          type="button"
          tabIndex={0}
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          id={`${id}-toggle-desc`}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
