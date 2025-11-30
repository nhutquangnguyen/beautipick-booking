import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SocialLinksManager } from "@/components/dashboard/social-links/social-links-manager";
import { SocialLink, defaultSocialLinks } from "@/types/database";

export default async function MyPageLinksPage() {
  const t = await getTranslations("myPage.links");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("social_links")
    .eq("id", user.id)
    .single();

  const socialLinks = (merchant?.social_links as SocialLink[]) ?? defaultSocialLinks;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <SocialLinksManager merchantId={user.id} socialLinks={socialLinks} />
    </div>
  );
}
