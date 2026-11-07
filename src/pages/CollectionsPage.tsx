import { PageHeader } from "../components/PageHeader";
import { Icon } from "../components/Icon";
import { collections } from "../data/initialData";
import type { Nav } from "../types";

export function CollectionsPage({ nav }: { nav: Nav }) {
  return (
    <main className="shell page">
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
                  <button onClick={() => nav("/skills/pdf-summarizer")}>
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
    </main>
  );
}
