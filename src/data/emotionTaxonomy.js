/**
 * 愛的能力健身房：情緒高解析度詞庫 (Emotion Taxonomy)
 * 
 * 設計邏輯:
 * - 6 大主類 (Primary Emotions): 憤怒、悲傷、恐懼、厭惡、羞恥、喜悅
 * - 60 個細分詞 (Granular Emotions): 幫助用戶精確定位感受
 * - 需求映射 (Need Mapping): 每個負面情緒都指向一個未被滿足的心理需求
 */

export const emotionTaxonomy = [
  // ============================================
  // 1. 憤怒類 (Anger) - 能量向外攻擊
  // ============================================
  {
    category: "Anger",
    category_zh: "憤怒",
    color: "#FF6B6B",
    icon: "🔥",
    description: "能量向外攻擊",
    description_en: "Energy directed outward",
    core_definition: "當邊界被侵犯，或目標被阻礙時的反應",
    core_definition_en: "Response when boundaries are violated or goals are blocked",
    emotions: [
      { id: "ang_01", name_zh: "煩躁", name_en: "Annoyed", definition: "因重複的干擾或小事不順而感到微怒。", definition_en: "Mild anger from repeated disturbances or minor setbacks.", need: "秩序感、空間、寧靜", need_en: "Order, space, tranquility", intensity: 3 },
      { id: "ang_02", name_zh: "挫折", name_en: "Frustrated", definition: "付出努力卻沒有得到預期結果，感到受阻。", definition_en: "Feeling blocked when effort doesn't yield expected results.", need: "成就感、進展、效能", need_en: "Achievement, progress, effectiveness", intensity: 5 },
      { id: "ang_03", name_zh: "不耐煩", name_en: "Impatient", definition: "覺得時間被浪費，或是事情進展太慢。", definition_en: "Feeling that time is wasted or things are moving too slowly.", need: "效率、節奏掌控", need_en: "Efficiency, pace control", intensity: 4 },
      { id: "ang_04", name_zh: "被冒犯", name_en: "Offended", definition: "感到自尊或價值觀受到輕視或攻擊。", definition_en: "Feeling that self-esteem or values are being dismissed or attacked.", need: "尊重、認可", need_en: "Respect, recognition", intensity: 6 },
      { id: "ang_05", name_zh: "怨恨", name_en: "Resentful", definition: "長期感到不公平對待，累積的怒氣。", definition_en: "Accumulated anger from long-term unfair treatment.", need: "公平、被看見、補償", need_en: "Fairness, being seen, compensation", intensity: 7 },
      { id: "ang_06", name_zh: "嫉妒", name_en: "Jealous", definition: "擔心失去重要的人或關係，對潛在威脅感到憤怒。", definition_en: "Anger from fear of losing an important person or relationship.", need: "安全感、獨佔性、重要性", need_en: "Security, exclusivity, importance", intensity: 8 },
      { id: "ang_07", name_zh: "敵意", name_en: "Hostile", definition: "對某人持有強烈的對抗心態，想攻擊對方。", definition_en: "Strong antagonistic attitude toward someone, wanting to attack.", need: "安全邊界、自我保護", need_en: "Safe boundaries, self-protection", intensity: 9 },
      { id: "ang_08", name_zh: "暴怒", name_en: "Furious", definition: "失控的憤怒，有破壞衝動。", definition_en: "Uncontrollable anger with destructive impulses.", need: "釋放、絕對的控制", need_en: "Release, absolute control", intensity: 10 },
      { id: "ang_09", name_zh: "被利用", name_en: "Used", definition: "覺得自己的善意被當作理所當然。", definition_en: "Feeling that your kindness is taken for granted.", need: "互惠、珍惜", need_en: "Reciprocity, appreciation", intensity: 6 },
      { id: "ang_10", name_zh: "憤世嫉俗", name_en: "Cynical", definition: "對人性或關係感到失望，進而轉為攻擊性的懷疑。", definition_en: "Disappointment in humanity turning into aggressive skepticism.", need: "信任、真誠", need_en: "Trust, authenticity", intensity: 5 }
    ]
  },

  // ============================================
  // 2. 悲傷類 (Sadness) - 能量向內撤退
  // ============================================
  {
    category: "Sadness",
    category_zh: "悲傷",
    color: "#5C7AEA",
    icon: "💧",
    description: "能量向內撤退",
    description_en: "Energy withdrawing inward",
    core_definition: "面對失落、分離或無力感時的反應",
    core_definition_en: "Response to loss, separation, or powerlessness",
    emotions: [
      { id: "sad_01", name_zh: "失落", name_en: "Lost", definition: "失去了某種連結或方向感。", definition_en: "Losing a sense of connection or direction.", need: "指引、目標", need_en: "Guidance, purpose", intensity: 4 },
      { id: "sad_02", name_zh: "孤單", name_en: "Lonely", definition: "渴望連結卻得不到，感到與世隔絕。", definition_en: "Craving connection but feeling isolated from the world.", need: "親密感、歸屬感、陪伴", need_en: "Intimacy, belonging, companionship", intensity: 6 },
      { id: "sad_03", name_zh: "受傷", name_en: "Hurt", definition: "感到被重要的人情感上刺痛。", definition_en: "Feeling emotionally wounded by someone important.", need: "呵護、溫柔", need_en: "Care, gentleness", intensity: 7 },
      { id: "sad_04", name_zh: "失望", name_en: "Disappointed", definition: "期待落空，感到心情低落。", definition_en: "Expectations unmet, feeling let down.", need: "可靠性、一致性", need_en: "Reliability, consistency", intensity: 5 },
      { id: "sad_05", name_zh: "無力", name_en: "Powerless", definition: "覺得自己無論做什麼都無法改變現狀。", definition_en: "Feeling that nothing you do can change the situation.", need: "影響力、自主權", need_en: "Influence, autonomy", intensity: 8 },
      { id: "sad_06", name_zh: "絕望", name_en: "Hopeless", definition: "看不到未來變好的可能性。", definition_en: "Unable to see any possibility of things getting better.", need: "希望、意義", need_en: "Hope, meaning", intensity: 10 },
      { id: "sad_07", name_zh: "遺憾", name_en: "Regretful", definition: "對過去的決定或行為感到難過，希望能重來。", definition_en: "Sad about past decisions, wishing you could do it over.", need: "原諒、接納不完美", need_en: "Forgiveness, accepting imperfection", intensity: 6 },
      { id: "sad_08", name_zh: "委屈", name_en: "Wronged", definition: "被誤解或受到不白之冤，感到心酸。", definition_en: "Being misunderstood or falsely accused, feeling bitter.", need: "理解、澄清、正義", need_en: "Understanding, clarification, justice", intensity: 7 },
      { id: "sad_09", name_zh: "疲憊", name_en: "Exhausted", definition: "長期情緒勞動後的深度倦怠。", definition_en: "Deep fatigue from prolonged emotional labor.", need: "休息、滋養", need_en: "Rest, nourishment", intensity: 8 },
      { id: "sad_10", name_zh: "麻木", name_en: "Numb", definition: "悲傷過度後的自我防禦，感覺不到任何東西。", definition_en: "Self-protection after excessive sadness, feeling nothing.", need: "喚醒、觸動", need_en: "Awakening, being moved", intensity: 9 }
    ]
  },

  // ============================================
  // 3. 恐懼類 (Fear) - 能量凍結或逃跑
  // ============================================
  {
    category: "Fear",
    category_zh: "恐懼",
    color: "#9B59B6",
    icon: "😨",
    description: "能量凍結或逃跑",
    description_en: "Energy freezing or fleeing",
    core_definition: "面對潛在威脅或不確定性時的反應",
    core_definition_en: "Response to potential threats or uncertainty",
    emotions: [
      { id: "fear_01", name_zh: "焦慮", name_en: "Anxious", definition: "對未來不確定性的持續擔憂。", definition_en: "Persistent worry about future uncertainty.", need: "確定性、掌控感", need_en: "Certainty, sense of control", intensity: 6 },
      { id: "fear_02", name_zh: "擔憂", name_en: "Worried", definition: "腦中反覆預演可能發生的壞事。", definition_en: "Mentally rehearsing potential bad outcomes.", need: "安心、計畫", need_en: "Reassurance, planning", intensity: 4 },
      { id: "fear_03", name_zh: "不安", name_en: "Insecure", definition: "對自身價值或環境安全感到不確定。", definition_en: "Uncertain about self-worth or environmental safety.", need: "肯定、保護", need_en: "Affirmation, protection", intensity: 5 },
      { id: "fear_04", name_zh: "恐慌", name_en: "Panicked", definition: "突如其來的強烈恐懼，想立刻逃離。", definition_en: "Sudden intense fear, wanting to escape immediately.", need: "立即的安全、喘息空間", need_en: "Immediate safety, breathing room", intensity: 9 },
      { id: "fear_05", name_zh: "不知所措", name_en: "Overwhelmed", definition: "接收訊息過載，無法處理。", definition_en: "Information overload, unable to process.", need: "簡化、暫停、分擔", need_en: "Simplification, pause, sharing burden", intensity: 8 },
      { id: "fear_06", name_zh: "懷疑", name_en: "Skeptical", definition: "不敢相信眼前的美好或承諾。", definition_en: "Afraid to trust good things or promises.", need: "證據、誠信", need_en: "Evidence, integrity", intensity: 5 },
      { id: "fear_07", name_zh: "緊張", name_en: "Nervous", definition: "面對挑戰時的生理緊繃感。", definition_en: "Physical tension when facing challenges.", need: "放鬆、準備", need_en: "Relaxation, preparation", intensity: 4 },
      { id: "fear_08", name_zh: "害怕被拋棄", name_en: "Fear of Abandonment", definition: "深層恐懼，害怕重要他人離開。", definition_en: "Deep fear of important people leaving.", need: "承諾、不離不棄", need_en: "Commitment, loyalty", intensity: 9 },
      { id: "fear_09", name_zh: "謹慎", name_en: "Cautious", definition: "小心翼翼，不敢踏錯一步。", definition_en: "Being very careful, afraid to make mistakes.", need: "安全網、容錯率", need_en: "Safety net, margin for error", intensity: 3 },
      { id: "fear_10", name_zh: "驚恐", name_en: "Terrified", definition: "極度的恐懼，感覺生命或核心價值受威脅。", definition_en: "Extreme fear, feeling that life or core values are threatened.", need: "生存、庇護", need_en: "Survival, shelter", intensity: 10 }
    ]
  },

  // ============================================
  // 4. 厭惡類 (Disgust) - 能量排斥
  // ============================================
  {
    category: "Disgust",
    category_zh: "厭惡",
    color: "#27AE60",
    icon: "🤢",
    description: "能量排斥",
    description_en: "Energy repelling",
    core_definition: "對有害、不潔或違反價值觀事物的排斥",
    core_definition_en: "Rejection of harmful, impure, or value-violating things",
    emotions: [
      { id: "dis_01", name_zh: "反感", name_en: "Dislike", definition: "輕微的排斥，不想靠近。", definition_en: "Mild rejection, not wanting to get close.", need: "舒適、合適", need_en: "Comfort, suitability", intensity: 3 },
      { id: "dis_02", name_zh: "嫌棄", name_en: "Disdain", definition: "覺得對方行為低於標準，帶有優越感的排斥。", definition_en: "Rejection with superiority, feeling others are below standard.", need: "品質、標準", need_en: "Quality, standards", intensity: 5 },
      { id: "dis_03", name_zh: "噁心", name_en: "Disgusted", definition: "生理或心理上的強烈不適，想嘔吐。", definition_en: "Strong physical or mental discomfort, wanting to vomit.", need: "純淨、界線", need_en: "Purity, boundaries", intensity: 8 },
      { id: "dis_04", name_zh: "鄙視", name_en: "Contempt", definition: "極度看不起對方，認為對方不配。", definition_en: "Extreme disrespect, believing others are unworthy.", need: "尊嚴、價值觀一致", need_en: "Dignity, value alignment", intensity: 9 },
      { id: "dis_05", name_zh: "疏離", name_en: "Alienated", definition: "覺得格格不入，不想與之為伍。", definition_en: "Feeling out of place, not wanting to belong.", need: "同頻、共鳴", need_en: "Resonance, connection", intensity: 6 },
      { id: "dis_06", name_zh: "不屑", name_en: "Scornful", definition: "認為某事不值得一提或關注。", definition_en: "Believing something isn't worth mentioning or attention.", need: "意義、深度", need_en: "Meaning, depth", intensity: 5 },
      { id: "dis_07", name_zh: "抗拒", name_en: "Resistant", definition: "不願意接受某種改變或觀念。", definition_en: "Unwilling to accept change or new ideas.", need: "自主、習慣", need_en: "Autonomy, routine", intensity: 6 },
      { id: "dis_08", name_zh: "冷漠", name_en: "Indifferent", definition: "關閉情感通道，拒絕投入。", definition_en: "Shutting down emotional channels, refusing to engage.", need: "自我保護、隔離", need_en: "Self-protection, isolation", intensity: 7 },
      { id: "dis_09", name_zh: "虛偽感", name_en: "Phony", definition: "覺得對方或環境不真實，感到排斥。", definition_en: "Feeling others or environment are fake, causing rejection.", need: "真實性、坦誠", need_en: "Authenticity, honesty", intensity: 6 },
      { id: "dis_10", name_zh: "批判", name_en: "Critical", definition: "忍不住想挑剔對方的錯誤。", definition_en: "Can't help but point out others' mistakes.", need: "完美、改善", need_en: "Perfection, improvement", intensity: 4 }
    ]
  },

  // ============================================
  // 5. 羞恥類 (Shame) - 能量自我攻擊
  // ============================================
  {
    category: "Shame",
    category_zh: "羞恥",
    color: "#E67E22",
    icon: "😳",
    description: "能量自我攻擊",
    description_en: "Energy attacking self",
    core_definition: "覺得自己「不夠好」、「有缺陷」的痛苦感受",
    core_definition_en: "Painful feeling of being 'not good enough' or 'flawed'",
    emotions: [
      { id: "sha_01", name_zh: "尷尬", name_en: "Embarrassed", definition: "當眾出醜或犯錯時的不自在。", definition_en: "Discomfort from making mistakes in public.", need: "遮蔽、體諒", need_en: "Cover, understanding", intensity: 4 },
      { id: "sha_02", name_zh: "內疚", name_en: "Guilty", definition: "覺得自己做錯事傷害了別人。", definition_en: "Feeling you've done wrong and hurt others.", need: "補償、原諒", need_en: "Amends, forgiveness", intensity: 6 },
      { id: "sha_03", name_zh: "自責", name_en: "Self-blame", definition: "反覆攻擊自己的錯誤。", definition_en: "Repeatedly attacking yourself for mistakes.", need: "自我寬恕、接納", need_en: "Self-forgiveness, acceptance", intensity: 7 },
      { id: "sha_04", name_zh: "丟臉", name_en: "Humiliated", definition: "自尊心被公開踐踏。", definition_en: "Self-esteem publicly trampled.", need: "尊嚴、恢復名譽", need_en: "Dignity, reputation restoration", intensity: 9 },
      { id: "sha_05", name_zh: "自卑", name_en: "Inferior", definition: "覺得自己比不上別人。", definition_en: "Feeling you don't measure up to others.", need: "自信、平等", need_en: "Confidence, equality", intensity: 8 },
      { id: "sha_06", name_zh: "無地自容", name_en: "Ashamed", definition: "恨不得找地洞鑽進去，覺得自己整個人都錯了。", definition_en: "Wanting to disappear, feeling entirely wrong as a person.", need: "存在感、被接納", need_en: "Sense of existence, acceptance", intensity: 10 },
      { id: "sha_07", name_zh: "軟弱", name_en: "Weak", definition: "覺得自己沒有能力應對挑戰。", definition_en: "Feeling incapable of handling challenges.", need: "力量、支持", need_en: "Strength, support", intensity: 6 },
      { id: "sha_08", name_zh: "愚蠢", name_en: "Stupid", definition: "批判自己的智力或判斷力。", definition_en: "Criticizing your own intelligence or judgment.", need: "智慧、學習機會", need_en: "Wisdom, learning opportunities", intensity: 5 },
      { id: "sha_09", name_zh: "被暴露", name_en: "Exposed", definition: "秘密或隱私被揭開的恐慌。", definition_en: "Panic from secrets or privacy being revealed.", need: "隱私、安全", need_en: "Privacy, safety", intensity: 8 },
      { id: "sha_10", name_zh: "不配得", name_en: "Unworthy", definition: "覺得自己不值得被愛或擁有美好。", definition_en: "Feeling undeserving of love or good things.", need: "無條件的愛", need_en: "Unconditional love", intensity: 9 }
    ]
  },

  // ============================================
  // 6. 喜悅/平靜類 (Joy/Peace) - 能量擴張與流動
  // ============================================
  {
    category: "Joy",
    category_zh: "喜悅",
    color: "#F1C40F",
    icon: "✨",
    description: "能量擴張與流動",
    description_en: "Energy expanding and flowing",
    core_definition: "需求被滿足時的狀態",
    core_definition_en: "State when needs are met",
    emotions: [
      { id: "joy_01", name_zh: "放鬆", name_en: "Relaxed", definition: "身體和心理的緊繃感消失。", definition_en: "Physical and mental tension disappearing.", need: "休息、安全", need_en: "Rest, safety", intensity: 4 },
      { id: "joy_02", name_zh: "平靜", name_en: "Calm", definition: "內心沒有波瀾，像止水一樣。", definition_en: "Inner stillness, like still water.", need: "和諧、秩序", need_en: "Harmony, order", intensity: 5 },
      { id: "joy_03", name_zh: "滿足", name_en: "Content", definition: "覺得當下的一切都剛剛好。", definition_en: "Feeling everything is just right.", need: "足夠、感恩", need_en: "Enough, gratitude", intensity: 6 },
      { id: "joy_04", name_zh: "感激", name_en: "Grateful", definition: "意識到他人的善意或命運的饋贈。", definition_en: "Recognizing others' kindness or life's gifts.", need: "連結、被愛", need_en: "Connection, being loved", intensity: 7 },
      { id: "joy_05", name_zh: "被愛", name_en: "Loved", definition: "深深感受到自己被接納和珍惜。", definition_en: "Deeply feeling accepted and cherished.", need: "親密、歸屬", need_en: "Intimacy, belonging", intensity: 9 },
      { id: "joy_06", name_zh: "興奮", name_en: "Excited", definition: "對即將發生的好事感到期待。", definition_en: "Anticipation for good things to come.", need: "刺激、希望", need_en: "Stimulation, hope", intensity: 8 },
      { id: "joy_07", name_zh: "自豪", name_en: "Proud", definition: "對自己的成就或伴侶的表現感到光榮。", definition_en: "Feeling honored by your achievements or partner's.", need: "成就、價值", need_en: "Achievement, value", intensity: 7 },
      { id: "joy_08", name_zh: "釋然", name_en: "Relieved", definition: "擔心的壞事沒有發生，重擔卸下。", definition_en: "Worried outcomes didn't happen, burden lifted.", need: "確定性、安全", need_en: "Certainty, safety", intensity: 6 },
      { id: "joy_09", name_zh: "連結", name_en: "Connected", definition: "感覺與對方心意相通。", definition_en: "Feeling in sync with someone.", need: "共鳴、理解", need_en: "Resonance, understanding", intensity: 8 },
      { id: "joy_10", name_zh: "充滿希望", name_en: "Hopeful", definition: "相信未來會變好。", definition_en: "Believing things will get better.", need: "意義、方向", need_en: "Meaning, direction", intensity: 6 }
    ]
  }
];

// Helper functions
export const getAllEmotions = () => {
  return emotionTaxonomy.flatMap(category => 
    category.emotions.map(emotion => ({
      ...emotion,
      category: category.category,
      category_zh: category.category_zh,
      color: category.color,
      icon: category.icon
    }))
  );
};

export const getEmotionById = (id) => {
  for (const category of emotionTaxonomy) {
    const emotion = category.emotions.find(e => e.id === id);
    if (emotion) {
      return {
        ...emotion,
        category: category.category,
        category_zh: category.category_zh,
        color: category.color,
        icon: category.icon,
        description_en: category.description_en
      };
    }
  }
  return null;
};

export const getEmotionsByCategory = (categoryName) => {
  const category = emotionTaxonomy.find(c => 
    c.category === categoryName || c.category_zh === categoryName
  );
  return category ? category.emotions : [];
};

export const getEmotionsByIntensity = (minIntensity, maxIntensity = 10) => {
  return getAllEmotions().filter(e => 
    e.intensity >= minIntensity && e.intensity <= maxIntensity
  );
};

export default emotionTaxonomy;
