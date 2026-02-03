import { Html, Body, Container, Text, Section, Heading, Link } from "@react-email/components";

export function PasswordResetVerifyTemplate({ name, url }: { name: string; url: string }) {
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
          {/* Main Block */}
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
              Reset Your Password
            </Heading>

            <Text
              style={{
                margin: "0 0 16px 0",
                fontSize: "16px",
                lineHeight: "1.5",
              }}
            >
              Hi <strong>{name}</strong>, we received a request to reset your password.
            </Text>

            <Text
              style={{
                margin: "0 0 16px 0",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#222",
              }}
            >
              Click the button below to choose a new password:
            </Text>

            {/* Button Block */}
            <Section
              style={{
                marginTop: "16px",
                textAlign: "center",
              }}
            >
              <Link
                href={url}
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  border: "3px solid #000",
                  backgroundColor: "#ffe24b",
                  boxShadow: "4px 4px 0px #000",
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                Reset Password
              </Link>
            </Section>

            <Text
              style={{
                margin: "24px 0 8px 0",
                fontSize: "12px",
                color: "#444",
              }}
            >
              If you did not request this, you can safely ignore this email.
            </Text>

            <Text
              style={{
                margin: "0",
                fontSize: "12px",
                color: "#444",
              }}
            >
              This link expires in <strong>15 minutes</strong>.
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
