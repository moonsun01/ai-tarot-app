export interface ArcanaCard {
  name: string;
  korean: string;
  keyword: string;
  meaning: string;
}

export const CARD_SYMBOLS = ['✦', '☽', '★', '◈', '⬡', '✧', '⊕', '⋆'];

export const ARCANA: ArcanaCard[] = [
  { name: 'The Fool',           korean: '바보',            keyword: '새로운 시작',   meaning: '두려움 없이 새로운 여정을 시작할 준비가 되어 있습니다. 순수한 가능성이 눈앞에 펼쳐집니다.' },
  { name: 'The Magician',       korean: '마법사',          keyword: '의지와 창조',   meaning: '당신 안에 모든 도구가 갖춰져 있습니다. 집중력과 의지로 원하는 것을 현실로 만들 수 있습니다.' },
  { name: 'The High Priestess', korean: '여사제',          keyword: '직관과 신비',   meaning: '겉으로 드러나지 않은 진실이 있습니다. 내면의 목소리에 귀 기울이세요.' },
  { name: 'The Empress',        korean: '여황제',          keyword: '풍요와 창조',   meaning: '풍성함과 따뜻함이 넘칩니다. 씨앗을 뿌리면 반드시 열매를 맺을 시기입니다.' },
  { name: 'The Emperor',        korean: '황제',            keyword: '권위와 안정',   meaning: '강한 의지와 구조가 필요합니다. 체계를 세우면 원하는 목표에 도달할 수 있습니다.' },
  { name: 'The Hierophant',     korean: '교황',            keyword: '전통과 가르침', meaning: '검증된 방법과 조언을 따르는 것이 현명합니다. 멘토의 역할이 중요합니다.' },
  { name: 'The Lovers',         korean: '연인',            keyword: '사랑과 선택',   meaning: '중요한 선택의 기로에 서 있습니다. 마음이 이끄는 방향이 진정한 답입니다.' },
  { name: 'The Chariot',        korean: '전차',            keyword: '승리와 추진력', meaning: '강한 의지로 앞으로 나아가세요. 장애물을 극복하는 힘이 당신에게 있습니다.' },
  { name: 'Strength',           korean: '힘',              keyword: '용기와 인내',   meaning: '외적 힘보다 내면의 용기가 빛을 발합니다. 부드러운 인내로 어려움을 이겨냅니다.' },
  { name: 'The Hermit',         korean: '은둔자',          keyword: '내면 탐구',     meaning: '혼자만의 시간이 필요합니다. 내면을 들여다볼 때 진정한 해답을 얻을 수 있습니다.' },
  { name: 'Wheel of Fortune',   korean: '운명의 수레바퀴', keyword: '운명과 전환',   meaning: '사이클이 바뀌는 시점입니다. 변화의 흐름을 받아들이면 행운이 찾아옵니다.' },
  { name: 'Justice',            korean: '정의',            keyword: '공정과 균형',   meaning: '균형이 중요한 시기입니다. 정직하고 공정하게 행동하면 좋은 결과가 따라옵니다.' },
  { name: 'The Hanged Man',     korean: '매달린 사람',     keyword: '관점의 전환',   meaning: '기다림과 희생이 필요합니다. 다른 시각으로 보면 새로운 해결책이 보입니다.' },
  { name: 'Death',              korean: '죽음',            keyword: '변화와 재생',   meaning: '낡은 것이 끝나고 새로운 것이 시작됩니다. 두려워하지 마세요, 이것은 성장입니다.' },
  { name: 'Temperance',         korean: '절제',            keyword: '조화와 균형',   meaning: '극단을 피하고 균형을 유지하세요. 인내와 조화가 최선의 결과를 만들어냅니다.' },
  { name: 'The Devil',          korean: '악마',            keyword: '속박과 유혹',   meaning: '스스로를 가두는 생각이나 습관을 경계하세요. 자유는 당신 손에 달려 있습니다.' },
  { name: 'The Tower',          korean: '탑',              keyword: '급변과 해방',   meaning: '갑작스러운 변화가 찾아올 수 있습니다. 흔들리지 마세요, 이 과정 끝에 해방이 있습니다.' },
  { name: 'The Star',           korean: '별',              keyword: '희망과 치유',   meaning: '어둠 속에서도 별빛이 빛납니다. 희망을 잃지 마세요, 치유와 회복의 시기입니다.' },
  { name: 'The Moon',           korean: '달',              keyword: '환상과 직관',   meaning: '불확실함이 있을 수 있습니다. 직관을 믿고 감정의 흐름을 따라가세요.' },
  { name: 'The Sun',            korean: '태양',            keyword: '기쁨과 성공',   meaning: '밝고 긍정적인 에너지가 넘칩니다. 성공과 행복이 가까이에 있으니 자신감을 가지세요.' },
  { name: 'Judgement',          korean: '심판',            keyword: '각성과 부름',   meaning: '새로운 소명이 당신을 부르고 있습니다. 과거를 용서하고 더 높은 목적으로 나아가세요.' },
  { name: 'The World',          korean: '세계',            keyword: '완성과 통합',   meaning: '하나의 중요한 사이클이 완성되었습니다. 성취감과 함께 새로운 시작을 준비하세요.' },
];
