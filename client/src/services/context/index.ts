import { createContext, useContext } from "react";
import { IFileStructure } from "../../types";

export const CourseStructureContext = createContext<IFileStructure | null>(
  null
);

export const useCourseStructure = () =>
  useContext(CourseStructureContext);
