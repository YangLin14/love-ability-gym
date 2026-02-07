export const vocabularyData = [
  {
    id: 'nagging',
    bad_phrase: "你怎麼這麼笨",
    alternatives: [
      { text: "我感到很著急，因為這件事對我很重要", reason: "表達焦慮而非貶低", isCorrect: true },
      { text: "我希望我們能一起把這件事做好", reason: "表達合作意願", isCorrect: true },
      { text: "你到底有沒有在聽", reason: "這是指責", isCorrect: false }
    ]
  },
  {
    id: 'always',
    bad_phrase: "你總是遲到",
    alternatives: [
      { text: "我等了20分鐘，我感到有些焦慮", reason: "陳述事實 + 感受", isCorrect: true },
      { text: "下次能不能準時一點？", reason: "具體請求", isCorrect: true },
      { text: "你就是不在乎我", reason: "過度解讀", isCorrect: false }
    ]
  },
  {
    id: 'lazy',
    bad_phrase: "你真懶",
    alternatives: [
      { text: "我看到家務還沒做", reason: "客觀事實", isCorrect: true },
      { text: "我需要幫忙", reason: "直接表達需求", isCorrect: true },
      { text: "這裡就像豬窩一樣", reason: "攻擊性語言", isCorrect: false }
    ]
  }
];
