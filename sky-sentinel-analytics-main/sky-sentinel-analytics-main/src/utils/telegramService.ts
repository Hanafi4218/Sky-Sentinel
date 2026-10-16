// Telegram Alert Service for SkySentinel
// Structure allows easy migration to backend later

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export interface TelegramAlertPayload {
  location: string;
  wind: number;
  humidity: number;
  temperature: number;
  riskPercentage: number;
}

/**
 * Formats the alert message with HTML styling for Telegram
 */
const formatAlertMessage = ({
  location,
  wind,
  humidity,
  temperature,
  riskPercentage,
}: TelegramAlertPayload): string => {
  return `🚨 <b>SKYSENTINEL COMMAND: CRITICAL ALERT</b>

📍 <b>SECTOR:</b> ${location}

⚠️ <b>THREAT LEVEL:</b> CRITICAL (${riskPercentage.toFixed(1)}%)

<b>TELEMETRY:</b>
💨 Wind: ${wind} km/h
💧 Humidity: ${humidity} %
🌡️ Temp: ${temperature} °C

🛑 <b>ACTION REQUIRED:</b> Immediate drone grounding and equipment securement.`;
};

export interface TelegramResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Sends a critical alert to the configured Telegram chat
 * @param payload - The alert data to send
 * @returns Promise with the result of the operation
 */
export const sendTelegramAlert = async (
  payload: TelegramAlertPayload
): Promise<TelegramResponse> => {
  // Check for configuration
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("Telegram not configured. Set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in .env");
    return {
      success: false,
      message: "Telegram not configured",
      error: "Missing BOT_TOKEN or CHAT_ID environment variables",
    };
  }

  const message = formatAlertMessage(payload);
  const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return {
        success: true,
        message: "Alert sent successfully to Telegram",
      };
    } else {
      return {
        success: false,
        message: "Failed to send Telegram alert",
        error: data.description || "Unknown error",
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Network error";
    return {
      success: false,
      message: "Failed to send Telegram alert",
      error: errorMessage,
    };
  }
};

/**
 * Test the Telegram connection without requiring critical conditions
 */
export const testTelegramConnection = async (
  location: string = "TEST LOCATION"
): Promise<TelegramResponse> => {
  return sendTelegramAlert({
    location,
    wind: 45,
    humidity: 90,
    temperature: 38,
    riskPercentage: 85.5,
  });
};
