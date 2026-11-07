import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SectionTitle } from "../components/SectionTitle";
import { Logo } from "../components/Logo";
import { Button } from "../components/Button";

export function BrandPage() {
  const navigate = useNavigate();
  return (
    <main className="shell page brand-page">
      <PageHeader title="Brand assets">
        <p>Logo files and usage guidance for skillpm.</p>
      </PageHeader>
      <section className="brand-logos">
        <div className="brand-sample light-sample">
          <Logo variant="full" linked={false} />
        </div>
        <div className="brand-sample dark-sample">
          <Logo variant="full" linked={false} />
        </div>
        <div className="brand-sample light-sample mark-sample">
          <Logo variant="mark" size={64} linked={false} />
        </div>
        <div className="brand-sample dark-sample mark-sample">
          <Logo variant="mark" size={64} linked={false} />
        </div>
        <div className="brand-sample light-sample monochrome-sample">
          <img src="/logo-monochrome.svg" alt="Single-color skillpm logo" />
        </div>
      </section>
      <section className="brand-rules">
        <div>
          <h2>Clear space</h2>
          <p>Keep clear space equal to half the mark height on every side.</p>
          <div className="clear-space">
            <Logo variant="mark" size={32} linked={false} />
          </div>
        </div>
        <div>
          <h2>Minimum size</h2>
          <p>Use the mark at 16px or larger and the full logo at 80px or larger.</p>
          <div className="minimum-size">
            <Logo variant="mark" size={16} linked={false} />
            <Logo variant="full" size={20} linked={false} />
          </div>
        </div>
        <div>
          <h2>Colors</h2>
          <p>Use graphite for the modular S and cobalt for its active connector.</p>
          <dl>
            <div>
              <dt>Cobalt</dt>
              <dd>#4169E1</dd>
            </div>
            <div>
              <dt>Light text</dt>
              <dd>#17191F</dd>
            </div>
            <div>
              <dt>Dark text</dt>
              <dd>#F5F3EE</dd>
            </div>
          </dl>
        </div>
      </section>
      <section>
        <SectionTitle title="Downloads" />
        <div className="download-links">
          <a href="/logo-full.svg" download>
            Download full logo SVG
          </a>
          <a href="/icon.svg" download>
            Download mark SVG
          </a>
          <a href="/logo-monochrome.svg" download>
            Download single-color SVG
          </a>
        </div>
      </section>
      <section>
        <SectionTitle title="Don't" />
        <div className="dont-grid">
          <div>
            <span className="dont-stretch">
              <Logo variant="mark" size={40} linked={false} />
            </span>
            <p>Don't stretch</p>
          </div>
          <div>
            <span className="dont-recolor">
              <Logo variant="mark" size={40} linked={false} />
            </span>
            <p>Don't recolor</p>
          </div>
          <div>
            <span className="dont-effects">
              <Logo variant="mark" size={40} linked={false} />
            </span>
            <p>Don't add effects</p>
          </div>
          <div>
            <span className="dont-rotate">
              <Logo variant="mark" size={40} linked={false} />
            </span>
            <p>Don't rotate</p>
          </div>
        </div>
      </section>
      <Button onClick={() => navigate("/")}>Back to home</Button>
    </main>
  );
}
