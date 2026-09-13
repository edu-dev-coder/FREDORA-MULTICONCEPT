import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import FrederaLogo from "@/components/FrederaLogo";

export default function Privacy() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setLocation("/temperamap")} className="cursor-pointer">
            <FrederaLogo size="sm" />
          </button>
          <Button variant="ghost" onClick={() => setLocation(-1 as any)} className="text-primary text-sm">
            ← Back
          </Button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-10">Last updated: January 2025</p>

        <div className="prose prose-slate max-w-none space-y-8 text-foreground">

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When you use Fredora TemperaMap, we collect the following information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li><strong className="text-foreground">Account information:</strong> Name, email address, and any profile details you provide (age group, phone number)</li>
              <li><strong className="text-foreground">Assessment data:</strong> Your answers to the 60 temperament questions and the computed results</li>
              <li><strong className="text-foreground">Payment information:</strong> Transaction references for passcode purchases. We do not store your card details</li>
              <li><strong className="text-foreground">Usage data:</strong> Information about how you interact with our platform, including device type and access times</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Provide and improve the Fredora TemperaMap assessment service</li>
              <li>Generate and deliver your personalised temperament report</li>
              <li>Process passcode purchases and send confirmation messages</li>
              <li>Communicate with you about your account and our services</li>
              <li>Produce anonymous, aggregated statistics about temperament distributions (no personally identifiable information is included)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">3. Data Storage & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is stored on secure, encrypted servers. We use industry-standard security measures to protect your information against unauthorised access, alteration, or disclosure. Your assessment answers and results are stored and linked to your account so you can access them at any time. We retain your data for as long as your account is active, or as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">4. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li><strong className="text-foreground">Service providers:</strong> Trusted third parties who help us deliver our service. These parties are bound by confidentiality agreements</li>
              <li><strong className="text-foreground">Legal requirements:</strong> If required by law, court order, or government authority</li>
              <li><strong className="text-foreground">Couples/Group tests:</strong> If you take a couples test, your temperament results will be visible to your partner within that shared session</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">5. Cookies & Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies to maintain your session and keep you logged in. We do not use advertising cookies or third-party tracking scripts. Our authentication provider (Clerk) may set cookies necessary for secure login functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">6. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent for non-essential data processing at any time</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:support@fredora.com" className="text-accent hover:underline font-medium">
                support@fredora.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">7. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. School licenses are administered by the educational institution on behalf of students, and schools are responsible for obtaining appropriate parental consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">8. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. When we make significant changes, we will notify you by email or through a notice on our platform. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-primary mb-3">9. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at{" "}
              <a href="mailto:support@fredora.com" className="text-accent hover:underline font-medium">
                support@fredora.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <footer className="bg-primary text-blue-200 py-8 px-4 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} Fredora TemperaMap. All rights reserved.</p>
      </footer>
    </div>
  );
}
