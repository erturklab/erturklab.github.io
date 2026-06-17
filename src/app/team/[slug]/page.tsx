import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamProfile } from "@/components/ui/team-profile";
import { formatFullName, getPageTeamMembers, getTeamMember } from "@/lib/team";

export function generateStaticParams() {
  return getPageTeamMembers().map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);

  if (!member || member.profileTier !== "page") {
    return { title: "Team member" };
  }

  return {
    title: formatFullName(member),
    description: member.bio,
  };
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = getTeamMember(slug);

  if (!member || member.profileTier !== "page") {
    notFound();
  }

  return <TeamProfile member={member} />;
}
