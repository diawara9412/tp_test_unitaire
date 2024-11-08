
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const teaDataFilename = 'data.json';

/**
 * @typedef {Object} Tea
 * @property {number} id 
 * @property {string} name 
 * @property {string} description 
 */

/**
 * @returns {Array<Tea>} 
 */
function listTeas() {
  if (!existsSync(teaDataFilename)) {
    return [];
  }
  const fileContent = readFileSync(teaDataFilename, 'utf8');
  return JSON.parse(fileContent);
}

/**
 * @param {Tea['name']} teaName
 * @returns {Tea|undefined} 
 */
function getTeaByName(teaName) {
  return listTeas().find(tea => tea.name === teaName);
}

/**
 * @param {Tea} newTea
 */
function saveTea(newTea) {
  const teas = listTeas();

  const teaByName = teas.find(tea => tea.name === newTea.name);
  if (teaByName && teaByName.id !== newTea.id) {
    throw new Error(`Tea with name ${newTea.name} already exists`);
  }


  const teaById = teas.find(tea => tea.id === newTea.id);
  if (teaById && teaById.name !== newTea.name) {
    throw new Error(`Tea with id ${newTea.id} already exists`);
  }

  const newTeas = [...teas.filter(tea => tea.id !== newTea.id), newTea];
  const newFileContent = JSON.stringify(newTeas, null, 2);
  writeFileSync(teaDataFilename, newFileContent);
}

/**
 * @returns {number}
 */
function generateNewTeaId() {
  return Date.now();
}

export { getTeaByName, saveTea, generateNewTeaId };
