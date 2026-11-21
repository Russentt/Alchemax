import type { Usuario } from "../types/index";

export const ALLOWED_GENEROS = [
  "femenino",
  "masculino",
  "otro",
  "prefiero-no-decirlo",
] as const;

export type GeneroPermitido = (typeof ALLOWED_GENEROS)[number];

export const AUTH_LIMITS = {
  MIN_NAME_LENGTH: 3,
  MAX_NAME_LENGTH: 60,
  MAX_EMAIL_LENGTH: 254,
  MIN_PASSWORD_LENGTH: 10,
  MAX_PASSWORD_LENGTH: 128,
  MIN_AGE: 14,
  MAX_AGE: 120,
} as const;

const COMMON_WEAK_PASSWORDS = new Set([
  "password123",
  "password123!",
  "Password123!",
  "1234567890",
  "qwerty1234",
  "admin12345",
  "nutrivida123",
  "NutriVida123!",
  "alchemax123",
  "Alchemax123!",
  "contraseña123",
  "Contrasena123!",
  "welcome123!",
  "abc123456!",
]);

const NAME_REGEX = /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u;
const EMAIL_REGEX =
  /^(?!.*\.\.)[a-z0-9](?:[a-z0-9._+-]{0,62}[a-z0-9])?@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z]{2,})+$/i;
const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const LOWERCASE_REGEX = /[a-z]/;
const UPPERCASE_REGEX = /[A-Z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9\s]/;
const WHITESPACE_REGEX = /\s/;

export function hasControlChars(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (
      code <= 0x1f ||
      code === 0x7f ||
      code === 0x200b ||
      code === 0x200c ||
      code === 0x200d ||
      code === 0xfeff
    ) {
      return true;
    }
  }
  return false;
}

export function stripControlChars(value: string): string {
  let clean = "";
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (
      code > 0x1f &&
      code !== 0x7f &&
      code !== 0x200b &&
      code !== 0x200c &&
      code !== 0x200d &&
      code !== 0xfeff
    ) {
      clean += value[i];
    }
  }
  return clean;
}

export function sanitizeName(value: string): string {
  return stripControlChars(value).trim().replace(/\s+/g, " ");
}

export function sanitizeEmail(value: string): string {
  return stripControlChars(value).trim().toLowerCase();
}

export function validateName(raw: string): string | null {
  const clean = sanitizeName(raw);
  if (!clean) {
    return "El nombre y apellido son obligatorios.";
  }
  if (clean.length < AUTH_LIMITS.MIN_NAME_LENGTH) {
    return `El nombre debe tener al menos ${AUTH_LIMITS.MIN_NAME_LENGTH} caracteres.`;
  }
  if (clean.length > AUTH_LIMITS.MAX_NAME_LENGTH) {
    return `El nombre no puede superar los ${AUTH_LIMITS.MAX_NAME_LENGTH} caracteres.`;
  }
  if (!NAME_REGEX.test(clean)) {
    return "El nombre solo puede contener letras, espacios, guiones o apóstrofes.";
  }
  return null;
}

export function validateEmail(
  raw: string,
  options: { requireGmail?: boolean } = {},
): string | null {
  if (hasControlChars(raw)) {
    return "El correo contiene caracteres no permitidos.";
  }
  const clean = sanitizeEmail(raw);
  if (!clean) {
    return "El correo electrónico es obligatorio.";
  }
  if (clean.length > AUTH_LIMITS.MAX_EMAIL_LENGTH) {
    return "El correo electrónico excede la longitud máxima permitida.";
  }
  if (!EMAIL_REGEX.test(clean)) {
    return "Ingresa un correo electrónico válido.";
  }
  if (options.requireGmail && !clean.endsWith("@gmail.com")) {
    return "Solo se permiten correos @gmail.com.";
  }
  return null;
}

export function getBirthDateBounds(): { min: string; max: string } {
  const hoy = new Date();
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const minDate = new Date(
    hoy.getFullYear() - AUTH_LIMITS.MAX_AGE,
    hoy.getMonth(),
    hoy.getDate(),
  );
  const maxDate = new Date(
    hoy.getFullYear() - AUTH_LIMITS.MIN_AGE,
    hoy.getMonth(),
    hoy.getDate(),
  );

  return { min: formatDate(minDate), max: formatDate(maxDate) };
}

export function validateBirthDate(raw: string): string | null {
  if (!raw) {
    return "Selecciona tu fecha de nacimiento.";
  }
  const match = ISO_DATE_REGEX.exec(raw);
  if (!match) {
    return "Ingresa una fecha de nacimiento válida.";
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const fechaNac = new Date(year, month - 1, day);

  if (
    Number.isNaN(fechaNac.getTime()) ||
    fechaNac.getFullYear() !== year ||
    fechaNac.getMonth() !== month - 1 ||
    fechaNac.getDate() !== day
  ) {
    return "Ingresa una fecha de nacimiento válida.";
  }

  const hoy = new Date();
  const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (fechaNac > hoySinHora) {
    return "La fecha de nacimiento no puede ser futura.";
  }

  let edad = hoySinHora.getFullYear() - fechaNac.getFullYear();
  const mesDiferencia = hoySinHora.getMonth() - fechaNac.getMonth();
  if (
    mesDiferencia < 0 ||
    (mesDiferencia === 0 && hoySinHora.getDate() < fechaNac.getDate())
  ) {
    edad -= 1;
  }

  if (edad < AUTH_LIMITS.MIN_AGE) {
    return `Debes tener al menos ${AUTH_LIMITS.MIN_AGE} años para registrarte.`;
  }
  if (edad > AUTH_LIMITS.MAX_AGE) {
    return "Ingresa una fecha de nacimiento válida.";
  }

  return null;
}

export function validateGenero(raw: string): string | null {
  if (!raw) {
    return "Selecciona una opción de género.";
  }
  if (!ALLOWED_GENEROS.includes(raw as GeneroPermitido)) {
    return "La opción de género seleccionada no es válida.";
  }
  return null;
}

export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordStrengthReport {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  barClass: string;
  requirements: PasswordRequirement[];
  isValid: boolean;
}

function containsPersonalData(
  password: string,
  email?: string,
  nombre?: string,
): boolean {
  const lowerPass = password.toLowerCase();

  if (email) {
    const localPart = sanitizeEmail(email).split("@")[0] ?? "";
    if (localPart.length >= 4 && lowerPass.includes(localPart)) {
      return true;
    }
  }

  if (nombre) {
    const tokens = sanitizeName(nombre)
      .toLowerCase()
      .split(/[\s'-]+/)
      .filter((t) => t.length >= 4);
    for (const token of tokens) {
      if (lowerPass.includes(token)) {
        return true;
      }
    }
  }

  return false;
}

export function evaluatePasswordStrength(
  password: string,
  email?: string,
  nombre?: string,
): PasswordStrengthReport {
  const hasMinLength = password.length >= AUTH_LIMITS.MIN_PASSWORD_LENGTH;
  const withinMaxLength = password.length <= AUTH_LIMITS.MAX_PASSWORD_LENGTH;
  const hasLower = LOWERCASE_REGEX.test(password);
  const hasUpper = UPPERCASE_REGEX.test(password);
  const hasDigit = DIGIT_REGEX.test(password);
  const hasSpecial = SPECIAL_CHAR_REGEX.test(password);
  const noSpacesOrControl =
    password.length > 0 &&
    !WHITESPACE_REGEX.test(password) &&
    !hasControlChars(password);
  const notCommon =
    password.length > 0 &&
    !COMMON_WEAK_PASSWORDS.has(password) &&
    !COMMON_WEAK_PASSWORDS.has(password.toLowerCase());
  const noPersonalInfo =
    password.length > 0 && !containsPersonalData(password, email, nombre);

  const requirements: PasswordRequirement[] = [
    {
      id: "length",
      label: `Mínimo ${AUTH_LIMITS.MIN_PASSWORD_LENGTH} caracteres`,
      met: hasMinLength && withinMaxLength,
    },
    { id: "lower", label: "Una letra minúscula", met: hasLower },
    { id: "upper", label: "Una letra mayúscula", met: hasUpper },
    { id: "digit", label: "Un número", met: hasDigit },
    {
      id: "special",
      label: "Un símbolo (!@#$%^&*)",
      met: hasSpecial,
    },
    {
      id: "spaces",
      label: "Sin espacios ni datos personales",
      met: noSpacesOrControl && notCommon && noPersonalInfo,
    },
  ];

  const metCount = requirements.filter((r) => r.met).length;
  const isValid = requirements.every((r) => r.met);

  let score: 0 | 1 | 2 | 3 | 4 = 0;
  let label = "Sin ingresar";
  let barClass = "bg-secondary";

  if (password.length > 0) {
    if (isValid && password.length >= 14) {
      score = 4;
      label = "Muy segura";
      barClass = "bg-success";
    } else if (isValid) {
      score = 3;
      label = "Segura";
      barClass = "bg-success";
    } else if (metCount >= 4) {
      score = 2;
      label = "Media";
      barClass = "bg-warning";
    } else {
      score = 1;
      label = "Débil";
      barClass = "bg-danger";
    }
  }

  return { score, label, barClass, requirements, isValid };
}

export function validateRegisterPassword(
  password: string,
  email?: string,
  nombre?: string,
): string | null {
  if (!password) {
    return "Debes ingresar una contraseña.";
  }
  if (password.length > AUTH_LIMITS.MAX_PASSWORD_LENGTH) {
    return `La contraseña no puede superar los ${AUTH_LIMITS.MAX_PASSWORD_LENGTH} caracteres.`;
  }
  if (WHITESPACE_REGEX.test(password) || hasControlChars(password)) {
    return "La contraseña no puede contener espacios ni caracteres de control.";
  }
  if (
    COMMON_WEAK_PASSWORDS.has(password) ||
    COMMON_WEAK_PASSWORDS.has(password.toLowerCase())
  ) {
    return "Esa contraseña es demasiado común. Elige una combinación única.";
  }
  if (containsPersonalData(password, email, nombre)) {
    return "La contraseña no debe incluir tu nombre ni tu correo electrónico.";
  }

  const report = evaluatePasswordStrength(password, email, nombre);
  if (!report.isValid) {
    return "La contraseña debe tener al menos 10 caracteres, mayúscula, minúscula, número y símbolo.";
  }
  return null;
}

export function validateLoginPassword(password: string): string | null {
  if (!password) {
    return "Ingresa tu contraseña.";
  }
  if (password.length > AUTH_LIMITS.MAX_PASSWORD_LENGTH) {
    return "La contraseña excede la longitud máxima permitida.";
  }
  if (hasControlChars(password)) {
    return "La contraseña contiene caracteres no permitidos.";
  }
  return null;
}

export function getDashboardRouteForRole(rol: Usuario["rol"]): string {
  switch (rol) {
    case "admin":
      return "/admin";
    case "nutricionista":
      return "/nutricionista";
    default:
      return "/account";
  }
}

// =========================================================
// CLIENT-SIDE LOGIN RATE LIMITER (BRUTE-FORCE PROTECTION)
// =========================================================
const LOGIN_GUARD_KEY = "nutrivida_login_guard";
const MAX_FAILED_ATTEMPTS = 5;

interface LoginGuardState {
  failedAttempts: number;
  lockUntil: number;
}

let memoryGuardState: LoginGuardState = { failedAttempts: 0, lockUntil: 0 };

function readGuardState(): LoginGuardState {
  try {
    const raw = sessionStorage.getItem(LOGIN_GUARD_KEY);
    if (!raw) return memoryGuardState;
    const parsed = JSON.parse(raw) as Partial<LoginGuardState>;
    const state: LoginGuardState = {
      failedAttempts:
        typeof parsed.failedAttempts === "number" &&
        Number.isFinite(parsed.failedAttempts) &&
        parsed.failedAttempts >= 0
          ? parsed.failedAttempts
          : 0,
      lockUntil:
        typeof parsed.lockUntil === "number" &&
        Number.isFinite(parsed.lockUntil) &&
        parsed.lockUntil >= 0
          ? parsed.lockUntil
          : 0,
    };
    memoryGuardState = state;
    return state;
  } catch {
    return memoryGuardState;
  }
}

function writeGuardState(state: LoginGuardState): void {
  memoryGuardState = state;
  try {
    sessionStorage.setItem(LOGIN_GUARD_KEY, JSON.stringify(state));
  } catch {
    // Fallback to in-memory guard if sessionStorage is unavailable
  }
}

export const loginRateLimiter = {
  getRemainingLockSeconds(): number {
    const { lockUntil } = readGuardState();
    const diffMs = lockUntil - Date.now();
    return diffMs > 0 ? Math.ceil(diffMs / 1000) : 0;
  },

  recordFailedAttempt(): { locked: boolean; lockSeconds: number; attempts: number } {
    const current = readGuardState();
    const attempts = current.failedAttempts + 1;
    let lockDurationSec = 0;

    if (attempts >= 10) {
      lockDurationSec = 120;
    } else if (attempts >= 8) {
      lockDurationSec = 60;
    } else if (attempts >= MAX_FAILED_ATTEMPTS) {
      lockDurationSec = 30;
    }

    const lockUntil =
      lockDurationSec > 0 ? Date.now() + lockDurationSec * 1000 : 0;

    writeGuardState({ failedAttempts: attempts, lockUntil });

    return {
      locked: lockDurationSec > 0,
      lockSeconds: lockDurationSec,
      attempts,
    };
  },

  resetAttempts(): void {
    memoryGuardState = { failedAttempts: 0, lockUntil: 0 };
    try {
      sessionStorage.removeItem(LOGIN_GUARD_KEY);
    } catch {
      // Ignore storage removal errors
    }
  },
};
