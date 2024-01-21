import { ChangeDetectorRef, Component, HostListener, Inject, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { ImagemDTO, PublicacaoResponseDTO } from '../dto/PublicacaoResponseDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng-lts/api';
import { StorageService } from './storage.service';
import { PublicacaoResquestDTO } from '../dto/publicacaoRequestDTO';
import { EditarPublicacaoDTO } from '../dto/editarPublicacaoDTO';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DOCUMENT, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  private eventSource!: EventSource;

  private sseSubscription!: Subscription;

  publicacaoForm!: FormGroup; 
  items: any[];
  images = [{}];
  publicacoes!: PublicacaoResponseDTO[];
  displayModal: boolean = false;
  maxFileSize = 1000000;
  uploadedFiles: any[] = [];
  fileLimit = 3;
  chooseLabel = 'Buscar arquivo';
  uploadLabel = 'Confirmar imagens';
  imagensRetornadaStorage!: ImagemDTO[];
  msgs = [{}];
  isEditando = false;
  header = "Nova Postagem"
  idItemEditado!: number;
  showFullText = false;
  notification = false;
  mostrarTela = false;
  isMostrarCard = true;
  alturaTopoTela: number = 0;
  scroll = false;

  constructor(
    private homeService: HomeService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private storageService: StorageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private viewportScroller: ViewportScroller,
     @Inject(DOCUMENT) private document: Document
  ) {
    this.publicacaoForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
    });

    this.buscarTodasPublicacoes();

    this.sseSubscription = this.homeService.initSSE().subscribe(
      data => {
        if(data){
          this.notification = true
        }else{
          this.notification = false;
        }
        this.publicacoes.unshift({...data}); // Atualize o array de mensagens
        this.cdr.detectChanges();
      },
      error => {
        console.error('Erro na conexão SSE:', error);
      }
    );

    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/home' },
    ];
  }

  ngOnDestroy() {
    this.homeService.closeSSE(); // Feche a conexão SSE ao destruir o componente
    this.sseSubscription.unsubscribe(); // Desinscreva-se da Observable
  }

  ngOnInit(): void {

    this.mostrarTela = true;

  }

  closeSSE() {
    this.eventSource.close();
  }

  toggleText(item: any): void {
    item.showFullText = !item.showFullText;
  }

  buscarTodasPublicacoes() {
    this.homeService.buscarTodasPublicacoes().subscribe(
      (data) => {
        this.publicacoes = data;
      },
      (error) => {}
    );
  }

  atualizarPagina() {
    // Lógica para atualizar a página
  }

  sair() {
    this.router.navigate(['/']);

  }

  showDialog() {
    this.isEditando ? this.header = "Editar Postagem" : this.header = "Nova Postagem";

    this.displayModal = true;
  }

  // Função para esconder o modal
  hideDialog() {
    this.displayModal = false;
  }

  salvarEditarPublicacao() {
    if(this.isEditando) {
      this.editarPostagem();
    }else {
      this.salvarPublicacao();
    }
  }

  salvarPublicacao() {
    if (this.publicacaoForm.valid) {
      if (this.uploadedFiles.length != 0) {
        this.enviarImagensStorage(this.uploadedFiles);
      }else {
      const descricao = this.publicacaoForm.get('descricao')?.value;
      const titulo = this.publicacaoForm.get('titulo')?.value;

      const enviarPublicacao: PublicacaoResquestDTO = {
        descricao: descricao,
        titulo: titulo,
        imagens: this.imagensRetornadaStorage
      };

      this.homeService.salvarPublicacao(enviarPublicacao).subscribe(
        (data) => {
          this.publicacaoForm.reset();
          this.hideDialog();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Postagem incluida.' });
            this.messageService.clear();  
        },
        (error) => {}
      );
      
      
    }
    } 
  }

  enviarImagensStorage(event: any): void {
    const files: File[] = event;
  
    if (files.length > 0) {
      this.storageService.uploadImagens(files).subscribe(
        (response) => {
          this.imagensRetornadaStorage = response;
  
          const descricao = this.publicacaoForm.get('descricao')?.value;
          const titulo = this.publicacaoForm.get('titulo')?.value;

          const enviarPublicacao: PublicacaoResquestDTO = {
            descricao: descricao,
            titulo: titulo,
            imagens: this.imagensRetornadaStorage
          };
  
  
          this.homeService.salvarPublicacao(enviarPublicacao).subscribe(
            (data) => {
              this.publicacaoForm.reset();
              this.hideDialog();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Postagem incluida.' });
                this.messageService.clear();  
            },
            (error) => {}
          );
          
          // Limpar os arquivos depois de fazer o upload
          this.uploadedFiles = [];
        },
        (error) => {}
      );
    }
  }

  onFileSelect(event: any): void {
    if (this.uploadedFiles.length < this.fileLimit) {
      this.uploadedFiles.push(event.files[0]);
    } else {
    }
  }

  excluirPostagem(id: any) {
      this.homeService.excluirPostagem(id).subscribe((res) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Postagem excluida.' });

          this.messageService.clear();  

      },
      (error) => {}
      )
  }

  editarPostagem(): void {

    const descricao = this.publicacaoForm.get('descricao')?.value;
    const titulo = this.publicacaoForm.get('titulo')?.value;

    const enviarPublicacao: PublicacaoResquestDTO = {
      id: this.idItemEditado,
      descricao: descricao,
      titulo: titulo,
    };

    this.homeService.editarPublicacao(enviarPublicacao).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Postagem atualizada.' });

          this.messageService.clear();  
          this.publicacaoForm.reset();
      },
      (error) => {
        console.error('Erro ao atualizar publicação:', error);
      }
    );
  }

  abrirModalEditar(publicacao: PublicacaoResponseDTO) {
    this.isEditando = true;
    this.idItemEditado = publicacao.id;
    const valoresIniciais = {
      descricao: publicacao.descricao,
      titulo: publicacao.titulo
    };
    this.publicacaoForm.patchValue(valoresIniciais);
    this.showDialog();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.alturaTopoTela = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    
    if(this.alturaTopoTela < 100) {
      this.scroll = false;
      this.notification = false;
    }else {
      this.scroll = true;
    }
  }

  atualizarPublicacoes() {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.notification = false;
  }

}
