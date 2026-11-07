import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { Icon } from "../components/Icon";
import { Container } from "../components/Container";
import { SEO } from "../components/SEO";
import { collections } from "../data/initialData";

export function CollectionsPage() {
  const navigate = useNavigate();
  return (
    <main className="page">
      <Container>
        <SEO title="Collections" description="Curated sets of AI agent skills for developer workflows." url="/collections" />
        <PageHeader title="Collections">
          <p>Small, maintained sets for common developer workflows.</p>
        </PageHeader>
        <div className="collection-list">
          {collections.map(([title, description, names]) => (
            <section key={title as string}>
              <div>
                <span>Collection</span>
                <h2>{title as string}</h2>
                <p>{description as string}</p>
              </div>
              <ul>
                {(names as string[]).map((name) => (
                  <li key={name}>
                    <button onClick={() => navigate(`/skills/${name}`)}>
                      <Icon name="package" size={16} />
                      {name}
                      <Icon name="arrow" size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
