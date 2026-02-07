這是一份**最終開發任務清單 (Master Task List)**，基於我們定案的 **PDD 3.0 (單人修行版)**。

我已經將所有功能按 **P0 (Must-have / MVP)**、**P1 (Should-have / Launch)** 和 **P2 (Nice-to-have / V1.1)** 進行了嚴格排序，您可以直接將此清單複製到 Jira、Trello 或 Notion 進行專案管理。

---

# **📋 Master Task List: 愛的能力健身房 (Solo Edition)**

**總體目標：** 打造一款「離線優先、隱私安全、情緒急救」的個人情感效能訓練 App。

**技術棧：** Flutter \+ Isar (Local DB) \+ Firebase Auth (Backup Only)

---

## **🚀 Sprint 1: 核心引擎與情緒急救 (MVP \- P0)**

**目標：** 讓用戶能記錄情緒，並在崩潰時獲得幫助。這是 App 的「最小可行性」狀態。

### **1.1 基礎建設 (Infrastructure)**

* \[ \] **Project Setup:** 搭建 Flutter 專案結構 (Clean Architecture)。  
* \[ \] **Database:** 配置 Isar 本地資料庫，建立 EmotionLog 和 StoryLog 表。  
* \[ \] **Assets:** 導入 emotion\_taxonomy.json (情緒詞庫) 與字體 (Serif)。  
* \[ \] **Navigation:** 設定 GoRouter 路由 (Home, Gym, Stats, Settings)。

### **1.2 模組 1: 情緒管理 (Foundation)**

* \[ \] **UI \- Panic Button:** 實現首頁懸浮的「危機按鈕」(FAB)。  
* \[ \] **Feature \- Breathing:** 製作 4-7-8 呼吸動畫 (Lottie/Rive) 與觸覺震動 (Haptic Feedback)。  
* \[ \] **Feature \- Awareness Log:** 實現「情緒輪盤」選擇器與強度滑桿 (0-10)。  
* \[ \] **Data:** 實現情緒日誌的 CRUD (增刪改查) 操作。

### **1.3 模組 0: 初始定錨 (Onboarding)**

* \[ \] **UI \- Assessment:** 製作 15 題心理測驗問卷頁面。  
* \[ \] **Logic \- Scoring:** 實現五維雷達圖算法 (計算各能力得分)。  
* \[ \] **Data:** 存儲用戶初始狀態，並鎖定推薦模組。

---

## **🛠 Sprint 2: 認知工具與話術教練 (Launch \- P1)**

**目標：** 提供改變認知的工具，讓用戶從「情緒」進入「理性」。

### **2.1 模組 2: 述情 (Expression)**

* \[ \] **UI \- Draft Builder:** 製作「六句真言」填空表單 (Wizard Form)。  
* \[ \] **Logic \- Regex Blocker:** 實現「攻擊性語言攔截」正則表達式 (如 "你總是...")。  
* \[ \] **Feature \- Copy:** 實現「一鍵複製」到剪貼簿功能。  
* \[ \] **Data:** 保存草稿到本地歷史記錄。

### **2.2 模組 3: 共情 (Empathy)**

* \[ \] **UI \- Anger Decoder:** 製作「憤怒解碼器」的選擇題流程。  
* \[ \] **Content:** 編寫 10 個常見憤怒場景的解碼邏輯 (Angry \-\> Fear \-\> Need)。

### **2.3 模組 4: 允許 (Allowing)**

* \[ \] **UI \- Permission Slip:** 製作「允許通行證」證書頁面。  
* \[ \] **Interaction:** 實現「長按 3 秒蓋章」的微交互動畫。

### **2.4 模組 5: 影響 (Influence)**

* \[ \] **UI \- Spotlight Journal:** 製作「聚光燈日記」輸入框。  
* \[ \] **Logic \- Attribution:** 實現「歸因訓練」引導彈窗 (運氣 vs 本性)。

---

## **📈 Sprint 3: 激勵、安全與變現 (Polish \- P2)**

**目標：** 增加留存率，確保合規，並準備上架。

### **3.1 遊戲化 (Gamification)**

* \[ \] **UI \- Dashboard:** 製作首頁儀表板 (LQ 雷達圖 \+ 連勝火焰)。  
* \[ \] **Logic \- Streak:** 實現「每日連勝」計算邏輯。  
* \[ \] **Logic \- Crisis Freeze:** 實現「危機模式下凍結連勝」邏輯。  
* \[ \] **Feature \- Badges:** 設計並實現 3 個核心勳章 (無為、轉念、定海神針)。

### **3.2 安全護欄 (Safety)**

* \[ \] **Logic \- Keyword Filter:** 在日記輸入框增加「家暴關鍵詞」檢測。  
* \[ \] **UI \- Warning Modal:** 製作全屏「求助熱線」警告頁面。  
* \[ \] **Feature \- Fake Screen:** 實現「偽裝計算機」緊急切換功能。

### **3.3 數據主權與變現 (Monetization)**

* \[ \] **Feature \- Export PDF:** 實現將月度情緒報告導出為 PDF。  
* \[ \] **Feature \- Biometric Lock:** 整合 local\_auth (FaceID/Fingerprint)。  
* \[ \] **IAP:** 整合 RevenueCat 或原聲 IAP，實現「訂閱 Pro 版」邏輯。

---

## **📝 內容資產清單 (Content Needs)**

*這些不需要寫程式，但開發前必須準備好。*

1. **情緒詞庫:** 6 大類、60 個細分情緒詞 (含定義)。  
2. **故事粉碎機題庫:** 50 則「事實 vs 故事」判斷題。  
3. **共情解碼腳本:** 10 則常見爭吵場景的「翻譯」。  
4. **免責聲明:** 法律合規文本。

---

**\[任務清單結束\]**

這就是從 0 到 1 的完整開發路徑。

您可以根據團隊人力（或是您自己的時間），按 Sprint 順序執行。

祝您的開發順利！這將是一款非常有意義的產品。

