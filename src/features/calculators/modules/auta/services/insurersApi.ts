export interface LoadedVehicleData {
  brand: string;
  model: string;
  engineCapacity: number;
  maxPower: number;
  maxPermittedWeight: number;
  firstRegistrationDate: string;
  seatCount: number;
}

export interface CompanyData {
  name: string;
  address: string;
}

export async function loadVehicleData(params: { plateNumber?: string; vin?: string }): Promise<LoadedVehicleData> {
  // Simulace API volání
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!params.plateNumber && !params.vin) {
        reject(new Error('Zadejte SPZ nebo VIN'));
        return;
      }
      // Mock data
      resolve({
        brand: 'Volkswagen',
        model: 'Golf',
        engineCapacity: 1500,
        maxPower: 110,
        maxPermittedWeight: 1800,
        firstRegistrationDate: '2015-03-15',
        seatCount: 5,
      });
    }, 1000);
  });
}

export async function loadCompanyData(ico: string): Promise<CompanyData> {
  // Simulace API volání
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!ico || ico.length < 8) {
        reject(new Error('Neplatné IČO'));
        return;
      }
      // Mock data
      resolve({
        name: 'Example s.r.o.',
        address: 'Praha 1, Václavské náměstí 1',
      });
    }, 1000);
  });
}








