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

function getAllAnimalsDefault() {
  return data.species.reduce((acc, current, index, array) => {
    const { name, location } = current;
    if (!acc[location]) acc[location] = [];
    acc[location].push(name);
    return acc;
  }, {});
}

function getAllAnimals(includedNames, sorted, sex) {
  if (includedNames) {
    const result = data.species.reduce((acc, current, index, array) => {
      const { name, location } = current;
      if (!acc[location]) acc[location] = [];
      acc[location].push({
        [name]: current.residents.map((animal) => animal.name),
      });
      return acc;
    }, {});

    return result;
  }
}

function getAnimalMap(options = {}) {
  const { includeNames, sorted, sex } = options;
  const result = getAllAnimalsDefault();
  // Sem parametros
  if (!Object.keys(options).length) {
    return result;
  }

  return getAllAnimals(includeNames, sorted, sex);
}
/*
console.log(
  getAnimalMap({
    includeNames: true,
  }),
); */

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
  if (!idOrName) {
    const list = data.employees.map((employee) => [`${employee.firstName} ${employee.lastName}`,
      employee.responsibleFor]);
    return list.map((item) => item[1].map((specieId) => {
      console.log(specieId);
      const species = data.species.find((specie) => specieId === specie.id);
      return species;
    }));
  }
}

console.log(getEmployeeCoverage());

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
