import { User } from "./User.model";

export interface Major {
  chef?: { firstName: string; lastName: string } | null;
  id?: number;
  name: string;
  contenu: string;
  dateCreation?: string;
  pdfFilename?: string;
  pdfPath?: string;
  chefId?: number | null; // 👈 ajoute ceci
  auteur?: User;
}
