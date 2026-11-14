import { WorkCandidateDTO } from "../dto/work-candidate.dto.js";

export interface BaseProvider {
  search: (query: string) => Promise<WorkCandidateDTO[]>
  // getDetails(externalId: string): Promise<WorkDetails>
}