export const nickNameGenerator = () => {
  const names = [
    '여행가방',
    '닉네임 예시',
    '재패니즈 라이프',
    '베트남 쌀국수',
    '꿔바로우가 좋아',
    '영프독',
    '샌프란시스코',
    '뉴욕',
    '호주는 지금 낮',
    '베버리힐스',
  ];
  return names[Math.floor(Math.random() * names.length)];
};
