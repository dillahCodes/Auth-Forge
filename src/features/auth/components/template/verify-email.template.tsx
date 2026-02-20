import { Html, Body, Container, Text, Section, Heading } from "@react-email/components";

export function VerifyEmailTemplate({ name, otp }: { name: string; otp: string }) {
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
          {/* Header Block */}
          <Section
            style={{
              border: "3px solid #000",
              backgroundColor: "#fff",
              padding: "24px",
              boxShadow: "4px 4px 0px #000",
            }}
          >
            <Heading
              style={{
                margin: "0 0 12px 0",
                fontSize: "28px",
                fontWeight: "800",
                lineHeight: "1.2",
              }}
            >
              Verify Your Email
            </Heading>

            <Text
              style={{
                margin: "0 0 16px 0",
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            >
              Hi <strong>{name}</strong>, please use the verification code below:
            </Text>

            {/* OTP Block */}
            <Section
              style={{
                marginTop: "16px",
                padding: "16px 24px",
                border: "3px solid #000",
                backgroundColor: "#ffe24b",
                boxShadow: "4px 4px 0px #000",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  letterSpacing: "4px",
                  margin: "0",
                  display: "inline-block",
                }}
              >
                {otp}
              </Text>
            </Section>

            <Text
              style={{
                margin: "24px 0 0 0",
                fontSize: "14px",
                color: "#222",
              }}
            >
              This code expires in <strong>15 minutes</strong>.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ marginTop: "24px", textAlign: "center" }}>
            <Text
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#555",
              }}
            >
              © {new Date().getFullYear()} dillahcodes.my.id — All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
