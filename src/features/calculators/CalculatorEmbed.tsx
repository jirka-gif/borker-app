import { ExternalLink } from "lucide-react";
import { Button, Card } from "@/components/ui";
import type { Calculator } from "@/types";

/** Vložení externí kalkulačky přes iframe (kind: "iframe"). */
export function CalculatorIframe({ calculator }: { calculator: Calculator }) {
  if (!calculator.href) return null;
  return (
    <Card className="overflow-hidden p-0">
      <iframe
        src={calculator.href}
        title={calculator.name}
        className="h-[70vh] w-full border-0"
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
      />
    </Card>
  );
}

/** Rozcestník pro externí nástroj (kind: "externi"). */
export function CalculatorExternal({ calculator }: { calculator: Calculator }) {
  return (
    <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-foreground">
        {calculator.name} se otevírá v externím nástroji
      </h3>
      <p className="mt-1 max-w-md text-sm text-muted">
        Tato kalkulačka je provozována mimo aplikaci. Otevřete ji v novém okně.
      </p>
      {calculator.href && (
        <a
          href={calculator.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6"
        >
          <Button rightIcon={<ExternalLink className="h-4 w-4" />}>
            Otevřít nástroj
          </Button>
        </a>
      )}
    </Card>
  );
}
