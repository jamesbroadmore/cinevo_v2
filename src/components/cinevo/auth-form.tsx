import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/client";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (event.nativeEvent instanceof KeyboardEvent && (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229)) return;
    setError("");
    setIsSubmitting(true);
    const result = mode === "signup"
      ? await authClient.signUp.email({ name: username.trim(), email: email.trim(), password })
      : await authClient.signIn.email({ email: email.trim(), password });
    setIsSubmitting(false);
    if (result.error) {
      setError("We couldn’t complete that request. Check your details and try again.");
      return;
    }
    await navigate({ to: "/app" });
  }

  return (
    <main className="auth-page">
      <div className="auth-backdrop" />
      <section className="auth-card" aria-labelledby="auth-title">
        <Link to="/" className="auth-card__brand">CINEVO</Link>
        <span className="public-kicker">PRIVATE BY DESIGN</span>
        <h1 id="auth-title">{mode === "signup" ? "Make room for every story." : "Welcome back to your library."}</h1>
        <p>{mode === "signup" ? "Create one account for your connected Plex libraries, shared access, and playback across every screen." : "Your watch history, connected servers, and shared libraries are waiting."}</p>
        <form className="auth-form" onSubmit={submit}>
          {mode === "signup" && (
            <label>
              Username
              <input required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
            </label>
          )}
          <label>
            Email
            <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            Password
            <input required minLength={8} type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="auth-form__error" role="alert">{error}</p>}
          <button className="auth-form__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
          </button>
        </form>
        <p className="auth-card__switch">
          {mode === "signup" ? "Already have an account? " : "New to CINEVO? "}
          <Link to={mode === "signup" ? "/login" : "/signup"}>{mode === "signup" ? "Log in" : "Create an account"}</Link>
        </p>
      </section>
    </main>
  );
}
