import { Html, Body, Container, Text, Section, Heading } from "@react-email/components";

type TwoFactorEmailTemplateProps = {
  username?: string;
  otp: string;
  location?: string;
  expiresInMinutes?: number;
};

export function TwoFactorEmailTemplate({
  username,
  otp,
  location = "Unknown location",
  expiresInMinutes = 15,
}: TwoFactorEmailTemplateProps) {
  return (
    <Html>
      <Body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f8f8f8",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "480px",
            margin: "0 auto",
            padding: "32px 24px",
          }}
        >
          <Section
            style={{
              border: "3px solid #000",
              backgroundColor: "#fff",
              padding: "24px",
              boxShadow: "4px 4px 0px #000",
            }}
          >
            {/* TITLE */}
            <Heading
              style={{
                margin: "0 0 16px 0",
                fontSize: "28px",
                fontWeight: 800,
                lineHeight: "1.2",
              }}
            >
              2-Step Verification Code
            </Heading>

            {/* INTRO */}
            <Text style={{ fontSize: "16px", lineHeight: "1.5" }}>Hello{username ? ` ${username}` : ""},</Text>

            {/* CONTEXT (NO OTP HERE) */}
            <Text
              style={{
                margin: "12px 0 20px 0",
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            >
              Use the verification code below to continue taking your desired action.
            </Text>

            {/* OTP FIELD — STANDALONE */}
            <Section
              style={{
                margin: "20px 0",
                padding: "16px 24px",
                border: "3px solid #000",
                backgroundColor: "#ffe24b",
                boxShadow: "4px 4px 0px #000",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  fontSize: "32px",
                  fontWeight: 900,
                  letterSpacing: "6px",
                }}
              >
                {otp}
              </Text>
            </Section>

            {/* META INFO */}
            <Text style={{ fontSize: "14px", margin: "0 0 8px 0" }}>
              This code expires in <strong>{expiresInMinutes} minutes</strong>.
            </Text>

            <Text style={{ fontSize: "14px", margin: "0 0 16px 0" }}>
              This request was received from <strong>{location}</strong>.
            </Text>

            {/* SECURITY NOTICE */}
            <Text
              style={{
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              <strong>IMPORTANT:</strong> Don&apos;t share your security codes with anyone. We will never ask for your
              verification code. Sharing your code puts your account and its content at high risk.
            </Text>

            {/* SIGNATURE */}
            <Text style={{ marginTop: "20px", fontSize: "14px" }}>
              Thank you,
              <br />
              <strong>The DillahCodes Team</strong>
            </Text>
          </Section>

          {/* FOOTER */}
          <Section style={{ marginTop: "24px", textAlign: "center" }}>
            <Text style={{ fontSize: "12px", color: "#555", margin: 0 }}>
              © {new Date().getFullYear()} dillahcodes.my.id — All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
