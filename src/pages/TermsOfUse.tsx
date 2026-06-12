import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsOfUse = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 -ml-2">
          <ArrowLeft size={16} /> Back
        </Button>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Terms of Use</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="text-lg font-bold mb-2">1. Acceptance of Terms</h2>
            <p>By downloading, installing, or using Simple Soccer Scorer ("the App"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the App.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">2. Description of Service</h2>
            <p>Simple Soccer Scorer is a free sideline scoring and match timer application designed for grassroots football coaches. The App allows you to track match scores, goal scorers, assists, and match timings.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">3. Use of the App</h2>
            <p>You may use the App for personal, non-commercial purposes. You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Reverse engineer, decompile, or disassemble the App</li>
              <li>Modify, adapt, or create derivative works of the App</li>
              <li>Use the App for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to the App's systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">4. Data &amp; Storage</h2>
            <p>All match data is stored locally on your device. You are responsible for your own data. We are not responsible for any data loss resulting from device failure, app uninstallation, or clearing of browser storage.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">5. Intellectual Property</h2>
            <p>The App, including its design, code, graphics, and content, is owned by Simple Soccer Scorer and is protected by applicable intellectual property laws. All rights not expressly granted are reserved.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">6. Disclaimer of Warranties</h2>
            <p>The App is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the App will be error-free, uninterrupted, or free of harmful components.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">7. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Simple Soccer Scorer shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the App, including but not limited to loss of data or inaccurate match recordings.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">8. Modifications to the App</h2>
            <p>We reserve the right to modify, suspend, or discontinue the App at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">9. Changes to These Terms</h2>
            <p>We may update these Terms of Use from time to time. Continued use of the App after changes constitutes acceptance of the revised terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2">10. Contact</h2>
            <p>If you have questions about these Terms, please contact us through the App's support channels.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
