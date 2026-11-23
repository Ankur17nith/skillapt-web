import { PageHeader } from "../components/PageHeader";
import { Link } from "../components/Link";
import { Icon } from "../components/Icon";
import { Container } from "../components/Container";
import { SEO } from "../components/SEO";
import { getCategory } from "../data/categories";
import { useCategories } from "../lib/useCategories";

export function CategoriesPage() {
  const categories = useCategories();
  return (
    <main className="page">
      <Container>
        <SEO
          title="Categories"
          description="Browse AI agent skills by what they are for: documents, coding, testing, security, data and more."
          url="/categories"
        />
        <PageHeader title="Categories">
          <p>Browse skills by the work they help an agent perform.</p>
        </PageHeader>
        <div className="category-directory">
          {categories.map((c) => (
            <Link key={c.id} to={`/browse?category=${c.id}`}>
              <span>
                <Icon name={getCategory(c.id)?.icon ?? "package"} size={18} />
              </span>
              <div>
                <strong>{c.label}</strong>
                <p>{c.description}</p>
                {c.count > 0 && <small className="category-count">{c.count} skills</small>}
              </div>
              <Icon name="arrow" size={16} />
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
