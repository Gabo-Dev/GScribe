import { useState } from "react";

interface Props {
  isLoading: boolean;
  onSubmit: (email: string) => void;
  onCancel: () => void;
}

export const ResetPasswordForm = ({ isLoading, onSubmit, onCancel }: Props) => {
  const [mail, setMail] = useState("");

  return (
    <form 
      className="flex flex-col gap-6" 
      onSubmit={(e) => { e.preventDefault(); onSubmit(mail); }}
    >
      <p className="text-sm text-gray-400">
        Enter the email address associated with your account and we'll send you a link to reset your password.
      </p>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
          Email Address
        </label>
        <input
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder="name@example.com"
          required
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 outline-none transition-all focus:border-sky-500/50 focus:bg-white/10 focus:ring-1 focus:ring-sky-500/50"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-linear-to-r from-sky-500 to-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/20 transition-all hover:shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending...
            </span>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </form>
  );
};