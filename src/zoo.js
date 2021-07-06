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

// LINK https://files.slack.com/files-pri/TMDDFEPFU-F01DPDJ9XQQ/zoom_0.mp4
// NOTE Refatorei algumas codigos com complexidade para entendimento.

function retrieveResidentsFromAnimalAndFilter(residents, sex) {
  return residents.filter((resident) => (sex !== undefined ? resident.sex === sex : true))
    .map((resident) => resident.name);
}

function retrieveFilteredAnimalsPerLocation(location) {
  return data.species
    .filter((animal) => animal.location === location);
}

function retrieveAnimalsPerLocationWithName(locations, sorted, sex) {
  const animalsPerLocation = {};
  locations.forEach((location) => {
    const filteredAnimals = retrieveFilteredAnimalsPerLocation(location)
      .map((animal) => {
        const residents = retrieveResidentsFromAnimalAndFilter(animal.residents, sex);
        if (sorted) residents.sort();
        return { [animal.name]: residents };
      });
    if (filteredAnimals.length !== 0) animalsPerLocation[location] = filteredAnimals;
  });
  return animalsPerLocation;
}

function retrieveAnimalsPerLocation(locations) {
  const animalsPerLocation = {};
  locations.forEach((location) => {
    const filteredAnimals = retrieveFilteredAnimalsPerLocation(location)
      .map((animal) => animal.name);
    if (filteredAnimals.length !== 0) animalsPerLocation[location] = filteredAnimals;
  });
  return animalsPerLocation;
}

function retrieveLocations() {
  return data.species.map((specie) => specie.location);
}

function getAnimalMap(options = {}) {
  const locations = retrieveLocations();
  if (!options) return retrieveAnimalsPerLocation(locations);

  const { includeNames = false, sorted = false, sex } = options;
  if (includeNames) {
    return retrieveAnimalsPerLocationWithName(locations, sorted, sex);
  }
  return retrieveAnimalsPerLocation(locations);
}

function getSchedule(dayName) {
  const result = Object.entries(data.hours).reduce((acc, hours) => {
    const day = hours[0];
    const { open } = hours[1];
    let { close } = hours[1];
    close = close % 12 || 12;
    acc[day] = `Open from ${open}am until ${close}pm`;
    if ([open, close].includes(0)) acc[day] = 'CLOSED';
    return acc;
  }, {});
  if (dayName) {
    return {
      [Object.keys(result).find((day) => day === dayName)]: result[dayName],
    };
  }
  return result;
}

function getOldestFromFirstSpecies(id) {
  const employeeFound = data.employees.find((employee) => employee.id === id);
  const animalId = employeeFound.responsibleFor[0];
  const firstSpecie = data.species.find((specie) => specie.id === animalId);
  const oldest = firstSpecie.residents.sort((a, b) => b.age - a.age);
  return Object.values(oldest[0]);
}

function increasePrices(percentage) {
  const keys = Object.keys(data.prices);

  keys.forEach((key) => {
    data.prices[key] = ((percentage / 100) * data.prices[key]) + data.prices[key];
    data.prices[key] = Math.round(data.prices[key] * 100) / 100;
  });
}

function getEmployeesAnimalsNameList(id) {
  const animalFound = data.species.find((animal) => animal.id === id);
  return animalFound.name;
}

function searchForParam(param) {
  const employee = data.employees.find((em) => [em.id, em.firstName, em.lastName].includes(param));
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const getAnimals = employee.responsibleFor
    .map((animal) => getEmployeesAnimalsNameList(animal));
  return { [fullName]: getAnimals };
}

function getEmployeesList() {
  const list = data.employees.reduce((acc, currentEmployee) => {
    const fullName = `${currentEmployee.firstName} ${currentEmployee.lastName}`;
    const getAnimals = currentEmployee.responsibleFor
      .map((animal) => getEmployeesAnimalsNameList(animal));
    acc[fullName] = getAnimals;
    return acc;
  }, {});
  return list;
}

function getEmployeeCoverage(idOrName) {
  const list = getEmployeesList();
  if (!idOrName) return list;
  return searchForParam(idOrName);
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
