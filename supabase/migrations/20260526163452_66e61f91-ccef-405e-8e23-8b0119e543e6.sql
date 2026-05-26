-- Add access_token column to appointments table
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS access_token VARCHAR(64) UNIQUE;

-- Create an index for faster lookup
CREATE INDEX IF NOT EXISTS idx_appointments_access_token ON public.appointments (access_token);

-- Update RLS policies to allow public access via token
-- Check if the table already has RLS enabled
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to SELECT an appointment if they have the correct access_token
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'appointments' 
        AND policyname = 'Allow public access via access_token'
    ) THEN
        CREATE POLICY "Allow public access via access_token" 
        ON public.appointments 
        FOR SELECT 
        TO anon, authenticated
        USING (access_token IS NOT NULL);
    END IF;
END $$;

-- Also allow service_role all access (should already be there but good to ensure)
GRANT ALL ON public.appointments TO service_role;
GRANT SELECT ON public.appointments TO anon;
GRANT SELECT ON public.appointments TO authenticated;
