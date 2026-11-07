import { PageHeader } from "../components/PageHeader";
import { Link } from "../components/Link";
import { Icon } from "../components/Icon";
import { Container } from "../components/Container";
import { SEO } from "../components/SEO";
import { categoryDescriptions } from "../data/initialData";

export function CategoriesPage() {
  return (
    <main className="page">
      <Container>
        <SEO title="Categories" description="Browse AI agent skills by category." url="/categories" />
        <PageHeader title="Categories">
          <p>Browse skills by the work they help an agent perform.</p>
        </PageHeader>
        <div className="category-directory">
          {Object.entries(categoryDescriptions).map(([name, description]) => (
            <Link key={name} to={`/browse?category=${name.toLowerCase()}`}>
              <span>
                <Icon
                  name={name === "Security" ? "shield" : name === "Coding" ? "code" : "package"}
                  size={18}
                />
              </span>
              <div>
                <strong>{name}</strong>
                <p>{description}</p>
              </div>
              <Icon name="arrow" size={16} />
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
