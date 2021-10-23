const { employees, species, hours, prices } = require('./data');

const getSpeciesByIds = (...ids) => species.filter((specie) => ids.includes(specie.id));

const getAnimalsOlderThan = (animal, age) => species
  .find((s) => s.name === animal).residents
  .every((s) => s.age > age);

const getEmployeeByName = (employeeName) => {
  if (!employeeName) return {};
  return employees
    .find((employee) => [employee.firstName, employee.lastName]
      .includes(employeeName));
};

const createEmployee = (personalInfo, associatedWith) => ({ ...personalInfo, ...associatedWith });

const isManager = (id) => employees.some((employee) => employee.managers.includes(id));

function addEmployee(id, firstName, lastName, managers, responsibleFor) {
  const employee = {
    id,
    firstName,
    lastName,
    managers: managers || [],
    responsibleFor: responsibleFor || [],
  };
  employees.push(employee);
}

function countAnimals(speciesName) {
  const allAnimals = species.reduce((acc, current) => {
    acc[current.name] = current.residents.length;
    return acc;
  }, {});

  if (!speciesName) return allAnimals;

  return allAnimals[speciesName];
}

function calculateEntry(entrants) {
  if (!entrants || Object.keys(entrants).length === 0) return 0;
  const { Adult = 0, Child = 0, Senior = 0 } = entrants;
  return (Adult * prices.Adult)
  + (Child * prices.Child)
  + (Senior * prices.Senior);
}

// LINK https://files.slack.com/files-pri/TMDDFEPFU-F01DPDJ9XQQ/zoom_0.mp4
// NOTE Refatorei algumas codigos com complexidade para entendimento.

function retrieveResidentsFromAnimalAndFilter(residents, sex) {
  return residents.filter((resident) => (sex !== undefined ? resident.sex === sex : true))
    .map((resident) => resident.name);
}

function retrieveFilteredAnimalsPerLocation(location) {
  return species
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
  return species.map((specie) => specie.location);
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
  const result = Object.entries(hours).reduce((acc, hour) => {
    const day = hour[0];
    const { open } = hour[1];
    let { close } = hour[1];
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
  const employeeFound = employees.find((employee) => employee.id === id);
  const animalId = employeeFound.responsibleFor[0];
  const firstSpecie = species.find((specie) => specie.id === animalId);
  const oldest = firstSpecie.residents.sort((a, b) => b.age - a.age);
  return Object.values(oldest[0]);
}

function increasePrices(percentage) {
  const keys = Object.keys(prices);

  keys.forEach((key) => {
    prices[key] = ((percentage / 100) * prices[key]) + prices[key];
    prices[key] = Math.round(prices[key] * 100) / 100;
  });
}

function getEmployeesAnimalsNameList(id) {
  const animalFound = species.find((animal) => animal.id === id);
  return animalFound.name;
}

function searchForParam(param) {
  const employee = employees.find((em) => [em.id, em.firstName, em.lastName].includes(param));
  const fullName = `${employee.firstName} ${employee.lastName}`;
  const getAnimals = employee.responsibleFor
    .map((animal) => getEmployeesAnimalsNameList(animal));
  return { [fullName]: getAnimals };
}

function getEmployeesList() {
  const list = employees.reduce((acc, currentEmployee) => {
    const fullName = `${currentEmployee.firstName} ${currentEmployee.lastName}`;
    const getAnimals = currentEmployee.responsibleFor
      .map((animal) => getEmployeesAnimalsNameList(animal));
    acc[fullName] = getAnimals;
    return acc;
  }, {});
  return list;
}

function getEmployeeCoverage(idOrName) {
  if (!idOrName) return getEmployeesList();
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
