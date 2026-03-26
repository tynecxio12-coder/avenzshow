import { CheckCircle2, Clock3 } from "lucide-react";

type Props = {
  steps: string[];
  currentIndex: number;
};

export default function OrderTimeline({ steps, currentIndex }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {steps.map((step, index) => {
        const completed = index <= currentIndex;
        return (
          <div
            key={step}
            className={`rounded-2xl border p-4 text-center ${
              completed ? "border-primary/20 bg-primary/5" : "border-border bg-card"
            }`}
          >
            <div
              className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
                completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {completed ? <CheckCircle2 className="h-5 w-5" /> : <Clock3 className="h-5 w-5" />}
            </div>
            <p className="text-sm font-medium capitalize">{step.replaceAll("_", " ")}</p>
          </div>
        );
      })}
    </div>
  );
}
