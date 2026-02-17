import { censorEmail } from "@/shared/utils/censor-email";
import { Body, Container, Heading, Html, Link, Section, Text } from "@react-email/components";

interface EmailChangeRevertTemplateProps {
  name: string;
  url: string;
  oldEmail: string;
  newEmail: string;
}

export function EmailChangeRevertTemplate({ name, url, oldEmail, newEmail }: EmailChangeRevertTemplateProps) {
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
                fontSize: "26px",
                fontWeight: "800",
                lineHeight: "1.2",
              }}
            >
              Email Address Changed
            </Heading>

            <Text
              style={{
                margin: "0 0 16px 0",
                fontSize: "15px",
                lineHeight: "1.6",
              }}
            >
              Dear <strong>{name}</strong>,
            </Text>

            <Text
              style={{
                margin: "0 0 16px 0",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#222",
              }}
            >
              We noticed that your account email address was changed from <strong>{censorEmail(oldEmail)}</strong> to{" "}
              <strong>{censorEmail(newEmail)}</strong>. If you made this change, you can safely disregard this email.
            </Text>

            {/* Informational text ABOVE button */}
            <Text
              style={{
                margin: "0 0 12px 0",
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#222",
              }}
            >
              If you did not make this change, or believe this was done by mistake, you can revert your account
              immediately:
            </Text>

            {/* Button Block */}
            <Section
              style={{
                margin: "20px 0",
                textAlign: "center",
              }}
            >
              <Link
                href={url}
                style={{
                  display: "inline-block",
                  padding: "14px 28px",
                  border: "3px solid #000",
                  backgroundColor: "#ff6b6b",
                  boxShadow: "4px 4px 0px #000",
                  fontSize: "16px",
                  fontWeight: "800",
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                Revert Account
              </Link>
            </Section>

            {/* Informational text BELOW button */}
            <Text
              style={{
                margin: "0 0 12px 0",
                fontSize: "13px",
                lineHeight: "1.6",
                color: "#222",
              }}
            >
              To help keep your account secure, you may be asked to reset your password after reverting the email
              change.
            </Text>

            <Text
              style={{
                margin: "16px 0 6px 0",
                fontSize: "12px",
                color: "#444",
              }}
            >
              If you recognize this activity, no further action is required.
            </Text>

            <Text
              style={{
                margin: "0",
                fontSize: "12px",
                color: "#444",
              }}
            >
              This link will expire in <strong>7 days</strong> and can only be used once.
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
