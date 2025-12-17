// src/app/components/generic-crud/generic-crud.component.ts
import { OnInit, Input, Directive } from '@angular/core';

import { Observable } from 'rxjs';
import { GenericService } from 'src/app/components/services/generic.service';
import Swal from 'sweetalert2';
@Directive()
export abstract class GenericCrudComponent<T> implements OnInit {
  items: T[] = [];
  selectedItem: T | null = null;
  isEditing: boolean = false;

  constructor(protected service: GenericService<T, number>) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.service.getAll().subscribe(data => {
      this.items = data;
    });
  }

  viewItem(id: number): void {
    this.service.getById(id).subscribe(item => {
      this.selectedItem = item;
      this.isEditing = false;
    });
  }
  

  editItem(id: number): void {
    this.service.getById(id).subscribe((item: any) => {
      this.selectedItem = item;
      this.isEditing = true;
  
      const formHtml = `
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${Object.keys(item)
          .filter(key => key !== 'id' && typeof item[key] !== 'object')
          .map(key => `
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
              <label for="swal-input-${key}" style="font-weight: bold; margin-bottom: 3px;">${key}</label>
              <input id="swal-input-${key}" class="swal2-input" value="${item[key] ?? ''}" style="width: 100%;">
            </div>
          `).join('')}
      </div>
    `;
      Swal.fire({
        title: 'Modifier',
        html: formHtml,
        width: 600,
        showCancelButton: true,
        confirmButtonText: 'Enregistrer',
        cancelButtonText: 'Annuler',
        focusConfirm: false,
        preConfirm: () => {
          const updatedItem: any = { id: item.id };
  
          Object.keys(item).forEach(key => {
            if (key !== 'id') {
              const input = document.getElementById(`swal-input-${key}`) as HTMLInputElement;
              if (input) {
                updatedItem[key] = input.value;
              }
            }
          });
  
          return this.service.update(id, updatedItem).toPromise()
            .then(() => {
              this.loadItems();
              Swal.fire('Succès', 'Élément mis à jour.', 'success');
            })
            .catch(() => {
              Swal.fire('Erreur', 'Échec de la mise à jour.', 'error');
            });
        }
      });
    });
  }
  

  saveItem(item: T, id?: number): void {
    if (this.isEditing && id != null) {
      this.service.update(id, item).subscribe(() => {
        this.loadItems();
        this.cancel();
      });
    } else {
      this.service.create(item).subscribe(() => {
        this.loadItems();
        this.cancel();
      });
    }
  }

  deleteItem(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          this.loadItems();
          Swal.fire('Supprimé !', 'L\'élément a été supprimé.', 'success');
        });
      }
    });
  }



  cancel(): void {
    this.selectedItem = null;
    this.isEditing = false;
  }
}
