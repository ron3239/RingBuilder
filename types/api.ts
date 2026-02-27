/**
 * API Request/Response types for Ring Design endpoints
 * Feature: jewelry-constructor-mvp
 */

import { MetalConfig, GemstoneConfig, SavedRingDesign } from './ring-design';

/**
 * Request body for creating a new ring design
 * POST /api/ring-designs
 */
export interface CreateRingDesignRequest {
  templateId: string;
  metal: {
    fineness: number;
    color: string;
  };
  gemstone?: {
    type: string;
    size: string;
  } | null;
  name?: string;
}

/**
 * Response from creating a ring design
 */
export interface CreateRingDesignResponse {
  id: string;
  userId: string;
  templateId: string;
  metal: MetalConfig;
  gemstone: GemstoneConfig | null;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Response from getting all user's ring designs
 * GET /api/ring-designs
 */
export interface GetRingDesignsResponse {
  designs: SavedRingDesign[];
  total: number;
}

/**
 * Response from getting a single ring design
 * GET /api/ring-designs/:id
 */
export interface GetRingDesignResponse extends SavedRingDesign {}

/**
 * Response from deleting a ring design
 * DELETE /api/ring-designs/:id
 */
export interface DeleteRingDesignResponse {
  success: boolean;
}

/**
 * Response from getting available templates
 * GET /api/templates
 */
export interface GetTemplatesResponse {
  templates: Array<{
    id: string;
    name: string;
    description: string;
    previewImage: string;
  }>;
}
