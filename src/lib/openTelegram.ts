// src/lib/openTelegram.ts
import { TELEGRAM_PHONE_E164 } from "./constants";

/**
 * Intenta abrir Telegram directo al chat por número.
 * Fallback: si no hay Telegram, abre el dialer (tel:).
 */
export function openTelegramByPhone() {
  const tgUrl = `tg://resolve?phone=${TELEGRAM_PHONE_E164}`;
  const telUrl = `tel:${TELEGRAM_PHONE_E164}`;

  // Abre Telegram (si está instalada la app)
  const win = window.open(tgUrl, "_self");

  // Fallback: si en ~700ms no cambió, intenta el dialer
  setTimeout(() => {
    try {
      // Algunos navegadores bloquean open en _self; en ese caso forzamos location
      if (document.visibilityState === "visible") {
        window.location.href = telUrl;
      }
    } catch {
      window.location.href = telUrl;
    }
  }, 700);
}
