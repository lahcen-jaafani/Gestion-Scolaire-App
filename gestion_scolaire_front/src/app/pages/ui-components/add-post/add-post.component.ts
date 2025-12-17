import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

interface Post {
  id?: number;
  titre: string;
  contenu: string;
  type: string;
  dateCreation?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.scss']
})
export class AddPostComponent {
  form: FormGroup;
  selectedFile: File | null = null;
  posts: Post[] = [];
  backendUrl = 'http://localhost:8080';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      contenu: ['', Validators.required],
      type: ['ACTUALITE', Validators.required]  // set default value here
    });
  }

  ngOnInit() {
    this.loadPosts();
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) this.selectedFile = file;
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    fileInput?.click();
  }

  submit() {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('post', new Blob([JSON.stringify(this.form.value)], { type: 'application/json' }));
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.http.post<Post>(`${this.backendUrl}/api/posts`, formData)
      .subscribe(post => {
        this.posts.unshift(post);
        this.form.reset({ type: 'ANNONCE' });
        this.selectedFile = null;
        this.router.navigate(['/ui-components/anounces']);
      });
  }
  postTypes = [
    { value: 'ACTUALITE', label: 'Actualite' },

    { value: 'EVENEMENT', label: 'Event' }
  ];
  loadPosts() {
    this.http.get<Post[]>(`${this.backendUrl}/api/posts`)
      .subscribe(posts => this.posts = posts);
  }
}
