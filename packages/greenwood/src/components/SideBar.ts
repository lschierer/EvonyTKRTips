import { type ClientNavItem } from "@evonytkrtips/schemas";
import { type Page } from "@greenwood/cli";
import { getContent } from "@greenwood/cli/src/data/client.js";

import SideNavCSS from "../styles/sidebar.css" with { type: "css" };

import debugFunction from "../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

export default class SideBar extends HTMLElement {
  private navTree: ClientNavItem[] = [];
  private currentPath: string = "";

  // Routes that should be excluded from the navigation
  private excludedRoutes: string[] = ["/404/", "/policy/"];

  protected hasOrder = (p: Page) => {
    if ("data" in p) {
      const data = p.data;
      if (data && "sidebar" in data) {
        const s = data.sidebar as object | undefined;
        if (s && "order" in s) {
          return s.order as number;
        }
      } else if (data && "order" in data) {
        return data.order as number;
      }
    }
    return -1;
  };

  /**
   * Checks if a route should be excluded from navigation
   */
  protected shouldExcludeRoute = (route: string): boolean => {
    // Check if the route itself is excluded
    if (this.excludedRoutes.includes(route)) {
      return true;
    }

    // Check if the route is a child of an excluded route
    for (const excludedRoute of this.excludedRoutes) {
      if (route.startsWith(excludedRoute)) {
        return true;
      }
    }

    return false;
  };

  protected getTitle = (page: Page) => {
    return page.title ? page.title : page.label ? page.label : page.id;
  };

  /**
   * Builds a navigation tree from a flat list of pages
   */
  protected buildTree = async () => {
    const allPages = await getContent();

    // First, convert all pages to nav items, excluding unwanted routes
    const navItems: ClientNavItem[] = [];
    for (const page of allPages) {
      // Skip excluded routes
      if (this.shouldExcludeRoute(page.route)) {
        continue;
      }

      const order = this.hasOrder(page);
      let navItem: ClientNavItem;

      if (order >= 0) {
        navItem = {
          title: this.getTitle(page),
          route: page.route,
          sidebar: {
            order: order,
          },
          children: [],
        };
      } else {
        navItem = {
          title: this.getTitle(page),
          route: page.route,
          children: [],
        };
      }

      navItems.push(navItem);
    }

    // Sort by route length to ensure parents come before children
    navItems.sort((a, b) => a.route.length - b.route.length);

    // Build the tree
    const rootItems: ClientNavItem[] = [];

    for (const item of navItems) {
      // Skip the home page
      if (item.route === "/") continue;

      // Find the parent
      let parent: ClientNavItem | undefined = undefined;
      let parentFound = false;

      // Look through all existing items in reverse (to find the most specific parent)
      for (let i = navItems.indexOf(item) - 1; i >= 0; i--) {
        const potentialParent = navItems[i];

        // Skip the home page as a parent
        if (potentialParent.route === "/") continue;

        // Check if this is a parent (item's route starts with potential parent's route)
        if (
          item.route !== potentialParent.route &&
          item.route.startsWith(potentialParent.route) &&
          // Make sure it's a proper parent-child relationship
          (item.route.charAt(potentialParent.route.length) === "/" ||
            potentialParent.route.endsWith("/"))
        ) {
          parent = potentialParent;
          parentFound = true;
          break;
        }
      }

      if (parentFound && parent) {
        // Add as a child to the parent
        parent.children.push(item);
      } else {
        // This is a top-level item
        rootItems.push(item);
      }
    }

    // Sort children by order if available
    const sortChildren = (items: ClientNavItem[]) => {
      items.sort((a, b) => {
        const orderA = a.sidebar?.order ?? 999;
        const orderB = b.sidebar?.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.title.localeCompare(b.title);
      });

      // Sort children recursively
      for (const item of items) {
        if (item.children.length > 0) {
          sortChildren(item.children);
        }
      }
    };

    sortChildren(rootItems);

    this.navTree = rootItems;

    if (DEBUG) {
      console.log(`Built navigation tree with ${rootItems.length} root items`);
    }
  };

  /**
   * Finds the path from root to the current page
   */
  protected findPathToCurrentPage = (currentPath: string): ClientNavItem[] => {
    const path: ClientNavItem[] = [];

    const findInTree = (items: ClientNavItem[], target: string): boolean => {
      for (const item of items) {
        if (item.route === target) {
          path.push(item);
          return true;
        }

        if (item.children.length > 0 && findInTree(item.children, target)) {
          path.unshift(item);
          return true;
        }
      }

      return false;
    };

    findInTree(this.navTree, currentPath);
    return path;
  };

  /**
   * Renders the navigation menu
   */
  protected renderNavigation = () => {
    // Get current path
    this.currentPath = window.location.pathname;
    document.adoptedStyleSheets.push(SideNavCSS);

    // Find path to current page
    const pathToCurrentPage = this.findPathToCurrentPage(this.currentPath);
    const currentPageItem =
      pathToCurrentPage.length > 0
        ? pathToCurrentPage[pathToCurrentPage.length - 1]
        : null;

    // Create the HTML
    const navHtml = this.renderNavItems(
      this.navTree,
      pathToCurrentPage,
      currentPageItem
    );

    // Set the HTML
    this.innerHTML = `
      <nav >

        ${navHtml}
      </nav>
    `;
  };

  /**
   * Renders navigation items recursively
   */
  protected renderNavItems = (
    items: ClientNavItem[],
    pathToCurrentPage: ClientNavItem[],
    currentPageItem: ClientNavItem | null
  ): string => {
    let html = `<ul class="spectrum-SideNav spectrum-SideNav--multiLevel spectrum-SideNav--hasIcon">`;

    for (const item of items) {
      const isActive = item.route === this.currentPath;
      const isInPath = pathToCurrentPage.includes(item);
      const shouldExpandChildren =
        isInPath || (currentPageItem && item.route === currentPageItem.route);
      const hasChildren = item.children.length > 0;

      html += `
        <li class="spectrum-SideNav-item ${isActive ? "is-selected" : ""} ">
          <a class="spectrum-SideNav-itemLink" ${isActive ? "" : `href="${item.route}"`}>
            <iconify-icon icon="${
              item.children.length
                ? isInPath
                  ? "tabler:folder-open"
                  : "tabler:folder"
                : "ion:book-outline"
            }"  height="1rem"
            inline
            aria-hidden="true"
            role="img"
            class="spectrum-Icon"></iconify-icon>
            <span class="spectrum-SideNav-link-text">${item.title}</span>
          </a>
      `;

      // Render children if this item is in the path to current page
      // or if it is the current page and has children
      if (hasChildren && (shouldExpandChildren || item.route === "/")) {
        html += this.renderNavItems(
          item.children,
          pathToCurrentPage,
          currentPageItem
        );
      }

      html += `</li>`;
    }

    html += `</ul>`;
    return html;
  };

  async connectedCallback() {
    await this.buildTree();
    this.renderNavigation();

    if (DEBUG) {
      console.log(
        `SideBar connected and rendered with ${this.navTree.length} root items`
      );
    }
  }
}

customElements.define("side-bar", SideBar);
