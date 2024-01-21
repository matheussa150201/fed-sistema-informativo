export class PublicacaoResponseDTO {
    id!: number;
    titulo!: string;
    descricao!: string;
    imagens!: ImagemDTO[];
    criador!: boolean;
    usuario!:string;
    showFullText: any;
  }
  
  export class ImagemDTO {
    idImagem!: number;
    publicId!: string;
    nome!: string;
    url!: string;
    formato!: string;
  }