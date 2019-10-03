import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';

export interface ToolCommand {
  /**
   * Appliquer la commande. Retourne une primitive si la commende en cree une, sinon retourne null.
   */
  apply(): SVGPrimitive | null;

  /**
   * Effectue l'inverse de la commande. Non implemente pour le moment.
   */
  cancel(): void;
}
