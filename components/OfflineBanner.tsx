'use client';

import { useOffline } from 'next/offline';

export default function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className="fixed top-0 inset-x-0 z-[60] text-center text-xs font-semibold py-2 px-4 text-amber-100"
      style={{
        background: 'linear-gradient(90deg, #78350f, #92400e, #78350f)',
        borderBottom: '1px solid rgba(251,191,36,0.35)',
      }}
    >
      📡 오프라인 상태입니다 · 기본 화면과 카드 선택은 계속 사용할 수 있어요. AI 해석은 인터넷 연결 후 가능합니다.
    </div>
  );
}
