import { useState } from "react";
import { Icon } from "./Icon";
import { faqs } from "../data/initialData";

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {faqs.map(([q, a], i) => (
        <div className="faq-item" key={q}>
          <button onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{q}</span>
            <Icon name="chevron" />
          </button>
          {open === i && <p>{a}</p>}
        </div>
      ))}
    </div>
  );
}
