const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach backend API. Ensure the server is running.");
  }

  if (!response.ok) {
    let message = "Request failed";

    try {
      const payload = await response.json();
      message = payload.message || message;
    } catch {
      // Ignore parse errors and keep generic message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function signup(payload: { name: string; email: string; password: string }) {
  return request<AuthResponse>("/signup", { method: "POST", body: payload });
}

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>("/login", { method: "POST", body: payload });
}

export function fetchMe(token: string) {
  return request<{ id: string; name: string; email: string }>("/me", { token });
}

export function saveOnboarding(
  token: string,
  payload: {
    subjects: string[];
    examDate: string | null;
    dailyHours: number;
    weakTopics: string[];
    strongTopics: string[];
  }
) {
  return request<{ message: string }>("/onboarding", {
    method: "POST",
    token,
    body: payload,
  });
}

export function generatePlan(token: string) {
  return request<{ message: string }>("/generate-plan", {
    method: "POST",
    token,
  });
}

export function fetchDashboard(token: string) {
  return request("/dashboard", { token });
}

export function fetchPlanner(token: string) {
  return request("/planner", { token });
}

export function fetchAnalytics(token: string) {
  return request("/analytics", { token });
}

export function fetchSubjects(token: string) {
  return request("/subjects", { token });
}

export function submitQuiz(
  token: string,
  payload: { topic: string; score: number; timeTaken: number }
) {
  return request<{ message: string }>("/submit-quiz", {
    method: "POST",
    token,
    body: payload,
  });
}

export function fetchPerformance(token: string) {
  return request("/performance", { token });
}
