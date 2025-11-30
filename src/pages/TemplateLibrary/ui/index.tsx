import { Sidebar } from "@shared/ui/sidebar";
import { Roles } from "./Roles";
import { ComMembers } from "./ComMembers";
import { useCommissionMembers } from "@features/template-library/hooks/useCommissionMembers";

export const TemplateLibrary = () => {
  // Один источник правды
  const membersState = useCommissionMembers();

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 w-full border-l border-gray-200 p-6 space-y-6">
        <Roles membersState={membersState} />
        <ComMembers membersState={membersState} />
      </main>
    </div>
  );
};
