import { useAOS } from "@/shared/hooks/use-aos";

export function Hero() {
  useAOS();

  return (
    <section className="border-b-2 border-dark bg-primary-bg-300 px-3 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Eyebrow */}
        <div className="inline-flex items-center rotate-6 gap-2 bg-info text-white border-2 border-dark px-3 py-1 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_2px_#111928] mb-6">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          REST API · OpenAPI 3.0
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-black text-dark leading-none tracking-tighter mb-4">
          Auth<span className="text-danger">Forge</span>
        </h1>

        <p className="text-dark-6 text-lg font-medium max-w-2xl mb-10 leading-relaxed">
          An advanced authentication system prototype built on the OAuth 2.0 protocol, featuring credentials login,
          Google OAuth integration, two-factor authentication (2FA), session management, and secure account operations.
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-4">
          {[
            { value: "2FA", label: "Multi-Factor Auth", dataAos: "fade-right" },
            { value: "OAuth 2.0", label: "Protocol", dataAos: "fade-down" },
            { value: "Cookie", label: "Auth Method", dataAos: "fade-up" },
            { value: "Anti Token Theft", label: "Security Layer", dataAos: "fade-left" },
          ].map((s) => (
            <div
              data-aos={s.dataAos}
              data-aos-duration="600"
              data-aos-delay="200"
              key={s.label}
              className="bg-primary-bg-200 border-2 border-dark px-5 py-3 shadow-[5px_5px_0px_2px_#111928]"
            >
              <div className="text-2xl font-black text-dark">{s.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-dark-6">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
