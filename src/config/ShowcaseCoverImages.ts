// src/config/ShowcaseCoverImages.ts
// Configuration for 3 cover images that can be uploaded via Dashboard

export interface ShowcaseCoverConfig {
  cover_image_1: string;
  cover_image_2: string;
  cover_image_3: string;
}

// Default professional portfolio cover images
// These will be replaced by merchant-uploaded images from Dashboard
export const DEFAULT_SHOWCASE_COVERS: ShowcaseCoverConfig = {
  cover_image_1: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071", // Art gallery
  cover_image_2: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080", // Creative workspace
  cover_image_3: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067", // Photography
};

/**
 * Helper function to get cover images array from config
 * Priority: merchant uploaded images → default showcase covers
 */
export function getCoverImagesArray(merchantCovers?: Partial<ShowcaseCoverConfig>): string[] {
  if (!merchantCovers) {
    return Object.values(DEFAULT_SHOWCASE_COVERS);
  }

  const covers: string[] = [];

  if (merchantCovers.cover_image_1) covers.push(merchantCovers.cover_image_1);
  if (merchantCovers.cover_image_2) covers.push(merchantCovers.cover_image_2);
  if (merchantCovers.cover_image_3) covers.push(merchantCovers.cover_image_3);

  // If no merchant covers uploaded, use defaults
  return covers.length > 0 ? covers : Object.values(DEFAULT_SHOWCASE_COVERS);
}
