import { describe, expect, test, vi, beforeEach } from "vitest";
import { addTea } from "./index.js";
import { getTeaByName, saveTea, generateNewTeaId } from "./saver.js";

vi.mock("./saver.js");

describe("Fonction addTea dans index.js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("doit ajouter un nouveau thé s'il n'existe pas", () => {
    const teaDto = { name: "Thé Blanc", description: "Un thé blanc" };
    getTeaByName.mockReturnValue(undefined);
    generateNewTeaId.mockReturnValue(1001);

    const result = addTea(teaDto);

    expect(result).toEqual({ success: true });
    expect(getTeaByName).toHaveBeenCalledWith("Thé Blanc");
    expect(generateNewTeaId).toHaveBeenCalled();
    expect(saveTea).toHaveBeenCalledWith({ ...teaDto, id: 1001 });
  });

  test("doit mettre à jour un thé existant", () => {
    const teaDto = { name: "Thé Vert", description: "Thé vert bio" };
    const existingTea = {
      id: 1000,
      name: "Thé Vert",
      description: "Un thé vert",
    };
    getTeaByName.mockReturnValue(existingTea);

    const result = addTea(teaDto);

    expect(result).toEqual({ success: true });
    expect(getTeaByName).toHaveBeenCalledWith("Thé Vert");
    expect(generateNewTeaId).not.toHaveBeenCalled();
    expect(saveTea).toHaveBeenCalledWith({ ...teaDto, id: existingTea.id });
  });

  test("doit retourner success: false si saveTea lance une erreur", () => {
    const teaDto = { name: "Thé Rouge", description: "Un thé rouge" };
    getTeaByName.mockReturnValue(undefined);
    generateNewTeaId.mockReturnValue(1002);
    saveTea.mockImplementation(() => {
      throw new Error("Erreur lors de la sauvegarde du thé");
    });

    const result = addTea(teaDto);

    expect(result).toEqual({ success: false });
    expect(getTeaByName).toHaveBeenCalledWith("Thé Rouge");
    expect(saveTea).toHaveBeenCalledWith({ ...teaDto, id: 1002 });
  });
});