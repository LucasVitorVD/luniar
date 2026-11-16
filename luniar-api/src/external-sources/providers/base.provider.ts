import { WorkCandidateDTO } from "../dto/work-candidate.dto.js";
import { WorkDetailsDTO } from "../dto/work-details.dto.js";

export interface BaseProvider {
  search: (query: string) => Promise<WorkCandidateDTO[]>
  getDetails: (externalId: string) => Promise<WorkDetailsDTO>
}
