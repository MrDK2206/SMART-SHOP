import { useEffect, useRef, useState } from "react";

function generateCaptcha(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export function CaptchaField({ value, onChange, onValidityChange }) {
  const canvasRef = useRef(null);
  const [captcha, setCaptcha] = useState(() => generateCaptcha());

  function redraw(currentCaptcha) {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(0.5, "#1f9d74");
    gradient.addColorStop(1, "#ee6c4d");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let index = 0; index < 8; index += 1) {
      context.strokeStyle = `rgba(255,255,255,${0.15 + index * 0.04})`;
      context.beginPath();
      context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      context.stroke();
    }

    context.font = "bold 30px Segoe UI";
    context.textBaseline = "middle";
    currentCaptcha.split("").forEach((character, index) => {
      const x = 18 + index * 28;
      const y = 32 + Math.random() * 8 - 4;
      const rotation = Math.random() * 0.4 - 0.2;
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.fillStyle = index % 2 === 0 ? "#ffffff" : "#fef3c7";
      context.fillText(character, 0, 0);
      context.restore();
    });
  }

  function refreshCaptcha() {
    const nextCaptcha = generateCaptcha();
    setCaptcha(nextCaptcha);
    onChange("");
    onValidityChange(false);
  }

  useEffect(() => {
    redraw(captcha);
  }, [captcha]);

  useEffect(() => {
    onValidityChange(value === captcha);
  }, [value, captcha, onValidityChange]);

  return (
    <div className="rounded-[1.5rem] bg-sand p-4 dark:bg-slate-900/70">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <canvas ref={canvasRef} width="220" height="64" className="rounded-2xl shadow-soft" />
        <button
          type="button"
          onClick={refreshCaptcha}
          className="interactive-button rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink dark:bg-slate-800 dark:text-white"
        >
          Refresh captcha
        </button>
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
          Enter captcha exactly as shown
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-brand-500 transition focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </label>
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Case-sensitive. Includes letters and digits.
      </p>
    </div>
  );
}
