import React from 'react';
import { TravelOffer } from '../../lib/travelQuotes';
import { TravelOfferCard } from './TravelOfferCard';
import { SecondaryButton } from '../../components/ui/Button';

interface TravelOffersProps {
  offers: TravelOffer[];
  onEditInput: () => void;
}

export function TravelOffers({ offers, onEditInput }: TravelOffersProps) {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Našli jsme {offers.length} {offers.length === 1 ? 'nabídku' : offers.length < 5 ? 'nabídky' : 'nabídek'} pro tvoji cestu
        </h2>
        <p className="text-muted">
          Porovnej nabídky a vyber si tu nejlepší pro svou cestu
        </p>
      </div>

      <div className="mb-4">
        <SecondaryButton onClick={onEditInput}>
          Upravit zadání
        </SecondaryButton>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => (
          <TravelOfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}



