import { flexRender, type Table } from "@tanstack/lit-table";

import {
  LitElement,
  html,
  css,
  type PropertyValues,
  type CSSResultGroup,
  unsafeCSS,
  type TemplateResult,
} from "lit";
import { repeat } from "lit/directives/repeat.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { type Ref, createRef, ref } from "lit/directives/ref.js";

import * as stores from "./store.ts";

export default function
