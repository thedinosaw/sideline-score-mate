import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 -ml-2">
          <ArrowLeft size={16} /> Back
        </Button>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-lg font-bold mb-2">1. Introduction</h2>
            <p>Simple Soccer Scorer ("we", "our", or "the App") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and website.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">2. Information We Collect</h2>
            <p className="mb-2"><strong>Data stored locally on your device:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Match data (team names, scores, goal scorers, timestamps)</li>
              <li>App preferences and settings (view mode, timer preferences)</li>
            </ul>
            <p className="mt-2">All match data is stored locally on your device using browser storage (localStorage). We do not transmit, collect, or store your match data on any external servers.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">3. Data We Do NOT Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Personal identification information (name, email, phone number)</li>
              <li>Location data</li>
              <li>Contacts or address book information</li>
              <li>Photos, camera, or microphone data</li>
              <li>Payment or financial information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">4. How We Use Your Information</h2>
            <p>The data stored on your device is used solely to provide the App's functionality — tracking match scores, timers, and maintaining your match history. This data never leaves your device.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">5. Third-Party Services</h2>
            <p>The App does not integrate with any third-party analytics, advertising, or tracking services. We do not share any data with third parties.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">6. Data Storage &amp; Security</h2>
            <p>All data is stored locally on your device. You can clear your data at any time by clearing your browser's storage or uninstalling the App. We do not have access to or control over your locally stored data.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">7. Children's Privacy</h2>
            <p>The App is designed for use by coaches and parents of youth athletes. We do not knowingly collect any personal information from children under 13. The App does not require account creation or personal data entry.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">9. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us through the App's support channels.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
