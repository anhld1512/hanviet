-- Users may update their own profile (display name, onboarding answers...), but
-- subscription and quota columns are writable only with the service role
-- (server API routes). Without this, any signed-in user could set is_pro = true
-- from the browser console.
--
-- Run AFTER deploying the code that writes quota columns via the admin client.

CREATE OR REPLACE FUNCTION protect_profile_columns()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- auth.role() is 'service_role' for server routes, NULL for SQL editor / migrations
  IF coalesce(auth.role(), 'service_role') = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.subscription_tier := 'free';
    NEW.is_pro            := false;
    NEW.pro_expires_at    := NULL;
    NEW.subscription_plan := 'free';
    NEW.bonus_gradings    := 0;
    NEW.monthly_gradings  := 0;
    NEW.grading_month     := NULL;
    NEW.monthly_prompts   := 0;
    NEW.prompt_month      := NULL;
  ELSE
    NEW.subscription_tier := OLD.subscription_tier;
    NEW.is_pro            := OLD.is_pro;
    NEW.pro_expires_at    := OLD.pro_expires_at;
    NEW.subscription_plan := OLD.subscription_plan;
    NEW.bonus_gradings    := OLD.bonus_gradings;
    NEW.monthly_gradings  := OLD.monthly_gradings;
    NEW.grading_month     := OLD.grading_month;
    NEW.monthly_prompts   := OLD.monthly_prompts;
    NEW.prompt_month      := OLD.prompt_month;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_profile_columns ON user_profiles;
CREATE TRIGGER protect_profile_columns
  BEFORE INSERT OR UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION protect_profile_columns();

-- Voucher tables are only touched by server routes (service role bypasses RLS).
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_redemptions ENABLE ROW LEVEL SECURITY;
