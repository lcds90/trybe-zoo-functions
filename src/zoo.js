const data = require('./data');

function getSpeciesByIds(...ids) {
  if (!ids) return [];
  return data.species.filter((specie) => ids.includes(specie.id));
}

function getAnimalsOlderThan(animal, age) {
  const olderAnimals = data.species.find((specie) => specie.name === animal);
  const areAllOlderThanAge = olderAnimals.residents.every((specie) => specie.age > age);
  return areAllOlderThanAge;
}

function getEmployeeByName(employeeName) {
  if (!employeeName) return {};
  return data.employees
    .find((employee) => employee.firstName === employeeName || employee.lastName === employeeName);
}

function createEmployee(personalInfo, associatedWith) {
  return { ...personalInfo, ...associatedWith };
}

function isManager(id) {
  return data.employees.some((employee) => employee.managers.includes(id));
}

function addEmployee(id, firstName, lastName, managers, responsibleFor) {
  const employee = {
    id,
    firstName,
    lastName,
    managers: managers || [],
    responsibleFor: responsibleFor || [],
  };
  data.employees.push(employee);
}

function countAnimals(species) {
  const allAnimals = data.species.reduce((acc, current) => {
    acc[current.name] = current.residents.length;

    return acc;
  }, {});

  if (!species) return allAnimals;

  return allAnimals[species];
}

function calculateEntry(entrants) {
  if (!entrants || Object.keys(entrants).length === 0) return 0;
  const { Adult = 0, Child = 0, Senior = 0 } = entrants;
  return (Adult * data.prices.Adult)
  + (Child * data.prices.Child)
  + (Senior * data.prices.Senior);
}

function getAnimalMap(options) {
  if (!options) {
    return data.species.reduce((acc, current) => {
      acc[current.location] = [acc.name, current.name];
      return acc;
    }, {});
  }
}

function getSchedule(dayName) {
  // seu código aqui
}

function getOldestFromFirstSpecies(id) {
  // seu código aqui
}

function increasePrices(percentage) {
  data.prices.Adult = ((percentage / 100) * data.prices.Adult) + data.prices.Adult;
  data.prices.Child = ((percentage / 100) * data.prices.Child) + data.prices.Child;
  data.prices.Senior = ((percentage / 100) * data.prices.Senior) + data.prices.Senior;
  // Arrendondar valor float apos calculo
  data.prices.Adult = Math.round(data.prices.Adult * 100) / 100;
  data.prices.Child = Math.round(data.prices.Child * 100) / 100;
  data.prices.Senior = Math.round(data.prices.Senior * 100) / 100;
  return data.prices;
}

function getEmployeeCoverage(idOrName) {
  // seu código aqui
}

module.exports = {
  calculateEntry,
  getSchedule,
  countAnimals,
  getAnimalMap,
  getSpeciesByIds,
  getEmployeeByName,
  getEmployeeCoverage,
  addEmployee,
  isManager,
  getAnimalsOlderThan,
  getOldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
