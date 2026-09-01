import { EventForm } from "../_components/EventForm";

export default function NuovoEventoPage() {
  return (
    <div className="p-8 md:p-12">
      <EventForm mode="create" />
    </div>
  );
}
