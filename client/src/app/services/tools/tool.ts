import { SVGPrimitive } from '../svgPrimitives/svgPrimitive';
import { ToolCommand } from '../toolCommands/toolCommand';
import { ToolType } from '../utils/constantsAndEnums';
import { Point } from '../utils/point';

export interface Tool {
  type: ToolType;

  /**
   * Commence une nouvelle utilisation de l'outil. Retourne une liste de primitives temporaires s'il y a lieu.
   *
   * @param position La position initiale de l'utilisation de l'outil
   */
  begin(position: Point): SVGPrimitive[];

  /**
   * Met l'outil a jour selon une nouvelle position. Retourne une liste de primitives temporaires s'il y a lieu.
   *
   * @param position La nouvelle position
   */
  update(position: Point): SVGPrimitive[];

  /**
   * Termine l'utilisation de l'outil. Retourne la commande cree.
   *
   * @param position La position finale de l'utilisation de l'outil
   * @param isLeft Est vrai si la methode a ete appelee par un clic gauche de la souris
   * @param primitive La primitive a modifier, s'il y a lieu
   */
  finish(position: Point, isLeft?: boolean, primitive?: SVGPrimitive): ToolCommand;

  /**
   * Applique l'utilisation d'une touche du clavier dans l'outil
   *
   * @param key La touche appuyee
   */
  keyDown(key: string): SVGPrimitive[];

  /**
   * Applique la fin de l'utilisation d'une touche du clavier dans l'outil
   *
   * @param key La touche qui vient d'etre relachee
   */
  keyUp(key: string): SVGPrimitive[];
}
