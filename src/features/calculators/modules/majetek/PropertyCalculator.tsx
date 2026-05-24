"use client";

import MultiStepInsuranceForm from "./components/MultiStepInsuranceForm";

/**
 * Vložená kalkulačka pojištění majetku (původně samostatná Next.js appka „PropertyFE").
 *
 * `MultiStepInsuranceForm` drží stav kroků i formulářová data. Z původní appky
 * je odebraná vlastní hlavička (petrisk) i celostránkový rámec – o ten se stará
 * hostitelská stránka hubu (breadcrumbs, „zpět na dashboard").
 */
export function PropertyCalculator() {
  return <MultiStepInsuranceForm />;
}

export default PropertyCalculator;
