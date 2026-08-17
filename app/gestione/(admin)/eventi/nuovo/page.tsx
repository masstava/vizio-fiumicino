import { EventForm } from "../_components/EventForm";

export default function NuovoEventoPage() {
  return (
    <div className="p-8 md:p-12">
      <p className="font-sans text-[10px] tracking-widest uppercase text-muted mb-3">
        Gestione · Eventi
      </p>
      <h1 className="font-serif text-4xl font-medium text-ink mb-8">
        Nuovo evento
      </h1>
      <EventForm mode="create" />
    </div>
  );
}
