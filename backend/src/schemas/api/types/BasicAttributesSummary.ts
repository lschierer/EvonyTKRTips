import { type BasicAttributesObjectSummary } from "./BasicAttributesObjectSummary";
/**
 * @description A summary form of the Basic Attributes, after they have been instantiated at a particular level and computed.
 */
export type BasicAttributesSummary = {
  Attack: BasicAttributesObjectSummary;
  Defense: BasicAttributesObjectSummary;
  Politics: BasicAttributesObjectSummary;
  Leadership: BasicAttributesObjectSummary;
};
