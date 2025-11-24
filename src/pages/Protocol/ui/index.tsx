import { Card, CardContent } from "@shared/ui/card";
import { Sidebar } from "@shared/ui/sidebar";
import { Button } from "@shared/ui/button";
import { useState, useEffect } from "react";
import { useCommissionMembers } from "@features/template-library/hooks/useCommissionMembers";
import { useCommissionRoles } from "@features/template-library/hooks/useCommissionRoles";
import type { CommissionMember } from "@features/template-library/hooks/useCommissionMembers";

export const Protocol = () => {
  const { members, loading: membersLoading, error: membersError } = useCommissionMembers();
  const { roles, loading: rolesLoading } = useCommissionRoles();
  
  const [selectedMembers, setSelectedMembers] = useState<{
    chairman: string;
    deputy: string;
    secretary: string;
    other: string[];
  }>({
    chairman: "",
    deputy: "",
    secretary: "",
    other: []
  });

  // Фильтруем членов комиссии по ролям
  const getMembersByRole = (role: string): CommissionMember[] => {
    const roleMembers = roles.filter(r => r.role === role).map(r => r.member_id);
    return members.filter(member => roleMembers.includes(member.id));
  };

  const chairmanMembers = getMembersByRole("Председатель");
  const deputyMembers = getMembersByRole("Заместитель");
  const secretaryMembers = getMembersByRole("Секретарь");

  // Автоматически устанавливаем первых членов для каждой роли, если не выбраны
  useEffect(() => {
    if (chairmanMembers.length > 0 && !selectedMembers.chairman) {
      setSelectedMembers(prev => ({ ...prev, chairman: chairmanMembers[0].id }));
    }
    if (deputyMembers.length > 0 && !selectedMembers.deputy) {
      setSelectedMembers(prev => ({ ...prev, deputy: deputyMembers[0].id }));
    }
    if (secretaryMembers.length > 0 && !selectedMembers.secretary) {
      setSelectedMembers(prev => ({ ...prev, secretary: secretaryMembers[0].id }));
    }
  }, [chairmanMembers, deputyMembers, secretaryMembers]);

  const handleRoleChange = (role: keyof Pick<typeof selectedMembers, 'chairman' | 'deputy' | 'secretary'>, memberId: string) => {
    setSelectedMembers(prev => ({
      ...prev,
      [role]: memberId
    }));
  };

  const handleOtherMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => ({
      ...prev,
      other: prev.other.includes(memberId)
        ? prev.other.filter(id => id !== memberId)
        : [...prev.other, memberId]
    }));
  };

  const handleGenerateProtocol = async () => {
    try {
      const { api } = await import("@shared/api/axios");
      
      const commission_members_id = [
        selectedMembers.chairman,
        selectedMembers.deputy,
        selectedMembers.secretary,
        ...selectedMembers.other
      ].filter(id => id !== "");

      const commission_roles_id = roles.map(role => role.id);

      console.log('Данные для генерации протокола:', {
        commission_members_id,
        commission_roles_id
      });

      const response = await api.post(
        "/generate-protocol",
        {
          commission_members_id,
          commission_roles_id
        },
        { 
          responseType: 'blob'
        }
      );

      // Скачиваем файл
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `protocol_${new Date().toISOString().split('T')[0]}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      console.error('Ошибка при генерации протокола:', err);
      alert('Ошибка при генерации протокола: ' + (err.response?.data?.message || err.message));
    }
  };


  // Все члены комиссии кроме тех, кто уже выбран на основные роли
  const availableMembersForOther = members.filter(member => 
    !Object.values({
      chairman: selectedMembers.chairman,
      deputy: selectedMembers.deputy,
      secretary: selectedMembers.secretary
    }).includes(member.id)
  );

  const loading = membersLoading || rolesLoading;

  return (
    <div className="flex min-h-screen w-full max-w-[1440px] bg-white">
      <Sidebar className="hidden lg:block" />

      <main className="flex-1 border-l w-full border-gray-200 p-6 space-y-6">
        <Card className="border-none shadow-none">
          <CardContent className="space-y-6">
            {/* Обязательные роли комиссии */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Состав комиссии</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Председатель */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Председатель *
                  </label>
                  <select
                    value={selectedMembers.chairman}
                    onChange={(e) => handleRoleChange('chairman', e.target.value)}
                    disabled={loading || chairmanMembers.length === 0}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[42px] disabled:bg-gray-100"
                  >
                    {chairmanMembers.length === 0 ? (
                      <option value="">Нет доступных председателей</option>
                    ) : (
                      chairmanMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.full_name} - {member.position}
                        </option>
                      ))
                    )}
                  </select>
                  {chairmanMembers.length === 0 && (
                    <span className="text-xs text-red-500">
                      Нет членов комиссии с ролью "Председатель"
                    </span>
                  )}
                </div>

                {/* Заместитель */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Заместитель *
                  </label>
                  <select
                    value={selectedMembers.deputy}
                    onChange={(e) => handleRoleChange('deputy', e.target.value)}
                    disabled={loading || deputyMembers.length === 0}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[42px] disabled:bg-gray-100"
                  >
                    {deputyMembers.length === 0 ? (
                      <option value="">Нет доступных заместителей</option>
                    ) : (
                      deputyMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.full_name} - {member.position}
                        </option>
                      ))
                    )}
                  </select>
                  {deputyMembers.length === 0 && (
                    <span className="text-xs text-red-500">
                      Нет членов комиссии с ролью "Заместитель"
                    </span>
                  )}
                </div>

                {/* Секретарь */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    Секретарь *
                  </label>
                  <select
                    value={selectedMembers.secretary}
                    onChange={(e) => handleRoleChange('secretary', e.target.value)}
                    disabled={loading || secretaryMembers.length === 0}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-[42px] disabled:bg-gray-100"
                  >
                    {secretaryMembers.length === 0 ? (
                      <option value="">Нет доступных секретарей</option>
                    ) : (
                      secretaryMembers.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.full_name} - {member.position}
                        </option>
                      ))
                    )}
                  </select>
                  {secretaryMembers.length === 0 && (
                    <span className="text-xs text-red-500">
                      Нет членов комиссии с ролью "Секретарь"
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Другие члены комиссии */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Другие члены комиссии</h3>
              
              <div className="p-4 border border-gray-200 rounded-lg max-h-64 overflow-y-auto space-y-2">
                {loading ? (
                  <p className="text-sm text-gray-500 text-center py-4">Загрузка членов комиссии...</p>
                ) : availableMembersForOther.length > 0 ? (
                  availableMembersForOther.map(member => (
                    <div key={member.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedMembers.other.includes(member.id)}
                        onChange={() => handleOtherMemberToggle(member.id)}
                        className="w-4 h-4 text-blue-400 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-800">
                        {member.full_name} - {member.position}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Все члены комиссии уже выбраны на роли
                  </p>
                )}
              </div>
            </div>

            {/* Информация о выбранных членах */}
            {(selectedMembers.chairman || selectedMembers.deputy || selectedMembers.secretary || selectedMembers.other.length > 0) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Выбранный состав комиссии:</h4>
                <div className="space-y-1 text-sm">
                  {selectedMembers.chairman && (
                    <div>
                      <span className="text-gray-600">Председатель:</span>{" "}
                      <span className="font-medium">
                        {members.find(m => m.id === selectedMembers.chairman)?.full_name}
                      </span>
                    </div>
                  )}
                  {selectedMembers.deputy && (
                    <div>
                      <span className="text-gray-600">Заместитель:</span>{" "}
                      <span className="font-medium">
                        {members.find(m => m.id === selectedMembers.deputy)?.full_name}
                      </span>
                    </div>
                  )}
                  {selectedMembers.secretary && (
                    <div>
                      <span className="text-gray-600">Секретарь:</span>{" "}
                      <span className="font-medium">
                        {members.find(m => m.id === selectedMembers.secretary)?.full_name}
                      </span>
                    </div>
                  )}
                  {selectedMembers.other.length > 0 && (
                    <div>
                      <span className="text-gray-600">Члены комиссии:</span>{" "}
                      <span className="font-medium">
                        {selectedMembers.other.map(id => 
                          members.find(m => m.id === id)?.full_name
                        ).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            <div>
              <Button 
                onClick={handleGenerateProtocol}
                disabled={!selectedMembers.chairman || !selectedMembers.deputy || !selectedMembers.secretary}
                variant="cube"
                className="w-full"
              >
                Сформировать протокол
              </Button>
            </div>

            {/* Ошибки */}
            {membersError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Ошибка загрузки членов комиссии:</strong> {membersError}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};