import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ImagemDTO, PublicacaoResponseDTO } from '../dto/PublicacaoResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private apiUrl = 'http://localhost:8080/sistema-informativo/storege';
  private apiUrlTi = 'https://sistema-informativo-production.up.railway.app/sistema-informativo/storege'

  constructor(private http: HttpClient) {}

  uploadImagens(files: File[]): Observable<ImagemDTO[]> {
    const formData = new FormData();

    for (const file of files) {
      formData.append('files', file, file.name);
    }

    const headers = new HttpHeaders();

    return this.http.post<any>(`${this.apiUrlTi}/upload`, formData, {
      headers,
    });
  }

}