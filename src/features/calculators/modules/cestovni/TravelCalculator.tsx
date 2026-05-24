"use client";

import { TravelInsuranceCalculator } from "./components/travelInsurance/TravelInsuranceCalculator";

/**
 * Vložená kalkulačka cestovního pojištění (původně samostatná Next.js appka „Travel").
 *
 * `TravelInsuranceCalculator` drží stav kroků, nabídky i formulářová data
 * (react-hook-form FormProvider). Z původní appky je odebraná vlastní hlavička
 * (petrisk) i gradientní banner – rámec dodává hostitelská stránka hubu.
 */
export function TravelCalculator() {
  return <TravelInsuranceCalculator />;
}

export default TravelCalculator;
