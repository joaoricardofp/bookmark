export type Bookmark = {
  id: string;
  user_id: string;
  collection_id: string | null;
  title: string;
  url: string;
  description: string | null;
  favicon: string | null;
  og_image: string | null;
  is_favorite: boolean;
  is_public: boolean;
  click_count: number;
  order: number;
  created_at: string;
  updated_at: string;
};
