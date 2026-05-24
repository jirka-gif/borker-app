import { TravelFormValues } from '../components/travelInsurance/TravelInsuranceCalculator';

export type TravelOffer = {
  id: string;
  insurerName: string;
  productName: string;
  totalPrice: number;
  pricePerDay: number;
  coverageLevel: 'basic' | 'standard' | 'premium';
  limits: {
    medical: string;
    baggage?: string;
    liability?: string;
    cancellation?: string;
  };
  includes: string[];
  recommended?: boolean;
};

export function getTravelQuotes(form: TravelFormValues): TravelOffer[] {
  const numTravellers = form.travellers.length || 1;
  const dateFrom = new Date(form.dateFrom);
  const dateTo = new Date(form.dateTo);
  const days = Math.ceil((dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)) || 1;

  // Base price per day per person based on coverage level
  const basePrices: Record<string, number> = {
    basic: 50,
    standard: 80,
    premium: 120,
  };

  const basePricePerDay = basePrices[form.coverageLevel] || basePrices.standard;
  const totalPricePerDay = basePricePerDay * numTravellers;
  const totalPrice = totalPricePerDay * days;

  // Adjust for optional coverage
  let priceMultiplier = 1;
  if (form.includeBaggage) priceMultiplier += 0.1;
  if (form.includeLiability) priceMultiplier += 0.15;
  if (form.includeTripCancellation) priceMultiplier += 0.2;
  if (form.includeAccident) priceMultiplier += 0.1;

  const adjustedPrice = Math.round(totalPrice * priceMultiplier);
  const adjustedPricePerDay = Math.round(totalPricePerDay * priceMultiplier);

  // Generate offers based on coverage level
  const offers: TravelOffer[] = [];

  if (form.coverageLevel === 'basic') {
    offers.push({
      id: '1',
      insurerName: 'Pojišťovna Levně',
      productName: 'Základní pojištění',
      totalPrice: adjustedPrice,
      pricePerDay: adjustedPricePerDay,
      coverageLevel: 'basic',
      limits: {
        medical: '5 000 000 Kč',
        baggage: form.includeBaggage ? '30 000 Kč' : undefined,
        liability: form.includeLiability ? '5 000 000 Kč' : undefined,
        cancellation: form.includeTripCancellation ? '50 000 Kč' : undefined,
      },
      includes: [
        'Léčebné výlohy v zahraničí',
        'Přeprava do ČR',
        ...(form.includeBaggage ? ['Pojištění zavazadel'] : []),
        ...(form.includeLiability ? ['Odpovědnost za škodu'] : []),
        ...(form.includeTripCancellation ? ['Storno cesty'] : []),
        ...(form.includeAccident ? ['Úrazové pojištění'] : []),
      ],
      recommended: true,
    });

    offers.push({
      id: '2',
      insurerName: 'Jistota Plus',
      productName: 'Basic Travel',
      totalPrice: adjustedPrice + 200,
      pricePerDay: adjustedPricePerDay + 50,
      coverageLevel: 'basic',
      limits: {
        medical: '8 000 000 Kč',
        baggage: form.includeBaggage ? '40 000 Kč' : undefined,
        liability: form.includeLiability ? '5 000 000 Kč' : undefined,
      },
      includes: [
        'Léčebné výlohy v zahraničí',
        'Přeprava do ČR',
        ...(form.includeBaggage ? ['Pojištění zavazadel'] : []),
        ...(form.includeLiability ? ['Odpovědnost za škodu'] : []),
      ],
    });
  } else if (form.coverageLevel === 'standard') {
    offers.push({
      id: '3',
      insurerName: 'Travel Guard',
      productName: 'Standard Travel Protection',
      totalPrice: adjustedPrice,
      pricePerDay: adjustedPricePerDay,
      coverageLevel: 'standard',
      limits: {
        medical: '10 000 000 Kč',
        baggage: form.includeBaggage ? '60 000 Kč' : undefined,
        liability: form.includeLiability ? '10 000 000 Kč' : undefined,
        cancellation: form.includeTripCancellation ? '100 000 Kč' : undefined,
      },
      includes: [
        'Léčebné výlohy v zahraničí',
        'Přeprava do ČR',
        'Nouzové služby 24/7',
        ...(form.includeBaggage ? ['Pojištění zavazadel'] : []),
        ...(form.includeLiability ? ['Odpovědnost za škodu'] : []),
        ...(form.includeTripCancellation ? ['Storno cesty'] : []),
        ...(form.includeAccident ? ['Úrazové pojištění'] : []),
      ],
      recommended: true,
    });

    offers.push({
      id: '4',
      insurerName: 'Globální Pojištění',
      productName: 'Standard Cover',
      totalPrice: adjustedPrice - 300,
      pricePerDay: adjustedPricePerDay - 50,
      coverageLevel: 'standard',
      limits: {
        medical: '8 000 000 Kč',
        baggage: form.includeBaggage ? '50 000 Kč' : undefined,
        liability: form.includeLiability ? '8 000 000 Kč' : undefined,
        cancellation: form.includeTripCancellation ? '80 000 Kč' : undefined,
      },
      includes: [
        'Léčebné výlohy v zahraničí',
        'Přeprava do ČR',
        ...(form.includeBaggage ? ['Pojištění zavazadel'] : []),
        ...(form.includeLiability ? ['Odpovědnost za škodu'] : []),
        ...(form.includeTripCancellation ? ['Storno cesty'] : []),
      ],
    });

    offers.push({
      id: '5',
      insurerName: 'Elite Insurance',
      productName: 'Premium Standard',
      totalPrice: adjustedPrice + 500,
      pricePerDay: adjustedPricePerDay + 100,
      coverageLevel: 'standard',
      limits: {
        medical: '15 000 000 Kč',
        baggage: form.includeBaggage ? '80 000 Kč' : undefined,
        liability: form.includeLiability ? '15 000 000 Kč' : undefined,
        cancellation: form.includeTripCancellation ? '150 000 Kč' : undefined,
      },
      includes: [
        'Léčebné výlohy v zahraničí',
        'Přeprava do ČR',
        'Nouzové služby 24/7',
        'Asistence v ČJ',
        ...(form.includeBaggage ? ['Pojištění zavazadel'] : []),
        ...(form.includeLiability ? ['Odpovědnost za škodu'] : []),
        ...(form.includeTripCancellation ? ['Storno cesty'] : []),
        ...(form.includeAccident ? ['Úrazové pojištění'] : []),
      ],
    });
  } else {
    // premium
    offers.push({
      id: '6',
      insurerName: 'Premium Travel Shield',
      productName: 'Premium Protection',
      totalPrice: adjustedPrice,
      pricePerDay: adjustedPricePerDay,
      coverageLevel: 'premium',
      limits: {
        medical: '20 000 000 Kč',
        baggage: form.includeBaggage ? '100 000 Kč' : undefined,
        liability: form.includeLiability ? '20 000 000 Kč' : undefined,
        cancellation: form.includeTripCancellation ? '200 000 Kč' : undefined,
      },
      includes: [
        'Léčebné výlohy v zahraničí',
        'Přeprava do ČR',
        'Nouzové služby 24/7',
        'Asistence v ČJ',
        'VIP servis',
        'Sportovní aktivity',
        ...(form.includeBaggage ? ['Pojištění zavazadel'] : []),
        ...(form.includeLiability ? ['Odpovědnost za škodu'] : []),
        ...(form.includeTripCancellation ? ['Storno cesty'] : []),
        ...(form.includeAccident ? ['Úrazové pojištění'] : []),
      ],
      recommended: true,
    });

    offers.push({
      id: '7',
      insurerName: 'Elite Global Insurance',
      productName: 'Ultimate Travel',
      totalPrice: adjustedPrice + 800,
      pricePerDay: adjustedPricePerDay + 150,
      coverageLevel: 'premium',
      limits: {
        medical: '25 000 000 Kč',
        baggage: form.includeBaggage ? '150 000 Kč' : undefined,
        liability: form.includeLiability ? '25 000 000 Kč' : undefined,
        cancellation: form.includeTripCancellation ? '300 000 Kč' : undefined,
      },
      includes: [
        'Léčebné výlohy v zahraničí',
        'Přeprava do ČR',
        'Nouzové služby 24/7',
        'Asistence v ČJ',
        'VIP servis',
        'Sportovní aktivity',
        'COVID-19 krytí',
        ...(form.includeBaggage ? ['Pojištění zavazadel'] : []),
        ...(form.includeLiability ? ['Odpovědnost za škodu'] : []),
        ...(form.includeTripCancellation ? ['Storno cesty'] : []),
        ...(form.includeAccident ? ['Úrazové pojištění'] : []),
      ],
    });
  }

  return offers;
}

