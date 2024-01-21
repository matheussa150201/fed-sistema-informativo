import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PublicacaoResponseDTO } from '../dto/PublicacaoResponseDTO';
import { PublicacaoResquestDTO } from '../dto/publicacaoRequestDTO';
import { EditarPublicacaoDTO } from '../dto/editarPublicacaoDTO';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = 'http://localhost:8080/sistema-informativo/publicacao';
  private apiUrlTi = 'https://sistema-informativo-production.up.railway.app/sistema-informativo/publicacao'
  private eventSource!: EventSource;

  constructor(private http: HttpClient) {}

  buscarTodasPublicacoes(): Observable<PublicacaoResponseDTO[]> {
    return this.http.get<PublicacaoResponseDTO[]>(`${this.apiUrlTi}`);
  }

  salvarPublicacao(publicacao: PublicacaoResquestDTO): Observable<any> {
    return this.http.post<any>(this.apiUrlTi, publicacao);
  }

  excluirPostagem(id :number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlTi}/${id}`);
  }

  editarPublicacao(publicacaoRequestDTO: EditarPublicacaoDTO): Observable<any> {
    return this.http.put<any>(this.apiUrlTi, publicacaoRequestDTO);
  }

  initSSE(): Observable<any> {
    this.eventSource = new EventSource('https://sistema-informativo-production.up.railway.app/sistema-informativo/publicacao/subscribe');


    return new Observable<any>(observer => {
      this.eventSource.addEventListener('new-post', event => {
        const eventData = JSON.parse((event as MessageEvent).data);
        observer.next(eventData);
      });

      this.eventSource.onerror = error => {
        observer.error(error);
      };
    });
  }


    closeSSE() {
      if (this.eventSource) {
        this.eventSource.close();
      }
    }
}