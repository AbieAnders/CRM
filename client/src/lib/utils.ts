import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatDateInIST = () => {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
  });
};

export const Logger = {
  info: (message: string, ...optionalParams: any[]) => {
    console.info(`[INFO] ${formatDateInIST()}:`, message, ...optionalParams);
  },
  warn: (message: string, ...optionalParams: any[]) => {
    console.warn(`[WARN] ${formatDateInIST()}:`, message, ...optionalParams);
  },
  error: (message: string, error?: any) => {
    const error_log =
      error instanceof Error
        ? error.stack || error.message
        : typeof error === "object"
          ? JSON.stringify(error, null, 2)
          : String(error);

    console.error(`[ERROR] ${formatDateInIST()}: Failure: { ${message} }, Message: { ${error_log} }`);
  },
  debug: (message: string, ...optionalParams: any[]) => {
    if (import.meta.env.MODE === 'development') {
      console.debug(`[DEBUG] ${formatDateInIST()}:`, message, ...optionalParams);
    }
  },
};
