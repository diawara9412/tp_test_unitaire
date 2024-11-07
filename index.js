
import { generateNewTeaId, getTeaByName, saveTea } from './saver';

/**
 * Creates a new tea. If the tea name already exists, it will be updated instead
 * @param {Omit<Tea, 'id'>} teaDto
 * @returns {{success: boolean}}
 */
export function addTea(teaDto) {
  const existingTea = getTeaByName(teaDto.name);
  const teaToCreate = {
    ...teaDto,
    id: existingTea ? existingTea.id : generateNewTeaId(),
  };

  try {
    saveTea(teaToCreate);
  } catch (e) {
    console.error(e);
    return {
      success: false,
    };
  }
  return {
    success: true,
  };
}
