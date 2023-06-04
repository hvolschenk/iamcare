export const mimeTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

type MimeType = (typeof mimeTypes)[number];

export interface Image {
  id: number;
  mimeType: MimeType;
  name: string;
  sizeBytes: number;
  url: string;
}
