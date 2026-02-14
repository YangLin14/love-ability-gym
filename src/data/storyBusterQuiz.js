/**
 * 故事粉碎機題庫 (Story Buster Quiz Database)
 * 
 * 設計邏輯:
 * - 事實 (Fact): 攝像機可以拍到的、法庭上可以作證的、不帶形容詞的客觀描述
 * - 故事 (Story): 主觀推論、形容詞、讀心術、對未來的預測、對意圖的揣測
 * 
 * 分類:
 * - behavior_intent: 行為 vs 意圖
 * - adjective_data: 形容詞 vs 數據
 * - future_present: 預測未來 vs 當下狀態
 * - self_attack: 自我攻擊
 * - advanced: 高級陷阱題
 */

export const storyBusterQuiz = [
  // ============================================
  // 第一組：行為 vs 意圖 (最常見的坑)
  // ============================================
  {
    id: 1,
    category: "behavior_intent",
    question_zh: "他不愛我了。",
    question_en: "He doesn't love me anymore.",
    is_fact: false,
    explanation_zh: "攝像機拍不到「愛不愛」，只能拍到行為。事實可能是「他沒有說早安」。",
    explanation_en: "A camera can't capture 'love'. It can only capture behaviors. The fact might be 'He didn't say good morning.'"
  },
  {
    id: 2,
    category: "behavior_intent",
    question_zh: "他早上出門沒有親我。",
    question_en: "He left this morning without kissing me.",
    is_fact: true,
    explanation_zh: "正確。這是一個客觀發生的動作（或未發生的動作）。",
    explanation_en: "Correct. This is an objective action (or lack of action) that occurred."
  },
  {
    id: 3,
    category: "behavior_intent",
    question_zh: "他故意氣我。",
    question_en: "He's trying to upset me on purpose.",
    is_fact: false,
    explanation_zh: "「故意」是你對他動機的猜測。事實是「他做了一件我不喜歡的事」。",
    explanation_en: "'On purpose' is your guess about his intention. The fact is 'He did something I don't like.'"
  },
  {
    id: 4,
    category: "behavior_intent",
    question_zh: "他把襪子丟在地上。",
    question_en: "He left his socks on the floor.",
    is_fact: true,
    explanation_zh: "沒錯，這是一個可觀察的物理現象。",
    explanation_en: "Correct, this is an observable physical phenomenon."
  },
  {
    id: 5,
    category: "behavior_intent",
    question_zh: "他不尊重我。",
    question_en: "He doesn't respect me.",
    is_fact: false,
    explanation_zh: "「尊重」是一個抽象概念。事實可能是「他說話時打斷了我」。",
    explanation_en: "'Respect' is an abstract concept. The fact might be 'He interrupted me while I was speaking.'"
  },
  {
    id: 6,
    category: "behavior_intent",
    question_zh: "他說話很大聲。",
    question_en: "He spoke loudly.",
    is_fact: true,
    explanation_zh: "雖然「大聲」有主觀成分，但在這裡通常被視為對物理音量的描述，接近事實。",
    explanation_en: "While 'loudly' has a subjective element, it's generally considered a description of physical volume, close to fact."
  },
  {
    id: 7,
    category: "behavior_intent",
    question_zh: "他對我很冷漠。",
    question_en: "He's being cold to me.",
    is_fact: false,
    explanation_zh: "「冷漠」是形容詞。事實是「他回家後只說了兩個字」。",
    explanation_en: "'Cold' is an adjective. The fact is 'He only said two words after coming home.'"
  },
  {
    id: 8,
    category: "behavior_intent",
    question_zh: "他今天沒回我訊息。",
    question_en: "He didn't reply to my message today.",
    is_fact: true,
    explanation_zh: "賓果。這是一個可驗證的數據。",
    explanation_en: "Bingo. This is verifiable data."
  },
  {
    id: 9,
    category: "behavior_intent",
    question_zh: "他覺得我很煩。",
    question_en: "He thinks I'm annoying.",
    is_fact: false,
    explanation_zh: "你又在讀心了！事實是「他皺了眉頭」或「他嘆了一口氣」。",
    explanation_en: "You're mind-reading again! The fact is 'He frowned' or 'He sighed.'"
  },
  {
    id: 10,
    category: "behavior_intent",
    question_zh: "他嘆了一口氣。",
    question_en: "He sighed.",
    is_fact: true,
    explanation_zh: "正確，這是一個生理動作。",
    explanation_en: "Correct, this is a physiological action."
  },

  // ============================================
  // 第二組：形容詞 vs 數據 (量化訓練)
  // ============================================
  {
    id: 11,
    category: "adjective_data",
    question_zh: "你總是遲到。",
    question_en: "You're always late.",
    is_fact: false,
    explanation_zh: "「總是」是誇飾法。事實是「你這週遲到了兩次」。",
    explanation_en: "'Always' is an exaggeration. The fact is 'You were late twice this week.'"
  },
  {
    id: 12,
    category: "adjective_data",
    question_zh: "你這週遲到了兩次。",
    question_en: "You were late twice this week.",
    is_fact: true,
    explanation_zh: "正確，這是數據。",
    explanation_en: "Correct, this is data."
  },
  {
    id: 13,
    category: "adjective_data",
    question_zh: "你從來不關心我。",
    question_en: "You never care about me.",
    is_fact: false,
    explanation_zh: "「從來」絕對是故事。事實是「我很希望你問問我今天過得怎麼樣」。",
    explanation_en: "'Never' is definitely a story. The fact is 'I wish you would ask me how my day was.'"
  },
  {
    id: 14,
    category: "adjective_data",
    question_zh: "你是個自私的人。",
    question_en: "You're a selfish person.",
    is_fact: false,
    explanation_zh: "這是貼標籤 (Labeling)。事實是「你只買了自己的晚餐」。",
    explanation_en: "This is labeling. The fact is 'You only bought dinner for yourself.'"
  },
  {
    id: 15,
    category: "adjective_data",
    question_zh: "你只買了自己的晚餐，沒買我的。",
    question_en: "You only bought dinner for yourself, not for me.",
    is_fact: true,
    explanation_zh: "對，這是客觀陳述。",
    explanation_en: "Yes, this is an objective statement."
  },
  {
    id: 16,
    category: "adjective_data",
    question_zh: "家裡亂得像豬窩。",
    question_en: "The house is a pigsty.",
    is_fact: false,
    explanation_zh: "「豬窩」是比喻。事實是「地板上有 5 件衣服和 3 個空瓶子」。",
    explanation_en: "'Pigsty' is a metaphor. The fact is 'There are 5 pieces of clothing and 3 empty bottles on the floor.'"
  },
  {
    id: 17,
    category: "adjective_data",
    question_zh: "地板上有 5 件衣服。",
    question_en: "There are 5 pieces of clothing on the floor.",
    is_fact: true,
    explanation_zh: "非常精確的事實。",
    explanation_en: "A very precise fact."
  },
  {
    id: 18,
    category: "adjective_data",
    question_zh: "你花錢大手大腳。",
    question_en: "You spend money recklessly.",
    is_fact: false,
    explanation_zh: "這是評論。事實是「你買了一個 5000 元的包包」。",
    explanation_en: "This is a judgment. The fact is 'You bought a $5000 handbag.'"
  },
  {
    id: 19,
    category: "adjective_data",
    question_zh: "你買了一個 5000 元的包包。",
    question_en: "You bought a $5000 handbag.",
    is_fact: true,
    explanation_zh: "是的，這是帳單上的數字。",
    explanation_en: "Yes, this is a number on a receipt."
  },
  {
    id: 20,
    category: "adjective_data",
    question_zh: "你很懶惰。",
    question_en: "You're lazy.",
    is_fact: false,
    explanation_zh: "這是性格評判。事實是「你今天在沙發上躺了 4 個小時」。",
    explanation_en: "This is a character judgment. The fact is 'You lay on the sofa for 4 hours today.'"
  },

  // ============================================
  // 第三組：預測未來 vs 當下狀態 (焦慮粉碎機)
  // ============================================
  {
    id: 21,
    category: "future_present",
    question_zh: "我們會分手的。",
    question_en: "We're going to break up.",
    is_fact: false,
    explanation_zh: "這是對未來的恐懼預測，還沒發生。",
    explanation_en: "This is a fear-based prediction about the future. It hasn't happened."
  },
  {
    id: 22,
    category: "future_present",
    question_zh: "他現在不想跟我說話。",
    question_en: "He doesn't want to talk to me right now.",
    is_fact: false,
    explanation_zh: "這是讀心。事實是「他現在戴著耳機」。",
    explanation_en: "This is mind-reading. The fact is 'He's wearing headphones right now.'"
  },
  {
    id: 23,
    category: "future_present",
    question_zh: "他戴著耳機。",
    question_en: "He's wearing headphones.",
    is_fact: true,
    explanation_zh: "看得到的動作。",
    explanation_en: "A visible action."
  },
  {
    id: 24,
    category: "future_present",
    question_zh: "他肯定是在跟別的女生聊天。",
    question_en: "He's definitely chatting with another woman.",
    is_fact: false,
    explanation_zh: "這是純粹的幻想。事實是「他在看手機螢幕」。",
    explanation_en: "This is pure imagination. The fact is 'He's looking at his phone screen.'"
  },
  {
    id: 25,
    category: "future_present",
    question_zh: "他在看手機螢幕，並且在笑。",
    question_en: "He's looking at his phone and smiling.",
    is_fact: true,
    explanation_zh: "這是觀察到的現象，不帶解讀。",
    explanation_en: "This is an observed phenomenon without interpretation."
  },
  {
    id: 26,
    category: "future_present",
    question_zh: "這種日子沒法過了。",
    question_en: "I can't live like this anymore.",
    is_fact: false,
    explanation_zh: "這是絕望的感慨。事實是「我們剛剛吵架了」。",
    explanation_en: "This is a despairing sentiment. The fact is 'We just had an argument.'"
  },
  {
    id: 27,
    category: "future_present",
    question_zh: "我們剛剛吵架了。",
    question_en: "We just had an argument.",
    is_fact: true,
    explanation_zh: "發生過的事件。",
    explanation_en: "An event that occurred."
  },
  {
    id: 28,
    category: "future_present",
    question_zh: "他變了。",
    question_en: "He's changed.",
    is_fact: false,
    explanation_zh: "這是比較和判斷。事實是「他以前每天打電話，現在每週打一次」。",
    explanation_en: "This is a comparison and judgment. The fact is 'He used to call daily, now he calls once a week.'"
  },
  {
    id: 29,
    category: "future_present",
    question_zh: "他每週打一次電話。",
    question_en: "He calls once a week.",
    is_fact: true,
    explanation_zh: "頻率統計，是事實。",
    explanation_en: "Frequency statistics, this is a fact."
  },
  {
    id: 30,
    category: "future_present",
    question_zh: "他不在乎這個家。",
    question_en: "He doesn't care about this family.",
    is_fact: false,
    explanation_zh: "意圖揣測。事實是「他連續三天加班到 10 點」。",
    explanation_en: "Intention speculation. The fact is 'He worked overtime until 10pm for three days straight.'"
  },

  // ============================================
  // 第四組：自我攻擊 (羞恥粉碎機)
  // ============================================
  {
    id: 31,
    category: "self_attack",
    question_zh: "我很糟糕。",
    question_en: "I'm terrible.",
    is_fact: false,
    explanation_zh: "這是自我評判。事實是「我搞砸了這件事」。",
    explanation_en: "This is self-judgment. The fact is 'I messed up this task.'"
  },
  {
    id: 32,
    category: "self_attack",
    question_zh: "我把菜燒焦了。",
    question_en: "I burned the food.",
    is_fact: true,
    explanation_zh: "客觀結果。",
    explanation_en: "An objective result."
  },
  {
    id: 33,
    category: "self_attack",
    question_zh: "沒人會喜歡我。",
    question_en: "No one will ever like me.",
    is_fact: false,
    explanation_zh: "絕對化的未來預測。事實是「我現在單身」。",
    explanation_en: "An absolute prediction about the future. The fact is 'I'm currently single.'"
  },
  {
    id: 34,
    category: "self_attack",
    question_zh: "我現在單身。",
    question_en: "I'm currently single.",
    is_fact: true,
    explanation_zh: "身份狀態描述。",
    explanation_en: "A description of relationship status."
  },
  {
    id: 35,
    category: "self_attack",
    question_zh: "我是個失敗的伴侶。",
    question_en: "I'm a failed partner.",
    is_fact: false,
    explanation_zh: "身份標籤。事實是「我忘記了他的生日」。",
    explanation_en: "An identity label. The fact is 'I forgot their birthday.'"
  },
  {
    id: 36,
    category: "self_attack",
    question_zh: "我忘記了他的生日。",
    question_en: "I forgot their birthday.",
    is_fact: true,
    explanation_zh: "記憶失誤的事件。",
    explanation_en: "An event of memory lapse."
  },
  {
    id: 37,
    category: "self_attack",
    question_zh: "我很胖。",
    question_en: "I'm fat.",
    is_fact: false,
    explanation_zh: "「胖」是形容詞。事實是「我的體重是 70 公斤」或「我的 BMI 是 26」。",
    explanation_en: "'Fat' is an adjective. The fact is 'My weight is 70kg' or 'My BMI is 26.'"
  },
  {
    id: 38,
    category: "self_attack",
    question_zh: "我的體重是 70 公斤。",
    question_en: "My weight is 70kg.",
    is_fact: true,
    explanation_zh: "測量數據。",
    explanation_en: "Measurement data."
  },
  {
    id: 39,
    category: "self_attack",
    question_zh: "我配不上他。",
    question_en: "I don't deserve them.",
    is_fact: false,
    explanation_zh: "價值判斷。事實是「他學歷比我高」或「他賺得比我多」。",
    explanation_en: "A value judgment. The fact is 'They have a higher degree' or 'They earn more.'"
  },
  {
    id: 40,
    category: "self_attack",
    question_zh: "他月薪比我高 2 萬。",
    question_en: "Their monthly salary is $20,000 higher than mine.",
    is_fact: true,
    explanation_zh: "數字比較。",
    explanation_en: "A numerical comparison."
  },

  // ============================================
  // 第五組：高級陷阱題 (那些聽起來像事實的故事)
  // ============================================
  {
    id: 41,
    category: "advanced",
    question_zh: "他對我不耐煩。",
    question_en: "He's impatient with me.",
    is_fact: false,
    explanation_zh: "「不耐煩」是你對他語氣的解讀。事實是「他語速變快，並打斷了我」。",
    explanation_en: "'Impatient' is your interpretation of his tone. The fact is 'He spoke faster and interrupted me.'"
  },
  {
    id: 42,
    category: "advanced",
    question_zh: "他打斷了我說話。",
    question_en: "He interrupted me.",
    is_fact: true,
    explanation_zh: "這是對話交互的動作。",
    explanation_en: "This is a conversational action."
  },
  {
    id: 43,
    category: "advanced",
    question_zh: "他吼了我。",
    question_en: "He yelled at me.",
    is_fact: true,
    explanation_zh: "如果定義為「大聲說話」，這是事實。",
    explanation_en: "If defined as 'speaking loudly', this is a fact."
  },
  {
    id: 44,
    category: "advanced",
    question_zh: "他攻擊我。",
    question_en: "He attacked me.",
    is_fact: false,
    explanation_zh: "「攻擊」是意圖。事實是「他說我很笨」。",
    explanation_en: "'Attack' implies intent. The fact is 'He said I was stupid.'"
  },
  {
    id: 45,
    category: "advanced",
    question_zh: "他說我很笨。",
    question_en: "He said I was stupid.",
    is_fact: true,
    explanation_zh: "這是引用他說的話 (Quotation)，所以是事實。",
    explanation_en: "This is a quotation of what he said, so it's a fact."
  },
  {
    id: 46,
    category: "advanced",
    question_zh: "他讓我生氣。",
    question_en: "He made me angry.",
    is_fact: false,
    explanation_zh: "這是因果歸因。沒人能「讓」你生氣，是你對他的行為產生了看法。事實是「我感到生氣」。",
    explanation_en: "This is causal attribution. No one can 'make' you angry. The fact is 'I feel angry.'"
  },
  {
    id: 47,
    category: "advanced",
    question_zh: "我感到生氣。",
    question_en: "I feel angry.",
    is_fact: true,
    explanation_zh: "重點！你的感受 (Feeling) 對你來說是絕對的事實。",
    explanation_en: "Key point! Your feeling is an absolute fact for you."
  },
  {
    id: 48,
    category: "advanced",
    question_zh: "他應該知道我在想什麼。",
    question_en: "He should know what I'm thinking.",
    is_fact: false,
    explanation_zh: "這是信念/規則 (Should statement)。事實是「我沒有告訴他我的想法」。",
    explanation_en: "This is a belief/rule (Should statement). The fact is 'I didn't tell him what I was thinking.'"
  },
  {
    id: 49,
    category: "advanced",
    question_zh: "我沒有告訴他我的想法。",
    question_en: "I didn't tell him what I was thinking.",
    is_fact: true,
    explanation_zh: "行為描述。",
    explanation_en: "A behavior description."
  },
  {
    id: 50,
    category: "advanced",
    question_zh: "這是不公平的。",
    question_en: "This is unfair.",
    is_fact: false,
    explanation_zh: "「公平」是主觀標準。事實是「我做了 80% 的家事」。",
    explanation_en: "'Fair' is a subjective standard. The fact is 'I did 80% of the housework.'"
  }
];

// Helper functions
export const getRandomQuestions = (count = 10, category = null) => {
  let pool = storyBusterQuiz;
  
  if (category) {
    pool = storyBusterQuiz.filter(q => q.category === category);
  }
  
  // Shuffle and pick
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getQuestionById = (id) => {
  return storyBusterQuiz.find(q => q.id === id);
};

export const getQuestionsByCategory = (category) => {
  return storyBusterQuiz.filter(q => q.category === category);
};

export const getCategoryStats = () => {
  const stats = {};
  storyBusterQuiz.forEach(q => {
    stats[q.category] = (stats[q.category] || 0) + 1;
  });
  return stats;
};

export default storyBusterQuiz;
