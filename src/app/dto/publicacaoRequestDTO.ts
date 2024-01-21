import { ImagemDTO } from "./PublicacaoResponseDTO";

export class PublicacaoResquestDTO {
    id?: number;
    titulo!: string;
    descricao!: string;
    imagens?: ImagemDTO[];
  }