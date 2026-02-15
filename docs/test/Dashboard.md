---
description: Dashboard 頁面測試案例
---

> 狀態：初始為 [ ]、完成為 [x]
> 注意：狀態只能在測試通過後由流程更新。
> 測試類型：前端元素、function 邏輯、Mock API、驗證權限...

---

## [x] 【前端元素】渲染基本元素
**範例輸入**：載入 Dashboard 頁面
**期待輸出**：
- 顯示標題 "Gym Dashboard"
- 顯示問候語 "dashboard.greeting" (mocked)
- 顯示 Focus Quote
- 顯示所有模組分頁按鈕 (All, Awareness, Expression 等)

---

## [x] 【前端元素】顯示使用者等級與評估分數
**範例輸入**：
- userStats: { level: 5 }
- assessment: { total: 80 }
**期待輸出**：
- 顯示 "Lv. 5"
- 顯示 "LQ: 80"
- 按鈕背景呈現 active 樣式

---

## [x] 【前端元素】顯示 Assessment 卡片 (無評估資料時)
**範例輸入**：assessment: null
**期待輸出**：
- 顯示帶有 "Start Here" 的 Assessment 卡片
- 點擊卡片導航至 `/onboarding`

---

## [x] 【功能邏輯】切換語言
**範例輸入**：當前語言為 EN，點擊 "CN" 按鈕
**期待輸出**：
- 呼叫 toggleLanguage 函數

---

## [x] 【功能邏輯】模組篩選
**範例輸入**：點擊 "Module 1" 分頁
**期待輸出**：
- 工具列表僅顯示 Module 1 的工具 (如 Attribution, Emotion Scan 等)
- 工具數量減少至 Module 1 的工具數量

---

## [] 【導航】點擊工具卡片
**範例輸入**：點擊 "Emotion Scan" 卡片
**期待輸出**：
- 導航至 `/module1/emotion-scan`
