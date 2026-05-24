import React from 'react';
import { TravelOffer } from '../../lib/travelQuotes';
import { PrimaryButton, SecondaryButton } from '../../components/ui/Button';

interface TravelOfferCardProps {
  offer: TravelOffer;
}

export function TravelOfferCard({ offer }: TravelOfferCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      {offer.recommended && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-brand-100 text-brand-800 text-sm font-semibold rounded-full">
            Doporučeno
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-foreground mb-1">
            {offer.insurerName}
          </h3>
          <p className="text-muted">{offer.productName}</p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-foreground mb-1">
            {formatPrice(offer.totalPrice)}
          </div>
          <div className="text-sm text-muted">
            {formatPrice(offer.pricePerDay)} / den
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4 mb-4">
        <h4 className="font-semibold text-foreground mb-3">Limity pojištění</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted">Léčebné výlohy: </span>
            <span className="font-medium">{offer.limits.medical}</span>
          </div>
          {offer.limits.baggage && (
            <div>
              <span className="text-muted">Zavazadla: </span>
              <span className="font-medium">{offer.limits.baggage}</span>
            </div>
          )}
          {offer.limits.liability && (
            <div>
              <span className="text-muted">Odpovědnost: </span>
              <span className="font-medium">{offer.limits.liability}</span>
            </div>
          )}
          {offer.limits.cancellation && (
            <div>
              <span className="text-muted">Storno: </span>
              <span className="font-medium">{offer.limits.cancellation}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4 mb-6">
        <h4 className="font-semibold text-foreground mb-3">Co je zahrnuto</h4>
        <ul className="space-y-1">
          {offer.includes.map((include, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-foreground">
              <span className="text-brand-600 mt-1">•</span>
              <span>{include}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <PrimaryButton
          onClick={() => console.log('Vybrat připojištění:', offer.id)}
          className="flex-1"
        >
          Vybrat připojištění
        </PrimaryButton>
        <SecondaryButton
          onClick={() => console.log('Detail:', offer.id)}
        >
          Detail
        </SecondaryButton>
      </div>
    </div>
  );
}

