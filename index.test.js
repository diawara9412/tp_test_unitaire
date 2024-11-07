
import { describe, test, expect, vi } from 'vitest';
import { addTea } from './index';
import { getTeaByName, saveTea, generateNewTeaId } from './saver';

vi.mock('./saver', () => ({
  getTeaByName: vi.fn(),
  saveTea: vi.fn(),
  generateNewTeaId: vi.fn(() => 12345),
}));

describe('addTea', () => {
  test('should create a new tea if tea name does not exist', () => {
    vi.mocked(getTeaByName).mockReturnValueOnce(undefined);
    const teaDto = { name: 'Chamomile', description: 'Calming tea' };
    const result = addTea(teaDto);
    expect(saveTea).toHaveBeenCalledWith({ ...teaDto, id: 12345 });
    expect(result).toEqual({ success: true });
  });

  test('should update tea if tea name already exists', () => {
    vi.mocked(getTeaByName).mockReturnValueOnce({ id: 1, name: 'Chamomile' });
    const teaDto = { name: 'Chamomile', description: 'Relaxing' };
    const result = addTea(teaDto);
    expect(saveTea).toHaveBeenCalledWith({ ...teaDto, id: 1 });
    expect(result).toEqual({ success: true });
  });

  test('should return success false if saveTea throws an error', () => {
    vi.mocked(getTeaByName).mockReturnValueOnce(undefined);
    vi.mocked(saveTea).mockImplementationOnce(() => { throw new Error('Save failed'); });
    const teaDto = { name: 'Peppermint', description: 'Refreshing' };
    const result = addTea(teaDto);
    expect(result).toEqual({ success: false });
  });
});
