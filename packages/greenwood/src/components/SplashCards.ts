import CardGrid from "./CardGrid.ts";
import { css } from "lit";

export default class SpashCards extends CardGrid {
  static override styles = [
    ...super.styles,
    css`
      sp-card {
        max-width: min(15rem,15vw);
    `,
  ];
  constructor() {
    super();
    this.Items = [
      {
        heading: "Generals",
        icon: "healthicons:officer-outline",
        description: "All about picking generals",
        target: "/Generals/",
      },
      {
        heading: "Monsters",
        icon: "game-icons:fish-monster",
        description: "All about hunting monsters",
      },
      {
        heading: "PvP",
        icon: "mdi:sword-fight",
        description: "All about participating in PvP",
      },
      {
        heading: "Reference",
        description: "Uncategorized Reference Material",
        icon: "ion:library-outline",
      },
    ];
  }
}
customElements.define("spash-cards", SpashCards);
