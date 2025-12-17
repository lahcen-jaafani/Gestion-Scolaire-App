export interface Departement {
  id: number;
  departementName: string;
  imageUrl: string;
  chefId?: number | null; // 👈 ajoute ceci
  chef?: { firstName: string; lastName: string } | null;
}
