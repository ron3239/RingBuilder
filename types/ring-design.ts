/**
 * Core TypeScript interfaces for Ring Design System
 * Feature: jewelry-constructor-mvp
 */

/**
 * Base template for ring design
 * Represents one of 3-5 available ring base templates
 */
export interface BaseTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string; // URL or local asset path
}

/**
 * Metal configuration for ring
 * Supports fineness options: 585, 750, 925
 * Color options depend on fineness
 */
export interface MetalConfig {
  fineness: 585 | 750 | 925;
  color: 'yellow_gold' | 'white_gold' | 'silver';
}

/**
 * Gemstone configuration for ring
 * Optional - user can add exactly one gemstone
 */
export interface GemstoneConfig {
  type: 'diamond' | 'sapphire' | 'ruby';
  size: 'small' | 'medium' | 'large';
}

/**
 * Main ring design model
 * Represents the current state of ring being designed
 */
export interface RingDesign {
  template: BaseTemplate | null;
  metal: MetalConfig | null;
  gemstone: GemstoneConfig | null;
}

/**
 * Saved ring design with metadata
 * Represents a design that has been saved to backend
 */
export interface SavedRingDesign {
  id: string;
  userId: string;
  design: RingDesign;
  createdAt: string;
  updatedAt: string;
  name?: string; // Optional name for the design
}
