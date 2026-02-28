"use client";

import { FaExchangeAlt, FaGoogle, FaKey, FaUserEdit, FaUserShield } from "react-icons/fa";
import { MdDevices, MdSecurity } from "react-icons/md";
import { RiRefreshLine } from "react-icons/ri";

export function DiagonalTriangle({
  size = 200,
  color = "#E11D48",
  borderColor = "#111928",
  borderWidth = 4,
  className = "",
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon
        points="0,0 100,0 100,100"
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth}
        strokeLinejoin="miter"
      />
    </svg>
  );
}

const features = [
  {
    icon: <FaGoogle size={26} />,
    title: "OAuth Providers",
    desc: "Google OAuth 2.0 authentication and account linking support.",
    color: "#2563EB",
  },
  {
    icon: <FaUserShield size={26} />,
    title: "2FA Protection",
    desc: "OTP-based two-factor authentication with verification status API.",
    color: "#059669",
  },
  {
    icon: <MdDevices size={26} />,
    title: "Session Management",
    desc: "Multi-session tracking, refresh, revoke, and device-based control.",
    color: "#0EA5E9",
  },
  {
    icon: <FaExchangeAlt size={26} />,
    title: "Token Rotation",
    desc: "Refresh token rotation with anti token theft protection.",
    color: "#7C3AED",
  },
  {
    icon: <FaUserEdit size={26} />,
    title: "Profile Management",
    desc: "Secure email, password, and account updates with verification flow.",
    color: "#D97706",
  },
  {
    icon: <MdSecurity size={26} />,
    title: "Account Recovery",
    desc: "Forgot password, email verification, and revert account operations.",
    color: "#DC2626",
  },
  {
    icon: <RiRefreshLine size={26} />,
    title: "Revert System",
    desc: "Automatic account recovery endpoints to revert sensitive changes.",
    color: "#4F46E5",
  },
  {
    icon: <FaKey size={26} />,
    title: "Credential Auth",
    desc: "Secure login and registration using credentials provider.",
    color: "#1D4ED8",
  },
];

export function Features() {
  return (
    <section className="bg-primary-bg-200 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-4">
        <h2 className="text-3xl font-black text-center sticky top-32">
          Core <span className="text-danger">Features</span>
        </h2>

        {features.map((feature, index) => (
          <div key={feature.title} className="sticky" style={{ zIndex: index + 1, top: `${25 + index * 4}dvh` }}>
            <div className="bg-white border-2 border-dark shadow-strong p-4 relative overflow-hidden">
              <DiagonalTriangle
                size={40}
                color={feature.color}
                borderColor="#111928"
                borderWidth={5}
                className="absolute top-0 right-0 pointer-events-none"
              />

              <div className="mb-4 text-dark">{feature.icon}</div>
              <h3 className="text-lg font-black uppercase mb-2">{feature.title}</h3>
              <p className="text-sm font-medium text-dark-6 leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
