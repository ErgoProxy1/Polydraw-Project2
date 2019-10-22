import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ToolCommand } from '../toolCommands/toolCommand';
import { KeyboardEventType, MouseEventType, ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';

export interface Tool {
  readonly type: ToolType;

   /**
    * Envoie les informations d'un evenement de souris a l'outil pour qu'il le traite.
    * Retourne une liste de primitives temporaires s'il y a lieu.
    *
    * @param eventType Le type d'evenement appelant cette fonction
    * @param position La position du curseur dans le canevas
    * @param primitive La primitive sur laquelle on a clique, s'il y a lieu
    */
  mouseEvent(eventType: MouseEventType, position: Point, primitive?: SVGPrimitive): SVGPrimitive[];

   /**
    * Envoie les informations d'un evenement de clavier a l'outil pour qu'il le traite.
    * Retourne une liste de primitives temporaires s'il y a lieu.
    *
    * @param eventType Le type d'evenement appelant cette fonction
    * @param key La touche du clavier affectee par cet evenement
    */
  keyboardEvent(eventType: KeyboardEventType, key: string): SVGPrimitive[];

   /**
    * Envoie les informations d'un evenement de la molette de souris a l'outil pour qu'il le traite.
    * Retourne une liste de primitives temporaires s'il y a lieu.
    *
    * @param delta La variation dans l'orientation de la molette de la souris
    */
  mouseWheelEvent(delta: number): SVGPrimitive[];

  /**
   * Retourne vrai si l'outil a une commande prete a etre appliquee.
   */
  isCommandReady(): boolean;

  /**
   * Retourne la commande creee par l'outil, s'il y a lieu.
   */
  getCommand(): ToolCommand | null;
}
