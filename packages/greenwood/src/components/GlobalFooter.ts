import styles from "../styles/GlobalFooter.css" with { type: "css" };

export default class GlobalFooter extends HTMLElement {
  private today = new Date();
  connectedCallback() {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles];
    this.innerHTML = `
      <div class="footer">
        <span class="privacy spectrum-Detail spectrum-Detail--serif spectrum-Detail--sizeM spectrum-Detail--light"><a href="/policy/privacy/" class="spectrum-Link spectrum-Link--quiet spectrum-Link--primary">Privacy Policy</a></span>
        <span class="copyright spectrum-Detail spectrum-Detail--serif spectrum-Detail--sizeM spectrum-Detail--light">©2023-${this.today.getFullYear()} Luke Schierer</span>
      </div>
    `;
  }
}
customElements.define("global-footer", GlobalFooter);
