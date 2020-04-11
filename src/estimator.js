const getImpact = ({ data, impactFactor }) => {
  // Input data
  const dayFactor = {
    days: 1,
    weeks: 7,
    months: 30
  };
  const days = data.timeToElapse * (dayFactor[data.periodType] || 1);
  const growthFactor = Math.floor(days / 3.0);
  const { region } = data;

  // Output data
  const currentlyInfected = data.reportedCases * impactFactor;

  const infectionsByRequestedTime = currentlyInfected * (2 ** growthFactor);

  const severeCasesByRequestedTime = infectionsByRequestedTime * 0.15;

  const hospitalBedsByRequestedTime = (data.totalHospitalBeds * 0.35) - severeCasesByRequestedTime;

  const casesForICUByRequestedTime = infectionsByRequestedTime * 0.05;

  const casesForVentilatorsByRequestedTime = infectionsByRequestedTime * 0.02;

  const dollarsInFlight = (infectionsByRequestedTime * region.avgDailyIncomePopulation
    * region.avgDailyIncomeInUSD) / days;

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime: Math.trunc(severeCasesByRequestedTime),
    hospitalBedsByRequestedTime: Math.trunc(hospitalBedsByRequestedTime),
    casesForICUByRequestedTime: Math.trunc(casesForICUByRequestedTime),
    casesForVentilatorsByRequestedTime: Math.trunc(casesForVentilatorsByRequestedTime),
    dollarsInFlight: Math.trunc(dollarsInFlight)
  };
};

const covid19ImpactEstimator = (data) => ({
  data,
  impact: getImpact({ data, impactFactor: 10 }),
  severeImpact: getImpact({ data, impactFactor: 50 })
});


export default covid19ImpactEstimator;
