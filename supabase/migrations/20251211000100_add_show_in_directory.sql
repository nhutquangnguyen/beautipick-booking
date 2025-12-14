-- Add show_in_directory column to merchants table
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS show_in_directory BOOLEAN DEFAULT true;

-- Update existing merchants to show in directory by default
UPDATE merchants SET show_in_directory = true WHERE show_in_directory IS NULL;

-- Add comment
COMMENT ON COLUMN merchants.show_in_directory IS 'Controls whether merchant appears in public directory listing at beautipick.com';
