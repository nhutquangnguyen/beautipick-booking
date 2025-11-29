import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/dashboard/settings/settings-form";
import { MerchantSettings, defaultSettings } from "@/types/database";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("id", user!.id)
    .single();

  const settings = (merchant?.settings as MerchantSettings) ?? defaultSettings;

  return <SettingsForm merchant={merchant!} settings={settings} />;
}
